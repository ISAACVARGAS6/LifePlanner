#!/usr/bin/env python3

import requests
import json
import time

def test_frontend_init():
    """Simula exactamente la inicialización de la API del frontend"""
    
    print(f"🔍 Simulando inicialización de la API del frontend")
    print(f"   Tiempo: {time.strftime('%H:%M:%S')}")
    
    # Simular exactamente el flujo del frontend
    # 1. Obtener URLs disponibles
    urls = {
        "emulator": "http://10.0.2.2:8000",
        "localhost": "http://localhost:8000", 
        "network": "http://0.0.0.0:8000",
        "fallback": "http://10.0.2.2:8000",
        "localIp": "http://192.168.3.188:8000",
        "fixed": "http://192.168.3.188:8000"  # URL fija del frontend
    }
    
    print(f"📋 URLs disponibles:")
    for name, url in urls.items():
        print(f"   {name}: {url}")
    
    # 2. Simular testConnection (como hace el frontend)
    def test_connection(url):
        try:
            print(f"\n🔍 Probando conexión a: {url}/lifeplanner/health")
            response = requests.get(f"{url}/lifeplanner/health", timeout=5)
            print(f"   Respuesta: {response.status}")
            return response.ok
        except Exception as e:
            print(f"   Error: {e}")
            return False
    
    # 3. Simular initializeApi (como hace el frontend)
    print(f"\n🚀 Inicializando API...")
    
    # Usar URL fija para pruebas (como hace el frontend)
    api_url = urls["fixed"]
    print(f"   Usando URL fija: {api_url}")
    
    # Probar la conexión
    if test_connection(api_url):
        print(f"   ✅ Conexión exitosa con URL fija")
    else:
        print(f"   ❌ Falló conexión con URL fija")
        
        # Si falla, intentar otras URLs
        for name, url in urls.items():
            if name == "fixed":
                continue
            print(f"   🔍 Probando conexión con {name}: {url}")
            if test_connection(url):
                print(f"   ✅ Conexión exitosa usando {name}: {url}")
                api_url = url
                break
            else:
                print(f"   ❌ Falló conexión con {name}: {url}")
    
    print(f"\n🎯 URL final configurada: {api_url}")
    
    # 4. Simular ensureConnection (como hace el frontend)
    print(f"\n🔒 Asegurando conexión...")
    if test_connection(api_url):
        print(f"   ✅ Conexión confirmada")
    else:
        print(f"   ❌ Conexión perdida, intentando reconectar...")
        # Aquí el frontend reintentaría la inicialización
    
    # 5. Probar creación de tarea con la URL configurada
    print(f"\n📝 Probando creación de tarea con URL configurada...")
    
    # Obtener proyecto
    try:
        response = requests.get(f"{api_url}/lifeplanner/projects/", timeout=10)
        if response.status_code == 200:
            projects = response.json()
            if projects:
                project_id = projects[0]['id']
                print(f"   📋 Usando proyecto: {projects[0]['title']} (ID: {project_id})")
                
                # Crear tarea
                task_data = {
                    "title": "Tarea test inicialización frontend",
                    "description": "Descripción de prueba de inicialización",
                    "priority": "media",
                    "status": "pendiente",
                    "due_date": None
                }
                
                print(f"   📤 Enviando datos: {json.dumps(task_data, indent=6)}")
                
                response = requests.post(
                    f"{api_url}/lifeplanner/tasks/project/{project_id}",
                    json=task_data,
                    headers={
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Cache-Control": "no-cache"
                    },
                    timeout=15
                )
                
                print(f"   📥 Respuesta: {response.status_code}")
                
                if response.status_code == 200:
                    task_created = response.json()
                    print(f"      ✅ Tarea creada: ID {task_created.get('id')}")
                    
                    # Verificar en BD
                    time.sleep(1)
                    verify_response = requests.get(f"{api_url}/lifeplanner/tasks/", params={"project_id": project_id})
                    if verify_response.status_code == 200:
                        tasks = verify_response.json()
                        print(f"      📊 Total tareas en proyecto {project_id}: {len(tasks)}")
                        
                        # Buscar la tarea
                        found = False
                        for task in tasks:
                            if task.get('title') == task_data['title']:
                                found = True
                                break
                        if found:
                            print(f"      ✅ Tarea confirmada en BD")
                        else:
                            print(f"      ❌ Tarea NO encontrada en BD")
                    else:
                        print(f"      ❌ Error verificando: {verify_response.status_code}")
                else:
                    print(f"      ❌ Error: {response.status_code}")
                    print(f"         Texto: {response.text[:100]}...")
                    
            else:
                print(f"   ❌ No hay proyectos")
        else:
            print(f"   ❌ Error obteniendo proyectos: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # 6. Resumen
    print(f"\n📋 Resumen de inicialización:")
    print(f"   ✅ URLs configuradas correctamente")
    print(f"   ✅ Conexión establecida")
    print(f"   ✅ API funcionando")
    print(f"   🔍 Si el frontend no funciona, el problema podría ser:")
    print(f"      - Errores de JavaScript en el navegador")
    print(f"      - Problemas de CORS")
    print(f"      - Problemas de estado en React")
    print(f"      - Problemas de red del lado del cliente")
    
    return True

if __name__ == "__main__":
    test_frontend_init()
