#!/usr/bin/env python3
"""
Script de prueba para verificar que el sistema de guardado funciona correctamente
"""

import requests
import json
import time
import uuid

# Configuración
API_BASE_URL = "http://localhost:8000"
TEST_DEVICE_ID = f"test_device_{uuid.uuid4().hex[:8]}"

def test_api_connection():
    """Prueba la conexión con la API"""
    try:
        response = requests.get(f"{API_BASE_URL}/lifeplanner/health", timeout=5)
        if response.status_code == 200:
            print("✅ Conexión con API exitosa")
            return True
        else:
            print(f"❌ Error de conexión: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        return False

def test_user_creation():
    """Prueba la creación automática de usuario"""
    print(f"\n🧪 Probando creación de usuario con device_id: {TEST_DEVICE_ID}")
    
    headers = {
        "X-Device-ID": TEST_DEVICE_ID,
        "Content-Type": "application/json"
    }
    
    try:
        # Intentar obtener proyectos (esto debería crear el usuario automáticamente)
        response = requests.get(f"{API_BASE_URL}/lifeplanner/projects/", headers=headers, timeout=10)
        
        if response.status_code == 200:
            print("✅ Usuario creado automáticamente")
            return True
        else:
            print(f"❌ Error al crear usuario: {response.status_code}")
            print(f"   Respuesta: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error al crear usuario: {e}")
        return False

def test_project_creation():
    """Prueba la creación de proyectos"""
    print(f"\n🧪 Probando creación de proyecto...")
    
    headers = {
        "X-Device-ID": TEST_DEVICE_ID,
        "Content-Type": "application/json"
    }
    
    project_data = {
        "title": "Proyecto de Prueba",
        "description": "Este es un proyecto de prueba para verificar el guardado",
        "status": "activo",
        "priority": "media",
        "category": "Pruebas"
    }
    
    try:
        response = requests.post(
            f"{API_BASE_URL}/lifeplanner/projects/", 
            headers=headers, 
            json=project_data, 
            timeout=10
        )
        
        if response.status_code == 201:
            project = response.json()
            print(f"✅ Proyecto creado exitosamente: ID {project['id']}")
            return project['id']
        else:
            print(f"❌ Error al crear proyecto: {response.status_code}")
            print(f"   Respuesta: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Error al crear proyecto: {e}")
        return None

def test_task_creation(project_id):
    """Prueba la creación de tareas"""
    print(f"\n🧪 Probando creación de tarea para proyecto {project_id}...")
    
    headers = {
        "X-Device-ID": TEST_DEVICE_ID,
        "Content-Type": "application/json"
    }
    
    task_data = {
        "title": "Tarea de Prueba",
        "description": "Esta es una tarea de prueba",
        "status": "pendiente",
        "priority": "alta"
    }
    
    try:
        response = requests.post(
            f"{API_BASE_URL}/lifeplanner/tasks/project/{project_id}", 
            headers=headers, 
            json=task_data, 
            timeout=10
        )
        
        if response.status_code == 200:
            task = response.json()
            print(f"✅ Tarea creada exitosamente: ID {task['id']}")
            return task['id']
        else:
            print(f"❌ Error al crear tarea: {response.status_code}")
            print(f"   Respuesta: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Error al crear tarea: {e}")
        return None

def test_data_persistence():
    """Prueba que los datos se persisten correctamente"""
    print(f"\n🧪 Probando persistencia de datos...")
    
    headers = {
        "X-Device-ID": TEST_DEVICE_ID,
        "Content-Type": "application/json"
    }
    
    try:
        # Obtener proyectos
        response = requests.get(f"{API_BASE_URL}/lifeplanner/projects/", headers=headers, timeout=10)
        
        if response.status_code == 200:
            projects = response.json()
            print(f"✅ Proyectos obtenidos: {len(projects)} proyectos")
            
            if projects:
                project = projects[0]
                print(f"   Proyecto: {project['title']} (ID: {project['id']})")
                
                # Obtener tareas del proyecto
                tasks_response = requests.get(
                    f"{API_BASE_URL}/lifeplanner/projects/{project['id']}/tasks", 
                    headers=headers, 
                    timeout=10
                )
                
                if tasks_response.status_code == 200:
                    tasks = tasks_response.json()
                    print(f"✅ Tareas obtenidas: {len(tasks)} tareas")
                    
                    if tasks:
                        task = tasks[0]
                        print(f"   Tarea: {task['title']} (ID: {task['id']})")
                    
                    return True
                else:
                    print(f"❌ Error al obtener tareas: {tasks_response.status_code}")
                    return False
            else:
                print("❌ No se encontraron proyectos")
                return False
        else:
            print(f"❌ Error al obtener proyectos: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error al verificar persistencia: {e}")
        return False

def test_project_deletion(project_id):
    """Prueba la eliminación de proyectos"""
    print(f"\n🧪 Probando eliminación de proyecto {project_id}...")
    
    headers = {
        "X-Device-ID": TEST_DEVICE_ID,
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.delete(
            f"{API_BASE_URL}/lifeplanner/projects/{project_id}", 
            headers=headers, 
            timeout=10
        )
        
        if response.status_code == 204:
            print("✅ Proyecto eliminado exitosamente")
            return True
        else:
            print(f"❌ Error al eliminar proyecto: {response.status_code}")
            print(f"   Respuesta: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error al eliminar proyecto: {e}")
        return False

def main():
    """Función principal de pruebas"""
    print("🚀 Iniciando pruebas del sistema de guardado...")
    print(f"🔧 Device ID de prueba: {TEST_DEVICE_ID}")
    
    # 1. Probar conexión
    if not test_api_connection():
        print("❌ No se puede continuar sin conexión a la API")
        return False
    
    # 2. Probar creación de usuario
    if not test_user_creation():
        print("❌ Error en creación de usuario")
        return False
    
    # 3. Probar creación de proyecto
    project_id = test_project_creation()
    if not project_id:
        print("❌ Error en creación de proyecto")
        return False
    
    # 4. Probar creación de tarea
    task_id = test_task_creation(project_id)
    if not task_id:
        print("❌ Error en creación de tarea")
        return False
    
    # 5. Probar persistencia
    if not test_data_persistence():
        print("❌ Error en persistencia de datos")
        return False
    
    # 6. Probar eliminación
    if not test_project_deletion(project_id):
        print("❌ Error en eliminación de proyecto")
        return False
    
    print("\n🎉 ¡Todas las pruebas pasaron exitosamente!")
    print("✅ El sistema de guardado funciona correctamente")
    
    return True

if __name__ == "__main__":
    success = main()
    if not success:
        print("\n💥 Algunas pruebas fallaron")
        exit(1)
