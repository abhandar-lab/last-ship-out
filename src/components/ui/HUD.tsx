// src/components/ui/HUD.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGameStore } from '@/stores/gameStore';

interface HUDProps {
  waterProgress?: number; // 0–1
}

export const HUD: React.FC<HUDProps> = ({ waterProgress = 0 }) => {
  const chapter = useGameStore((s) => s.chapter);
  const scene = useGameStore((s) => s.scene);

  return (
    <View style={styles.container} pointerEvents="none">
      <View style={styles.chapterBox}>
        <Text style={styles.chapterText}>Chapter {chapter}</Text>
        <Text style={styles.sceneText}>Scene {scene}</Text>
      </View>
      <View style={styles.waterBox}>
        <Text style={styles.waterLabel}>Water level</Text>
        <View style={styles.waterBar}>
          <View
            style={[
              styles.waterFill,
              { width: `${Math.min(100, Math.max(0, waterProgress * 100))}%` },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 5,
  },
  chapterBox: {
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 8,
  },
  chapterText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  sceneText: {
    color: '#cccccc',
    fontSize: 12,
  },
  waterBox: {
    alignItems: 'flex-end',
  },
  waterLabel: {
    color: '#ffffff',
    fontSize: 12,
    marginBottom: 4,
  },
  waterBar: {
    width: 120,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  waterFill: {
    height: '100%',
    backgroundColor: '#4da6ff',
  },
});
