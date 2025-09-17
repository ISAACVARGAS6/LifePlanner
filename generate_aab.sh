#!/bin/bash

echo "🚀 Generando Android App Bundle para LifePlanner..."

# Configurar variables de entorno
export ANDROID_HOME=/home/isaac/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools

# Navegar al directorio de Android
cd android

# Limpiar proyecto
echo "🧹 Limpiando proyecto..."
./gradlew clean

# Generar bundle de release
echo "📦 Generando Android App Bundle..."
./gradlew bundleRelease --no-daemon --stacktrace

# Verificar si se generó correctamente
if [ -f "app/build/outputs/bundle/release/app-release.aab" ]; then
    echo "✅ ¡AAB generado exitosamente!"
    echo "📁 Ubicación: android/app/build/outputs/bundle/release/app-release.aab"
    echo "📊 Tamaño: $(du -h app/build/outputs/bundle/release/app-release.aab | cut -f1)"
else
    echo "❌ Error: No se pudo generar el AAB"
    exit 1
fi


