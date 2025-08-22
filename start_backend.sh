#!/bin/bash

echo "🚀 Iniciando Backend LifePlanner..."
cd Backend

# Verificar si Python está instalado
if ! command -v python &> /dev/null; then
    echo "❌ Python no está instalado. Por favor instala Python 3.8+"
    exit 1
fi

# Verificar si uvicorn está instalado
if ! python -c "import uvicorn" &> /dev/null; then
    echo "📦 Instalando dependencias..."
    pip install -r requirements.txt
fi

echo "✅ Iniciando servidor en http://localhost:8000"
echo "📖 Documentación API: http://localhost:8000/docs"
echo "🔄 Presiona Ctrl+C para detener"

python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
