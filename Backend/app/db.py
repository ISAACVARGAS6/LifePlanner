from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
import os

# Leer DATABASE_URL de entorno (Render lo provee automáticamente)
DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
    # Render usa PostgreSQL → SQLAlchemy requiere reemplazar "postgres://" por "postgresql://"
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
else:
    # Si no existe, usar SQLite local (modo desarrollo)
    current_dir = os.path.dirname(os.path.abspath(__file__))
    parent_dir = os.path.dirname(current_dir)
    DATABASE_URL = f"sqlite:///{parent_dir}/lifeplanner.db"
    print(f"📁 Usando base de datos local en: {DATABASE_URL}")

# Crear el motor de la base de datos
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
)

# Crear la sesión
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Crear la base declarativa usando la nueva API
class Base(DeclarativeBase):
    pass

# Función para obtener la base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Función para inicializar la base de datos
def init_db():
    Base.metadata.create_all(bind=engine)
    print("✅ Base de datos conectada correctamente")
