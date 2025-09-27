from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
import sys
from pathlib import Path
import logging

from app.db import Base, engine, SessionLocal
from app.routes import project_route, task_route, chibi_route, user_route

# 🚨 IMPORTAR MODELOS para que Base los registre antes de create_all()
from app.models import project, task, user

# Configurar logging
logging.basicConfig(level=logging.DEBUG)  # En producción usa INFO o WARNING
logger = logging.getLogger(__name__)

def run_migration(module_name: str, function_name: str, success_message: str):
    """Función helper para ejecutar migraciones de forma segura"""
    try:
        module = __import__(f"app.migrations.{module_name}", fromlist=[function_name])
        migration_func = getattr(module, function_name)
        
        # Si la función necesita db_path, proporcionarlo
        if function_name == "truncate_titles":
            db_path = str(Path(__file__).parent.parent / "lifeplanner.db")
            if migration_func(db_path):
                logger.info(success_message)
                return True
            else:
                logger.warning(f"⚠️ Migración {module_name} no completada")
                return False
        else:
            # Para otras migraciones que no necesitan parámetros
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
        
        # Ejecutar migraciones solo si son necesarias
        run_migration("truncate_titles", "truncate_titles", 
                      "✅ Migración de truncado de títulos ejecutada correctamente")
        
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
import os
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Montar archivos estáticos (solo si existe el directorio)
static_dir = Path(__file__).parent.parent / "static"
if static_dir.exists():
    app.mount("/static", StaticFiles(directory=str(static_dir)), name="static")

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

app.include_router(
    chibi_route.router,
    prefix="/lifeplanner",
    tags=["chibis"]
)

app.include_router(
    user_route.router,
    prefix="/lifeplanner/users",
    tags=["users"]
)

# Ruta de salud
@app.get("/lifeplanner/health")
async def health_check():
    return {"status": "healthy", "database": "connected"}

