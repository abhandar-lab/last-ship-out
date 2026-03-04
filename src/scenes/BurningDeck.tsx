// src/scenes/BurningDeck.tsx
import React, { useMemo, useState, useCallback, useRef } from 'react';
import * as THREE from 'three';
import { Environment } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Token } from '@/components/3d/Token';
import { BurnPit, useBurnPitCollision } from '@/components/3d/BurnPit';
import { FireEffect } from '@/components/3d/FireEffect';
import { SmokeEffect } from '@/components/3d/SmokeEffect';
import { PostFX } from '@/components/effects/PostFX';
import { useCameraAnimation } from '@/hooks/useCameraAnimation';
import { useChoiceStore } from '@/stores/choiceStore';
import { useTelemetryStore } from '@/stores/telemetryStore';
import { useGameStore } from '@/stores/gameStore';
import { useHaptics } from '@/hooks/useHaptics';
import { TOKENS_2B } from '@/data/tokens';
import { nowMs } from '@/utils/timing';

const PIT_CENTER = new THREE.Vector3(0, 0, 0);
const PIT_RADIUS = 0.8;
const ORGANIC_DURATION_MS = 45000;

export const BurningDeck: React.FC = () => {
  const [burnedIds, setBurnedIds] = useState<Set<string>>(new Set());
  const [fireIntensity, setFireIntensity] = useState(0);
  const sceneStartRef = useRef(nowMs());
  const haptics = useHaptics();
  const { burnItem } = useChoiceStore();
  const { addEvent } = useTelemetryStore();
  const { isInsidePit, getResistanceFactor } = useBurnPitCollision(PIT_CENTER, PIT_RADIUS);

  useCameraAnimation({
    keyframes: [{ position: [0, 4, 5], lookAt: [0, 0.5, 0], duration: 1.2 }],
    playing: true,
    onComplete: () => useGameStore.getState().setScenePhase('active'),
  });

  // Organic urgency: fire grows over 45s
  useFrame(() => {
    const elapsed = nowMs() - sceneStartRef.current;
    const progress = Math.min(elapsed / ORGANIC_DURATION_MS, 1);
    setFireIntensity(progress);
  });

  const handleBurn = useCallback(
    (tokenId: string) => {
      if (burnedIds.has(tokenId) || burnedIds.size >= 3) return;
      haptics.fireResistance();
      setBurnedIds((prev) => new Set(prev).add(tokenId));
      burnItem(tokenId);

      addEvent({
        chapter: 2,
        scene: '2B',
        eventType: 'burn_item',
        tokenId,
        burnOrder: burnedIds.size + 1,
        burnHesitationMs: 0,
        resistanceOvercomeSpeed: 0,
      } as any);

      if (burnedIds.size + 1 >= 3) {
        setTimeout(() => {
          useGameStore.getState().endScene();
          useGameStore.getState().goToNextScene();
        }, 2000);
      }
    },
    [burnedIds, haptics, burnItem, addEvent]
  );

  const tokenPositions = useMemo(() => {
    const positions: THREE.Vector3[] = [];
    const startX = -3;
    for (let i = 0; i < TOKENS_2B.length; i++) {
      positions.push(new THREE.Vector3(startX + i * 1, 0, -2));
    }
    return positions;
  }, []);

  const handleDropCheck = useCallback(
    (worldPos: [number, number, number], tokenId: string) => {
      if (isInsidePit(worldPos)) {
        handleBurn(tokenId);
        return { inSlot: true, slotIndex: 0 };
      }
      return { inSlot: false };
    },
    [isInsidePit, handleBurn]
  );

  const pressure = fireIntensity;

  return (
    <>
      <Environment preset="apartment" />
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 2, 0]} intensity={1.5 + fireIntensity} color="#ff6622" />

      {/* Cabin walls placeholder */}
      <mesh position={[0, 1.5, -3]}>
        <planeGeometry args={[8, 4]} />
        <meshStandardMaterial color="#2a1a10" />
      </mesh>

      {/* Shelves */}
      <mesh position={[-3, 0.8, -2.5]}>
        <boxGeometry args={[6, 0.05, 0.6]} />
        <meshStandardMaterial color="#4a3020" />
      </mesh>

      {/* Burn pit */}
      <BurnPit position={[0, 0, 0]} radius={PIT_RADIUS} />

      {/* Door fire */}
      <group position={[3, 0, -2.5]}>
        <FireEffect
          particleCount={150 + Math.floor(fireIntensity * 200)}
          radius={0.5 + fireIntensity * 0.4}
          height={1 + fireIntensity * 1.5}
        />
      </group>

      <SmokeEffect
        particleCount={40 + Math.floor(fireIntensity * 80)}
        radius={2}
        height={3}
      />

      {/* Burnable items */}
      {TOKENS_2B.filter((t) => !burnedIds.has(t.id)).map((token, index) => (
        <Token
          key={token.id}
          tokenId={token.id}
          label={token.label}
          chapter={2}
          scene="2B"
          basePosition={tokenPositions[index]}
          onDropInSlot={(worldPos) => handleDropCheck(worldPos, token.id)}
        />
      ))}

      <PostFX pressureVignette={pressure} />
    </>
  );
};
