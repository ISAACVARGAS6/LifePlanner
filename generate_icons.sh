#!/bin/bash

echo "🎨 Generando íconos para LifePlanner..."

# Crear directorios si no existen
mkdir -p android/app/src/main/res/mipmap-hdpi
mkdir -p android/app/src/main/res/mipmap-mdpi
mkdir -p android/app/src/main/res/mipmap-xhdpi
mkdir -p android/app/src/main/res/mipmap-xxhdpi
mkdir -p android/app/src/main/res/mipmap-xxxhdpi

# Verificar si ImageMagick está instalado
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick no está instalado. Instalando..."
    sudo dnf install -y ImageMagick
fi

# Generar íconos en diferentes resoluciones
echo "📱 Generando íconos para diferentes densidades..."

# HDPI (72x72)
convert assets/icon.svg -resize 72x72 android/app/src/main/res/mipmap-hdpi/ic_launcher.png
convert assets/icon.svg -resize 72x72 android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png

# MDPI (48x48)
convert assets/icon.svg -resize 48x48 android/app/src/main/res/mipmap-mdpi/ic_launcher.png
convert assets/icon.svg -resize 48x48 android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png

# XHDPI (96x96)
convert assets/icon.svg -resize 96x96 android/app/src/main/res/mipmap-xhdpi/ic_launcher.png
convert assets/icon.svg -resize 96x96 android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png

# XXHDPI (144x144)
convert assets/icon.svg -resize 144x144 android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png
convert assets/icon.svg -resize 144x144 android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png

# XXXHDPI (192x192)
convert assets/icon.svg -resize 192x192 android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png
convert assets/icon.svg -resize 192x192 android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png

# Generar ícono adaptativo
echo "🔄 Generando ícono adaptativo..."
convert assets/adaptive-icon.svg -resize 512x512 assets/adaptive-icon.png

# Generar ícono principal
convert assets/icon.svg -resize 512x512 assets/icon.png

echo "✅ ¡Íconos generados exitosamente!"
echo "📁 Ubicaciones:"
echo "   - android/app/src/main/res/mipmap-*/ic_launcher.png"
echo "   - assets/icon.png"
echo "   - assets/adaptive-icon.png"

# Mostrar información de los archivos generados
echo "📊 Información de archivos:"
ls -lh android/app/src/main/res/mipmap-*/ic_launcher.png
ls -lh assets/icon.png assets/adaptive-icon.png

