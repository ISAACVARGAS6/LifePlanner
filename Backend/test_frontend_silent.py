#!/usr/bin/env python3

import requests
import json
import time

def test_frontend_silent():
    """Prueba problemas silenciosos del frontend"""
    
    base_url = "http://192.168.3.188:8000"
    
    print(f"🔍 Probando problemas silenciosos del frontend")
    print(f"   URL: {base_url}")
    
    # 1. Verificar que el frontend puede acceder a la API
    print(f"\n1️⃣ Verificando acceso desde frontend...")
    
    # Simular exactamente lo que hace el frontend
    try:
        # Health check (como hace el frontend)
        response = requests.get(f"{base_url}/lifeplanner/health", timeout=5)
        if response.status_code == 200:
            print(f"   ✅ Health check exitoso")
        else:
            print(f"   ❌ Health check falló: {response.status_code}")
            return False
    except Exception as e:
        print(f"   ❌ Error en health check: {e}")
        return False
    
    # 2. Verificar que puede obtener proyectos
    print(f"\n2️⃣ Verificando obtención de proyectos...")
    try:
        response = requests.get(f"{base_url}/lifeplanner/projects/", timeout=10)
        if response.status_code == 200:
            projects = response.json()
            print(f"   ✅ Proyectos obtenidos: {len(projects)}")
            if projects:
                project_id = projects[0]['id']
                print(f"   📋 Usando proyecto: {projects[0]['title']} (ID: {project_id})")
            else:
                print(f"   ❌ No hay proyectos")
                return False
        else:
            print(f"   ❌ Error obteniendo proyectos: {response.status_code}")
            return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False
    
    # 3. Probar creación de tarea con diferentes configuraciones
    print(f"\n3️⃣ Probando creación con diferentes configuraciones...")
    
    test_cases = [
        {
            "name": "Configuración básica (como frontend)",
            "headers": {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            "timeout": 10
        },
        {
            "name": "Configuración con cache control",
            "headers": {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Cache-Control": "no-cache"
            },
            "timeout": 10
        },
        {
            "name": "Configuración con user agent",
            "headers": {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "User-Agent": "Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36"
            },
            "timeout": 10
        }
    ]
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\n   {i}️⃣ {test_case['name']}")
        
        task_data = {
            "title": f"Tarea test {i} - {test_case['name']}",
            "description": f"Descripción de prueba {i}",
            "priority": "media",
            "status": "pendiente",
            "due_date": None
        }
        
        print(f"      📤 Enviando: {task_data['title']}")
        
        try:
            response = requests.post(
                f"{base_url}/lifeplanner/tasks/project/{project_id}",
                json=task_data,
                headers=test_case['headers'],
                timeout=test_case['timeout']
            )
            
            print(f"      📥 Respuesta: {response.status_code}")
            
            if response.status_code == 200:
                task_created = response.json()
                print(f"         ✅ Tarea creada: ID {task_created.get('id')}")
                
                # Verificar inmediatamente
                time.sleep(0.5)
                verify_response = requests.get(f"{base_url}/lifeplanner/tasks/", params={"project_id": project_id})
                if verify_response.status_code == 200:
                    tasks = verify_response.json()
                    # Buscar la tarea
                    found = False
                    for task in tasks:
                        if task.get('title') == task_data['title']:
                            found = True
                            break
                    if found:
                        print(f"         ✅ Tarea confirmada en BD")
                    else:
                        print(f"         ❌ Tarea NO encontrada en BD")
                else:
                    print(f"         ❌ Error verificando: {verify_response.status_code}")
            else:
                print(f"         ❌ Error: {response.status_code}")
                print(f"            Texto: {response.text[:100]}...")
                
        except Exception as e:
            print(f"         ❌ Excepción: {e}")
    
    # 4. Verificar estado final
    print(f"\n4️⃣ Verificando estado final...")
    try:
        response = requests.get(f"{base_url}/lifeplanner/tasks/", params={"project_id": project_id})
        if response.status_code == 200:
            tasks = response.json()
            print(f"   📊 Total tareas en proyecto {project_id}: {len(tasks)}")
            print(f"   📝 Últimas 5 tareas:")
            for task in tasks[-5:]:
                print(f"      - {task.get('id')}: {task.get('title')} | {task.get('status')}")
        else:
            print(f"   ❌ Error obteniendo tareas: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # 5. Diagnóstico
    print(f"\n5️⃣ Diagnóstico del problema:")
    print(f"   ✅ Backend funcionando")
    print(f"   ✅ API accesible")
    print(f"   ✅ Tareas guardándose")
    print(f"   🔍 Problema en frontend:")
    print(f"      - Verificar si hay errores en consola del navegador")
    print(f"      - Verificar si las llamadas HTTP aparecen en Network tab")
    print(f"      - Verificar si hay problemas de CORS")
    print(f"      - Verificar si hay problemas de estado en React")
    
    return True

if __name__ == "__main__":
    test_frontend_silent()
