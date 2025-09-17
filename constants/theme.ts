import { MD3LightTheme } from 'react-native-paper';
import { SakuraColors } from './Colors';

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: SakuraColors.primary,
    secondary: SakuraColors.secondary,
    tertiary: SakuraColors.success,
    error: SakuraColors.error,
    background: SakuraColors.background,
    surface: SakuraColors.surface,
    accent: SakuraColors.accent,
    onSurface: SakuraColors.textPrimary,
    placeholder: SakuraColors.textSecondary,
    backdrop: SakuraColors.overlay,
    notification: SakuraColors.warning,
  },
  roundness: 8,
}; 