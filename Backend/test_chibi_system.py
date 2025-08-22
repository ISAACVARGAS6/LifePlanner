#!/usr/bin/env python3
"""
Script de prueba para el sistema de colegiala chibi
Verifica que todos los endpoints funcionen correctamente
"""

import requests
import json
from typing import Dict, Any

# Configuración
BASE_URL = "http://localhost:8000/lifeplanner"
CHIBI_BASE_URL = f"{BASE_URL}/chibis"

def test_endpoint(endpoint: str, method: str = "GET", data: Dict = None) -> Dict[str, Any]:
    """Prueba un endpoint y retorna el resultado"""
    url = f"{CHIBI_BASE_URL}{endpoint}"
    
    try:
        if method == "GET":
            response = requests.get(url)
        elif method == "POST":
            response = requests.post(url, json=data)
        else:
            return {"error": f"Método {method} no soportado"}
        
        if response.status_code == 200:
            return {
                "success": True,
                "data": response.json(),
                "status_code": response.status_code
            }
        else:
            return {
                "success": False,
                "error": f"Status {response.status_code}: {response.text}",
                "status_code": response.status_code
            }
    
    except requests.exceptions.ConnectionError:
        return {
            "success": False,
            "error": "No se pudo conectar al servidor. Asegúrate de que el backend esté corriendo."
        }
    except Exception as e:
        return {
            "success": False,
            "error": f"Error inesperado: {str(e)}"
        }

def print_result(test_name: str, result: Dict[str, Any]):
    """Imprime el resultado de una prueba de forma formateada"""
    print(f"\n{'='*60}")
    print(f"🧪 PRUEBA: {test_name}")
    print(f"{'='*60}")
    
    if result["success"]:
        print("✅ ÉXITO")
        print(f"📊 Datos recibidos:")
        print(json.dumps(result["data"], indent=2, ensure_ascii=False))
    else:
        print("❌ FALLO")
        print(f"🚨 Error: {result['error']}")
    
    print(f"📡 Status Code: {result.get('status_code', 'N/A')}")

def main():
    """Función principal que ejecuta todas las pruebas"""
    print("🎓 INICIANDO PRUEBAS DEL SISTEMA DE COLEGIALA CHIBI")
    print("=" * 60)
    
    # Lista de pruebas
    tests = [
        ("Tipos de chibis", "/types"),
        ("Estados emocionales", "/emotional-states"),
        ("Personalidad de Sakura", "/personality"),
        ("Apariencia de Sakura", "/appearance"),
        ("Frase del día", "/daily-quote"),
        ("Actividades de descanso", "/study-break-activities"),
        ("Estado emocional aleatorio", "/random-emotional-state"),
        ("Vista previa completa", "/preview"),
    ]
    
    # Pruebas con parámetros
    project_tests = [
        ("Proyecto activo alta prioridad", "/project/activo/alta"),
        ("Proyecto en pausa media prioridad", "/project/en_pausa/media"),
        ("Proyecto terminado baja prioridad", "/project/terminado/baja"),
    ]
    
    task_tests = [
        ("Tarea pendiente alta prioridad", "/task/pendiente/alta"),
        ("Tarea en progreso media prioridad", "/task/en_progreso/media"),
        ("Tarea completada baja prioridad", "/task/completada/baja"),
    ]
    
    motivational_tests = [
        ("Mensajes motivacionales - feliz", "/motivational-messages/happy_excited"),
        ("Mensajes motivacionales - concentrada", "/motivational-messages/focused_determined"),
        ("Mensajes motivacionales - cansada", "/motivational-messages/tired_but_determined"),
    ]
    
    study_tests = [
        ("Consejos de estudio - matemáticas", "/study-tips/matemáticas"),
        ("Consejos de estudio - literatura", "/study-tips/literatura"),
        ("Consejos de estudio - ciencias", "/study-tips/ciencias"),
    ]
    
    schedule_tests = [
        ("Horario del lunes", "/school-schedule/monday"),
        ("Horario del martes", "/school-schedule/tuesday"),
    ]
    
    # Ejecutar pruebas básicas
    print("\n📋 PRUEBAS BÁSICAS")
    for test_name, endpoint in tests:
        result = test_endpoint(endpoint)
        print_result(test_name, result)
    
    # Ejecutar pruebas de proyectos
    print("\n📋 PRUEBAS DE PROYECTOS")
    for test_name, endpoint in project_tests:
        result = test_endpoint(endpoint)
        print_result(test_name, result)
    
    # Ejecutar pruebas de tareas
    print("\n📋 PRUEBAS DE TAREAS")
    for test_name, endpoint in task_tests:
        result = test_endpoint(endpoint)
        print_result(test_name, result)
    
    # Ejecutar pruebas de motivación
    print("\n📋 PRUEBAS DE MOTIVACIÓN")
    for test_name, endpoint in motivational_tests:
        result = test_endpoint(endpoint)
        print_result(test_name, result)
    
    # Ejecutar pruebas de estudio
    print("\n📋 PRUEBAS DE ESTUDIO")
    for test_name, endpoint in study_tests:
        result = test_endpoint(endpoint)
        print_result(test_name, result)
    
    # Ejecutar pruebas de horario
    print("\n📋 PRUEBAS DE HORARIO")
    for test_name, endpoint in schedule_tests:
        result = test_endpoint(endpoint)
        print_result(test_name, result)
    
    print("\n" + "="*60)
    print("🎓 PRUEBAS COMPLETADAS")
    print("="*60)
    print("\n💡 Para usar el sistema:")
    print("1. Asegúrate de que el backend esté corriendo en http://localhost:8000")
    print("2. Las rutas están disponibles en /lifeplanner/chibis/")
    print("3. Consulta la documentación en CHIBI_COLEGIALA_README.md")
    print("4. Los archivos de imagen deben estar en /static/chibis/")

if __name__ == "__main__":
    main() 