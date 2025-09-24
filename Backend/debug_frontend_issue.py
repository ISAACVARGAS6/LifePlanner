#!/usr/bin/env python3

import requests
import json
import time

def debug_frontend_issue():
    """Debug del problema del frontend paso a paso"""
    
    base_url = "http://192.168.3.188:8000"
    
    print(f"🔍 Debug del problema del frontend")
    print(f"   URL: {base_url}")
    print(f"   Tiempo: {time.strftime('%H:%M:%S')}")
    
    # 1. Verificar que el proyecto 1 existe
    print(f"\n1️⃣ Verificando que el proyecto 1 existe...")
    try:
        response = requests.get(f"{base_url}/lifeplanner/projects/1", timeout=10)
        if response.status_code == 200:
            project = response.json()
            print(f"   ✅ Proyecto encontrado: {project.get('title')}")
        else:
            print(f"   ❌ Proyecto no encontrado: {response.status_code}")
            return False
    except Exception as e:
        print(f"   ❌ Error verificando proyecto: {e}")
        return False
    
    # 2. Verificar tareas existentes
    print(f"\n2️⃣ Verificando tareas existentes...")
    try:
        response = requests.get(f"{base_url}/lifeplanner/tasks/", params={"project_id": 1}, timeout=10)
        if response.status_code == 200:
            tasks = response.json()
            print(f"   ✅ Tareas encontradas: {len(tasks)}")
            print(f"   📝 Últimas 3 tareas:")
            for task in tasks[-3:]:
                print(f"      - {task.get('id')}: {task.get('title')} ({task.get('status')})")
        else:
            print(f"   ❌ Error obteniendo tareas: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Error obteniendo tareas: {e}")
    
    # 3. Probar creación con datos exactos del frontend
    print(f"\n3️⃣ Probando creación con datos del frontend...")
    
    # Simular exactamente los datos que envía el frontend
    task_data = {
        "title": "Tarea de debug frontend",
        "description": "Descripción de debug",
        "priority": "media",
        "status": "pendiente",
        "due_date": None
    }
    
    print(f"   📤 Enviando datos: {json.dumps(task_data, indent=6)}")
    
    try:
        response = requests.post(
            f"{base_url}/lifeplanner/tasks/project/1",
            json=task_data,
            headers={
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Cache-Control": "no-cache"
            },
            timeout=15
        )
        
        print(f"   📥 Respuesta recibida:")
        print(f"      Status: {response.status_code}")
        print(f"      Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            task_created = response.json()
            print(f"      ✅ Tarea creada: ID {task_created.get('id')}")
            
            # 4. Verificar inmediatamente en la BD
            print(f"\n4️⃣ Verificando en BD inmediatamente...")
            time.sleep(1)  # Pequeña pausa
            
            response = requests.get(f"{base_url}/lifeplanner/tasks/", params={"project_id": 1}, timeout=10)
            if response.status_code == 200:
                tasks_after = response.json()
                print(f"   📊 Tareas después de crear: {len(tasks_after)}")
                
                # Buscar la tarea recién creada
                new_task = None
                for task in tasks_after:
                    if task.get('title') == task_data['title']:
                        new_task = task
                        break
                
                if new_task:
                    print(f"   ✅ Tarea confirmada en BD: ID {new_task.get('id')}")
                    print(f"      Título: {new_task.get('title')}")
                    print(f"      Estado: {new_task.get('status')}")
                    print(f"      Prioridad: {new_task.get('priority')}")
                else:
                    print(f"   ❌ Tarea NO encontrada en BD")
                    print(f"   🔍 Últimas tareas:")
                    for task in tasks_after[-5:]:
                        print(f"      - {task.get('id')}: {task.get('title')}")
            else:
                print(f"   ❌ Error verificando BD: {response.status_code}")
                
        else:
            print(f"      ❌ Error en respuesta:")
            print(f"         Texto: {response.text}")
            try:
                error_json = response.json()
                print(f"         JSON: {json.dumps(error_json, indent=6)}")
            except:
                pass
                
    except requests.exceptions.Timeout:
        print(f"   ❌ Timeout - Solicitud tardó demasiado")
    except requests.exceptions.ConnectionError as e:
        print(f"   ❌ Error de conexión: {e}")
    except Exception as e:
        print(f"   ❌ Error inesperado: {e}")
        import traceback
        traceback.print_exc()
    
    # 5. Verificar logs del servidor
    print(f"\n5️⃣ Verificando logs del servidor...")
    print(f"   📋 Revisa la consola donde ejecutaste uvicorn")
    print(f"   🔍 Busca mensajes de error o warnings")
    
    return True

if __name__ == "__main__":
    debug_frontend_issue()
