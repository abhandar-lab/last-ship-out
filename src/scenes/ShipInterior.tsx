// src/scenes/ShipInterior.tsx
import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import { Token } from '@/components/3d/Token';
import { LifeboatSlots, useLifeboatSlots } from '@/components/3d/LifeboatSlots';
import { WaterRising } from '@/components/3d/WaterRising';
import { Timer } from '@/components/ui/Timer';
import { useSceneTimerController } from '@/hooks/useSceneTimerController';
import { useGameStore } from '@/stores/gameStore';
import { SCENE_CONFIGS } from '@/types/game';

const TOKENS_1A = [
  { id: 'P01', label: 'Believes in you' },
  { id: 'P02', label: 'Keeps things running' },
  { id: 'P03', label: 'Exciting one' },
  { id: 'P04', label: 'Calm touch' },
  { id: 'P05', label: 'Shows up with needs' },
  { id: 'P06', label: 'Tiny kid' },
  { id: 'P07', label: 'Older smiler' },
  { id: 'P08', label: 'Engineer' },
  { id: 'O01', label: 'Cash & docs' },
  { id: 'O02', label: 'Photo album' },
  { id: 'O03', label: 'Toolkit' },
  { id: 'O04', label: 'Medical kit' },
  { id: 'O05', label: 'Luxury items' },
  { id: 'O06', label: 'Journal' },
];

export const ShipInterior: React.FC = () => {
  const config = SCENE_CONFIGS['1A'];
  const totalMs = config.timerDurationMs ?? 25000;

  const { getSlotForWorldPosition } = useLifeboatSlots(6, 1.2, 0.35);
  const { timerRemainingMs } = useSceneTimerController({
    sceneId: '1A',
    autoStartOnPhaseActive: true,
    onExpire: () => {
      useGameStore.getState().endScene();
      useGameStore.getState().goToNextScene();
    },
  });

  const getTimerRemainingMs = () => timerRemainingMs;

  const tokenPositions = useMemo(() => {
    const positions: THREE.Vector3[] = [];
    const radius = 3;
    const angleStep = (Math.PI * 2) / TOKENS_1A.length;
    for (let i = 0; i < TOKENS_1A.length; i++) {
      const angle = i * angleStep;
      positions.push(new THREE.Vector3(
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius
      ));
    }
    return positions;
  }, []);

  const waterProgress = 1 - timerRemainingMs / totalMs;

  return (
    <>
      <Environment preset="warehouse" />
      {/* Placeholder deck */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#3b2a20" />
      </mesh>

      {/* Lifeboat and slots */}
      <group position={[0, 0, 4]}>
        <LifeboatSlots />
      </group>

      {/* Rising water plane */}
      <WaterRising progress={waterProgress} />

      {/* Tokens on deck */}
      {TOKENS_1A.map((token, index) => (
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

      {/* UI overlay is rendered in React Native side via Timer component on game screen */}
      {/* But if you want in-scene UI, you can use Html from drei. */}
    </>
  );
};
