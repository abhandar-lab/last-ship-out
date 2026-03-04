// src/scenes/OneSentence.tsx
import React, { useCallback } from 'react';
import { Environment, Stars } from '@react-three/drei';
import { Ocean } from '@/components/3d/Ocean';
import { ShipmateNPC } from '@/components/3d/ShipmateNPC';
import { PostFX } from '@/components/effects/PostFX';
import { useCameraAnimation } from '@/hooks/useCameraAnimation';
import { useGameStore } from '@/stores/gameStore';

export const OneSentence: React.FC = () => {
  useCameraAnimation({
    keyframes: [{ position: [0, 1.6, 3], lookAt: [0, 1.2, 0], duration: 1.5 }],
    playing: true,
    onComplete: () => useGameStore.getState().setScenePhase('active'),
  });

  return (
    <>
      <Environment preset="dawn" />
      <Stars radius={60} depth={30} count={800} factor={2} />
      <Ocean color="#1a3555" opacity={0.75} waveSpeed={0.15} waveHeight={0.06} />

      <directionalLight position={[3, 5, 3]} intensity={0.6} color="#ffe0b0" />

      <ShipmateNPC position={[0, 0, 0]} expression="softened" />

      <PostFX pressureVignette={0} />
    </>
  );
};
