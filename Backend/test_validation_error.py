#!/usr/bin/env python3

import requests
import json

def test_validation_error():
    """Prueba si hay errores de validación con los datos del frontend"""
    
    base_url = "http://192.168.3.188:8000"
    
    print(f"🔍 Probando validación de datos del frontend")
    print(f"   URL: {base_url}")
    
    # Casos de prueba que podrían fallar
    test_cases = [
        {
            "name": "Tarea con due_date null (como envía el frontend)",
            "data": {
                "title": "Tarea con fecha null",
                "description": "Descripción",
                "priority": "media",
                "status": "pendiente",
                "due_date": None
            }
        },
        {
            "name": "Tarea con due_date string ISO",
            "data": {
                "title": "Tarea con fecha ISO",
                "description": "Descripción",
                "priority": "media",
                "status": "pendiente",
                "due_date": "2025-08-15T00:00:00.000Z"
            }
        },
        {
            "name": "Tarea con due_date string ISO (sin Z)",
            "data": {
                "title": "Tarea con fecha ISO sin Z",
                "description": "Descripción",
                "priority": "media",
                "status": "pendiente",
                "due_date": "2025-08-15T00:00:00.000"
            }
        },
        {
            "name": "Tarea con due_date string ISO (formato simple)",
            "data": {
                "title": "Tarea con fecha ISO simple",
                "description": "Descripción",
                "priority": "media",
                "status": "pendiente",
                "due_date": "2025-08-15"
            }
        }
    ]
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\n{i}️⃣ {test_case['name']}")
        print(f"   📤 Datos: {json.dumps(test_case['data'], indent=6)}")
        
        try:
            response = requests.post(
                f"{base_url}/lifeplanner/tasks/project/1",
                json=test_case['data'],
                headers={
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                timeout=10
            )
            
            print(f"   📥 Respuesta: {response.status_code}")
            
            if response.status_code == 200:
                task_created = response.json()
                print(f"      ✅ Tarea creada: ID {task_created.get('id')}")
                print(f"      📅 Due date en respuesta: {task_created.get('due_date')}")
            else:
                print(f"      ❌ Error: {response.status_code}")
                try:
                    error_detail = response.json()
                    print(f"      📋 Detalle: {json.dumps(error_detail, indent=8)}")
                except:
                    print(f"      📋 Texto: {response.text}")
                    
        except Exception as e:
            print(f"      ❌ Excepción: {e}")
    
    print(f"\n🔍 Verificando tareas creadas...")
    try:
        response = requests.get(f"{base_url}/lifeplanner/tasks/", params={"project_id": 1})
        if response.status_code == 200:
            tasks = response.json()
            print(f"   📊 Total tareas en proyecto 1: {len(tasks)}")
            print(f"   📝 Últimas 5 tareas:")
            for task in tasks[-5:]:
                print(f"      - {task.get('id')}: {task.get('title')} | Fecha: {task.get('due_date')}")
        else:
            print(f"   ❌ Error obteniendo tareas: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Error: {e}")

if __name__ == "__main__":
    test_validation_error()
