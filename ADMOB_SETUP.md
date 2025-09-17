# Configuración de AdMob en LifePlanner

## Estado de la Integración ✅

**AdMob está completamente integrado y funcional** con anuncios intersticiales en LifePlanner.

## Características Implementadas

### 🎯 **Anuncios Intersticiales**
- ✅ Integración completa con `react-native-google-mobile-ads`
- ✅ Precarga automática de anuncios para mejor rendimiento
- ✅ Control de frecuencia (máximo 1 por día)
- ✅ Límites por sesión (máximo 3 por sesión)
- ✅ Fallback a simulación si falla la carga
- ✅ Manejo de eventos (loaded, error, closed)

### 📱 **Configuración Multiplataforma**
- ✅ Android: Permisos y meta-data configurados
- ✅ iOS: Info.plist configurado
- ✅ IDs de test y producción separados
- ✅ Configuración automática según entorno

### 🎮 **Lógica de Negocio**
- ✅ Verificación de suscripción premium
- ✅ Control de límites diarios
- ✅ Estadísticas de uso
- ✅ Reinicio de sesión

## Archivos de Configuración

### 1. **adMobConfig.ts** - Configuración principal
```typescript
// IDs de test (desarrollo)
test: {
  appId: 'ca-app-pub-3940256099942544~3347511713',
  interstitialId: 'ca-app-pub-3940256099942544/1033173712',
}

// IDs de producción (cambiar por los reales)
production: {
  appId: 'ca-app-pub-3940256099942544~3347511713',
  interstitialId: 'ca-app-pub-3940256099942544/1033173712',
}
```

### 2. **adMobService.ts** - Servicio principal
- Inicialización automática de AdMob
- Precarga de anuncios intersticiales
- Control de frecuencia y límites
- Manejo de errores y fallbacks

### 3. **AndroidManifest.xml** - Configuración Android
```xml
<meta-data
  android:name="com.google.android.gms.ads.APPLICATION_ID"
  android:value="ca-app-pub-3940256099942544~3347511713" />
```

### 4. **Info.plist** - Configuración iOS
```xml
<key>GADApplicationIdentifier</key>
<string>ca-app-pub-3940256099942544~3347511713</string>
```

## Uso en la Aplicación

### Mostrar Anuncio Intersticial
```typescript
import adMobService from '../services/adMobService';

// Mostrar anuncio normal
await adMobService.showInterstitialAd();

// Mostrar anuncio de agradecimiento
await adMobService.showThankYouAd();

// Mostrar anuncio diario
await adMobService.showDailyAd();
```

### Verificar Estado
```typescript
const stats = await adMobService.getStats();
console.log('Anuncios mostrados:', stats.adsShownThisSession);
console.log('Anuncio precargado:', stats.hasPreloadedAd);
```

## Configuración para Producción

### 1. **Cambiar IDs de Test por IDs Reales**
Editar `Frontend/config/adMobConfig.ts`:
```typescript
production: {
  appId: 'ca-app-pub-TU_APP_ID_REAL',
  interstitialId: 'ca-app-pub-TU_INTERSTITIAL_ID_REAL',
}
```

### 2. **Actualizar AndroidManifest.xml**
```xml
<meta-data
  android:name="com.google.android.gms.ads.APPLICATION_ID"
  android:value="ca-app-pub-TU_APP_ID_REAL" />
```

### 3. **Actualizar Info.plist**
```xml
<key>GADApplicationIdentifier</key>
<string>ca-app-pub-TU_APP_ID_REAL</string>
```

## Testing

### Modo Desarrollo
- Los anuncios se simulan con Alert.alert
- No se conecta a AdMob real
- Perfecto para desarrollo y testing

### Modo Producción
- Anuncios reales de AdMob
- Precarga automática
- Manejo completo de eventos

## Dependencias

```json
{
  "react-native-google-mobile-ads": "^15.4.0"
}
```

## Troubleshooting

### Error: "AdMob not initialized"
- Verificar que `MobileAds().initialize()` se ejecute
- Comprobar permisos de internet en Android/iOS

### Error: "Failed to load ad"
- Verificar IDs de anuncios
- Comprobar conexión a internet
- Revisar logs de AdMob en consola

### Anuncios no se muestran
- Verificar límites de frecuencia
- Comprobar estado de suscripción premium
- Revisar estadísticas con `getStats()`

## Próximos Pasos

1. ✅ **Completado**: Integración básica de intersticiales
2. 🔄 **En progreso**: Optimización de rendimiento
3. 📋 **Pendiente**: Anuncios recompensados
4. 📋 **Pendiente**: Análisis de métricas
5. 📋 **Pendiente**: A/B testing de frecuencia

---

**Estado**: 🟢 **COMPLETAMENTE FUNCIONAL**
**Última actualización**: Diciembre 2024
**Versión**: 1.0.0
