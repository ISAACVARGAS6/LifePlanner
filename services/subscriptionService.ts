import AsyncStorage from '@react-native-async-storage/async-storage';

// Tipos de suscripción
export type SubscriptionType = 'free' | 'premium';

// Límites de la versión gratuita
export const FREE_LIMITS = {
  MAX_PROJECTS: 3,
  MAX_TASKS_PER_PROJECT: 10,
  ADS_ENABLED: true,
  EXPORT_ENABLED: false,
  ADVANCED_STATS: false,
} as const;

// Funcionalidades premium
export const PREMIUM_FEATURES = {
  UNLIMITED_PROJECTS: true,
  UNLIMITED_TASKS: true,
  NO_ADS: true,
  EXPORT_ENABLED: true,
  ADVANCED_STATS: true,
  CUSTOM_THEMES: true,
  BACKUP_CLOUD: true,
  PRIORITY_SUPPORT: true,
} as const;

interface SubscriptionData {
  type: SubscriptionType;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  features: {
    UNLIMITED_PROJECTS: boolean;
    UNLIMITED_TASKS: boolean;
    NO_ADS: boolean;
    EXPORT_ENABLED: boolean;
    ADVANCED_STATS: boolean;
    CUSTOM_THEMES: boolean;
    BACKUP_CLOUD: boolean;
    PRIORITY_SUPPORT: boolean;
  };
  limits: {
    MAX_PROJECTS: number;
    MAX_TASKS_PER_PROJECT: number;
    ADS_ENABLED: boolean;
    EXPORT_ENABLED: boolean;
    ADVANCED_STATS: boolean;
  };
}

class SubscriptionService {
  private static instance: SubscriptionService;
  private readonly SUBSCRIPTION_KEY = 'lifeplanner_subscription';

  private constructor() {}

  public static getInstance(): SubscriptionService {
    if (!SubscriptionService.instance) {
      SubscriptionService.instance = new SubscriptionService();
    }
    return SubscriptionService.instance;
  }

  /**
   * Obtiene la suscripción actual
   */
  async getSubscription(): Promise<SubscriptionData> {
    try {
      const data = await AsyncStorage.getItem(this.SUBSCRIPTION_KEY);
      if (data) {
        return JSON.parse(data);
      }
      // Suscripción gratuita por defecto
      return this.getDefaultFreeSubscription();
    } catch (error) {
      console.error('Subscription: Error obteniendo suscripción:', error);
      return this.getDefaultFreeSubscription();
    }
  }

  /**
   * Guarda la suscripción
   */
  async saveSubscription(subscription: SubscriptionData): Promise<void> {
    try {
      await AsyncStorage.setItem(this.SUBSCRIPTION_KEY, JSON.stringify(subscription));
      console.log('Subscription: Suscripción guardada exitosamente');
    } catch (error) {
      console.error('Subscription: Error guardando suscripción:', error);
      throw error;
    }
  }

  /**
   * Actualiza a suscripción premium
   */
  async upgradeToPremium(): Promise<void> {
    try {
      const subscription: SubscriptionData = {
        type: 'premium',
        startDate: new Date().toISOString(),
        isActive: true,
        features: {
          UNLIMITED_PROJECTS: true,
          UNLIMITED_TASKS: true,
          NO_ADS: true,
          EXPORT_ENABLED: true,
          ADVANCED_STATS: true,
          CUSTOM_THEMES: true,
          BACKUP_CLOUD: true,
          PRIORITY_SUPPORT: true,
        },
        limits: {
          MAX_PROJECTS: Infinity,
          MAX_TASKS_PER_PROJECT: Infinity,
          ADS_ENABLED: false,
          EXPORT_ENABLED: true,
          ADVANCED_STATS: true,
        },
      };
      
      await this.saveSubscription(subscription);
      console.log('Subscription: Actualizado a premium exitosamente');
    } catch (error) {
      console.error('Subscription: Error actualizando a premium:', error);
      throw error;
    }
  }

  /**
   * Degrada a suscripción gratuita
   */
  async downgradeToFree(): Promise<void> {
    try {
      const subscription = this.getDefaultFreeSubscription();
      await this.saveSubscription(subscription);
      console.log('Subscription: Degradado a gratuito exitosamente');
    } catch (error) {
      console.error('Subscription: Error degradando a gratuito:', error);
      throw error;
    }
  }

  /**
   * Verifica si el usuario puede crear más proyectos
   */
  async canCreateProject(currentProjectCount: number): Promise<boolean> {
    try {
      const subscription = await this.getSubscription();
      return currentProjectCount < subscription.limits.MAX_PROJECTS;
    } catch (error) {
      console.error('Subscription: Error verificando límite de proyectos:', error);
      return currentProjectCount < FREE_LIMITS.MAX_PROJECTS;
    }
  }

  /**
   * Verifica si el usuario puede crear más tareas
   */
  async canCreateTask(currentTaskCount: number): Promise<boolean> {
    try {
      const subscription = await this.getSubscription();
      return currentTaskCount < subscription.limits.MAX_TASKS_PER_PROJECT;
    } catch (error) {
      console.error('Subscription: Error verificando límite de tareas:', error);
      return currentTaskCount < FREE_LIMITS.MAX_TASKS_PER_PROJECT;
    }
  }

