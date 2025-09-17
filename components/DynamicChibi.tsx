import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
  Easing,
} from 'react-native';
import { SakuraStyles } from '../constants/Styles';
import { SakuraColors } from '../constants/Colors';

export type ChibiEmotion = 'happy' | 'sad' | 'angry' | 'success' | 'neutral';

interface DynamicChibiProps {
  emotion: ChibiEmotion;
  size?: 'small' | 'medium' | 'large';
  showMessage?: boolean;
  onPress?: () => void;
  style?: any;
}

const chibiImages = {
  happy: require('../images/chibi_happy.png'),
  sad: require('../images/chibi_sad.png'),
  angry: require('../images/chibi_angry.png'),
  success: require('../images/chibi_success.png'),
  neutral: require('../images/chibi_happy.png'), // Usar happy como neutral por defecto
};

const emotionMessages = {
  happy: {
    title: '¡Excelente! 🎉',
    message: '¡Sigues avanzando muy bien! ¡Mantén ese ritmo!',
    color: SakuraColors.happy,
  },
  sad: {
    title: '¡No te desanimes! 💪',
    message: 'Los contratiempos son parte del aprendizaje. ¡Tú puedes!',
    color: SakuraColors.tired,
  },
  angry: {
    title: '¡Determinación! 🔥',
    message: '¡No te rindas! Cada desafío te hace más fuerte.',
    color: SakuraColors.excited,
  },
  success: {
    title: '¡Logro Completado! 🏆',
    message: '¡Felicidades! Has completado tu objetivo exitosamente.',
    color: SakuraColors.determined,
  },
  neutral: {
    title: '¡Hola! 👋',
    message: 'Estoy aquí para acompañarte en tu jornada.',
    color: SakuraColors.calm,
  },
};

export default function DynamicChibi({
  emotion = 'neutral',
  size = 'medium',
  showMessage = true,
  onPress,
  style,
}: DynamicChibiProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Animación de entrada
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Animación de rebote cuando cambia la emoción
  useEffect(() => {
    if (emotion !== 'neutral') {
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1.2,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [emotion]);

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      const message = emotionMessages[emotion];
      Alert.alert(message.title, message.message, [
        { text: '¡Entendido!', style: 'default' }
      ]);
    }

    // Animación de presión
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { width: 60, height: 60 };
      case 'large':
        return { width: 120, height: 120 };
      default:
        return { width: 80, height: 80 };
    }
  };

  const sizeStyles = getSizeStyles();
  const message = emotionMessages[emotion];

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={[
          styles.chibiContainer,
          {
            width: sizeStyles.width,
            height: sizeStyles.height,
          },
        ]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Animated.View
          style={[
            styles.imageContainer,
            {
              opacity: fadeAnim,
              transform: [
                { scale: Animated.multiply(scaleAnim, bounceAnim) },
              ],
            },
          ]}
        >
          <Animated.Image
            source={chibiImages[emotion]}
            style={[
              styles.chibiImage,
              {
                width: sizeStyles.width,
                height: sizeStyles.height,
              },
            ]}
            resizeMode="contain"
          />
        </Animated.View>
      </TouchableOpacity>

      {showMessage && (
        <View style={[styles.messageContainer, { backgroundColor: message.color + '20' }]}>
          <Text style={[styles.messageText, { color: message.color }]}>
            {message.title}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
  },
  chibiContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chibiImage: {
    borderRadius: 20,
  },
  messageContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageText: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
}); 