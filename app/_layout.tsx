import { Stack } from 'expo-router';
import { Provider as PaperProvider } from 'react-native-paper';

export default function RootLayout() {
  return (
    <PaperProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ title: 'Inicio' }} />
        <Stack.Screen name="onboarding" options={{ title: 'Onboarding' }} />
        <Stack.Screen name="home" options={{ title: 'Home' }} />
        <Stack.Screen name="projects" options={{ title: 'Proyectos' }} />
      </Stack>
    </PaperProvider>
  );
}

