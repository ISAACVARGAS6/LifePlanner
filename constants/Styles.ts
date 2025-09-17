import { StyleSheet } from 'react-native';
import { SakuraColors } from './Colors';

/**
 * Estilos unificados para LifePlanner con Sakura
 * Mantiene coherencia visual en toda la aplicación
 */

export const SakuraStyles = StyleSheet.create({
  // Contenedores principales
  container: {
    flex: 1,
    backgroundColor: SakuraColors.background,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: SakuraColors.background,
  },
  
  // Headers y títulos
  header: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: SakuraColors.surface,
    borderBottomWidth: 1,
    borderBottomColor: SakuraColors.border,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: SakuraColors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: SakuraColors.textSecondary,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: SakuraColors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: SakuraColors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  
  // Tarjetas y contenedores
  card: {
    backgroundColor: SakuraColors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoCard: {
    backgroundColor: SakuraColors.background,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: SakuraColors.border,
  },
  
  // Botones
  primaryButton: {
    backgroundColor: SakuraColors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButton: {
    backgroundColor: SakuraColors.surface,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: SakuraColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: SakuraColors.error,
    borderRadius: 20,
  },
  buttonText: {
    color: SakuraColors.textLight,
    fontSize: 14,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: SakuraColors.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  closeButtonText: {
    color: SakuraColors.textLight,
    fontSize: 12,
    fontWeight: 'bold',
  },
  
  // Textos
  textPrimary: {
    fontSize: 14,
    color: SakuraColors.textPrimary,
    lineHeight: 20,
    flexWrap: 'wrap',
  },
  textSecondary: {
    fontSize: 14,
    color: SakuraColors.textSecondary,
    lineHeight: 20,
    flexWrap: 'wrap',
  },
  textSmall: {
    fontSize: 12,
    color: SakuraColors.textSecondary,
    lineHeight: 16,
    flexWrap: 'wrap',
  },
  textLarge: {
    fontSize: 16,
    color: SakuraColors.textPrimary,
    lineHeight: 24,
    flexWrap: 'wrap',
  },
  
  // Estados emocionales
  emotionalState: {
    fontSize: 14,
    fontWeight: 'bold',
    color: SakuraColors.primary,
    textAlign: 'center',
    marginBottom: 6,
    textTransform: 'capitalize' as const,
  },
  motivationalContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: SakuraColors.border,
    borderRadius: 12,
    maxWidth: 280,
    borderLeftWidth: 4,
    borderLeftColor: SakuraColors.primary,
    flexWrap: 'wrap',
  },
  motivationalText: {
    fontSize: 11,
    color: SakuraColors.textPrimary,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 14,
    flexWrap: 'wrap',
  },
  
  // Personalidad de Sakura
  personalityName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: SakuraColors.secondary,
    marginBottom: 4,
  },
  personalityDetails: {
    fontSize: 12,
    color: SakuraColors.textSecondary,
    marginBottom: 4,
  },
  personalityTraits: {
    fontSize: 10,
    color: SakuraColors.textTertiary,
    textAlign: 'center',
  },
  
  // Selectores y controles
  subjectSelector: {
    marginBottom: 16,
  },
  subjectButton: {
    backgroundColor: SakuraColors.border,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedSubjectButton: {
    backgroundColor: SakuraColors.primary,
    borderColor: SakuraColors.accent,
  },
  subjectButtonText: {
    fontSize: 14,
    color: SakuraColors.primary,
    fontWeight: 'bold',
  },
  selectedSubjectButtonText: {
    color: SakuraColors.textLight,
  },
  
  // Estados de carga y error
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: SakuraColors.textSecondary,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 14,
    color: SakuraColors.error,
    textAlign: 'center',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: SakuraColors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: SakuraColors.textLight,
    fontSize: 12,
    fontWeight: 'bold',
  },
  
  // Imágenes y placeholders
  imageErrorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: SakuraColors.borderLight,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageErrorText: {
    fontSize: 32,
    marginBottom: 8,
  },
  imageErrorSubtext: {
    fontSize: 12,
    color: SakuraColors.textTertiary,
    textAlign: 'center',
  },
});

// Constantes de espaciado
export const Spacing = {
  small: 8,
  medium: 16,
  large: 24,
  xlarge: 32,
};

// Funciones de utilidad para estilos dinámicos
export const getSizeStyles = (size: 'small' | 'medium' | 'large') => {
  const sizes = {
    small: {
      width: 80,
      height: 80,
      borderRadius: 40,
    },
    medium: {
      width: 120,
      height: 120,
      borderRadius: 60,
    },
    large: {
      width: 160,
      height: 160,
      borderRadius: 80,
    },
  };
  return sizes[size];
};

export const getContainerStyles = (size: 'small' | 'medium' | 'large') => {
  const containers = {
    small: {
      padding: 8,
      marginBottom: 8,
    },
    medium: {
      padding: 16,
      marginBottom: 16,
    },
    large: {
      padding: 24,
      marginBottom: 24,
    },
  };
  return containers[size];
}; 