  /**
   * Verifica si los anuncios están habilitados
   */
  async areAdsEnabled(): Promise<boolean> {
    try {
      const subscription = await this.getSubscription();
      return subscription.limits.ADS_ENABLED;
    } catch (error) {
      console.error('Subscription: Error verificando anuncios:', error);
      return FREE_LIMITS.ADS_ENABLED;
    }
  }

  /**
   * Verifica si la exportación está habilitada
   */
  async isExportEnabled(): Promise<boolean> {
    try {
      const subscription = await this.getSubscription();
      return subscription.limits.EXPORT_ENABLED;
    } catch (error) {
      console.error('Subscription: Error verificando exportación:', error);
      return FREE_LIMITS.EXPORT_ENABLED;
    }
  }

  /**
   * Verifica si las estadísticas avanzadas están habilitadas
   */
  async areAdvancedStatsEnabled(): Promise<boolean> {
    try {
      const subscription = await this.getSubscription();
      return subscription.limits.ADVANCED_STATS;
    } catch (error) {
      console.error('Subscription: Error verificando estadísticas:', error);
      return FREE_LIMITS.ADVANCED_STATS;
    }
  }

  /**
   * Obtiene el límite actual de proyectos
   */
  async getProjectLimit(): Promise<number> {
    try {
      const subscription = await this.getSubscription();
      return subscription.limits.MAX_PROJECTS;
    } catch (error) {
      console.error('Subscription: Error obteniendo límite de proyectos:', error);
      return FREE_LIMITS.MAX_PROJECTS;
    }
  }

  /**
   * Obtiene el límite actual de tareas por proyecto
   */
  async getTaskLimit(): Promise<number> {
    try {
      const subscription = await this.getSubscription();
      return subscription.limits.MAX_TASKS_PER_PROJECT;
    } catch (error) {
      console.error('Subscription: Error obteniendo límite de tareas:', error);
      return FREE_LIMITS.MAX_TASKS_PER_PROJECT;
    }
  }

  /**
   * Obtiene las características disponibles
   */
  async getAvailableFeatures(): Promise<{
    UNLIMITED_PROJECTS: boolean;
    UNLIMITED_TASKS: boolean;
    NO_ADS: boolean;
    EXPORT_ENABLED: boolean;
    ADVANCED_STATS: boolean;
    CUSTOM_THEMES: boolean;
    BACKUP_CLOUD: boolean;
    PRIORITY_SUPPORT: boolean;
  }> {
    try {
      const subscription = await this.getSubscription();
      return subscription.features;
    } catch (error) {
      console.error('Subscription: Error obteniendo características:', error);
      return {
        UNLIMITED_PROJECTS: false,
        UNLIMITED_TASKS: false,
        NO_ADS: false,
        EXPORT_ENABLED: false,
        ADVANCED_STATS: false,
        CUSTOM_THEMES: false,
        BACKUP_CLOUD: false,
        PRIORITY_SUPPORT: false,
      };
    }
  }

  /**
   * Verifica si la suscripción está activa
   */
  async isSubscriptionActive(): Promise<boolean> {
    try {
      const subscription = await this.getSubscription();
      return subscription.isActive;
    } catch (error) {
      console.error('Subscription: Error verificando estado de suscripción:', error);
      return true; // Por defecto activa
    }
  }

  /**
   * Obtiene información de la suscripción para mostrar al usuario
   */
  async getSubscriptionInfo(): Promise<{
    type: SubscriptionType;
    isActive: boolean;
    projectLimit: number;
    taskLimit: number;
    adsEnabled: boolean;
    exportEnabled: boolean;
    advancedStats: boolean;
  }> {
    try {
      const subscription = await this.getSubscription();
      return {
        type: subscription.type,
        isActive: subscription.isActive,
        projectLimit: subscription.limits.MAX_PROJECTS,
        taskLimit: subscription.limits.MAX_TASKS_PER_PROJECT,
        adsEnabled: subscription.limits.ADS_ENABLED,
        exportEnabled: subscription.limits.EXPORT_ENABLED,
        advancedStats: subscription.limits.ADVANCED_STATS,
      };
    } catch (error) {
      console.error('Subscription: Error obteniendo información de suscripción:', error);
      return {
        type: 'free',
        isActive: true,
        projectLimit: FREE_LIMITS.MAX_PROJECTS,
        taskLimit: FREE_LIMITS.MAX_TASKS_PER_PROJECT,
        adsEnabled: FREE_LIMITS.ADS_ENABLED,
        exportEnabled: FREE_LIMITS.EXPORT_ENABLED,
        advancedStats: FREE_LIMITS.ADVANCED_STATS,
      };
    }
  }

  /**
   * Obtiene la suscripción gratuita por defecto
   */
  private getDefaultFreeSubscription(): SubscriptionData {
    return {
      type: 'free',
      startDate: new Date().toISOString(),
      isActive: true,
      features: {
        UNLIMITED_PROJECTS: false,
        UNLIMITED_TASKS: false,
        NO_ADS: false,
        EXPORT_ENABLED: false,
        ADVANCED_STATS: false,
        CUSTOM_THEMES: false,
        BACKUP_CLOUD: false,
        PRIORITY_SUPPORT: false,
      },
      limits: {
        MAX_PROJECTS: 3,
        MAX_TASKS_PER_PROJECT: 10,
        ADS_ENABLED: true,
        EXPORT_ENABLED: false,
        ADVANCED_STATS: false,
      },
    };
  }
}

export default SubscriptionService.getInstance(); 