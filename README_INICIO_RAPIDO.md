# 🚀 LifePlanner - Inicio Rápido

## 📋 Prerrequisitos

- **Python 3.8+** para el backend
- **Node.js 18+** para el frontend
- **npm** o **yarn** para gestionar dependencias

## 🎯 Inicio Rápido

### 1. Backend (FastAPI)

```bash
# Opción 1: Usar el script automático
./start_backend.sh

# Opción 2: Comando manual
cd Backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**✅ El backend estará disponible en:**
- API: http://localhost:8000
- Documentación: http://localhost:8000/docs
- Health check: http://localhost:8000/lifeplanner/health

### 2. Frontend (React Native + Expo)

```bash
# Opción 1: Usar el script automático
./start_frontend.sh

# Opción 2: Comando manual
cd Frontend
npx expo start
```

**✅ El frontend estará disponible en:**
- Metro bundler: http://localhost:8081
- Código QR para escanear con Expo Go

## 🔧 Solución de Problemas

### Error: "No encuentra app.main"
- **Causa**: Ejecutar desde el directorio raíz en lugar del directorio Backend
- **Solución**: Usar `cd Backend` antes de ejecutar, o usar el script `start_backend.sh`

### Error: "expo-cli deprecado"
- **Causa**: Usar el comando `expo` directamente
- **Solución**: Usar `npx expo` en su lugar

### Dependencias faltantes
```bash
# Backend
cd Backend
pip install -r requirements.txt

# Frontend
cd Frontend
npm install
```

## 📁 Estructura del Proyecto

```
AppLifePlanner/
├── Backend/           # API FastAPI
│   ├── app/
│   │   ├── main.py   # Punto de entrada principal
│   │   ├── models/   # Modelos de base de datos
│   │   └── routes/   # Rutas de la API
│   └── requirements.txt
├── Frontend/          # App React Native
│   ├── app/          # Páginas con Expo Router
│   ├── components/   # Componentes reutilizables
│   └── package.json
├── start_backend.sh   # Script de inicio del backend
└── start_frontend.sh  # Script de inicio del frontend
```

## 🎮 Comandos Útiles

```bash
# Verificar estado del backend
curl http://localhost:8000/lifeplanner/health

# Instalar dependencias del backend
cd Backend && pip install -r requirements.txt

# Limpiar cache de Expo
cd Frontend && npx expo start --clear

# Ejecutar tests del backend
cd Backend && python -m pytest
```

## 🆘 ¿Necesitas Ayuda?

Si encuentras algún problema:

1. Verifica que estés en el directorio correcto
2. Asegúrate de que las dependencias estén instaladas
3. Revisa los logs de error en la terminal
4. Usa los scripts automáticos `start_backend.sh` y `start_frontend.sh`
