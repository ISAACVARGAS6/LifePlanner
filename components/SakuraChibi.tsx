import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import { chibiService, ChibiInfo, PersonalityInfo } from '../services/chibiService';
import { SakuraStyles, getSizeStyles, getContainerStyles } from '../constants/Styles';
import { SakuraColors } from '../constants/Colors';

interface SakuraChibiProps {
  type: 'project' | 'task' | 'random' | 'personality';
  status?: string;
  priority?: string;
  size?: 'small' | 'medium' | 'large';
  showDescription?: boolean;
  showMotivationalMessage?: boolean;
  onPress?: () => void;
  style?: any;
}

export default function SakuraChibi({
  type,
  status,
  priority,
  size = 'medium',
  showDescription = true,
  showMotivationalMessage = false,
  onPress,
  style,
}: SakuraChibiProps) {
  const [chibiInfo, setChibiInfo] = useState<ChibiInfo | null>(null);
  const [personality, setPersonality] = useState<PersonalityInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [motivationalMessage, setMotivationalMessage] = useState<string>('');
  const [imageError, setImageError] = useState(false);
  
  // Animaciones
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.8))[0];
  const bounceAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    loadChibiData();
  }, [type, status, priority]);

  useEffect(() => {
    // Animación de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [chibiInfo]);

  const loadChibiData = async () => {
    try {
      setLoading(true);
      setError(null);
      setImageError(false);

      let chibiData: ChibiInfo;

      switch (type) {
        case 'project':
          if (!status) {
            throw new Error('Status es requerido para proyectos');
          }
          chibiData = await chibiService.getProjectChibi(status, priority);
          break;
        case 'task':
          if (!status) {
            throw new Error('Status es requerido para tareas');
          }
          chibiData = await chibiService.getTaskChibi(status, priority);
          break;
        case 'random':
          // Usar estado neutral en lugar de aleatorio
          chibiData = {
            chibi_filename: "happy_calm.png",
            chibi_url: "/static/chibis/happy_calm.png",
            emotional_state: 'neutral',
            emotional_description: '¡Hola! Estoy aquí para acompañarte en tu jornada.'
          };
          break;
        case 'personality':
          const personalityData = await chibiService.getPersonality();
          setPersonality(personalityData);
          chibiData = {
            chibi_filename: "happy_calm.png",
            chibi_url: "/static/chibis/happy_calm.png",
            emotional_state: 'neutral',
            emotional_description: '¡Hola! Estoy aquí para acompañarte en tu jornada.'
          };
          break;
        default:
          throw new Error('Tipo de chibi no válido');
      }

      setChibiInfo(chibiData);
      
      // Cargar mensaje motivacional si está habilitado
      if (showMotivationalMessage && chibiData.emotional_state) {
        try {
          const motivationalData = await chibiService.getMotivationalMessages(chibiData.emotional_state);
          if (motivationalData.messages && motivationalData.messages.length > 0) {
            setMotivationalMessage(motivationalData.messages[0]);
          } else {
            setMotivationalMessage('¡Hola! Soy Sakura, tu compañera de estudio. ¡Estoy aquí para motivarte y ayudarte en tu jornada de aprendizaje!');
          }
        } catch (error) {
          console.warn('Error cargando mensaje motivacional:', error);
          setMotivationalMessage('¡Hola! Soy Sakura, tu compañera de estudio. ¡Estoy aquí para motivarte y ayudarte en tu jornada de aprendizaje!');
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(`Error cargando datos del chibi: ${errorMessage}`);
      console.error('Error detallado:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImagePress = () => {
    if (onPress) {
      // Animación de rebote al presionar
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
      
      onPress();
    }
  };

  const handleRetry = () => {
    loadChibiData();
  };

  if (loading) {
    return (
      <View style={[styles.container, style]}>
        <ActivityIndicator size="large" color={SakuraColors.primary} />
        <Text style={SakuraStyles.loadingText}>Cargando Sakura...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, style]}>
        <Text style={SakuraStyles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={SakuraStyles.retryButton} onPress={handleRetry}>
          <Text style={SakuraStyles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!chibiInfo) {
    return (
      <View style={[styles.container, style]}>
        <Text style={SakuraStyles.errorText}>No se pudo cargar la información</Text>
      </View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [
            { scale: scaleAnim },
            { scale: bounceAnim }
          ],
        },
        style,
      ]}
    >
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={handleImagePress}
        activeOpacity={0.8}
      >
        <Animated.Image
          source={{ uri: chibiInfo.chibi_url }}
          style={[styles.chibiImage, getSizeStyles(size)]}
          onError={() => setImageError(true)}
        />
        
        {imageError && (
          <View style={SakuraStyles.imageErrorContainer}>
            <Text style={SakuraStyles.imageErrorText}>🎓</Text>
            <Text style={SakuraStyles.imageErrorSubtext}>Sakura</Text>
          </View>
        )}
      </TouchableOpacity>

      {showMotivationalMessage && motivationalMessage && (
        <View style={SakuraStyles.motivationalContainer}>
          <Text style={SakuraStyles.motivationalText}>
            "{motivationalMessage}"
          </Text>
        </View>
      )}

      {type === 'personality' && personality && (
        <View style={styles.personalityContainer}>
          <Text style={SakuraStyles.personalityName}>{personality.name}</Text>
          <Text style={SakuraStyles.personalityDetails}>
            {personality.age} años • {personality.grade}
          </Text>
          <Text style={SakuraStyles.personalityTraits}>
            {personality.personality_traits.join(' • ')}
          </Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chibiImage: {
    resizeMode: 'contain',
  },
  personalityContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
}); 