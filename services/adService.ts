import { Alert } from 'react-native';

interface AdConfig {
  maxAdsPerSession: number;
  minTimeBetweenAds: number; // en milisegundos
  adMessages: string[];
}

class AdService {
  private static instance: AdService;
  private adsShownThisSession: number = 0;
  private lastAdTime: number = 0;
  private sessionStartTime: number = Date.now();

  private config: AdConfig = {
    maxAdsPerSession: 1,
    minTimeBetweenAds: 300000, // 5 minutos
    adMessages: [
      "¿Te gusta LifePlanner? ¡Compártelo con tus amigos! 📱",
      "¡Gracias por usar LifePlanner! Tu feedback nos ayuda a mejorar ⭐",
      "¿Necesitas más funcionalidades? ¡Déjanos saber qué te gustaría agregar! 💡",
      "¡Sakura está aquí para motivarte! ¡Sigue organizando tus proyectos! 🎓",
      "¿Sabías que puedes personalizar tus proyectos? ¡Explora todas las opciones! ✨"
    ]
  };

  private constructor() {}

  public static getInstance(): AdService {
    if (!AdService.instance) {
      AdService.instance = new AdService();
    }
    return AdService.instance;
  }

  /**
   * Verifica si se puede mostrar un anuncio
   */
  private canShowAd(): boolean {
    const now = Date.now();
    const timeSinceLastAd = now - this.lastAdTime;
    const timeSinceSessionStart = now - this.sessionStartTime;

    // No mostrar si ya se mostró el máximo de anuncios
    if (this.adsShownThisSession >= this.config.maxAdsPerSession) {
      return false;
    }

    // No mostrar si no ha pasado suficiente tiempo desde el último anuncio
    if (timeSinceLastAd < this.config.minTimeBetweenAds) {
      return false;
    }

    // No mostrar en los primeros 2 minutos de la sesión
    if (timeSinceSessionStart < 120000) {
      return false;
    }

    return true;
  }

  /**
   * Obtiene un mensaje de anuncio aleatorio
   */
  private getRandomAdMessage(): string {
    const randomIndex = Math.floor(Math.random() * this.config.adMessages.length);
    return this.config.adMessages[randomIndex];
  }

  /**
   * Muestra un anuncio intersticial moderado
   */
  public showInterstitialAd(): boolean {
    if (!this.canShowAd()) {
      return false;
    }

    const adMessage = this.getRandomAdMessage();
    
    Alert.alert(
      '💫 LifePlanner',
      adMessage,
      [
        {
          text: '¡Gracias!',
          style: 'default',
          onPress: () => {
            this.adsShownThisSession++;
            this.lastAdTime = Date.now();
          }
        },
        {
          text: 'Más tarde',
          style: 'cancel'
        }
      ],
      { cancelable: true }
    );

    return true;
  }

  /**
   * Muestra un anuncio de agradecimiento (no cuenta como anuncio intersticial)
   */
  public showThankYouAd(): void {
    const thankYouMessages = [
      "¡Gracias por usar LifePlanner! 🎉",
      "¡Sakura está orgullosa de tu progreso! 🌸",
      "¡Sigues haciendo un excelente trabajo! ⭐",
      "¡Tu organización es admirable! 📚",
      "¡Gracias por confiar en LifePlanner! 💖"
    ];

    const randomMessage = thankYouMessages[Math.floor(Math.random() * thankYouMessages.length)];
    
    Alert.alert(
      '🌸 Sakura',
      randomMessage,
      [{ text: '¡Gracias!', style: 'default' }],
      { cancelable: true }
    );
  }

  /**
   * Reinicia el contador de anuncios para una nueva sesión
   */
  public resetSession(): void {
    this.adsShownThisSession = 0;
    this.sessionStartTime = Date.now();
    this.lastAdTime = 0;
  }

  /**
   * Obtiene estadísticas de anuncios de la sesión actual
   */
  public getSessionStats(): {
    adsShown: number;
    maxAds: number;
    sessionDuration: number;
    timeSinceLastAd: number;
  } {
    const now = Date.now();
    return {
      adsShown: this.adsShownThisSession,
      maxAds: this.config.maxAdsPerSession,
      sessionDuration: now - this.sessionStartTime,
      timeSinceLastAd: now - this.lastAdTime
    };
  }

  /**
   * Configura los parámetros de anuncios
   */
  public configureAds(config: Partial<AdConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

export default AdService.getInstance(); 