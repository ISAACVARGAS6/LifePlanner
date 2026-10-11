# 🔒 Guía de Seguridad - LifePlanner

## ⚠️ Información Sensible Protegida

### Archivos que NO deben subirse a GitHub:

1. **Bases de datos**:
   - `Backend/lifeplanner.db`
   - `Backend/test.db`
   - `*.sqlite`, `*.sqlite3`

2. **Certificados y keystores**:
   - `*.keystore`
   - `my-release-key.keystore`
   - `lifeplanner-release-key.keystore`
   - `*.key`, `*.p12`, `*.jks`

3. **Archivos de configuración**:
   - `.env`
   - `.env.local`
   - `.env.production`
   - `config.json`
   - `secrets.json`

4. **Archivos de servicios**:
   - `google-services.json`
   - `GoogleService-Info.plist`
   - `service-account*.json`

## 🔐 Variables de Entorno Requeridas

### Backend (.env):
```bash
DATABASE_URL=sqlite:///./lifeplanner.db
SECRET_KEY=your-secret-key-here-change-in-production
ALLOWED_ORIGINS=https://your-domain.com,http://localhost:3000
```

### Frontend Android (build.gradle):
```bash
KEYSTORE_PASSWORD=your-keystore-password
KEY_PASSWORD=your-key-password
```

## 🛡️ Configuración de Seguridad

### 1. Secretos en Código
- ✅ **Corregido**: `SECRET_KEY` ahora usa variables de entorno
- ✅ **Corregido**: Passwords de keystore usan variables de entorno
- ✅ **Corregido**: `.gitignore` actualizado para excluir archivos sensibles

### 2. Base de Datos
- ✅ **Corregido**: `DATABASE_URL` se lee de variables de entorno
- ✅ **Corregido**: Archivos `.db` excluidos del repositorio

### 3. Certificados Android
- ✅ **Corregido**: Passwords de keystore usan variables de entorno
- ✅ **Corregido**: Archivos `.keystore` excluidos del repositorio

## 🚨 Acciones de Seguridad Realizadas

1. **Eliminación de secretos hardcodeados**:
   - `SECRET_KEY` en `auth.py` ahora usa `os.getenv()`
   - Passwords de keystore en `build.gradle` usan variables de entorno

2. **Actualización de .gitignore**:
   - Agregados archivos específicos de keystore
   - Mantenida exclusión de archivos sensibles

3. **Creación de archivos de ejemplo**:
   - `Backend/env.example` - Variables de entorno del backend
   - `Frontend/android/app/env.example` - Variables de entorno de Android

## 🔍 Verificación de Seguridad

### Comandos para verificar:
```bash
# Verificar que no hay archivos sensibles en el repositorio
git ls-files | grep -E "\.(keystore|db|env|key)$"

# Verificar que no hay secretos hardcodeados
grep -r "password\|secret\|key" --exclude-dir=node_modules --exclude-dir=.git .
```

### Archivos que deben estar en .gitignore:
- `*.keystore`
- `*.db`
- `.env*`
- `my-release-key.keystore`
- `lifeplanner-release-key.keystore`

## 📋 Checklist de Seguridad

- [x] Secretos movidos a variables de entorno
- [x] Archivos sensibles excluidos del repositorio
- [x] .gitignore actualizado
- [x] Archivos de ejemplo creados
- [x] Documentación de seguridad creada

## 🚀 Para Producción

### Render.com:
```bash
SECRET_KEY=tu-secreto-super-seguro-aqui
DATABASE_URL=postgresql://user:pass@host:port/db
ALLOWED_ORIGINS=https://tu-dominio.com
```

### Android (CI/CD):
```bash
KEYSTORE_PASSWORD=tu-password-keystore
KEY_PASSWORD=tu-password-key
```

## ⚠️ Recordatorios Importantes

1. **NUNCA** subas archivos `.keystore` al repositorio
2. **NUNCA** hardcodees passwords o secretos
3. **SIEMPRE** usa variables de entorno para configuración sensible
4. **SIEMPRE** verifica que los archivos sensibles estén en `.gitignore`
5. **SIEMPRE** genera nuevos secretos para producción

## 🔧 Herramientas de Seguridad

- **GitHub Secrets**: Para CI/CD
- **Render Environment Variables**: Para despliegue
- **Android Keystore**: Para firma de aplicaciones
- **PostgreSQL**: Para base de datos en producción






