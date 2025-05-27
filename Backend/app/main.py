from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
import sys
from pathlib import Path
import logging

from app.db import Base, engine, SessionLocal
from app.routes import project_route, task_route

# 🚨 IMPORTAR MODELOS para que Base los registre antes de create_all()
from app.models import project, task

# Configurar logging
logging.basicConfig(level=logging.DEBUG)  # En producción usa INFO o WARNING
logger = logging.getLogger(__name__)

def run_migration(module_name: str, function_name: str, success_message: str):
    """Función helper para ejecutar migraciones de forma segura"""
    try:
        module = __import__(f"app.migrations.{module_name}", fromlist=[function_name])
        migration_func = getattr(module, function_name)
        if migration_func():
            logger.info(success_message)
            return True
        else:
            logger.warning(f"⚠️ Migración {module_name} no completada")
            return False
    except ImportError:
        logger.warning(f"⚠️ Migración {module_name} no disponible")
        return False
    except Exception as e:
        logger.error(f"❌ Error durante la migración {module_name}: {str(e)}")
        return False

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        # ✅ Crear tablas si no existen
        Base.metadata.create_all(bind=engine)
        with SessionLocal() as db:
            db.execute(text("SELECT 1"))
        logger.info("✅ Base de datos conectada correctamente")
        
        # Asegurar que sys.path incluye raíz del proyecto
        root_path = str(Path(__file__).resolve().parent.parent)
        if root_path not in sys.path:
            sys.path.append(root_path)
        
        # Ejecutar migraciones
        run_migration("truncate_titles", "truncate_titles", 
                      "✅ Migración de truncado de títulos ejecutada correctamente")
        run_migration("add_priority_to_tasks", "run_migration",
                      "✅ Migración de prioridades ejecutada correctamente")
        run_migration("add_status_to_projects", "run_migration",
                      "✅ Migración de status ejecutada correctamente")
        
    except SQLAlchemyError as e:
        logger.error(f"❌ Error al conectar con la base de datos: {str(e)}")
        raise
    except Exception as e:
        logger.error(f"❌ Error inesperado: {str(e)}")
        raise
    
    yield  # Aquí la aplicación está en ejecución
    
    logger.info("🔴 Apagando la aplicación...")

app = FastAPI(
    title="LifePlanner API",
    description="API para gestionar proyectos y tareas en la app LifePlanner",
    version="1.0.0",
    lifespan=lifespan
)

# Configuración CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especifica los dominios permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusión de routers
app.include_router(
    project_route.router,
    prefix="/lifeplanner/projects",
    tags=["projects"]
)

app.include_router(
    task_route.router,
    prefix="/lifeplanner/tasks",
    tags=["tasks"]
)

# Ruta de salud
@app.get("/lifeplanner/health")
async def health_check():
    return {"status": "healthy", "database": "connected"}

