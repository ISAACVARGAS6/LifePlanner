from app.db import Base, engine
from app.models import Project, Task  # Importar los modelos explícitamente

def init_db():
    print("🔧 Iniciando creación de tablas...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tablas creadas correctamente")

if __name__ == "__main__":
    init_db()
