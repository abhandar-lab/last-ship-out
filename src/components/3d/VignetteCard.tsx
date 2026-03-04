// src/components/3d/VignetteCard.tsx
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { useHaptics } from '@/hooks/useHaptics';

interface VignetteCardProps {
  id: string;
  description: string;
  position: [number, number, number];
  onSpark: (id: string) => void;
  isSparked: boolean;
}

export const VignetteCard: React.FC<VignetteCardProps> = ({
  id,
  description,
  position,
  onSpark,
  isSparked,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef(0);
  const haptics = useHaptics();

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const target = isSparked ? 1 : 0;
    glowRef.current += (target - glowRef.current) * delta * 5;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = glowRef.current * 2;
  });

  const handleTap = () => {
    if (isSparked) return;
    haptics.sparkTap();
    onSpark(id);
  };

  return (
    <group position={position}>
      <mesh ref={meshRef} onClick={handleTap}>
        <planeGeometry args={[2.4, 1.4]} />
        <meshStandardMaterial
          color={isSparked ? '#fff8e1' : '#1a1a2e'}
          emissive={isSparked ? '#ffd700' : '#222244'}
          emissiveIntensity={0}
          transparent
          opacity={0.92}
          side={THREE.DoubleSide}
        />
      </mesh>
      <Billboard position={[0, 0, 0.01]}>
        <Text
          fontSize={0.14}
          maxWidth={2}
          textAlign="center"
          color={isSparked ? '#4a3800' : '#cccccc'}
          anchorX="center"
          anchorY="middle"
        >
          {description}
        </Text>
      </Billboard>
    </group>
  );
};
