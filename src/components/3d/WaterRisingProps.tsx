// src/components/3d/WaterRising.tsx
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface WaterRisingProps {
  /** 0–1 progress over scene duration */
  progress: number;
  startY?: number;
  endY?: number;
}

export const WaterRising: React.FC<WaterRisingProps> = ({
  progress,
  startY = -2,
  endY = 0,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!meshRef.current) return;
    const y = startY + (endY - startY) * progress;
    meshRef.current.position.y = y;
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[20, 20, 64, 64]} />
      <meshStandardMaterial
        color="#204a7a"
        transparent
        opacity={0.7}
        roughness={0.3}
        metalness={0.1}
      />
    </mesh>
  );
};
