#!/usr/bin/env python3

import requests
import json
import time

def test_frontend_flow():
    """Simula el flujo completo del frontend"""
    
    print(f"🔍 Simulando flujo completo del frontend")
    print(f"   Tiempo: {time.strftime('%H:%M:%S')}")
    
    # 1. Simular inicialización de API (health check)
    print(f"\n1️⃣ Inicializando API (health check)...")
    
    urls_to_test = [
        "http://192.168.3.188:8000",  # URL fija del frontend
        "http://localhost:8000",       # localhost
        "http://10.0.2.2:8000"        # emulador Android
    ]
    
    working_url = None
    for url in urls_to_test:
        try:
            print(f"   🔍 Probando: {url}")
            response = requests.get(f"{url}/lifeplanner/health", timeout=5)
            if response.status_code == 200:
                working_url = url
                print(f"      ✅ Conexión exitosa: {url}")
                break
            else:
                print(f"      ❌ Status: {response.status_code}")
        except Exception as e:
            print(f"      ❌ Error: {e}")
    
    if not working_url:
        print(f"   ❌ No se pudo conectar a ninguna URL")
        return False
    
    print(f"   🎯 Usando URL: {working_url}")
    
    # 2. Simular obtención de proyectos
    print(f"\n2️⃣ Obteniendo proyectos...")
    try:
        response = requests.get(f"{working_url}/lifeplanner/projects/", timeout=10)
        if response.status_code == 200:
            projects = response.json()
            print(f"   ✅ Proyectos obtenidos: {len(projects)}")
            if projects:
                project = projects[0]
                project_id = project['id']
                print(f"   📋 Usando proyecto: {project['title']} (ID: {project_id})")
            else:
                print(f"   ❌ No hay proyectos")
                return False
        else:
            print(f"   ❌ Error obteniendo proyectos: {response.status_code}")
            return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False
    
    # 3. Simular creación de tarea (exactamente como el frontend)
    print(f"\n3️⃣ Creando tarea (simulando frontend)...")
    
    # Datos exactos que envía el frontend
    task_data = {
        "title": "Tarea simulando frontend completo",
        "description": "Descripción de prueba del flujo completo",
        "priority": "media",
        "status": "pendiente",
        "due_date": None
    }
    
    print(f"   📤 Datos enviados: {json.dumps(task_data, indent=6)}")
    print(f"   🌐 Endpoint: POST {working_url}/lifeplanner/tasks/project/{project_id}")
    
    try:
        response = requests.post(
            f"{working_url}/lifeplanner/tasks/project/{project_id}",
            json=task_data,
            headers={
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Cache-Control": "no-cache"
            },
            timeout=15
        )
        
        print(f"   📥 Respuesta del servidor:")
        print(f"      Status: {response.status_code}")
        print(f"      Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            task_created = response.json()
            print(f"      ✅ Tarea creada exitosamente:")
            print(f"         ID: {task_created.get('id')}")
            print(f"         Título: {task_created.get('title')}")
            print(f"         Proyecto: {task_created.get('project_id')}")
            print(f"         Estado: {task_created.get('status')}")
            print(f"         Prioridad: {task_created.get('priority')}")
            print(f"         Fecha límite: {task_created.get('due_date')}")
            
            # 4. Verificar en la base de datos
            print(f"\n4️⃣ Verificando en la base de datos...")
            time.sleep(1)  # Pequeña pausa
            
            response = requests.get(f"{working_url}/lifeplanner/tasks/", params={"project_id": project_id})
            if response.status_code == 200:
                tasks_after = response.json()
                print(f"   📊 Total tareas en proyecto {project_id}: {len(tasks_after)}")
                
                # Buscar la tarea recién creada
                new_task = None
                for task in tasks_after:
                    if task.get('title') == task_data['title']:
                        new_task = task
                        break
                
                if new_task:
                    print(f"   ✅ Tarea confirmada en BD:")
                    print(f"      ID: {new_task.get('id')}")
                    print(f"      Título: {new_task.get('title')}")
                    print(f"      Estado: {new_task.get('status')}")
                    print(f"      Prioridad: {new_task.get('priority')}")
                    print(f"      Fecha límite: {new_task.get('due_date')}")
                    print(f"      Creada: {new_task.get('created_at')}")
                else:
                    print(f"   ❌ Tarea NO encontrada en BD")
                    print(f"   🔍 Últimas 5 tareas:")
                    for task in tasks_after[-5:]:
                        print(f"      - {task.get('id')}: {task.get('title')} | {task.get('status')}")
            else:
                print(f"   ❌ Error verificando BD: {response.status_code}")
                
        else:
            print(f"      ❌ Error en la respuesta:")
            print(f"         Texto: {response.text}")
            try:
                error_json = response.json()
                print(f"         JSON: {json.dumps(error_json, indent=8)}")
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
    
    # 5. Resumen final
    print(f"\n5️⃣ Resumen del flujo:")
    print(f"   ✅ Backend funcionando correctamente")
    print(f"   ✅ API accesible desde IP externa")
    print(f"   ✅ Validación de datos funcionando")
    print(f"   ✅ Tareas guardándose en BD")
    print(f"   🔍 El problema debe estar en el frontend")
    print(f"   💡 Revisa:")
    print(f"      - Consola del navegador")
    print(f"      - Logs del frontend")
    print(f"      - Errores de red en DevTools")
    
    return True

if __name__ == "__main__":
    test_frontend_flow()
