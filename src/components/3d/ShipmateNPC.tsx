// src/components/3d/ShipmateNPC.tsx
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ShipmateNPCProps {
  position?: [number, number, number];
  expression?: 'neutral' | 'tense' | 'softened';
}

export const ShipmateNPC: React.FC<ShipmateNPCProps> = ({
  position = [0, 0, 0],
  expression = 'neutral',
}) => {
  const headRef = useRef<THREE.Mesh>(null);
  const bodyRef = useRef<THREE.Mesh>(null);

  const expressionColor: Record<string, string> = {
    neutral: '#d4a574',
    tense: '#c4836a',
    softened: '#e0b89a',
  };

  useFrame(({ clock }) => {
    if (!headRef.current) return;
    const t = clock.getElapsedTime();
    // Subtle breathing
    headRef.current.position.y = 1.55 + Math.sin(t * 1.5) * 0.01;
    // Idle blink — scale Y of head briefly every ~3s
    const blinkCycle = t % 3;
    if (blinkCycle > 2.85 && blinkCycle < 2.95) {
      headRef.current.scale.y = 0.95;
    } else {
      headRef.current.scale.y = 1;
    }
  });

  return (
    <group position={position}>
      {/* Body */}
      <mesh ref={bodyRef} position={[0, 0.75, 0]}>
        <capsuleGeometry args={[0.3, 0.8, 8, 16]} />
        <meshStandardMaterial color="#3a4a5c" roughness={0.7} />
      </mesh>
      {/* Head */}
      <mesh ref={headRef} position={[0, 1.55, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial
          color={expressionColor[expression]}
          roughness={0.5}
        />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.08, 1.6, 0.2]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color="#222222" />
      </mesh>
      <mesh position={[0.08, 1.6, 0.2]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color="#222222" />
      </mesh>
    </group>
  );
};
