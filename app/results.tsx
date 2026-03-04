// app/results.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { scoringEngine } from '@/engine/ScoringEngine';
import { profileGenerator, GeneratedProfile } from '@/engine/ProfileGenerator';
import { useTelemetryStore } from '@/stores/telemetryStore';

const FadeInSection: React.FC<{
  delay: number;
  children: React.ReactNode;
}> = ({ delay, children }) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 800 }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 800 }));
  }, [delay, opacity, translateY]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={style}>{children}</Animated.View>;
};

export default function ResultsScreen() {
  const [profile, setProfile] = useState<GeneratedProfile | null>(null);
  const events = useTelemetryStore((s) => s.events);
  const summary = useTelemetryStore((s) => s.getSessionSummary());

  useEffect(() => {
    const scores = scoringEngine.computeFromCurrentSession();
    const generated = profileGenerator.generate(scores, events);
    setProfile(generated);
  }, [events]);

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Generating your profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <FadeInSection delay={0}>
        <Text style={styles.header}>Your Profile</Text>
        <Text style={styles.subheader}>
          Based on {summary.totalEvents} moments across{' '}
          {summary.scenesCompleted.length} scenes
        </Text>
      </FadeInSection>

      {/* Melt Points */}
      <FadeInSection delay={600}>
        <Text style={styles.sectionTitle}>🔥 Your Melt Points</Text>
        <Text style={styles.sectionSubtitle}>
          The top 3 things that make you weak in the knees
        </Text>
        {profile.meltPoints.map((mp, i) => (
          <View key={i} style={styles.meltCard}>
            <Text style={styles.meltLabel}>{mp.label}</Text>
            <Text style={styles.meltDesc}>{mp.description}</Text>
            <View style={styles.scoreBar}>
              <View
                style={[styles.scoreFill, { width: `${mp.score}%` }]}
              />
            </View>
          </View>
        ))}
      </FadeInSection>

      {/* Love Language */}
      <FadeInSection delay={1200}>
        <Text style={styles.sectionTitle}>💛 How You Feel Loved</Text>

        <Text style={styles.subSectionTitle}>When everything is on fire</Text>
        {profile.loveLanguagePressure.map((ll, i) => (
          <View key={`p-${i}`} style={styles.llRow}>
            <Text style={styles.llLabel}>{ll.language}</Text>
            <View style={styles.llBar}>
              <View style={[styles.llFill, { width: `${ll.score}%` }]} />
            </View>
          </View>
        ))}

        <Text style={[styles.subSectionTitle, { marginTop: 16 }]}>
          When life is calm
        </Text>
        {profile.loveLanguageCalm.map((ll, i) => (
          <View key={`c-${i}`} style={styles.llRow}>
            <Text style={styles.llLabel}>{ll.language}</Text>
            <View style={styles.llBar}>
              <View
                style={[styles.llFill, styles.llFillCalm, { width: `${ll.score}%` }]}
              />
            </View>
          </View>
        ))}
      </FadeInSection>

      {/* Relationship Reflexes */}
      <FadeInSection delay={1800}>
        <Text style={styles.sectionTitle}>⚡ Relationship Reflexes</Text>
        {profile.relationshipReflexes.map((reflex, i) => (
          <View key={i} style={styles.reflexCard}>
            <Text style={styles.reflexText}>{reflex}</Text>
          </View>
        ))}
      </FadeInSection>

      {/* Confidence */}
      <FadeInSection delay={2400}>
        <View style={styles.confidenceBox}>
          <Text style={styles.confidenceLabel}>Profile confidence</Text>
          <Text style={styles.confidenceValue}>
            {(profile.overallConfidence * 100).toFixed(0)}%
          </Text>
        </View>
      </FadeInSection>

      {/* Faking flags (dev only — hide in production) */}
      {profile.fakingFlags.length > 0 && (
        <FadeInSection delay={3000}>
          <View style={styles.flagBox}>
            <Text style={styles.flagTitle}>⚠️ Analysis Notes</Text>
            {profile.fakingFlags.map((flag, i) => (
              <Text key={i} style={styles.flagText}>
                • {flag}
              </Text>
            ))}
          </View>
        </FadeInSection>
      )}

      <View style={{ height: 80 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0f1a',
  },
  content: {
    padding: 24,
    paddingTop: 60,
  },
  loading: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
  header: {
    color: '#ffffff',
    fontSize: 34,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  subheader: {
    color: '#888899',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 40,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 6,
    marginTop: 32,
  },
  sectionSubtitle: {
    color: '#888899',
    fontSize: 14,
    marginBottom: 16,
  },
  subSectionTitle: {
    color: '#aaaaaa',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  meltCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.15)',
  },
  meltLabel: {
    color: '#ffd85a',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  meltDesc: {
    color: '#cccccc',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  scoreBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  scoreFill: {
    height: '100%',
    backgroundColor: '#ffd85a',
    borderRadius: 3,
  },
  llRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  llLabel: {
    color: '#cccccc',
    fontSize: 13,
    width: 140,
  },
  llBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  llFill: {
    height: '100%',
    backgroundColor: '#ff6b6b',
    borderRadius: 4,
  },
  llFillCalm: {
    backgroundColor: '#6bcfff',
  },
  reflexCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#6bcfff',
  },
  reflexText: {
    color: '#dddddd',
    fontSize: 14,
    lineHeight: 21,
  },
  confidenceBox: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginTop: 32,
  },
  confidenceLabel: {
    color: '#888899',
    fontSize: 14,
    marginBottom: 6,
  },
  confidenceValue: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: '800',
  },
  flagBox: {
    backgroundColor: 'rgba(255,100,100,0.08)',
    borderRadius: 10,
    padding: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,100,100,0.2)',
  },
  flagTitle: {
    color: '#ff8888',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  flagText: {
    color: '#cc8888',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 4,
  },
});
