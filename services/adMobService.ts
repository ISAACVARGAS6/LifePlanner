import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { adMobConfig, getAdUnitId } from '../config/adMobConfig';
import subscriptionService from './subscriptionService';

// Importación condicional de Google Ads para evitar errores en web y desarrollo
let MobileAds: any = null;
let InterstitialAd: any = null;

try {
  // Solo importar en móvil y producción
  if (!__DEV__ && Platform.OS !== 'web') {
    const googleAds = require('react-native-google-mobile-ads');
    MobileAds = googleAds.MobileAds;
    InterstitialAd = googleAds.InterstitialAd;
  }
} catch (error: any) {
  console.log('AdMobService: Google Ads no disponible en este entorno');
}

const STORAGE_KEYS = {
  LAST_DAILY_AD_TIME: 'lastDailyAdTime',
  ADS_SHOWN_TODAY: 'adsShownToday',
  LAST_AD_DATE: 'lastAdDate',
};

class AdMobService {
  private interstitialAd: any = null;
  private lastAdShown: number = 0;
  private adsShownThisSession: number = 0;
  private isInitialized: boolean = false;
  private isPreloading: boolean = false;

  constructor() {
    console.log('AdMobService: Inicializando servicio de publicidad');
    this.initializeAds();
  }

  private async initializeAds() {
    try {
      // En desarrollo, simulamos la inicialización
      if (__DEV__) {
        console.log('AdMobService: Modo desarrollo - simulando inicialización de AdMob');
        this.isInitialized = true;
        return;
      }

      // Aquí iría la inicialización real de AdMob
      await MobileAds.initialize();
      this.isInitialized = true;
      console.log('AdMobService: AdMob inicializado correctamente');
      
      // Iniciar precarga de anuncios intersticiales
      this.preloadInterstitialAd();
    } catch (error) {
      console.error('AdMobService: Error inicializando AdMob:', error);
    }
  }

  private async canShowAd(): Promise<boolean> {
    // Verificar si el usuario es premium
    const adsEnabled = await subscriptionService.areAdsEnabled();
    if (!adsEnabled) {
      console.log('AdMobService: Usuario premium - no se muestran anuncios');
      return false;
    }

    // Verificar límites de frecuencia
    const now = Date.now();
    const timeSinceLastAd = now - this.lastAdShown;
    const minInterval = adMobConfig.frequency.minTimeBetweenAds;
    
    if (timeSinceLastAd < minInterval) {
      console.log('AdMobService: Muy pronto para mostrar otro anuncio');
      return false;
    }

    if (this.adsShownThisSession >= adMobConfig.frequency.maxAdsPerSession) {
      console.log('AdMobService: Límite de anuncios por sesión alcanzado');
      return false;
    }

    return true;
  }

