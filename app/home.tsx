import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, SafeAreaView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SakuraColors } from '../constants/Colors';
import { useSubscription } from '../hooks/useSubscription';

export default function HomeScreen() {
  const [showFullInfo, setShowFullInfo] = useState(false);
  const { subscriptionInfo } = useSubscription();
  const router = useRouter();

  // Debug: Verificar que la pantalla se esté renderizando
  useEffect(() => {
    console.log('🏠 HomeScreen renderizada - Chibi debería estar visible');
  }, []);

  const handleChibiPress = () => {
    Alert.alert(
      '¡Hola! 👋',
      'Soy Sakura, tu compañera de estudio. ¡Estoy aquí para motivarte y ayudarte en tu jornada de aprendizaje!',
      [
        { text: 'Conocer más', onPress: () => setShowFullInfo(true) },
        { text: 'Gracias', style: 'cancel' }
      ]
    );
  };

  const navigateToProjects = () => {
    router.push('/projects');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleWrapper}>
            <Text style={styles.mainTitle}>LifePlanner</Text>
          </View>
          <Text style={styles.subtitle}>Tu compañera de estudio te espera</Text>
        </View>

        {/* Sakura Chibi Principal - Imagen Estática */}
        <View style={styles.chibiSection}>
          <TouchableOpacity
            style={styles.chibiContainer}
            onPress={handleChibiPress}
            activeOpacity={0.8}
          >
            <Image
              source={require('../images/chibi_happy.png')}
              style={styles.chibiImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.chibiWelcomeText}>
            ¡Hola! Soy Sakura, tu compañera de estudio 🌸
          </Text>
          <Text style={styles.chibiSubText}>
            Toca mi imagen para conocerme mejor
          </Text>
        </View>

        {/* Botones de Navegación */}
        <View style={styles.navigationSection}>
          <View style={styles.buttonWrapper}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={navigateToProjects}
            >
              <Text style={styles.navButtonText}>Proyectos</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Información de la App */}
        <View style={styles.appInfoSection}>
          <Text style={styles.sectionTitle}>Acerca de LifePlanner</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              LifePlanner es tu asistente personal para organizar proyectos y tareas.
              Sakura, tu compañera de estudio, te acompaña en cada paso con motivación
              y consejos útiles.
            </Text>
            <Text style={styles.featuresTitle}>Características:</Text>
            <Text style={styles.feature}>• Gestión de proyectos y tareas</Text>
            <Text style={styles.feature}>• Compañera virtual motivacional</Text>
            <Text style={styles.feature}>• Consejos de estudio personalizados</Text>
            <Text style={styles.feature}>• Estados emocionales dinámicos</Text>
            <Text style={styles.feature}>• Chibi animado con tu imagen personal</Text>
          </View>
        </View>

        {/* Información de Suscripción */}
        <View style={styles.subscriptionSection}>
          <Text style={styles.subscriptionTitle}>
            {subscriptionInfo.type === 'premium' ? '✨ Premium' : '📱 Gratuito'}
          </Text>
          <Text style={styles.subscriptionDescription}>
            {subscriptionInfo.type === 'premium' 
              ? 'Disfruta de todas las características sin límites y sin anuncios.'
              : `Límite de ${subscriptionInfo.projectLimit} proyectos y ${subscriptionInfo.taskLimit} tareas por proyecto.`
            }
          </Text>
        </View>

        {/* Botón de Debug - Solo en desarrollo */}
        {__DEV__ && (
          <View style={styles.debugSection}>
            <TouchableOpacity
              style={styles.debugButton}
              onPress={async () => {
                try {
                  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
                  await AsyncStorage.removeItem('hasSeenOnboarding');
                  Alert.alert('Debug', 'Onboarding reseteado. Reinicia la app para ver el onboarding.');
                } catch (error) {
                  console.error('Error reseteando onboarding:', error);
                }
              }}
            >
              <Text style={styles.debugButtonText}>🔄 Reset Onboarding (Debug)</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: SakuraColors.background,
    paddingTop: 20,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    paddingTop: 30,
    backgroundColor: SakuraColors.surface,
    marginBottom: 20,
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 2,
    borderColor: SakuraColors.primary,
  },
  titleWrapper: {
    backgroundColor: SakuraColors.primary,
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 20,
    marginBottom: 12,
    alignSelf: 'center',
    minWidth: 200,
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: SakuraColors.textLight,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: SakuraColors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  chibiSection: {
    alignItems: 'center',
    paddingVertical: 30,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  chibiContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chibiImage: {
    width: '100%',
    height: '100%',
  },
  chibiWelcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: SakuraColors.textPrimary,
    marginTop: 15,
    textAlign: 'center',
  },
  chibiSubText: {
    fontSize: 14,
    color: SakuraColors.textSecondary,
    marginTop: 5,
    textAlign: 'center',
  },
  navigationSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  buttonWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButton: {
    backgroundColor: SakuraColors.primary,
    paddingVertical: 18,
    paddingHorizontal: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 280,
  },
  navButtonText: {
    color: SakuraColors.textLight,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  appInfoSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: SakuraColors.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: SakuraColors.surface,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  infoText: {
    fontSize: 16,
    color: SakuraColors.textPrimary,
    lineHeight: 26,
    marginBottom: 20,
    textAlign: 'center',
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: SakuraColors.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  feature: {
    fontSize: 15,
    color: SakuraColors.textSecondary,
    marginBottom: 8,
    lineHeight: 22,
    paddingLeft: 8,
  },
  subscriptionSection: {
    paddingHorizontal: 16,
    marginTop: 20,
    backgroundColor: SakuraColors.surface,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  subscriptionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: SakuraColors.textPrimary,
    textAlign: 'center',
    marginBottom: 10,
  },
  subscriptionDescription: {
    fontSize: 15,
    color: SakuraColors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  debugSection: {
    paddingHorizontal: 16,
    marginTop: 20,
    backgroundColor: SakuraColors.surface,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  debugButton: {
    backgroundColor: SakuraColors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  debugButtonText: {
    color: SakuraColors.textLight,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
