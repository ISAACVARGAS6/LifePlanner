import { Stack } from 'expo-router';

export default function ProjectsLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'Mis Proyectos',
          headerStyle: {
            backgroundColor: '#FF6B9D',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="create"
        options={{
          title: 'Nuevo Proyecto',
          presentation: 'modal',
          headerStyle: {
            backgroundColor: '#FF6B9D',
          },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Detalles del Proyecto',
          headerStyle: {
            backgroundColor: '#FF6B9D',
          },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="edit/[id]"
        options={{
          title: 'Editar Proyecto',
          presentation: 'modal',
          headerStyle: {
            backgroundColor: '#FF6B9D',
          },
          headerTintColor: '#fff',
        }}
      />
    </Stack>
  );
} 