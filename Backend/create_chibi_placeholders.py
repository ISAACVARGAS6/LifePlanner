#!/usr/bin/env python3
"""
Script para crear imágenes placeholder de los chibis de Sakura
Genera imágenes básicas para los 15 estados emocionales
"""

from PIL import Image, ImageDraw, ImageFont
import os
from typing import Dict, Tuple

# Configuración de colores de Sakura
COLORS = {
    "uniform_primary": "#2E4A8C",    # Azul marino del uniforme
    "uniform_secondary": "#FFFFFF",   # Blanco de la camisa
    "accent": "#FF6B9D",             # Rosa para detalles
    "shoes": "#8B4513",              # Marrón de los zapatos
    "hair": "#8B4513",               # Castaño del cabello
    "eyes": "#4A90E2",               # Azul de los ojos
    "skin": "#FFE4C4",               # Color de piel
    "background": "#F0F8FF"          # Fondo azul claro
}

# Estados emocionales con sus características
EMOTIONAL_STATES = {
    "happy_excited": {
        "title": "Feliz y Emocionada",
        "description": "¡Está muy emocionada! Sus ojos brillan con entusiasmo",
        "expression": "😊",
        "color": "#FFB6C1"  # Rosa claro
    },
    "happy_calm": {
        "title": "Feliz y Tranquila", 
        "description": "Se ve tranquila y contenta, disfrutando del momento",
        "expression": "🙂",
        "color": "#98FB98"  # Verde claro
    },
    "happy_studying": {
        "title": "Feliz Estudiando",
        "description": "Está estudiando con alegría, disfrutando del aprendizaje",
        "expression": "📚",
        "color": "#87CEEB"  # Azul cielo
    },
    "focused_determined": {
        "title": "Concentrada y Determinada",
        "description": "Concentrada en su objetivo, muestra determinación",
        "expression": "💪",
        "color": "#DDA0DD"  # Ciruela
    },
    "focused_stressed": {
        "title": "Concentrada pero Estresada",
        "description": "Está trabajando duro pero se nota algo de tensión",
        "expression": "😰",
        "color": "#F0E68C"  # Amarillo claro
    },
    "tired_but_determined": {
        "title": "Cansada pero Determinada",
        "description": "Aunque está cansada, mantiene su determinación",
        "expression": "😴",
        "color": "#E6E6FA"  # Lavanda
    },
    "tired_overwhelmed": {
        "title": "Cansada y Abrumada",
        "description": "Se ve agotada y un poco abrumada, necesita descanso",
        "expression": "😵",
        "color": "#FFA07A"  # Salmón claro
    },
    "excited_achievement": {
        "title": "Emocionada por Logro",
        "description": "¡Está súper emocionada por su logro!",
        "expression": "🎉",
        "color": "#FFD700"  # Dorado
    },
    "proud_accomplished": {
        "title": "Orgullosa de Logro",
        "description": "Se ve orgullosa y satisfecha con lo que ha logrado",
        "expression": "😌",
        "color": "#98FB98"  # Verde claro
    },
    "thoughtful_planning": {
        "title": "Pensativa Planificando",
        "description": "Está pensando y planificando su siguiente paso",
        "expression": "🤔",
        "color": "#B0E0E6"  # Azul polvo
    },
    "confident_ready": {
        "title": "Confiada y Lista",
        "description": "Se ve segura de sí misma y lista para cualquier desafío",
        "expression": "😎",
        "color": "#FFB6C1"  # Rosa claro
    },
    "nervous_uncertain": {
        "title": "Nerviosa e Incierta",
        "description": "Se nota un poco nerviosa e insegura sobre lo que viene",
        "expression": "😟",
        "color": "#F0E68C"  # Amarillo claro
    },
    "relaxed_break": {
        "title": "Relajada en Descanso",
        "description": "Está relajada, tomándose un merecido descanso",
        "expression": "😌",
        "color": "#E0FFFF"  # Cian claro
    },
    "energized_motivated": {
        "title": "Energizada y Motivada",
        "description": "¡Está llena de energía y motivación!",
        "expression": "⚡",
        "color": "#FFD700"  # Dorado
    },
    "determined_challenge": {
        "title": "Determinada ante Desafío",
        "description": "Se ve decidida a enfrentar el desafío que tiene por delante",
        "expression": "🔥",
        "color": "#FF6347"  # Tomate
    }
}

