import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { chibiService, PersonalityInfo, DailyQuote, StudyTips, StudyBreakActivities } from '../services/chibiService';
import { SakuraStyles } from '../constants/Styles';
import { SakuraColors } from '../constants/Colors';

interface SakuraInfoProps {
  showDailyQuote?: boolean;
  showStudyTips?: boolean;
  showBreakActivities?: boolean;
  style?: any;
}

export default function SakuraInfo({
  showDailyQuote = true,
  showStudyTips = true,
  showBreakActivities = true,
  style,
}: SakuraInfoProps) {
  const [personality, setPersonality] = useState<PersonalityInfo | null>(null);
  const [dailyQuote, setDailyQuote] = useState<DailyQuote | null>(null);
  const [studyTips, setStudyTips] = useState<StudyTips | null>(null);
  const [breakActivities, setBreakActivities] = useState<StudyBreakActivities | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>('matemáticas');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Animaciones
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];

  useEffect(() => {
    loadSakuraInfo();
  }, []);

  useEffect(() => {
    // Animación de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [personality, dailyQuote, studyTips, breakActivities]);

  const loadSakuraInfo = async () => {
    try {
      setLoading(true);
      setError(null);

      const [personalityData, quoteData, activitiesData] = await Promise.all([
        chibiService.getPersonality(),
        showDailyQuote ? chibiService.getDailyQuote() : null,
        showBreakActivities ? chibiService.getStudyBreakActivities() : null,
      ]);

      setPersonality(personalityData);
      setDailyQuote(quoteData);
      setBreakActivities(activitiesData);

      // Cargar consejos de estudio para la materia seleccionada
      if (showStudyTips) {
        await loadStudyTips(selectedSubject);
      }

    } catch (error) {
      console.error('Error al cargar información de Sakura:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const loadStudyTips = async (subject: string) => {
    try {
      const tipsData = await chibiService.getStudyTips(subject);
      setStudyTips(tipsData);
    } catch (error) {
      console.error('Error al cargar consejos de estudio:', error);
    }
  };

  const handleSubjectChange = (subject: string) => {
    setSelectedSubject(subject);
    loadStudyTips(subject);
  };

  const handleRetry = () => {
    loadSakuraInfo();
  };

  if (loading) {
    return (
      <View style={[styles.container, style]}>
        <ActivityIndicator size="large" color={SakuraColors.primary} />
        <Text style={SakuraStyles.loadingText}>Cargando información de Sakura...</Text>
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

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
        style,
      ]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Información de Personalidad */}
        {personality && (
          <View style={SakuraStyles.card}>
            <Text style={SakuraStyles.sectionTitle}>👧 {personality.name}</Text>
            <Text style={SakuraStyles.textSecondary}>
              {personality.age} años • {personality.grade} • {personality.favorite_subject}
            </Text>
            <Text style={SakuraStyles.textSmall}>
              {personality.personality_traits.join(' • ')}
            </Text>
            <Text style={SakuraStyles.textSmall}>
              <Text style={{ fontWeight: 'bold' }}>Hobbies:</Text> {personality.hobbies.join(', ')}
            </Text>
            <Text style={SakuraStyles.textSmall}>
              <Text style={{ fontWeight: 'bold' }}>Metas:</Text> {personality.goals.join(', ')}
            </Text>
          </View>
        )}

        {/* Frase del Día */}
        {showDailyQuote && dailyQuote && (
          <View style={SakuraStyles.card}>
            <Text style={SakuraStyles.sectionTitle}>💭 Frase del Día</Text>
            <Text style={styles.quoteText}>
              "{dailyQuote.quote}"
            </Text>
            <Text style={styles.quoteSource}>
              — {dailyQuote.source}
            </Text>
          </View>
        )}

        {/* Consejos de Estudio */}
        {showStudyTips && (
          <View style={SakuraStyles.card}>
            <Text style={SakuraStyles.sectionTitle}>📚 Consejos de Estudio</Text>
            
            {/* Selector de Materia */}
            <View style={SakuraStyles.subjectSelector}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {['matemáticas', 'literatura', 'ciencias', 'historia', 'inglés'].map((subject) => (
                  <TouchableOpacity
                    key={subject}
                    style={[
                      SakuraStyles.subjectButton,
                      selectedSubject === subject && SakuraStyles.selectedSubjectButton,
                    ]}
                    onPress={() => handleSubjectChange(subject)}
                  >
                    <Text
                      style={[
                        SakuraStyles.subjectButtonText,
                        selectedSubject === subject && SakuraStyles.selectedSubjectButtonText,
                      ]}
                    >
                      {subject.charAt(0).toUpperCase() + subject.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Consejos */}
            {studyTips && (
              <View style={styles.tipsCard}>
                <Text style={styles.tipsTitle}>
                  Consejos para {studyTips.subject}:
                </Text>
                {studyTips.tips.map((tip: string, index: number) => (
                  <Text key={index} style={styles.tip}>
                    • {tip}
                  </Text>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Actividades de Descanso */}
        {showBreakActivities && breakActivities && (
          <View style={SakuraStyles.card}>
            <Text style={SakuraStyles.sectionTitle}>☕ Actividades de Descanso</Text>
            <Text style={styles.activitiesRecommendation}>
              {breakActivities.recommendation}
            </Text>
            <View style={styles.activitiesCard}>
              {breakActivities.activities.map((activity: string, index: number) => (
                <Text key={index} style={styles.activity}>
                  • {activity}
                </Text>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  quoteText: {
    fontSize: 18,
    color: SakuraColors.textPrimary,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  quoteSource: {
    fontSize: 14,
    color: SakuraColors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  tipsCard: {
    backgroundColor: SakuraColors.surface,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: SakuraColors.textPrimary,
    marginBottom: 12,
  },
  tip: {
    fontSize: 14,
    color: SakuraColors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  activitiesCard: {
    backgroundColor: SakuraColors.surface,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  activitiesRecommendation: {
    fontSize: 14,
    color: SakuraColors.primary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 20,
  },
  activity: {
    fontSize: 14,
    color: SakuraColors.textSecondary,
    marginBottom: 6,
  },
}); 