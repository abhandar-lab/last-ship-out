// src/components/3d/SmokeEffect.tsx
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SmokeEffectProps {
  particleCount?: number;
  radius?: number;
  height?: number;
}

export const SmokeEffect: React.FC<SmokeEffectProps> = ({
  particleCount = 120,
  radius = 0.6,
  height = 2,
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const seeds = useMemo(
    () => Array.from({ length: particleCount }, () => Math.random()),
    [particleCount]
  );

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const time = clock.getElapsedTime();
    const dummy = new THREE.Object3D();

    for (let i = 0; i < particleCount; i++) {
      const seed = seeds[i];
      const life = (time * 0.5 + seed * 10) % 1;
      const angle = seed * Math.PI * 2;
      const r = radius * (0.4 + 0.6 * seed);
      const x = Math.cos(angle) * r * (1 - life * 0.5);
      const z = Math.sin(angle) * r * (1 - life * 0.5);
      const y = life * height;

      dummy.position.set(x, y, z);
      const scale = 0.3 + 0.5 * life;
      dummy.scale.set(scale, scale * 0.8, scale);
      dummy.rotation.y = angle;
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined as any, undefined as any, particleCount]}
    >
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial
        color="#555555"
        transparent
        opacity={0.5}
      />
    </instancedMesh>
  );
};