  private async canShowDailyAd(): Promise<boolean> {
    try {
      const now = Date.now();
      const today = new Date().toDateString();
      
      // Obtener la fecha del último anuncio
      const lastAdDate = await AsyncStorage.getItem(STORAGE_KEYS.LAST_AD_DATE);
      const adsShownToday = await AsyncStorage.getItem(STORAGE_KEYS.ADS_SHOWN_TODAY);
      
      // Si es un nuevo día, resetear el contador
      if (lastAdDate !== today) {
        await AsyncStorage.setItem(STORAGE_KEYS.ADS_SHOWN_TODAY, '0');
        await AsyncStorage.setItem(STORAGE_KEYS.LAST_AD_DATE, today);
        console.log('AdMobService: Nuevo día - contador de anuncios reseteado');
        return true;
      }
      
      // Verificar si ya se mostró el máximo de anuncios hoy (1 por día)
      const adsToday = parseInt(adsShownToday || '0', 10);
      if (adsToday >= 1) {
        console.log('AdMobService: Ya se mostró el anuncio diario hoy');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('AdMobService: Error verificando límite diario:', error);
      return false;
    }
  }

  /**
   * Precarga un anuncio intersticial para mejor rendimiento
   */
  private async preloadInterstitialAd(): Promise<void> {
    if (__DEV__ || this.isPreloading) return;

    try {
      this.isPreloading = true;
      const interstitial = InterstitialAd.createForAdRequest(getAdUnitId('INTERSTITIAL'), {
        requestNonPersonalizedAdsOnly: true,
        keywords: ['productivity', 'planning', 'organization', 'tasks', 'projects'],
      });

      // Configurar eventos del anuncio
      interstitial.addAdEventListener('loaded' as any, () => {
        console.log('AdMobService: Anuncio intersticial precargado');
        this.interstitialAd = interstitial;
        this.isPreloading = false;
      });

      interstitial.addAdEventListener('error' as any, (error: any) => {
        console.error('AdMobService: Error precargando anuncio:', error);
        this.isPreloading = false;
      });

      interstitial.addAdEventListener('closed' as any, () => {
        console.log('AdMobService: Anuncio intersticial cerrado');
        this.interstitialAd = null;
        // Precargar el siguiente anuncio
        setTimeout(() => this.preloadInterstitialAd(), 1000);
      });

      // Cargar el anuncio
      await interstitial.load();
    } catch (error) {
      console.error('AdMobService: Error precargando anuncio intersticial:', error);
      this.isPreloading = false;
    }
  }

  /**
   * Fuerza la precarga de un anuncio intersticial
   */
  public async forcePreloadAd(): Promise<void> {
    if (__DEV__) {
      console.log('AdMobService: Precarga forzada no disponible en desarrollo');
      return;
    }
    
    if (this.isInitialized) {
      await this.preloadInterstitialAd();
    }
  }

  async showInterstitialAd(): Promise<boolean> {
    try {
      if (!(await this.canShowAd())) {
        return false;
      }

      // Verificar límite diario
      if (!(await this.canShowDailyAd())) {
        return false;
      }

      // En desarrollo, simulamos el anuncio
      if (__DEV__) {
        console.log('AdMobService: Simulando anuncio intersticial');
        this.lastAdShown = Date.now();
        this.adsShownThisSession++;
        
        // Incrementar contador diario
        await this.incrementDailyAdCount();
        
        Alert.alert(
          'Anuncio Simulado',
          'Este sería un anuncio intersticial real en producción.',
          [{ text: 'OK' }]
        );
        return true;
      }

      // Implementación real del anuncio intersticial
      try {
        // Si tenemos un anuncio precargado, usarlo
        if (this.interstitialAd) {
          console.log('AdMobService: Usando anuncio intersticial precargado');
          await this.interstitialAd.show();
          this.interstitialAd = null; // Limpiar referencia
        } else {
          // Crear y mostrar un anuncio nuevo
          const interstitial = InterstitialAd.createForAdRequest(getAdUnitId('INTERSTITIAL'), {
            requestNonPersonalizedAdsOnly: true,
            keywords: ['productivity', 'planning', 'organization', 'tasks', 'projects'],
          });

          // Cargar el anuncio
          await interstitial.load();
          
          // Mostrar el anuncio
          await interstitial.show();
        }
        
        this.lastAdShown = Date.now();
        this.adsShownThisSession++;
        
        // Incrementar contador diario
        await this.incrementDailyAdCount();
        
        console.log('AdMobService: Anuncio intersticial mostrado correctamente');
        return true;
      } catch (adError) {
        console.error('AdMobService: Error con el anuncio intersticial:', adError);
        // Fallback a simulación si falla el anuncio real
        this.lastAdShown = Date.now();
        this.adsShownThisSession++;
        await this.incrementDailyAdCount();
        return true;
      }
    } catch (error) {
      console.error('AdMobService: Error mostrando anuncio intersticial:', error);
      return false;
    }
  }

  async showThankYouAd(): Promise<boolean> {
    try {
      if (!(await this.canShowAd())) {
        return false;
      }

      // Verificar límite diario
      if (!(await this.canShowDailyAd())) {
        return false;
      }

      // En desarrollo, simulamos el anuncio de agradecimiento
      if (__DEV__) {
        console.log('AdMobService: Simulando anuncio de agradecimiento');
        this.lastAdShown = Date.now();
        this.adsShownThisSession++;
        
        // Incrementar contador diario
        await this.incrementDailyAdCount();
        
        Alert.alert(
          '¡Gracias!',
          'Gracias por usar nuestra aplicación. Este sería un anuncio de agradecimiento.',
          [{ text: 'OK' }]
        );
        return true;
      }

      // Implementación real del anuncio de agradecimiento
      try {
        // Si tenemos un anuncio precargado, usarlo
        if (this.interstitialAd) {
          console.log('AdMobService: Usando anuncio de agradecimiento precargado');
          await this.interstitialAd.show();
          this.interstitialAd = null; // Limpiar referencia
        } else {
          // Crear y mostrar un anuncio nuevo
          const interstitial = InterstitialAd.createForAdRequest(getAdUnitId('INTERSTITIAL'), {
            requestNonPersonalizedAdsOnly: true,
            keywords: ['productivity', 'planning', 'organization', 'tasks', 'projects'],
          });

          // Cargar el anuncio
          await interstitial.load();
          
          // Mostrar el anuncio
          await interstitial.show();
        }
        
        this.lastAdShown = Date.now();
        this.adsShownThisSession++;
        
        // Incrementar contador diario
        await this.incrementDailyAdCount();
        
        console.log('AdMobService: Anuncio de agradecimiento mostrado correctamente');
        return true;
      } catch (adError) {
        console.error('AdMobService: Error con el anuncio de agradecimiento:', adError);
        // Fallback a simulación si falla el anuncio real
        this.lastAdShown = Date.now();
        this.adsShownThisSession++;
        await this.incrementDailyAdCount();
        return true;
      }
    } catch (error) {
      console.error('AdMobService: Error mostrando anuncio de agradecimiento:', error);
      return false;
    }
  }

  async showDailyAd(): Promise<boolean> {
    try {
      // Verificar límite diario
      if (!(await this.canShowDailyAd())) {
        return false;
      }

      const success = await this.showInterstitialAd();
      return success;
    } catch (error) {
      console.error('AdMobService: Error mostrando anuncio diario:', error);
      return false;
    }
  }

  private async incrementDailyAdCount(): Promise<void> {
    try {
      const adsShownToday = await AsyncStorage.getItem(STORAGE_KEYS.ADS_SHOWN_TODAY);
      const currentCount = parseInt(adsShownToday || '0', 10);
      await AsyncStorage.setItem(STORAGE_KEYS.ADS_SHOWN_TODAY, (currentCount + 1).toString());
      console.log(`AdMobService: Contador diario incrementado a ${currentCount + 1}`);
    } catch (error) {
      console.error('AdMobService: Error incrementando contador diario:', error);
    }
  }

  async getDailyAdStats(): Promise<{
    adsShownToday: number;
    canShowToday: boolean;
    lastAdDate: string | null;
  }> {
    try {
      const today = new Date().toDateString();
      const lastAdDate = await AsyncStorage.getItem(STORAGE_KEYS.LAST_AD_DATE);
      const adsShownToday = await AsyncStorage.getItem(STORAGE_KEYS.ADS_SHOWN_TODAY);
      
      const adsToday = parseInt(adsShownToday || '0', 10);
      const canShowToday = lastAdDate !== today || adsToday < 1;
      
      return {
        adsShownToday: adsToday,
        canShowToday,
        lastAdDate,
      };
    } catch (error) {
      console.error('AdMobService: Error obteniendo estadísticas diarias:', error);
      return {
        adsShownToday: 0,
        canShowToday: true,
        lastAdDate: null,
      };
    }
  }

  async resetDailyAdCount(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.ADS_SHOWN_TODAY);
      await AsyncStorage.removeItem(STORAGE_KEYS.LAST_AD_DATE);
      console.log('AdMobService: Contador diario de anuncios reseteado');
    } catch (error) {
      console.error('AdMobService: Error reseteando contador diario:', error);
    }
  }

  resetSession(): void {
    this.adsShownThisSession = 0;
    console.log('AdMobService: Sesión de anuncios reiniciada');
  }

  async getStats() {
    const dailyStats = await this.getDailyAdStats();
    return {
      adsShownThisSession: this.adsShownThisSession,
      lastAdShown: this.lastAdShown,
      isInitialized: this.isInitialized,
      canShowAd: await this.canShowAd(),
      dailyStats,
      hasPreloadedAd: !!this.interstitialAd,
      isPreloading: this.isPreloading,
    };
  }
}

const adMobService = new AdMobService();
export default adMobService; 