#!/usr/bin/env python3
"""
Script para corregir problemas de persistencia en la base de datos
- Limpia datos huérfanos
- Corrige inconsistencias de usuarios
- Resetea la base de datos a un estado limpio
"""

import sqlite3
import os
from pathlib import Path

def fix_database_issues():
    """Corrige los problemas de la base de datos"""
    db_path = Path(__file__).parent / "lifeplanner.db"
    
    if not db_path.exists():
        print("❌ Base de datos no encontrada")
        return False
    
    print("🔧 Iniciando corrección de problemas de base de datos...")
    
    try:
        conn = sqlite3.connect(str(db_path))
        cursor = conn.cursor()
        
        # 1. Verificar estado actual
        print("\n📊 Estado actual de la base de datos:")
        cursor.execute("SELECT COUNT(*) FROM users")
        user_count = cursor.fetchone()[0]
        print(f"   Usuarios: {user_count}")
        
        cursor.execute("SELECT COUNT(*) FROM projects")
        project_count = cursor.fetchone()[0]
        print(f"   Proyectos: {project_count}")
        
        cursor.execute("SELECT COUNT(*) FROM tasks")
        task_count = cursor.fetchone()[0]
        print(f"   Tareas: {task_count}")
        
        # 2. Mostrar datos existentes
        print("\n👥 Usuarios existentes:")
        cursor.execute("SELECT id, username, device_id FROM users")
        users = cursor.fetchall()
        for user in users:
            print(f"   ID: {user[0]}, Username: {user[1]}, Device: {user[2]}")
        
        print("\n📁 Proyectos existentes:")
        cursor.execute("SELECT id, title, user_id FROM projects")
        projects = cursor.fetchall()
        for project in projects:
            print(f"   ID: {project[0]}, Title: {project[1]}, User ID: {project[2]}")
        
        # 3. Limpiar datos huérfanos
        print("\n🧹 Limpiando datos huérfanos...")
        
        # Eliminar proyectos que no tienen usuario válido
        cursor.execute("""
            DELETE FROM projects 
            WHERE user_id NOT IN (SELECT id FROM users)
        """)
        orphaned_projects = cursor.rowcount
        print(f"   Proyectos huérfanos eliminados: {orphaned_projects}")
        
        # Eliminar tareas que no tienen proyecto válido
        cursor.execute("""
            DELETE FROM tasks 
            WHERE project_id NOT IN (SELECT id FROM projects)
        """)
        orphaned_tasks = cursor.rowcount
        print(f"   Tareas huérfanas eliminadas: {orphaned_tasks}")
        
        # 4. Limpiar usuarios temporales y sus datos
        print("\n🗑️ Limpiando usuarios temporales...")
        
        # Eliminar usuarios temporales y sus datos
        cursor.execute("""
            DELETE FROM projects 
            WHERE user_id IN (
                SELECT id FROM users 
                WHERE device_id LIKE 'temp_%' OR username LIKE 'Usuario_%'
            )
        """)
        temp_projects = cursor.rowcount
        print(f"   Proyectos de usuarios temporales eliminados: {temp_projects}")
        
        cursor.execute("""
            DELETE FROM users 
            WHERE device_id LIKE 'temp_%' OR username LIKE 'Usuario_%'
        """)
        temp_users = cursor.rowcount
        print(f"   Usuarios temporales eliminados: {temp_users}")
        
        # 5. Resetear secuencias de autoincrement
        print("\n🔄 Reseteando secuencias de autoincrement...")
        try:
            cursor.execute("DELETE FROM sqlite_sequence WHERE name='users'")
            cursor.execute("DELETE FROM sqlite_sequence WHERE name='projects'")
            cursor.execute("DELETE FROM sqlite_sequence WHERE name='tasks'")
            print("   Secuencias reseteadas correctamente")
        except Exception as e:
            print(f"   ⚠️ No se pudieron resetear las secuencias: {e}")
        
        # 6. Verificar estado final
        print("\n📊 Estado final de la base de datos:")
        cursor.execute("SELECT COUNT(*) FROM users")
        final_user_count = cursor.fetchone()[0]
        print(f"   Usuarios: {final_user_count}")
        
        cursor.execute("SELECT COUNT(*) FROM projects")
        final_project_count = cursor.fetchone()[0]
        print(f"   Proyectos: {final_project_count}")
        
        cursor.execute("SELECT COUNT(*) FROM tasks")
        final_task_count = cursor.fetchone()[0]
        print(f"   Tareas: {final_task_count}")
        
        # 7. Confirmar cambios
        conn.commit()
        print("\n✅ Base de datos corregida exitosamente")
        
        return True
        
    except Exception as e:
        print(f"❌ Error al corregir la base de datos: {e}")
        conn.rollback()
        return False
    finally:
        conn.close()

def create_clean_database():
    """Crea una base de datos completamente limpia"""
    db_path = Path(__file__).parent / "lifeplanner.db"
    
    print("🗑️ Creando base de datos completamente limpia...")
    
    # Hacer backup de la base de datos actual
    if db_path.exists():
        backup_path = db_path.with_suffix('.db.backup')
        db_path.rename(backup_path)
        print(f"   Backup creado: {backup_path}")
    
    # Crear nueva base de datos limpia
    try:
        conn = sqlite3.connect(str(db_path))
        cursor = conn.cursor()
        
        # Crear tablas desde cero
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username VARCHAR(50) NOT NULL UNIQUE,
                email VARCHAR(100) UNIQUE,
                device_id VARCHAR(100) UNIQUE,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS projects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title VARCHAR(100) NOT NULL,
                description VARCHAR(500),
                status VARCHAR(20) NOT NULL DEFAULT 'activo',
                priority VARCHAR(20),
                category VARCHAR(100),
                deadline DATETIME,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                user_id INTEGER NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title VARCHAR(100) NOT NULL,
                description VARCHAR(500),
                status VARCHAR(20) NOT NULL DEFAULT 'pendiente',
                priority VARCHAR(20) NOT NULL DEFAULT 'media',
                due_date DATETIME,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                project_id INTEGER,
                FOREIGN KEY (project_id) REFERENCES projects (id)
            )
        """)
        
        # Crear índices
        cursor.execute("CREATE INDEX IF NOT EXISTS ix_users_id ON users (id)")
        cursor.execute("CREATE INDEX IF NOT EXISTS ix_users_username ON users (username)")
        cursor.execute("CREATE INDEX IF NOT EXISTS ix_users_email ON users (email)")
        cursor.execute("CREATE INDEX IF NOT EXISTS ix_users_device_id ON users (device_id)")
        
        cursor.execute("CREATE INDEX IF NOT EXISTS ix_projects_id ON projects (id)")
        cursor.execute("CREATE INDEX IF NOT EXISTS ix_tasks_id ON tasks (id)")
        
        conn.commit()
        print("✅ Base de datos limpia creada exitosamente")
        
        return True
        
    except Exception as e:
        print(f"❌ Error al crear base de datos limpia: {e}")
        return False
    finally:
        conn.close()

if __name__ == "__main__":
    print("🚀 Iniciando corrección de problemas de base de datos...")
    
    # Ejecutar corrección automáticamente
    print("\n🔧 Ejecutando corrección automática...")
    success = fix_database_issues()
    
    if success:
        print("\n🎉 Corrección completada exitosamente")
    else:
        print("\n💥 Error en la corrección")
