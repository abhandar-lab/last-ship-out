// src/components/3d/Explosion.tsx
import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ExplosionProps {
  trigger: number;
  duration?: number;
  particleCount?: number;
  radius?: number;
}

export const Explosion: React.FC<ExplosionProps> = ({
  trigger,
  duration = 2000,
  particleCount = 200,
  radius = 0.5,
}) => {
  const instanceRef = useRef<THREE.InstancedMesh>(null);
  const startTimeRef = useRef<number | null>(null);
  const lastTriggerRef = useRef(trigger);

  const velocities = useMemo(() => {
    const arr: THREE.Vector3[] = [];
    for (let i = 0; i < particleCount; i++) {
      const dir = new THREE.Vector3(
        (Math.random() - 0.5),
        Math.random(),
        (Math.random() - 0.5)
      ).normalize();
      const speed = 2 + Math.random() * 3;
      arr.push(dir.multiplyScalar(speed));
    }
    return arr;
  }, [particleCount]);

  useEffect(() => {
    if (trigger !== lastTriggerRef.current) {
      lastTriggerRef.current = trigger;
      startTimeRef.current = performance.now();
    }
  }, [trigger]);

  useFrame(() => {
    const mesh = instanceRef.current;
    if (!mesh || startTimeRef.current == null) return;

    const now = performance.now();
    const elapsed = now - startTimeRef.current;
    const t = elapsed / duration;
    mesh.visible = t < 1;
    if (!mesh.visible) return;

    const dummy = new THREE.Object3D();
    for (let i = 0; i < particleCount; i++) {
      const v = velocities[i];
      const timeSeconds = elapsed / 1000;
      const position = new THREE.Vector3(
        v.x * timeSeconds,
        v.y * timeSeconds - 2 * timeSeconds * timeSeconds * 0.5,
        v.z * timeSeconds
      );
      dummy.position.copy(position);
      const s = 0.05 * (1 - t);
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={instanceRef}
      args={[undefined as any, undefined as any, particleCount]}
      visible={false}
    >
      <sphereGeometry args={[radius, 6, 6]} />
      <meshStandardMaterial color="#ffcc88" emissive="#ff7744" />
    </instancedMesh>
  );
};
