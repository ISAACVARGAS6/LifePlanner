# 🚀 Guía de Despliegue en Render.com

## Configuración del Backend para Render

### Archivos de configuración creados:

1. **`requirements-render.txt`** - Dependencias optimizadas para producción
2. **`render.yaml`** - Configuración de servicios y base de datos
3. **`Procfile`** - Comando de inicio para Render
4. **`runtime.txt`** - Versión de Python específica

### Pasos para desplegar en Render.com:

#### 1. Crear cuenta en Render.com
- Ve a [render.com](https://render.com)
- Regístrate con tu cuenta de GitHub

#### 2. Conectar repositorio
- Haz clic en "New +" → "Web Service"
- Conecta tu repositorio de GitHub
- Selecciona el repositorio `LifePlanner`

#### 3. Configurar el servicio web
```
Name: lifeplanner-backend
Environment: Python 3
Build Command: pip install -r Backend/requirements-render.txt
Start Command: gunicorn Backend.app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT
```

#### 4. Configurar variables de entorno
En la sección "Environment Variables" de Render:

```
ALLOWED_ORIGINS = https://tu-dominio-frontend.com,http://localhost:3000
PYTHON_VERSION = 3.11.0
```

#### 5. Crear base de datos PostgreSQL
- En Render, ve a "New +" → "PostgreSQL"
- Nombre: `lifeplanner-db`
- Plan: Free
- Copia la `DATABASE_URL` generada

#### 6. Configurar la base de datos en el servicio web
- En tu servicio web, ve a "Environment"
- Agrega la variable `DATABASE_URL` con el valor de la base de datos

#### 7. Desplegar
- Haz clic en "Create Web Service"
- Render construirá y desplegará automáticamente

### Verificación del despliegue:

1. **Health Check**: `https://tu-app.onrender.com/lifeplanner/health`
2. **API Docs**: `https://tu-app.onrender.com/docs`
3. **Base de datos**: Verifica que las tablas se creen automáticamente

### Comandos útiles para debugging:

```bash
# Ver logs en tiempo real
render logs --service lifeplanner-backend

# Reiniciar servicio
render restart --service lifeplanner-backend
```

### Estructura de archivos para Render:

```
Backend/
├── app/
│   ├── main.py          # Aplicación principal
│   ├── db.py            # Configuración de BD
│   ├── models/          # Modelos de datos
│   ├── routes/          # Rutas de la API
│   └── schemas/         # Esquemas de validación
├── requirements-render.txt  # Dependencias
├── Procfile            # Comando de inicio
├── runtime.txt         # Versión de Python
└── render.yaml         # Configuración de Render
```

### Troubleshooting común:

1. **Error de importación**: Verifica que el `Start Command` use `Backend.app.main:app`
2. **Error de base de datos**: Asegúrate de que `DATABASE_URL` esté configurada
3. **Error de CORS**: Configura `ALLOWED_ORIGINS` correctamente
4. **Timeout**: El plan gratuito tiene límites de tiempo de inactividad

### URLs importantes después del despliegue:

- **API Base**: `https://tu-app.onrender.com/lifeplanner/`
- **Health Check**: `https://tu-app.onrender.com/lifeplanner/health`
- **Documentación**: `https://tu-app.onrender.com/docs`
- **Proyectos**: `https://tu-app.onrender.com/lifeplanner/projects/`
- **Tareas**: `https://tu-app.onrender.com/lifeplanner/tasks/`
