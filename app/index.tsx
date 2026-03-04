// app/index.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  withSequence,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useGameStore } from '@/stores/gameStore';

type Phase = 'splash' | 'warning' | 'ready';

export default function SplashScreen() {
  const [phase, setPhase] = useState<Phase>('splash');
  const router = useRouter();
  const { startSession, startScene } = useGameStore();

  const titleOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);

  useEffect(() => {
    titleOpacity.value = withTiming(1, { duration: 1200 });
    subtitleOpacity.value = withDelay(800, withTiming(1, { duration: 1000 }));
    buttonOpacity.value = withDelay(2000, withTiming(1, { duration: 800 }));
  }, [titleOpacity, subtitleOpacity, buttonOpacity]);

  const titleStyle = useAnimatedStyle(() => ({ opacity: titleOpacity.value }));
  const subtitleStyle = useAnimatedStyle(() => ({ opacity: subtitleOpacity.value }));
  const buttonStyle = useAnimatedStyle(() => ({ opacity: buttonOpacity.value }));

  const handleStart = () => {
    if (phase === 'splash') {
      setPhase('warning');
    } else if (phase === 'warning') {
      setPhase('ready');
      startSession();
      startScene('1A');
      router.replace('/game');
    }
  };

  return (
    <View style={styles.container}>
      {phase === 'splash' && (
        <>
          <Animated.Text style={[styles.title, titleStyle]}>
            Last Ship Out
          </Animated.Text>
          <Animated.Text style={[styles.subtitle, subtitleStyle]}>
            A journey of impossible choices
          </Animated.Text>
          <Animated.View style={buttonStyle}>
            <TouchableOpacity style={styles.button} onPress={handleStart}>
              <Text style={styles.buttonText}>Begin</Text>
            </TouchableOpacity>
          </Animated.View>
        </>
      )}

      {phase === 'warning' && (
        <View style={styles.warningContainer}>
          <Text style={styles.warningTitle}>Before You Begin</Text>
          <Text style={styles.warningBody}>
            This experience asks you to make difficult emotional choices under
            pressure. There are no right or wrong answers.{'\n\n'}
            Your choices reflect your instincts — not your worth.{'\n\n'}
            The experience takes 8–12 minutes. Find a quiet moment.
          </Text>
          <TouchableOpacity style={styles.button} onPress={handleStart}>
            <Text style={styles.buttonText}>I understand — let's go</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0f1a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  title: {
    color: '#ffffff',
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    color: '#8899aa',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 48,
  },
  button: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  warningContainer: {
    alignItems: 'center',
  },
  warningTitle: {
    color: '#ffd85a',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
  },
  warningBody: {
    color: '#cccccc',
    fontSize: 16,
    lineHeight: 26,
    textAlign: 'center',
    marginBottom: 40,
  },
});