def hex_to_rgb(hex_color: str) -> Tuple[int, int, int]:
    """Convierte color hexadecimal a RGB"""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def create_chibi_placeholder(state: str, config: Dict) -> Image.Image:
    """Crea una imagen placeholder para un estado emocional"""
    # Configuración de la imagen
    width, height = 256, 256
    img = Image.new('RGBA', (width, height), (240, 248, 255, 255))  # Fondo azul claro
    draw = ImageDraw.Draw(img)
    
    # Color de fondo específico del estado
    bg_color = hex_to_rgb(config["color"])
    draw.rectangle([0, 0, width, height], fill=bg_color + (100,))  # Con transparencia
    
    # Dibujar círculo para la cabeza (estilo chibi)
    head_center = (width // 2, height // 2 - 20)
    head_radius = 60
    draw.ellipse([
        head_center[0] - head_radius,
        head_center[1] - head_radius,
        head_center[0] + head_radius,
        head_center[1] + head_radius
    ], fill=hex_to_rgb(COLORS["skin"]))
    
    # Dibujar cabello (estilo chibi)
    hair_color = hex_to_rgb(COLORS["hair"])
    draw.ellipse([
        head_center[0] - head_radius - 10,
        head_center[1] - head_radius - 15,
        head_center[0] + head_radius + 10,
        head_center[1] + head_radius - 20
    ], fill=hair_color)
    
    # Dibujar ojos
    eye_color = hex_to_rgb(COLORS["eyes"])
    left_eye = (head_center[0] - 20, head_center[1] - 10)
    right_eye = (head_center[0] + 20, head_center[1] - 10)
    draw.ellipse([left_eye[0] - 8, left_eye[1] - 8, left_eye[0] + 8, left_eye[1] + 8], fill=eye_color)
    draw.ellipse([right_eye[0] - 8, right_eye[1] - 8, right_eye[0] + 8, right_eye[1] + 8], fill=eye_color)
    
    # Dibujar uniforme (cuerpo)
    uniform_color = hex_to_rgb(COLORS["uniform_primary"])
    body_top = head_center[1] + head_radius - 20
    body_bottom = height - 40
    draw.rectangle([
        head_center[0] - 40,
        body_top,
        head_center[0] + 40,
        body_bottom
    ], fill=uniform_color)
    
    # Agregar texto del estado
    try:
        # Intentar usar una fuente del sistema
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 16)
    except:
        try:
            # Fuente alternativa
            font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 16)
        except:
            # Fuente por defecto
            font = ImageFont.load_default()
    
    # Título del estado
    title = config["title"]
    title_bbox = draw.textbbox((0, 0), title, font=font)
    title_width = title_bbox[2] - title_bbox[0]
    title_x = (width - title_width) // 2
    draw.text((title_x, 20), title, fill=(0, 0, 0), font=font)
    
    # Emoji de expresión
    emoji = config["expression"]
    emoji_bbox = draw.textbbox((0, 0), emoji, font=font)
    emoji_width = emoji_bbox[2] - emoji_bbox[0]
    emoji_x = (width - emoji_width) // 2
    draw.text((emoji_x, head_center[1] - 50), emoji, fill=(0, 0, 0), font=font)
    
    # Texto "Sakura"
    sakura_text = "Sakura"
    sakura_bbox = draw.textbbox((0, 0), sakura_text, font=font)
    sakura_width = sakura_bbox[2] - sakura_bbox[0]
    sakura_x = (width - sakura_width) // 2
    draw.text((sakura_x, height - 40), sakura_text, fill=(0, 0, 0), font=font)
    
    return img

def main():
    """Función principal que crea todas las imágenes placeholder"""
    print("🎨 CREANDO IMÁGENES PLACEHOLDER PARA SAKURA")
    print("=" * 50)
    
    # Crear directorio si no existe
    output_dir = "static/chibis"
    os.makedirs(output_dir, exist_ok=True)
    
    created_files = []
    
    for state, config in EMOTIONAL_STATES.items():
        print(f"📝 Creando: {config['title']} ({state})")
        
        # Crear imagen
        img = create_chibi_placeholder(state, config)
        
        # Guardar imagen
        filename = f"{state}.png"
        filepath = os.path.join(output_dir, filename)
        img.save(filepath, "PNG")
        
        created_files.append(filename)
        print(f"✅ Guardado: {filepath}")
    
    print("\n" + "=" * 50)
    print("🎓 IMÁGENES CREADAS EXITOSAMENTE")
    print("=" * 50)
    print(f"📁 Directorio: {output_dir}")
    print(f"📊 Total de archivos: {len(created_files)}")
    print("\n📋 Archivos creados:")
    for filename in created_files:
        print(f"  - {filename}")
    
    print("\n💡 Próximos pasos:")
    print("1. Reemplazar estas imágenes placeholder con diseños finales")
    print("2. Seguir las especificaciones en static/chibis/README.md")
    print("3. Mantener el mismo nombre de archivo para compatibilidad")
    print("4. Probar el sistema con: python test_chibi_system.py")

if __name__ == "__main__":
    main() 