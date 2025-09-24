from app.db import engine
from sqlalchemy import text

def run_migration():
    try:
        with engine.connect() as connection:
            connection.execute(text("UPDATE projects SET title = SUBSTR(title, 1, 100) WHERE LENGTH(title) > 100"))
            connection.commit()
            print("✅ Migración de truncado de títulos completada")
    except Exception as e:
        print(f"Error en migración truncate_titles: {e}")
        raise e 