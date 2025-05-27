import sqlite3
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

def truncate_titles(db_path: str):
    """Trunca los títulos de proyectos y tareas que excedan 100 caracteres."""
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        # Truncar títulos de proyectos
        cursor.execute("""
            UPDATE projects 
            SET title = substr(title, 1, 100) 
            WHERE length(title) > 100
        """)
        projects_updated = cursor.rowcount
        
        # Truncar títulos de tareas
        cursor.execute("""
            UPDATE tasks 
            SET title = substr(title, 1, 100) 
            WHERE length(title) > 100
        """)
        tasks_updated = cursor.rowcount

        conn.commit()
        conn.close()

        logger.info(f"Títulos truncados: {projects_updated} proyectos, {tasks_updated} tareas")
        return True

    except Exception as e:
        logger.error(f"Error al truncar títulos: {str(e)}")
        return False

if __name__ == "__main__":
    db_path = Path(__file__).parent.parent.parent / "lifeplanner.db"
    truncate_titles(str(db_path)) 