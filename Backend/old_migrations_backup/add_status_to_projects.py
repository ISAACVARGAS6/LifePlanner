from app.db import engine
from sqlalchemy import text

def run_migration():
    try:
        with engine.connect() as connection:
            connection.execute(text("ALTER TABLE projects ADD COLUMN status VARCHAR(20) DEFAULT 'activo'"))
            connection.commit()
            print("✅ Migración de status completada")
    except Exception as e:
        print(f"Error en migración add_status_to_projects: {e}")
        raise e

if __name__ == "__main__":
    run_migration() 