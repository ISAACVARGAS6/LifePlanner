#!/bin/bash

echo "🚀 Generando AAB para Google Play Console..."

# Limpiar proyecto
echo "🧹 Limpiando proyecto..."
cd /home/isaac/AppLifePlanner/Frontend
rm -rf android/app/build/outputs/bundle/release/app-release.aab

# Verificar keystores
echo "🔐 Verificando keystores..."
cd android/app

# Verificar keystore de upload
if [ ! -f "upload-keystore.keystore" ]; then
    echo "❌ Keystore de upload no encontrado. Generando uno nuevo..."
    keytool -genkeypair -v -storetype PKCS12 -keystore upload-keystore.keystore -alias upload-key-alias -keyalg RSA -keysize 2048 -validity 10000 -storepass upload123 -keypass upload123 -dname "CN=LifePlanner Upload, OU=Mobile Development, O=LifePlanner Inc, L=Mexico City, ST=CDMX, C=MX"
fi

# Verificar keystore de release
if [ ! -f "lifeplanner-release-key.keystore" ]; then
    echo "❌ Keystore de release no encontrado. Generando uno nuevo..."
    keytool -genkeypair -v -storetype PKCS12 -keystore lifeplanner-release-key.keystore -alias lifeplanner-key-alias -keyalg RSA -keysize 2048 -validity 10000 -storepass lifeplanner123 -keypass lifeplanner123 -dname "CN=LifePlanner App, OU=Mobile Development, O=LifePlanner Inc, L=Mexico City, ST=CDMX, C=MX"
fi

echo "✅ Verificando keystores..."
echo "📋 Keystore de Upload:"
keytool -list -v -keystore upload-keystore.keystore -storepass upload123 | grep -E "(CN=|Alias name)"
echo "📋 Keystore de Release:"
keytool -list -v -keystore lifeplanner-release-key.keystore -storepass lifeplanner123 | grep -E "(CN=|Alias name)"

# Construir AAB con keystore de upload (para Google Play Console)
echo "🔨 Construyendo AAB con keystore de upload..."
cd ..

# Modificar temporalmente build.gradle para usar upload keystore
echo "⚙️ Configurando build.gradle para usar upload keystore..."
sed -i 's/signingConfig signingConfigs.release/signingConfig signingConfigs.upload/g' app/build.gradle

# Construir AAB
./gradlew clean
./gradlew bundleRelease --stacktrace --info

# Restaurar configuración original
echo "🔄 Restaurando configuración original..."
sed -i 's/signingConfig signingConfigs.upload/signingConfig signingConfigs.release/g' app/build.gradle

# Verificar que el AAB se generó
if [ -f "app/build/outputs/bundle/release/app-release.aab" ]; then
    echo "✅ AAB generado exitosamente!"
    
    # Verificar firma
    echo "🔍 Verificando firma del AAB..."
    cd app/build/outputs/bundle/release
    jarsigner -verify -verbose -certs app-release.aab | grep -E "(Signer|CN=)" | head -3
    
    echo "📁 Ubicación: Frontend/android/app/build/outputs/bundle/release/app-release.aab"
    ls -la app-release.aab
    
    echo ""
    echo "🎯 INSTRUCCIONES PARA GOOGLE PLAY CONSOLE:"
    echo "1. Ve a Google Play Console → Release → Setup → App signing"
    echo "2. Si tienes 'App Signing by Google Play' ACTIVADO:"
    echo "   - Sube este AAB (firmado con upload keystore)"
    echo "   - Google lo re-firmará automáticamente"
    echo "3. Si tienes 'App Signing by Google Play' DESACTIVADO:"
    echo "   - Necesitas usar el keystore de release"
    echo "   - Ejecuta: ./generate_aab_android_studio.sh"
    echo ""
    echo "🔍 Verifica la configuración en Google Play Console antes de subir!"
else
    echo "❌ Error: AAB no se generó"
    exit 1
fi
