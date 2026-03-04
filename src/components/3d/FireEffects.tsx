// src/components/3d/FireEffect.tsx
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FireEffectProps {
  particleCount?: number;
  radius?: number;
  height?: number;
}

export const FireEffect: React.FC<FireEffectProps> = ({
  particleCount = 300,
  radius = 0.4,
  height = 1.2,
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
      const life = (time * 1.5 + seed * 10) % 1;
      const angle = seed * Math.PI * 2;
      const r = radius * (0.3 + 0.7 * seed);
      const x = Math.cos(angle) * r * (1 - life);
      const z = Math.sin(angle) * r * (1 - life);
      const y = life * height;

      dummy.position.set(x, y, z);
      const scale = 0.05 + 0.1 * (1 - life);
      dummy.scale.setScalar(scale);
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
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial
        color="#ffcc66"
        transparent
        opacity={0.8}
      />
    </instancedMesh>
  );
};
