#!/bin/bash

echo "🚀 Generando AAB con Android Studio..."

# Limpiar proyecto
echo "🧹 Limpiando proyecto..."
cd /home/isaac/AppLifePlanner/Frontend
rm -rf android/app/build/outputs/bundle/release/app-release.aab

# Verificar que Android Studio esté instalado
if ! command -v studio &> /dev/null; then
    echo "❌ Android Studio no está instalado o no está en el PATH"
    echo "💡 Instala Android Studio y asegúrate de que 'studio' esté en tu PATH"
    exit 1
fi

# Verificar keystore
echo "🔐 Verificando keystore..."
cd android/app
if [ ! -f "lifeplanner-release-key.keystore" ]; then
    echo "❌ Keystore no encontrado. Generando uno nuevo..."
    keytool -genkeypair -v -storetype PKCS12 -keystore lifeplanner-release-key.keystore -alias lifeplanner-key-alias -keyalg RSA -keysize 2048 -validity 10000 -storepass lifeplanner123 -keypass lifeplanner123 -dname "CN=LifePlanner App, OU=Mobile Development, O=LifePlanner Inc, L=Mexico City, ST=CDMX, C=MX"
fi

# Verificar keystore
echo "✅ Verificando keystore..."
keytool -list -v -keystore lifeplanner-release-key.keystore -storepass lifeplanner123 | grep -E "(CN=|Alias name)"

# Construir AAB con Gradle directamente
echo "🔨 Construyendo AAB con Gradle..."
cd ..
./gradlew clean
./gradlew bundleRelease --stacktrace --info

# Verificar que el AAB se generó
if [ -f "app/build/outputs/bundle/release/app-release.aab" ]; then
    echo "✅ AAB generado exitosamente!"
    
    # Verificar firma
    echo "🔍 Verificando firma del AAB..."
    cd app/build/outputs/bundle/release
    jarsigner -verify -verbose -certs app-release.aab | grep -E "(Signer|CN=)" | head -3
    
    echo "📁 Ubicación: Frontend/android/app/build/outputs/bundle/release/app-release.aab"
    ls -la app-release.aab
else
    echo "❌ Error: AAB no se generó"
    exit 1
fi
