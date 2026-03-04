// src/components/3d/Ocean.tsx
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface OceanProps {
  color?: string;
  opacity?: number;
  waveSpeed?: number;
  waveHeight?: number;
}

export const Ocean: React.FC<OceanProps> = ({
  color = '#1a3a5c',
  opacity = 0.85,
  waveSpeed = 0.4,
  waveHeight = 0.15,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const geo = mesh.geometry as THREE.PlaneGeometry;
    const positions = geo.attributes.position;
    const time = clock.getElapsedTime() * waveSpeed;

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);
      const y =
        Math.sin(x * 0.5 + time) * waveHeight +
        Math.sin(z * 0.3 + time * 1.3) * waveHeight * 0.6;
      positions.setY(i, y);
    }
    positions.needsUpdate = true;
    geo.computeVertexNormals();
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <planeGeometry args={[40, 40, 64, 64]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={opacity}
        roughness={0.2}
        metalness={0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};
