#!/bin/bash

echo "🚀 Actualizando LifePlanner a Expo SDK 54 y Android SDK 35..."

# Limpiar dependencias existentes
echo "🧹 Limpiando dependencias existentes..."
rm -rf node_modules
rm -f package-lock.json
rm -f yarn.lock

# Instalar Expo CLI globalmente si no está instalado
echo "📦 Verificando Expo CLI..."
if ! command -v expo &> /dev/null; then
    echo "Instalando Expo CLI..."
    npm install -g @expo/cli
fi

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Actualizar a Expo SDK 54
echo "🔄 Actualizando a Expo SDK 54..."
npx expo install --fix

# Limpiar caché
echo "🧹 Limpiando caché..."
npx expo r -c

echo "✅ Actualización completada!"
echo "📱 Para probar la aplicación, ejecuta:"
echo "   npx expo start"
echo ""
echo "🔧 Cambios realizados:"
echo "   - Expo SDK actualizado a 54.0.0"
echo "   - Android SDK actualizado a 35"
echo "   - Gradle actualizado a 8.4"
echo "   - NDK actualizado a 25.1.8937393"
echo "   - Kotlin actualizado a 1.9.10"
