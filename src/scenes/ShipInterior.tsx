// src/scenes/ShipInterior.tsx
import React, { useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { Environment, Stars } from '@react-three/drei';
import { Token } from '@/components/3d/Token';
import { LifeboatSlots, useLifeboatSlots } from '@/components/3d/LifeboatSlots';
import { WaterRising } from '@/components/3d/WaterRising';
import { Explosion } from '@/components/3d/Explosion';
import { SmokeEffect } from '@/components/3d/SmokeEffect';
import { CameraShake } from '@/components/effects/CameraShake';
import { ScreenFlash } from '@/components/effects/ScreenFlash';
import { PostFX } from '@/components/effects/PostFX';
import { useCameraAnimation } from '@/hooks/useCameraAnimation';
import { useSceneTimerController } from '@/hooks/useSceneTimerController';
import { useGameStore } from '@/stores/gameStore';
import { useHaptics } from '@/hooks/useHaptics';
import { TOKENS_1A } from '@/data/tokens';
import { SCENE_CONFIGS } from '@/types/game';

export const ShipInterior: React.FC = () => {
  const config = SCENE_CONFIGS['1A'];
  const totalMs = config.timerDurationMs ?? 25000;
  const haptics = useHaptics();

  const [phase, setPhase] = useState<'intro' | 'explosion' | 'active' | 'outro'>('intro');
  const [explosionTrigger, setExplosionTrigger] = useState(0);

  const { getSlotForWorldPosition } = useLifeboatSlots(6, 1.2, 0.35);

  const { timerRemainingMs } = useSceneTimerController({
    sceneId: '1A',
    autoStartOnPhaseActive: false,
    onExpire: () => setPhase('outro'),
  });

  // Camera: slow orbit → snap to isometric after explosion
  useCameraAnimation({
    keyframes: [
      { position: [4, 3, 4], lookAt: [0, 0, 0], duration: 3 },
    ],
    playing: phase === 'intro',
    onComplete: () => {
      setPhase('explosion');
      setExplosionTrigger((p) => p + 1);
      haptics.explosion();
      setTimeout(() => {
        setPhase('active');
        useGameStore.getState().setScenePhase('active');
        useGameStore.getState().setTimerActive(true);
      }, 1500);
    },
  });

  // Snap camera to isometric when active
  useCameraAnimation({
    keyframes: [
      { position: [0, 8, 6], lookAt: [0, 0, 0], duration: 0.8 },
    ],
    playing: phase === 'active',
  });

  const tokenPositions = useMemo(() => {
    const positions: THREE.Vector3[] = [];
    const cols = 5;
    for (let i = 0; i < TOKENS_1A.length; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      positions.push(
        new THREE.Vector3((col - 2) * 1.2, 0, (row - 1) * 1.2 - 1.5)
      );
    }
    return positions;
  }, []);

  const getTimerRemainingMs = useCallback(() => timerRemainingMs, [timerRemainingMs]);

  const waterProgress = totalMs > 0 ? 1 - timerRemainingMs / totalMs : 0;
  const pressureVignette = timerRemainingMs < 10000 ? (1 - timerRemainingMs / 10000) : 0;

  return (
    <>
      <Environment preset="warehouse" />

      {/* Deck */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#3b2a20" />
      </mesh>

      {/* Explosion FX */}
      <Explosion trigger={explosionTrigger} />
      <CameraShake trigger={explosionTrigger} intensity={0.35} duration={800} />
      <ScreenFlash trigger={explosionTrigger} />
      <SmokeEffect particleCount={60} radius={1} height={3} />

      {/* Water rising */}
      {phase === 'active' && <WaterRising progress={waterProgress} />}

      {/* Lifeboat */}
      <group position={[0, 0, 3.5]}>
        <LifeboatSlots />
      </group>

      {/* Tokens — only show in active phase */}
      {phase === 'active' &&
        TOKENS_1A.map((token, index) => (
          <Token
            key={token.id}
            tokenId={token.id}
            label={token.label}
            chapter={1}
            scene="1A"
            basePosition={tokenPositions[index]}
            getTimerRemainingMs={getTimerRemainingMs}
            onDropInSlot={(worldPos) => getSlotForWorldPosition(worldPos)}
          />
        ))}

      <PostFX pressureVignette={pressureVignette} />
    </>
  );
};
