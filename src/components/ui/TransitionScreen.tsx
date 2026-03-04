// src/components/ui/TransitionScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  withDelay,
} from 'react-native-reanimated';

interface TransitionScreenProps {
  title: string;
  subtitle?: string;
  visible: boolean;
  onComplete?: () => void;
  durationMs?: number;
}

export const TransitionScreen: React.FC<TransitionScreenProps> = ({
  title,
  subtitle,
  visible,
  onComplete,
  durationMs = 3000,
}) => {
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      opacity.value = withSequence(
        withTiming(1, { duration: 600 }),
        withDelay(durationMs - 1200, withTiming(0, { duration: 600 }))
      );
      if (onComplete) {
        const timer = setTimeout(onComplete, durationMs);
        return () => clearTimeout(timer);
      }
    } else {
      opacity.value = 0;
    }
  }, [visible, durationMs, onComplete, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0a0f1a',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    color: '#aaaaaa',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 24,
  },
});
