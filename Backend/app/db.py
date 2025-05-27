from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
import os

# Obtener la ruta del directorio actual
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)

# Construir la ruta de la base de datos
DATABASE_URL = f"sqlite:///{parent_dir}/lifeplanner.db"

# Imprimir la ruta de la base de datos (para debugging)
print(f"📁 Usando base de datos en: {parent_dir}/lifeplanner.db")

# Crear el motor de la base de datos
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
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

