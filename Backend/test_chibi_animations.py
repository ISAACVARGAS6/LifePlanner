#!/usr/bin/env python3
"""
Script de prueba para verificar las animaciones y funcionalidades del chibi
Prueba todos los endpoints y verifica que las imágenes se sirvan correctamente
"""

import requests
import json
import time
from typing import Dict, Any

# Configuración
BASE_URL = "http://localhost:8000/lifeplanner/chibis"
STATIC_URL = "http://localhost:8000/static/chibis"

def test_endpoint(endpoint: str, expected_status: int = 200) -> Dict[str, Any]:
    """Prueba un endpoint específico"""
    url = f"{BASE_URL}/{endpoint}"
    try:
        response = requests.get(url, timeout=10)
        success = response.status_code == expected_status
        return {
            "endpoint": endpoint,
            "url": url,
            "status_code": response.status_code,
            "success": success,
            "data": response.json() if success else None,
            "error": None if success else f"Status {response.status_code}"
        }
    except Exception as e:
        return {
            "endpoint": endpoint,
            "url": url,
            "status_code": None,
            "success": False,
            "data": None,
            "error": str(e)
        }

def test_image(image_name: str) -> Dict[str, Any]:
    """Prueba que una imagen se sirva correctamente"""
    url = f"{STATIC_URL}/{image_name}"
    try:
        response = requests.head(url, timeout=5)
        success = response.status_code == 200
        return {
            "image": image_name,
            "url": url,
            "status_code": response.status_code,
            "success": success,
            "content_type": response.headers.get('content-type', ''),
            "error": None if success else f"Status {response.status_code}"
        }
    except Exception as e:
        return {
            "image": image_name,
            "url": url,
            "status_code": None,
            "success": False,
            "content_type": "",
            "error": str(e)
        }

def main():
    """Función principal de pruebas"""
    print("🎓 PRUEBAS DE ANIMACIONES Y FUNCIONALIDADES DEL CHIBI")
    print("=" * 60)
    
    # Lista de endpoints a probar
    endpoints = [
        "types",
        "emotional-states",
        "personality",
        "appearance",
        "daily-quote",
        "study-break-activities",
        "random-emotional-state",
        "project/activo/alta",
        "project/en_progreso/media",
        "project/terminado/baja",
        "task/activo/alta",
        "task/en_progreso/media",
        "task/terminado/baja",
        "motivational-messages/happy_excited",
        "motivational-messages/focused_determined",
        "study-tips/matemáticas",
        "study-tips/literatura",
        "school-schedule/monday",
        "school-schedule/tuesday"
    ]
    
    # Lista de imágenes a probar
    images = [
        "happy_excited.png",
        "happy_calm.png",
        "happy_studying.png",
        "focused_determined.png",
        "focused_stressed.png",
        "tired_but_determined.png",
        "tired_overwhelmed.png",
        "excited_achievement.png",
        "proud_accomplished.png",
        "thoughtful_planning.png",
        "confident_ready.png",
        "nervous_uncertain.png",
        "relaxed_break.png",
        "energized_motivated.png",
        "determined_challenge.png"
    ]
    
    print("\n📡 PROBANDO ENDPOINTS DE LA API")
    print("-" * 40)
    
    endpoint_results = []
    for endpoint in endpoints:
        print(f"🔍 Probando: {endpoint}")
        result = test_endpoint(endpoint)
        endpoint_results.append(result)
        
        if result["success"]:
            print(f"✅ Éxito: {endpoint}")
        else:
            print(f"❌ Fallo: {endpoint} - {result['error']}")
        
        time.sleep(0.1)  # Pequeña pausa entre requests
    
    print("\n🖼️ PROBANDO IMÁGENES ESTÁTICAS")
    print("-" * 40)
    
    image_results = []
    for image in images:
        print(f"🔍 Probando: {image}")
        result = test_image(image)
        image_results.append(result)
        
        if result["success"]:
            print(f"✅ Éxito: {image}")
        else:
            print(f"❌ Fallo: {image} - {result['error']}")
        
        time.sleep(0.1)  # Pequeña pausa entre requests
    
    # Resumen de resultados
    print("\n📊 RESUMEN DE RESULTADOS")
    print("=" * 60)
    
    successful_endpoints = sum(1 for r in endpoint_results if r["success"])
    failed_endpoints = len(endpoint_results) - successful_endpoints
    
    successful_images = sum(1 for r in image_results if r["success"])
    failed_images = len(image_results) - successful_images
    
    print(f"🎯 Endpoints: {successful_endpoints}/{len(endpoint_results)} exitosos")
    print(f"🖼️ Imágenes: {successful_images}/{len(image_results)} exitosas")
    print(f"📈 Tasa de éxito general: {((successful_endpoints + successful_images) / (len(endpoint_results) + len(image_results)) * 100):.1f}%")
    
    # Mostrar errores específicos
    if failed_endpoints > 0:
        print("\n❌ ENDPOINTS CON ERRORES:")
        for result in endpoint_results:
            if not result["success"]:
                print(f"  - {result['endpoint']}: {result['error']}")
    
    if failed_images > 0:
        print("\n❌ IMÁGENES CON ERRORES:")
        for result in image_results:
            if not result["success"]:
                print(f"  - {result['image']}: {result['error']}")
    
    # Recomendaciones
    print("\n💡 RECOMENDACIONES:")
    if successful_endpoints == len(endpoint_results) and successful_images == len(image_results):
        print("✅ ¡Todo está funcionando perfectamente!")
        print("✅ El sistema está listo para las animaciones del frontend")
        print("✅ Sakura debería verse correctamente en la aplicación")
    elif successful_endpoints == len(endpoint_results):
        print("⚠️ API funcionando, pero hay problemas con las imágenes")
        print("🔧 Verificar que las imágenes estén en static/chibis/")
    elif successful_images == len(image_results):
        print("⚠️ Imágenes funcionando, pero hay problemas con la API")
        print("🔧 Verificar los endpoints del backend")
    else:
        print("❌ Hay problemas tanto en la API como en las imágenes")
        print("🔧 Revisar la configuración del backend")
    
    print("\n🎓 ¡Pruebas completadas!")

if __name__ == "__main__":
    main() 