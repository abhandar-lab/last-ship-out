// src/components/ui/NarratorText.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
} from 'react-native-reanimated';

interface NarratorTextProps {
  text: string;
  visible: boolean;
  delayMs?: number;
  durationMs?: number;
}

export const NarratorText: React.FC<NarratorTextProps> = ({
  text,
  visible,
  delayMs = 0,
  durationMs = 800,
}) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    if (visible) {
      opacity.value = withDelay(delayMs, withTiming(1, { duration: durationMs }));
      translateY.value = withDelay(delayMs, withTiming(0, { duration: durationMs }));
    } else {
      opacity.value = withTiming(0, { duration: 400 });
      translateY.value = withTiming(20, { duration: 400 });
    }
  }, [visible, delayMs, durationMs, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View style={[styles.textBox, animatedStyle]}>
        <Text style={styles.text}>{text}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 30,
  },
  textBox: {
    paddingHorizontal: 32,
  },
  text: {
    color: '#e0e0e0',
    fontSize: 20,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 30,
  },
});
