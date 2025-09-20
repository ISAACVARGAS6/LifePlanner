#!/bin/bash

echo "🚀 Generando AAB con configuración nativa..."

# Limpiar proyecto
echo "🧹 Limpiando proyecto..."
cd Frontend
rm -rf node_modules
rm -rf android/app/build
rm -rf android/build

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install --legacy-peer-deps

# Generar keystore de producción
echo "🔐 Generando keystore de producción..."
cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore lifeplanner-release-key.keystore -alias lifeplanner-key-alias -keyalg RSA -keysize 2048 -validity 10000 -storepass lifeplanner123 -keypass lifeplanner123 -dname "CN=LifePlanner, OU=Development, O=LifePlanner, L=City, S=State, C=US"

# Verificar keystore
echo "✅ Verificando keystore..."
keytool -list -v -keystore lifeplanner-release-key.keystore -storepass lifeplanner123

# Construir AAB
echo "🔨 Construyendo AAB..."
cd ..
./gradlew bundleRelease --stacktrace --info

# Verificar firma
echo "🔍 Verificando firma del AAB..."
cd app/build/outputs/bundle/release
aapt dump badging app-release.aab | grep -E "(package|debuggable)"

echo "✅ AAB generado exitosamente!"
echo "📁 Ubicación: Frontend/android/app/build/outputs/bundle/release/app-release.aab"
