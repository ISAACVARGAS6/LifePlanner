#!/usr/bin/env python3

import requests
import json

def test_frontend_exact():
    """Prueba la API exactamente como la usa el frontend"""
    
    base_url = "http://192.168.3.188:8000"
    
    print(f"🔍 Probando API exactamente como el frontend: {base_url}")
    
    # Simular exactamente la llamada del frontend
    # El frontend llama a: api.tasks.create(Number(projectId), taskData)
    # Que se traduce a: POST /lifeplanner/tasks/project/{projectId}
    
    project_id = 1
    task_data = {
        "title": "Tarea de prueba frontend exacta",
        "description": "Descripción de prueba",
        "priority": "media",
        "status": "pendiente",
        "due_date": None
    }
    
    print(f"📝 Creando tarea para proyecto {project_id}")
    print(f"   Datos: {json.dumps(task_data, indent=2)}")
    print(f"   Endpoint: POST {base_url}/lifeplanner/tasks/project/{project_id}")
    
    try:
        response = requests.post(
            f"{base_url}/lifeplanner/tasks/project/{project_id}",
            json=task_data,
            headers={
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Cache-Control": "no-cache"
            },
            timeout=15
        )
        
        print(f"\n📊 Respuesta del servidor:")
        print(f"   Status: {response.status_code}")
        print(f"   Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            task_created = response.json()
            print(f"   ✅ Tarea creada exitosamente:")
            print(f"      ID: {task_created.get('id')}")
            print(f"      Título: {task_created.get('title')}")
            print(f"      Proyecto: {task_created.get('project_id')}")
            
            # Verificar en la base de datos
            print(f"\n🔍 Verificando en la base de datos...")
            response = requests.get(f"{base_url}/lifeplanner/tasks/", params={"project_id": project_id})
            if response.status_code == 200:
                tasks = response.json()
                print(f"   Total tareas en proyecto {project_id}: {len(tasks)}")
                
                # Buscar la tarea recién creada
                new_task = None
                for task in tasks:
                    if task.get('title') == task_data['title']:
                        new_task = task
                        break
                
                if new_task:
                    print(f"   ✅ Tarea encontrada en BD: ID {new_task.get('id')}")
                else:
                    print(f"   ❌ Tarea NO encontrada en BD")
            else:
                print(f"   ❌ Error verificando BD: {response.status_code}")
                
        else:
            print(f"   ❌ Error en la respuesta:")
            print(f"      Texto: {response.text}")
            try:
                error_json = response.json()
                print(f"      JSON: {json.dumps(error_json, indent=2)}")
            except:
                pass
                
    except requests.exceptions.Timeout:
        print(f"   ❌ Timeout - La solicitud tardó demasiado")
    except requests.exceptions.ConnectionError as e:
        print(f"   ❌ Error de conexión: {e}")
    except Exception as e:
        print(f"   ❌ Error inesperado: {e}")
        import traceback
        traceback.print_exc()
    
    return True

if __name__ == "__main__":
    test_frontend_exact()
