// Configuración de AdMob para LifePlanner

export const adMobConfig = {
  // Test IDs (para desarrollo)
  test: {
    appId: 'ca-app-pub-3940256099942544~3347511713',
    bannerId: 'ca-app-pub-3940256099942544/6300978111',
    interstitialId: 'ca-app-pub-3940256099942544/1033173712',
    rewardedId: 'ca-app-pub-3940256099942544/5224354917',
  },
  
  // Production IDs (para producción)
  production: {
    appId: 'ca-app-pub-3940256099942544~3347511713', // Cambiar por el ID real
    bannerId: 'ca-app-pub-3940256099942544/6300978111', // Cambiar por el ID real
    interstitialId: 'ca-app-pub-3940256099942544/1033173712', // Cambiar por el ID real
    rewardedId: 'ca-app-pub-3940256099942544/5224354917', // Cambiar por el ID real
  },
  
  // Configuración general
  settings: {
    testMode: __DEV__, // Usar test mode en desarrollo
    maxAdContentRating: 'PG',
    tagForChildDirectedTreatment: false,
    tagForUnderAgeOfConsent: false,
    keywords: ['productivity', 'planning', 'tasks', 'projects'],
  },
  
  // Configuración de frecuencia
  frequency: {
    interstitialInterval: 24 * 60 * 60 * 1000, // 24 horas en milisegundos
    maxAdsPerSession: 3,
    minTimeBetweenAds: 5 * 60 * 1000, // 5 minutos
  },
  
  // Configuración de carga
  loading: {
    timeout: 10000, // 10 segundos
    retryAttempts: 3,
    retryDelay: 2000, // 2 segundos
  },
};

// Función para obtener el ID correcto según el entorno
export const getAdUnitId = (adType: 'INTERSTITIAL' | 'BANNER' | 'REWARDED'): string => {
  if (__DEV__) {
    const testIds = {
      INTERSTITIAL: adMobConfig.test.interstitialId,
      BANNER: adMobConfig.test.bannerId,
      REWARDED: adMobConfig.test.rewardedId,
    };
    return testIds[adType];
  }
  
  const productionIds = {
    INTERSTITIAL: adMobConfig.production.interstitialId,
    BANNER: adMobConfig.production.bannerId,
    REWARDED: adMobConfig.production.rewardedId,
  };
  return productionIds[adType];
};

// Función para obtener el App ID correcto según la plataforma
export const getAppId = (platform: 'android' | 'ios'): string => {
  return adMobConfig.test.appId; // Assuming appId is the same for both platforms for now
};

// Configuración de eventos de AdMob
export const AD_EVENTS = {
  LOADED: 'loaded',
  ERROR: 'error',
  OPENED: 'opened',
  CLOSED: 'closed',
  CLICKED: 'clicked',
  IMPRESSION: 'impression',
};

// Configuración de tipos de anuncios
export const AD_TYPES = {
  INTERSTITIAL: 'interstitial',
  BANNER: 'banner',
  REWARDED: 'rewarded',
  NATIVE: 'native',
};

// Configuración de posiciones de banner
export const BANNER_POSITIONS = {
  TOP: 'top',
  BOTTOM: 'bottom',
  CUSTOM: 'custom',
};

// Configuración de tamaños de banner
export const BANNER_SIZES = {
  BANNER: 'BANNER',
  LARGE_BANNER: 'LARGE_BANNER',
  MEDIUM_RECTANGLE: 'MEDIUM_RECTANGLE',
  FULL_BANNER: 'FULL_BANNER',
  LEADERBOARD: 'LEADERBOARD',
  ADAPTIVE_BANNER: 'ADAPTIVE_BANNER',
}; 