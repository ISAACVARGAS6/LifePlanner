import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { SakuraColors } from '../constants/Colors';

interface ProgressBarProps {
  progress: number; // 0-100
  totalTasks: number;
  completedTasks: number;
  showText?: boolean;
  height?: number;
  borderRadius?: number;
  animated?: boolean;
}

export default function ProgressBar({
  progress,
  totalTasks,
  completedTasks,
  showText = true,
  height = 8,
  borderRadius = 4,
  animated = true,
}: ProgressBarProps) {
  // Asegurar que el progreso esté entre 0 y 100
  const clampedProgress = Math.max(0, Math.min(100, progress));
  
  // Animación del progreso
  const animatedWidth = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (animated) {
      Animated.timing(animatedWidth, {
        toValue: clampedProgress,
        duration: 800,
        useNativeDriver: false,
      }).start();
    } else {
      animatedWidth.setValue(clampedProgress);
    }
  }, [clampedProgress, animated, animatedWidth]);
  
  // Determinar el color basado en el progreso
  const getProgressColor = (progress: number) => {
    if (progress === 100) return SakuraColors.success;
    if (progress >= 70) return SakuraColors.primary;
    if (progress >= 40) return SakuraColors.warning;
    return SakuraColors.error;
  };

  const progressColor = getProgressColor(clampedProgress);

  // Determinar el emoji basado en el progreso
  const getProgressEmoji = (progress: number) => {
    if (progress === 100) return '🎉';
    if (progress >= 70) return '🚀';
    if (progress >= 40) return '💪';
    if (progress > 0) return '📈';
    return '📝';
  };

  const progressEmoji = getProgressEmoji(clampedProgress);

  return (
    <View style={styles.container}>
      {showText && (
        <View style={styles.textContainer}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressText}>
              {completedTasks}/{totalTasks} tareas completadas
            </Text>
            <Text style={styles.emojiText}>{progressEmoji}</Text>
          </View>
          <Text style={styles.percentageText}>
            {Math.round(clampedProgress)}%
          </Text>
        </View>
      )}
      
      <View style={[styles.progressContainer, { height, borderRadius }]}>
        <Animated.View 
          style={[
            styles.progressFill, 
            { 
              width: animated ? animatedWidth.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }) : `${clampedProgress}%`,
              backgroundColor: progressColor,
              borderRadius,
            }
          ]} 
        />
      </View>
      
      {showText && totalTasks === 0 && (
        <Text style={styles.noTasksText}>Sin tareas</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 12,
    color: SakuraColors.textSecondary,
    fontWeight: '500',
  },
  emojiText: {
    fontSize: 14,
    marginLeft: 6,
  },
  percentageText: {
    fontSize: 12,
    color: SakuraColors.textPrimary,
    fontWeight: 'bold',
  },
  progressContainer: {
    backgroundColor: SakuraColors.borderLight,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    minWidth: 4, // Mínimo ancho para mostrar algo incluso con 0%
  },
  noTasksText: {
    fontSize: 12,
    color: SakuraColors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 4,
  },
});
