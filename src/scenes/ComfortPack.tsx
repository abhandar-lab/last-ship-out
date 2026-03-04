// src/scenes/ComfortPack.tsx
import React, { useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { Stars, Environment } from '@react-three/drei';
import { Token } from '@/components/3d/Token';
import { LifeboatSlots, useLifeboatSlots } from '@/components/3d/LifeboatSlots';
import { Ocean } from '@/components/3d/Ocean';
import { PostFX } from '@/components/effects/PostFX';
import { useCameraAnimation } from '@/hooks/useCameraAnimation';
import { useGameStore } from '@/stores/gameStore';
import { useTelemetryStore } from '@/stores/telemetryStore';
import { TOKENS_1B } from '@/data/tokens';
import { nowMs } from '@/utils/timing';

export const ComfortPack: React.FC = () => {
  const { getSlotForWorldPosition } = useLifeboatSlots(3, 0.9, 0.35);
  const sceneStartRef = React.useRef(nowMs());

  useCameraAnimation({
    keyframes: [{ position: [0, 5, 6], lookAt: [0, 0, 0], duration: 1.5 }],
    playing: true,
  });

  React.useEffect(() => {
    useGameStore.getState().setScenePhase('active');
  }, []);

  const tokenPositions = useMemo(() => {
    const positions: THREE.Vector3[] = [];
    const arcRadius = 2.5;
    const angleStep = Math.PI / (TOKENS_1B.length + 1);
    for (let i = 0; i < TOKENS_1B.length; i++) {
      const angle = -Math.PI / 2 + angleStep * (i + 1);
      positions.push(
        new THREE.Vector3(
          Math.cos(angle) * arcRadius,
          0,
          Math.sin(angle) * arcRadius - 1
        )
      );
    }
    return positions;
  }, []);

  return (
    <>
      <Environment preset="night" />
      <Stars radius={100} depth={50} count={3000} factor={4} />
      <Ocean color="#0d2137" opacity={0.9} waveSpeed={0.2} waveHeight={0.08} />

      {/* Raft surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#5a3a1a" />
      </mesh>

      {/* Comfort boat slots */}
      <group position={[0, 0, 2.5]}>
        <LifeboatSlots slotCount={3} radius={0.9} />
      </group>

      {/* No timer — deliberate */}
      {TOKENS_1B.map((token, index) => (
        <Token
          key={token.id}
          tokenId={token.id}
          label={token.label}
          chapter={1}
          scene="1B"
          basePosition={tokenPositions[index]}
          onDropInSlot={(worldPos) => getSlotForWorldPosition(worldPos)}
        />
      ))}

      <PostFX pressureVignette={0} />
    </>
  );
};
