#!/usr/bin/env python3

import requests
import json

def test_frontend_api():
    """Prueba la API exactamente como la usa el frontend"""
    
    base_url = "http://192.168.3.188:8000"
    
    print(f"🔍 Probando API desde IP externa: {base_url}")
    
    # 1. Probar health check
    try:
        response = requests.get(f"{base_url}/lifeplanner/health", timeout=5)
        print(f"✅ Health check: {response.status_code}")
        print(f"   Respuesta: {response.json()}")
    except Exception as e:
        print(f"❌ Health check falló: {e}")
        return False
    
    # 2. Probar creación de tarea (simulando frontend)
    task_data = {
        "title": "Tarea de prueba desde frontend",
        "description": "Descripción de prueba",
        "priority": "media",
        "status": "pendiente"
    }
    
    print(f"\n📝 Creando tarea con datos: {json.dumps(task_data, indent=2)}")
    
    try:
        response = requests.post(
            f"{base_url}/lifeplanner/tasks/project/1",
            json=task_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"✅ Creación de tarea: {response.status_code}")
        if response.status_code == 200:
            task_created = response.json()
            print(f"   Tarea creada: {json.dumps(task_created, indent=2)}")
            
            # 3. Verificar que la tarea se guardó
            print(f"\n🔍 Verificando que la tarea se guardó...")
            response = requests.get(f"{base_url}/lifeplanner/tasks/", params={"project_id": 1})
            if response.status_code == 200:
                tasks = response.json()
                print(f"   Tareas en proyecto 1: {len(tasks)}")
                for task in tasks[-3:]:  # Mostrar las últimas 3 tareas
                    print(f"   - {task['id']}: {task['title']} ({task['status']})")
            else:
                print(f"   ❌ Error obteniendo tareas: {response.status_code}")
        else:
            print(f"   ❌ Error: {response.status_code}")
            print(f"   Respuesta: {response.text}")
            
    except Exception as e:
        print(f"❌ Error creando tarea: {e}")
        return False
    
    return True

if __name__ == "__main__":
    test_frontend_api()
