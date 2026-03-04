// src/components/ui/Timer.tsx
import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

interface TimerProps {
  remainingMs: number;
  totalMs: number;
}

export const Timer: React.FC<TimerProps> = ({ remainingMs, totalMs }) => {
  const remainingSeconds = Math.ceil(remainingMs / 1000);

  const color = useMemo(() => {
    if (remainingSeconds <= 5) return '#ff4b4b';
    if (remainingSeconds <= 10) return '#ffd85a';
    return '#ffffff';
  }, [remainingSeconds]);

  const percentage = totalMs > 0 ? remainingMs / totalMs : 0;

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: withTiming(percentage) }],
  }));

  return (
    <View style={styles.container} pointerEvents="none">
      <View style={styles.timerWrapper}>
        <Text style={[styles.timerText, { color }]}>{remainingSeconds}</Text>
        <View style={styles.ringBackground}>
          <Animated.View style={[styles.ringForeground, ringStyle]} />
        </View>
      </View>
    </View>
  );
};

const RING_HEIGHT = 4;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  timerWrapper: {
    alignItems: 'center',
  },
  timerText: {
    fontSize: 40,
    fontWeight: '700',
  },
  ringBackground: {
    marginTop: 8,
    width: 180,
    height: RING_HEIGHT,
    borderRadius: RING_HEIGHT / 2,
    backgroundColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
  },
  ringForeground: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ff4b4b',
  },
});
