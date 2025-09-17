import { useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { storage } from '../services/storage';
import { SakuraColors } from '../constants/Colors';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    checkOnboardingAndRedirect();
  }, []);

  const checkOnboardingAndRedirect = async () => {
    try {
      const hasSeenOnboarding = await storage.getItem('hasSeenOnboarding');
      
      if (hasSeenOnboarding === 'true') {
        // Usuario ya vio el onboarding, ir a la pantalla principal
        router.replace('/home');
      } else {
        // Usuario no ha visto el onboarding, ir al onboarding
        router.replace('/onboarding');
      }
    } catch (error) {
      console.error('Error verificando onboarding:', error);
      // En caso de error, ir al onboarding
      router.replace('/onboarding');
    }
  };

  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor: SakuraColors.background 
    }}>
      <Text style={{ color: SakuraColors.primary, marginBottom: 20, fontSize: 18 }}>
        Cargando LifePlanner...
      </Text>
      <ActivityIndicator size="large" color={SakuraColors.primary} />
    </View>
  );
}
