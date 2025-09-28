# Solución para el error de psycopg2 en Render

## Problema
```
ImportError: /opt/render/project/src/.venv/lib/python3.13/site-packages/psycopg2/_psycopg.cpython-313-x86_64-linux-gnu.so: undefined symbol: _PyInterpreterState_Get
```

## Causa
- Render está usando Python 3.13 por defecto
- `psycopg2` no es compatible con Python 3.13
- El error `undefined symbol: _PyInterpreterState_Get` es típico de esta incompatibilidad

## Solución aplicada

### 1. Archivos actualizados:
- `runtime.txt` → `python-3.11.9`
- `requirements.txt` → Versiones compatibles con Python 3.11
- `requirements-render.txt` → Versiones compatibles con Python 3.11
- `.python-version` → `3.11.9` (para forzar la versión)
- `render.yaml` → Configuración específica para Render

### 2. Dependencias corregidas:
```
fastapi==0.115.8
uvicorn[standard]==0.34.2
gunicorn==23.0.0
sqlalchemy==2.0.35
alembic==1.15.2
psycopg2-binary==2.9.9
python-dotenv==1.1.0
pydantic==2.10.6
pydantic-settings==2.9.1
python-multipart==0.0.20
python-jose[cryptography]==3.4.0
passlib[bcrypt]==1.7.4
email-validator==2.2.0
pytz==2025.2
greenlet==3.1.1
```

### 3. Pasos para aplicar en Render:
1. Hacer commit y push de los cambios
2. Render detectará automáticamente los cambios
3. El redeploy usará Python 3.11.9
4. El backend debería funcionar correctamente

### 4. Verificación:
- El backend debería conectarse a PostgreSQL sin errores
- Las migraciones de Alembic deberían ejecutarse correctamente
- La API debería responder en `https://lifeplanner-zjn3.onrender.com`

## Notas importantes:
- Python 3.11.9 es compatible con `psycopg2-binary==2.9.9`
- `greenlet==3.1.1` es necesario para SQLAlchemy
- Render respeta el archivo `runtime.txt` para la versión de Python
