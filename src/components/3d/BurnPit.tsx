// src/components/3d/BurnPit.tsx
import React, { useRef, useCallback } from 'react';
import * as THREE from 'three';
import { FireEffect } from './FireEffect';

interface BurnPitProps {
  position?: [number, number, number];
  radius?: number;
}

export const useBurnPitCollision = (
  pitCenter: THREE.Vector3,
  pitRadius: number
) => {
  const isInsidePit = useCallback(
    (worldPos: [number, number, number]): boolean => {
      const point = new THREE.Vector3(...worldPos);
      const dist = pitCenter.distanceTo(point);
      return dist <= pitRadius;
    },
    [pitCenter, pitRadius]
  );

  const getResistanceFactor = useCallback(
    (worldPos: [number, number, number]): number => {
      const point = new THREE.Vector3(...worldPos);
      const dist = pitCenter.distanceTo(point);
      if (dist > pitRadius) return 0;
      const penetration = 1 - dist / pitRadius;
      return penetration * 0.4;
    },
    [pitCenter, pitRadius]
  );

  return { isInsidePit, getResistanceFactor };
};

export const BurnPit: React.FC<BurnPitProps> = ({
  position = [0, 0, 0],
  radius = 0.8,
}) => {
  return (
    <group position={position}>
      {/* Stone ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 0.85, radius, 24]} />
        <meshStandardMaterial color="#555555" roughness={0.9} />
      </mesh>
      {/* Dark pit floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <circleGeometry args={[radius * 0.85, 24]} />
        <meshStandardMaterial color="#1a0a00" />
      </mesh>
      {/* Fire */}
      <FireEffect particleCount={200} radius={radius * 0.6} height={1} />
    </group>
  );
};
