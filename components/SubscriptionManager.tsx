import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SakuraColors } from '../constants/Colors';
import { useSubscription } from '../hooks/useSubscription';

export default function SubscriptionManager() {
  const { subscriptionInfo, features, upgradeToPremium, downgradeToFree } = useSubscription();

  const handleUpgradeToPremium = async () => {
    Alert.alert(
      'Actualizar a Premium',
      '¿Estás seguro de que quieres actualizar a Premium? Disfrutarás de:\n\n' +
      '• Proyectos ilimitados\n' +
      '• Tareas ilimitadas\n' +
      '• Sin anuncios\n' +
      '• Exportación de datos\n' +
      '• Estadísticas avanzadas\n' +
      '• Temas personalizados\n' +
      '• Respaldo en la nube\n' +
      '• Soporte prioritario',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Actualizar',
          onPress: async () => {
            const success = await upgradeToPremium();
            if (success) {
              Alert.alert('¡Éxito!', 'Has sido actualizado a Premium. Disfruta de todas las características.');
            } else {
              Alert.alert('Error', 'No se pudo actualizar a Premium. Inténtalo de nuevo.');
            }
          },
        },
      ]
    );
  };

  const handleDowngradeToFree = async () => {
    Alert.alert(
      'Degradar a Gratuito',
      '¿Estás seguro de que quieres degradar a la versión gratuita?\n\n' +
      'Perderás acceso a:\n' +
      '• Proyectos ilimitados\n' +
      '• Tareas ilimitadas\n' +
      '• Sin anuncios\n' +
      '• Exportación de datos\n' +
      '• Estadísticas avanzadas\n' +
      '• Temas personalizados\n' +
      '• Respaldo en la nube\n' +
      '• Soporte prioritario\n\n' +
      'Los datos existentes se mantendrán.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Degradar',
          style: 'destructive',
          onPress: async () => {
            const success = await downgradeToFree();
            if (success) {
              Alert.alert('Completado', 'Has sido degradado a la versión gratuita.');
            } else {
              Alert.alert('Error', 'No se pudo degradar. Inténtalo de nuevo.');
            }
          },
        },
      ]
    );
  };

  const renderFeature = (icon: string, title: string, description: string, enabled: boolean) => (
    <View style={[styles.featureItem, !enabled && styles.featureDisabled]}>
      <View style={styles.featureHeader}>
        <Ionicons 
          name={icon as any} 
          size={24} 
          color={enabled ? SakuraColors.success : SakuraColors.textSecondary} 
        />
        <Text style={[styles.featureTitle, !enabled && styles.featureTitleDisabled]}>
          {title}
        </Text>
        <Ionicons 
          name={enabled ? 'checkmark-circle' : 'close-circle'} 
          size={20} 
          color={enabled ? SakuraColors.success : SakuraColors.error} 
        />
      </View>
      <Text style={[styles.featureDescription, !enabled && styles.featureDescriptionDisabled]}>
        {description}
      </Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Estado actual */}
      <View style={styles.currentStatus}>
        <View style={styles.statusHeader}>
          <Ionicons 
            name={subscriptionInfo.type === 'premium' ? 'star' : 'phone-portrait'} 
            size={32} 
            color={subscriptionInfo.type === 'premium' ? SakuraColors.warning : SakuraColors.textSecondary} 
          />
          <Text style={styles.statusTitle}>
            {subscriptionInfo.type === 'premium' ? 'Premium' : 'Gratuito'}
          </Text>
        </View>
        <Text style={styles.statusDescription}>
          {subscriptionInfo.type === 'premium' 
            ? 'Disfruta de todas las características sin límites'
            : `Límite de ${subscriptionInfo.projectLimit} proyectos y ${subscriptionInfo.taskLimit} tareas por proyecto`
          }
        </Text>
      </View>

      {/* Límites actuales */}
      <View style={styles.limitsSection}>
        <Text style={styles.sectionTitle}>Límites Actuales</Text>
        <View style={styles.limitsGrid}>
          <View style={styles.limitItem}>
            <Ionicons name="folder" size={20} color={SakuraColors.primary} />
            <Text style={styles.limitLabel}>Proyectos</Text>
            <Text style={styles.limitValue}>
              {subscriptionInfo.projectLimit === Infinity ? '∞' : subscriptionInfo.projectLimit}
            </Text>
          </View>
          <View style={styles.limitItem}>
            <Ionicons name="list" size={20} color={SakuraColors.secondary} />
            <Text style={styles.limitLabel}>Tareas por proyecto</Text>
            <Text style={styles.limitValue}>
              {subscriptionInfo.taskLimit === Infinity ? '∞' : subscriptionInfo.taskLimit}
            </Text>
          </View>
          <View style={styles.limitItem}>
            <Ionicons name="megaphone" size={20} color={SakuraColors.warning} />
            <Text style={styles.limitLabel}>Anuncios</Text>
            <Text style={styles.limitValue}>
              {subscriptionInfo.adsEnabled ? 'Sí' : 'No'}
            </Text>
          </View>
          <View style={styles.limitItem}>
            <Ionicons name="download" size={20} color={SakuraColors.success} />
            <Text style={styles.limitLabel}>Exportación</Text>
            <Text style={styles.limitValue}>
              {subscriptionInfo.exportEnabled ? 'Sí' : 'No'}
            </Text>
          </View>
        </View>
      </View>

      {/* Características */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>Características</Text>
        
        {renderFeature(
          'infinite',
          'Proyectos Ilimitados',
          'Crea tantos proyectos como necesites',
          features.UNLIMITED_PROJECTS
        )}
        
        {renderFeature(
          'list',
          'Tareas Ilimitadas',
          'Agrega todas las tareas que quieras a cada proyecto',
          features.UNLIMITED_TASKS
        )}
        
        {renderFeature(
          'megaphone-off',
          'Sin Anuncios',
          'Experiencia completamente libre de publicidad',
          features.NO_ADS
        )}
        
        {renderFeature(
          'download',
          'Exportación de Datos',
          'Exporta todos tus datos para respaldo',
          features.EXPORT_ENABLED
        )}
        
        {renderFeature(
          'analytics',
          'Estadísticas Avanzadas',
          'Análisis detallado de tu productividad',
          features.ADVANCED_STATS
        )}
        
        {renderFeature(
          'color-palette',
          'Temas Personalizados',
          'Personaliza la apariencia de la app',
          features.CUSTOM_THEMES
        )}
        
        {renderFeature(
          'cloud-upload',
          'Respaldo en la Nube',
          'Sincroniza tus datos en la nube',
          features.BACKUP_CLOUD
        )}
        
        {renderFeature(
          'headset',
          'Soporte Prioritario',
          'Atención al cliente prioritaria',
          features.PRIORITY_SUPPORT
        )}
      </View>

      {/* Acciones */}
      <View style={styles.actionsSection}>
        {subscriptionInfo.type === 'free' ? (
          <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgradeToPremium}>
            <Ionicons name="star" size={24} color="white" />
            <Text style={styles.upgradeButtonText}>Actualizar a Premium</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.downgradeButton} onPress={handleDowngradeToFree}>
            <Ionicons name="arrow-down" size={24} color={SakuraColors.error} />
            <Text style={styles.downgradeButtonText}>Degradar a Gratuito</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SakuraColors.background,
  },
  currentStatus: {
    backgroundColor: SakuraColors.surface,
    padding: 20,
    margin: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: SakuraColors.textPrimary,
    marginLeft: 10,
  },
  statusDescription: {
    fontSize: 16,
    color: SakuraColors.textSecondary,
    lineHeight: 24,
  },
  limitsSection: {
    backgroundColor: SakuraColors.surface,
    padding: 20,
    margin: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: SakuraColors.textPrimary,
    marginBottom: 16,
  },
  limitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  limitItem: {
    width: '48%',
    backgroundColor: SakuraColors.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  limitLabel: {
    fontSize: 12,
    color: SakuraColors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  limitValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: SakuraColors.textPrimary,
    marginTop: 2,
  },
  featuresSection: {
    backgroundColor: SakuraColors.surface,
    padding: 20,
    margin: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: SakuraColors.background,
    borderRadius: 8,
  },
  featureDisabled: {
    opacity: 0.6,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: SakuraColors.textPrimary,
    flex: 1,
    marginLeft: 8,
  },
  featureTitleDisabled: {
    color: SakuraColors.textSecondary,
  },
  featureDescription: {
    fontSize: 14,
    color: SakuraColors.textSecondary,
    marginLeft: 32,
  },
  featureDescriptionDisabled: {
    color: SakuraColors.textSecondary,
  },
  actionsSection: {
    padding: 16,
    marginBottom: 20,
  },
  upgradeButton: {
    backgroundColor: SakuraColors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  upgradeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  downgradeButton: {
    backgroundColor: SakuraColors.error + '20',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: SakuraColors.error,
  },
  downgradeButtonText: {
    color: SakuraColors.error,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
}); 