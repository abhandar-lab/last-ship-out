// src/components/3d/FutureCard.tsx
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { useHaptics } from '@/hooks/useHaptics';

interface FutureCardProps {
  id: string;
  title: string;
  subtext: string;
  position: [number, number, number];
  isSelected: boolean;
  onToggle: (id: string) => void;
}

export const FutureCard: React.FC<FutureCardProps> = ({
  id,
  title,
  subtext,
  position,
  isSelected,
  onToggle,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const liftRef = useRef(0);
  const haptics = useHaptics();

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const targetY = isSelected ? 0.3 : 0;
    liftRef.current += (targetY - liftRef.current) * delta * 8;
    groupRef.current.position.y = position[1] + liftRef.current;
  });

  const handleTap = () => {
    haptics.cardSelect();
    onToggle(id);
  };

  return (
    <group ref={groupRef} position={position}>
      <mesh onClick={handleTap}>
        <planeGeometry args={[1.6, 2.2]} />
        <meshStandardMaterial
          color={isSelected ? '#fff8e1' : '#1e1e30'}
          emissive={isSelected ? '#ffd700' : '#111122'}
          emissiveIntensity={isSelected ? 1.5 : 0.2}
          transparent
          opacity={0.95}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Gold border when selected */}
      {isSelected && (
        <lineSegments>
          <edgesGeometry args={[new THREE.PlaneGeometry(1.6, 2.2)]} />
          <lineBasicMaterial color="#ffd700" linewidth={2} />
        </lineSegments>
      )}
      <Billboard position={[0, 0.4, 0.01]}>
        <Text fontSize={0.18} color={isSelected ? '#3a2800' : '#ffffff'} anchorX="center" fontWeight="bold">
          {title}
        </Text>
      </Billboard>
      <Billboard position={[0, -0.2, 0.01]}>
        <Text
          fontSize={0.1}
          maxWidth={1.3}
          textAlign="center"
          color={isSelected ? '#5a4a20' : '#999999'}
          anchorX="center"
        >
          {subtext}
        </Text>
      </Billboard>
    </group>
  );
};
