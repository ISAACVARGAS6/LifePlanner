from app.db import engine
from sqlalchemy import text

def run_migration():
    try:
        with engine.connect() as connection:
            connection.execute(text("ALTER TABLE tasks ADD COLUMN priority VARCHAR(20)"))
            connection.commit()
            print("✅ Migración de prioridades completada")
    except Exception as e:
        print(f"Error en migración add_priority_to_tasks: {e}")
        raise e