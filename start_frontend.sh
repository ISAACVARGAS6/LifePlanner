#!/bin/bash

echo "🎨 Iniciando Frontend LifePlanner..."
cd Frontend

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js 18+"
    exit 1
fi

# Verificar si npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado. Por favor instala npm"
    exit 1
fi

# Instalar dependencias si no están instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

echo "✅ Iniciando Expo..."
echo "📱 Escanea el código QR con la app Expo Go"
echo "🔄 Presiona Ctrl+C para detener"

npx expo start
