/**
 * Paleta de colores unificada para LifePlanner con Sakura
 * Colores principales inspirados en la temática escolar y motivacional
 */

const tintColorLight = '#4A90E2'; // Azul principal
const tintColorDark = '#fff';

// Paleta de colores de Sakura
export const SakuraColors = {
  // Colores principales
  primary: '#4A90E2',        // Azul principal
  secondary: '#FF6B9D',      // Rosa de Sakura
  accent: '#2E4A8C',         // Azul oscuro
  success: '#4CAF50',        // Verde éxito
  warning: '#FF9800',        // Naranja advertencia
  error: '#FF6B6B',          // Rojo error
  
  // Colores de fondo
  background: '#F8F9FA',     // Fondo principal
  surface: '#FFFFFF',         // Superficies
  card: '#FFFFFF',           // Tarjetas
  
  // Colores de texto
  textPrimary: '#2E4A8C',    // Texto principal
  textSecondary: '#666666',  // Texto secundario
  textTertiary: '#888888',   // Texto terciario
  textLight: '#FFFFFF',      // Texto claro
  
  // Colores de estado emocional
  happy: '#FFD93D',         // Amarillo feliz
  focused: '#4A90E2',       // Azul concentrado
  tired: '#9B59B6',         // Púrpura cansado
  excited: '#E74C3C',       // Rojo emocionado
  calm: '#3498DB',          // Azul tranquilo
  determined: '#2ECC71',     // Verde determinado
  
  // Colores de gradientes y efectos
  gradientStart: '#4A90E2',
  gradientEnd: '#2E4A8C',
  shadow: 'rgba(0, 0, 0, 0.1)',
  overlay: 'rgba(0, 0, 0, 0.5)',
  
  // Colores de bordes
  border: '#E8F4FD',
  borderLight: '#F0F0F0',
  borderDark: '#D0D0D0',
};

export const Colors = {
  light: {
    text: SakuraColors.textPrimary,
    background: SakuraColors.background,
    tint: SakuraColors.primary,
    icon: SakuraColors.textSecondary,
    tabIconDefault: SakuraColors.textTertiary,
    tabIconSelected: SakuraColors.primary,
    surface: SakuraColors.surface,
    card: SakuraColors.card,
    border: SakuraColors.border,
    error: SakuraColors.error,
    success: SakuraColors.success,
    warning: SakuraColors.warning,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    surface: '#1E1E1E',
    card: '#2A2A2A',
    border: '#333333',
    error: '#FF6B6B',
    success: '#4CAF50',
    warning: '#FF9800',
  },
};
