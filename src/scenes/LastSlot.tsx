// src/scenes/LastSlot.tsx
import React, { useMemo, useCallback, useState } from 'react';
import * as THREE from 'three';
import { Environment } from '@react-three/drei';
import { Token } from '@/components/3d/Token';
import { LifeboatSlots, useLifeboatSlots } from '@/components/3d/LifeboatSlots';
import { SmokeEffect } from '@/components/3d/SmokeEffect';
import { PostFX } from '@/components/effects/PostFX';
import { useCameraAnimation } from '@/hooks/useCameraAnimation';
import { useSceneTimerController } from '@/hooks/useSceneTimerController';
import { useGameStore } from '@/stores/gameStore';
import { useHaptics } from '@/hooks/useHaptics';
import { TOKENS_2A } from '@/data/tokens';
import { SCENE_CONFIGS } from '@/types/game';

export const LastSlot: React.FC = () => {
  const config = SCENE_CONFIGS['2A'];
  const totalMs = config.timerDurationMs ?? 15000;
  const haptics = useHaptics();

  const { getSlotForWorldPosition } = useLifeboatSlots(1, 0.5, 0.4);

  const { timerRemainingMs } = useSceneTimerController({
    sceneId: '2A',
    autoStartOnPhaseActive: true,
    onExpire: () => {
      haptics.timerExpire();
      useGameStore.getState().endScene();
      useGameStore.getState().goToNextScene();
    },
  });

  useCameraAnimation({
    keyframes: [{ position: [0, 2, 4], lookAt: [0, 1, 0], duration: 1 }],
    playing: true,
    onComplete: () => {
      useGameStore.getState().setScenePhase('active');
      useGameStore.getState().setTimerActive(true);
    },
  });

  const tokenPositions = useMemo(() => {
    const positions: THREE.Vector3[] = [];
    const arcRadius = 2.5;
    const angleStep = Math.PI / (TOKENS_2A.length + 1);
    for (let i = 0; i < TOKENS_2A.length; i++) {
      const angle = angleStep * (i + 1);
      positions.push(
        new THREE.Vector3(
          Math.cos(angle) * arcRadius,
          0,
          Math.sin(angle) * arcRadius * 0.5
        )
      );
    }
    return positions;
  }, []);

  const getTimerRemainingMs = useCallback(() => timerRemainingMs, [timerRemainingMs]);
  const pressure = timerRemainingMs < 5000 ? 1 - timerRemainingMs / 5000 : 0;

  return (
    <>
      <Environment preset="sunset" />
      <ambientLight intensity={0.2} color="#ff4422" />
      <pointLight position={[0, 3, 0]} intensity={0.6} color="#ff6633" />

      <SmokeEffect particleCount={80} radius={3} height={4} />

      {/* Single slot lifeboat */}
      <group position={[0, 0, 3]}>
        <LifeboatSlots slotCount={1} radius={0.5} />
      </group>

      {/* Character silhouettes */}
      {TOKENS_2A.map((token, index) => (
        <Token
          key={token.id}
          tokenId={token.id}
          label={token.label}
          chapter={2}
          scene="2A"
          basePosition={tokenPositions[index]}
          getTimerRemainingMs={getTimerRemainingMs}
          onDropInSlot={(worldPos) => getSlotForWorldPosition(worldPos)}
        />
      ))}

      <PostFX pressureVignette={pressure} />
    </>
  );
};
