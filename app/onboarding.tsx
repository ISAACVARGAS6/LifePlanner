import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated, ScrollView } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { router } from 'expo-router';
import { storage } from '../services/storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: 1,
    title: 'Bienvenido a LifePlanner',
    description: 'Tu asistente personal para organizar proyectos y tareas de manera eficiente.',
    icon: 'notebook-outline',
  },
  {
    id: 2,
    title: 'Gestiona tus Proyectos',
    description: 'Crea y organiza proyectos, establece fechas límite y prioridades.',
    icon: 'format-list-checks',
  },
  {
    id: 3,
    title: 'Seguimiento de Tareas',
    description: 'Mantén el control de tus tareas, marca su progreso y nunca pierdas una fecha importante.',
    icon: 'calendar-check',
  },
  {
    id: 4,
    title: '¡Comencemos!',
    description: 'Todo está listo para ayudarte a ser más productivo.',
    icon: 'rocket-launch',
  },
];

export default function Onboarding() {
  const theme = useTheme();
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      scrollViewRef.current?.scrollTo({
        x: width * (currentIndex + 1),
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    try {
      await storage.setItem('hasSeenOnboarding', 'true');
      router.replace('/home');
    } catch (error) {
      console.error('Error guardando estado de onboarding:', error);
      router.replace('/home');
    }
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const renderDots = () => {
    return slides.map((_, i) => {
      const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
      
      const dotWidth = scrollX.interpolate({
        inputRange,
        outputRange: [8, 16, 8],
        extrapolate: 'clamp',
      });

      const opacity = scrollX.interpolate({
        inputRange,
        outputRange: [0.3, 1, 0.3],
        extrapolate: 'clamp',
      });

      return (
        <Animated.View
          key={i}
          style={[
            styles.dot,
            {
              width: dotWidth,
              opacity,
              backgroundColor: theme.colors.primary,
            },
          ]}
        />
      );
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(newIndex);
        }}
      >
        {slides.map((slide) => (
          <View key={slide.id} style={[styles.slide, { width }]}>
            <MaterialCommunityIcons
              name={slide.icon as any}
              size={120}
              color={theme.colors.primary}
            />
            <Text variant="headlineMedium" style={styles.title}>
              {slide.title}
            </Text>
            <Text variant="bodyLarge" style={styles.description}>
              {slide.description}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.dotsContainer}>{renderDots()}</View>
        <Button
          mode="contained"
          onPress={handleNext}
          style={styles.button}
        >
          {currentIndex === slides.length - 1 ? '¡Comenzar!' : 'Siguiente'}
        </Button>
        {currentIndex < slides.length - 1 && (
          <Button
            mode="text"
            onPress={handleFinish}
            style={styles.skipButton}
          >
            Saltar
          </Button>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  description: {
    textAlign: 'center',
    marginHorizontal: 20,
    opacity: 0.8,
  },
  footer: {
    padding: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  button: {
    marginBottom: 10,
  },
  skipButton: {
    marginTop: 10,
  },
}); 