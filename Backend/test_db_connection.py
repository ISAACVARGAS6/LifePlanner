#!/usr/bin/env python3

from app.db import engine, SessionLocal
from app.models.task import Task
from sqlalchemy import text

def test_database():
    print("🔍 Probando conexión a la base de datos...")
    
    try:
        # Probar conexión
        with engine.connect() as conn:
            result = conn.execute(text('SELECT 1'))
            print("✅ Conexión exitosa a la base de datos")
            
            # Verificar tablas
            result = conn.execute(text("SELECT name FROM sqlite_master WHERE type='table'"))
            tables = result.fetchall()
            print(f"📋 Tablas encontradas: {[table[0] for table in tables]}")
            
            # Verificar tabla tasks específicamente
            result = conn.execute(text("SELECT name FROM sqlite_master WHERE type='table' AND name='tasks'"))
            tasks_table = result.fetchall()
            if tasks_table:
                print("✅ Tabla 'tasks' encontrada")
                
                # Verificar estructura de la tabla
                result = conn.execute(text("PRAGMA table_info(tasks)"))
                columns = result.fetchall()
                print("📊 Estructura de la tabla 'tasks':")
                for col in columns:
                    print(f"  - {col[1]} ({col[2]}) - Nullable: {col[3]}")
                    
                # Contar tareas
                result = conn.execute(text("SELECT COUNT(*) FROM tasks"))
                count = result.fetchone()[0]
                print(f"📝 Número de tareas en la base de datos: {count}")
                
            else:
                print("❌ Tabla 'tasks' NO encontrada")
                
    except Exception as e:
        print(f"❌ Error: {e}")
        return False
    
    return True

if __name__ == "__main__":
    test_database() 