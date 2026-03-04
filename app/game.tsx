// app/game.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Canvas } from '@react-three/fiber';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { ShipInterior } from '@/scenes/ShipInterior';
import { useGameStore } from '@/stores/gameStore';

const GameScreen: React.FC = () => {
  const scene = useGameStore((s) => s.scene);

  return (
    <GestureHandlerRootView style={styles.root}>
      <View style={styles.container}>
        <Canvas
          camera={{ fov: 45, near: 0.1, far: 100, position: [0, 5, 8] }}
          shadows
        >
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[5, 10, 5]}
            intensity={1}
            castShadow
          />
          {scene === '1A' && <ShipInterior />}
          {/* TODO: add other scenes as you implement them */}
        </Canvas>
        <StatusBar style="light" />
      </View>
    </GestureHandlerRootView>
  );
};

export default GameScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
  },
});
