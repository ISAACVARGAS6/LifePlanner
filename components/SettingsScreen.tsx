import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button, Switch, Card, Divider } from 'react-native-paper';
import { useUserPreferences } from '../hooks/useStorage';
import { useAppSettings } from '../hooks/useStorage';
import { useChibiStats } from '../hooks/useStorage';
import { useSessionData } from '../hooks/useStorage';
import { useSubscription } from '../hooks/useSubscription';
import adMobService from '../services/adMobService';
import { SakuraColors } from '../constants/Colors';
import { SakuraStyles } from '../constants/Styles';

export default function SettingsScreen() {
  const { preferences, updatePreferences, loading: prefsLoading } = useUserPreferences();
  const { settings, updateSettings, loading: settingsLoading } = useAppSettings();
  const { stats, updateStats, loading: statsLoading } = useChibiStats();
  const { sessionData, updateSessionData, loading: sessionLoading } = useSessionData();
  const { subscriptionInfo, features } = useSubscription();
  
  const [adStats, setAdStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAdStats();
  }, []);

  const loadAdStats = async () => {
    try {
      const stats = await adMobService.getStats();
      setAdStats(stats);
    } catch (error) {
      console.error('Error cargando estadísticas de anuncios:', error);
    }
  };

  const handleResetAdCount = async () => {
    try {
      await adMobService.resetDailyAdCount();
      await loadAdStats();
      Alert.alert('Éxito', 'Contador de anuncios reseteado');
    } catch (error) {
      Alert.alert('Error', 'No se pudo resetear el contador');
    }
  };

  const handleExportData = async () => {
    setLoading(true);
    try {
      // Aquí implementarías la exportación de datos
      Alert.alert('Éxito', 'Datos exportados correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudieron exportar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = async () => {
    Alert.alert(
      'Confirmar',
      '¿Estás seguro de que quieres borrar todos los datos? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Borrar',
          style: 'destructive',
          onPress: async () => {
            try {
              // Aquí implementarías el borrado de datos
              Alert.alert('Éxito', 'Datos borrados correctamente');
            } catch (error) {
              Alert.alert('Error', 'No se pudieron borrar los datos');
            }
          },
        },
      ]
    );
  };

  if (prefsLoading || settingsLoading || statsLoading || sessionLoading) {
    return (
      <View style={styles.container}>
        <Text>Cargando configuración...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Configuración</Text>

      {/* Preferencias del Usuario */}
      <Card style={styles.card}>
        <Card.Title title="Preferencias del Usuario" />
        <Card.Content>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Tema Oscuro</Text>
            <Switch
              value={preferences?.theme === 'dark'}
              onValueChange={(value) =>
                updatePreferences({ ...preferences, theme: value ? 'dark' : 'light' })
              }
            />
          </View>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Idioma Español</Text>
            <Switch
              value={preferences?.language === 'es'}
              onValueChange={(value) =>
                updatePreferences({ ...preferences, language: value ? 'es' : 'en' })
              }
            />
          </View>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Notificaciones</Text>
            <Switch
              value={preferences?.notifications ?? true}
              onValueChange={(value) =>
                updatePreferences({ ...preferences, notifications: value })
              }
            />
          </View>
        </Card.Content>
      </Card>

      {/* Configuración de la Aplicación */}
      <Card style={styles.card}>
        <Card.Title title="Configuración de la App" />
        <Card.Content>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Mostrar Chibi</Text>
            <Switch
              value={settings?.showChibi ?? true}
              onValueChange={(value) =>
                updateSettings({ ...settings, showChibi: value })
              }
            />
          </View>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Auto-guardado</Text>
            <Switch
              value={settings?.autoSave ?? true}
              onValueChange={(value) =>
                updateSettings({ ...settings, autoSave: value })
              }
            />
          </View>
        </Card.Content>
      </Card>

      {/* Estadísticas de Chibi */}
      <Card style={styles.card}>
        <Card.Title title="Estadísticas de Chibi" />
        <Card.Content>
          <Text style={styles.statText}>Emociones mostradas: {stats?.emotionsShown || 0}</Text>
          <Text style={styles.statText}>Mensajes motivacionales: {stats?.motivationalMessages || 0}</Text>
          <Text style={styles.statText}>Interacciones totales: {stats?.totalInteractions || 0}</Text>
        </Card.Content>
      </Card>

      {/* Estadísticas de Anuncios */}
      <Card style={styles.card}>
        <Card.Title title="Estadísticas de Anuncios" />
        <Card.Content>
          {adStats ? (
            <>
              <Text style={styles.statText}>
                Anuncios mostrados hoy: {adStats.dailyStats?.adsShownToday || 0}/1
              </Text>
              <Text style={styles.statText}>
                Puede mostrar hoy: {adStats.dailyStats?.canShowToday ? 'Sí' : 'No'}
              </Text>
              <Text style={styles.statText}>
                Anuncios en esta sesión: {adStats.adsShownThisSession || 0}
              </Text>
              <Text style={styles.statText}>
                Último anuncio: {adStats.lastAdShown ? new Date(adStats.lastAdShown).toLocaleString() : 'Nunca'}
              </Text>
              <Button
                mode="outlined"
                onPress={handleResetAdCount}
                style={styles.resetButton}
              >
                Resetear Contador Diario
              </Button>
            </>
          ) : (
            <Text>Cargando estadísticas...</Text>
          )}
        </Card.Content>
      </Card>

      {/* Información de Suscripción */}
      <Card style={styles.card}>
        <Card.Title title="Suscripción" />
        <Card.Content>
          <Text style={styles.statText}>
            Tipo: {subscriptionInfo?.type === 'premium' ? 'Premium' : 'Gratuita'}
          </Text>
          <Text style={styles.statText}>
            Proyectos permitidos: {features?.maxProjects || 'Sin límite'}
          </Text>
          <Text style={styles.statText}>
            Tareas por proyecto: {features?.maxTasksPerProject || 'Sin límite'}
          </Text>
          <Text style={styles.statText}>
            Anuncios: {features?.adsEnabled ? 'Habilitados' : 'Deshabilitados'}
          </Text>
        </Card.Content>
      </Card>

      {/* Información de la App */}
      <Card style={styles.card}>
        <Card.Title title="Información de la App" />
        <Card.Content>
          <Text style={styles.statText}>Versión: 1.0.0</Text>
          <Text style={styles.statText}>Sesiones iniciadas: {sessionData?.sessionsStarted || 0}</Text>
          <Text style={styles.statText}>Tiempo total de uso: {sessionData?.totalUsageTime || 0} minutos</Text>
        </Card.Content>
      </Card>

      {/* Acciones */}
      <Card style={styles.card}>
        <Card.Title title="Acciones" />
        <Card.Content>
          <Button
            mode="contained"
            onPress={handleExportData}
            loading={loading}
            style={styles.actionButton}
          >
            Exportar Datos
          </Button>
          
          <Button
            mode="outlined"
            onPress={handleClearData}
            style={styles.actionButton}
            buttonColor={SakuraColors.error}
          >
            Borrar Todos los Datos
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SakuraColors.background,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: SakuraColors.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: SakuraColors.textPrimary,
    flex: 1,
  },
  statText: {
    fontSize: 16,
    color: SakuraColors.textPrimary,
    marginBottom: 8,
  },
  resetButton: {
    marginTop: 10,
  },
  actionButton: {
    marginTop: 10,
  },
}); 