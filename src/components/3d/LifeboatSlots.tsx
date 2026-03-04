// src/components/3d/LifeboatSlots.tsx
import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';

export interface LifeboatSlotsProps {
  slotCount?: number;
  radius?: number;
  slotRadius?: number;
  onSlotChange?: (filledSlots: (string | null)[]) => void;
}

export interface LifeboatSlotsAPI {
  getSlotForWorldPosition: (
    worldPosition: [number, number, number]
  ) => { inSlot: boolean; slotIndex?: number };
}

export const useLifeboatSlots = (
  slotCount = 6,
  radius = 1.2,
  slotRadius = 0.35
): LifeboatSlotsAPI => {
  const { scene } = useThree();

  const slots = useMemo(() => {
    const result: THREE.Vector3[] = [];
    const angleStep = (Math.PI * 0.8) / (slotCount - 1);
    const startAngle = -Math.PI * 0.4;
    for (let i = 0; i < slotCount; i++) {
      const angle = startAngle + i * angleStep;
      result.push(
        new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius)
      );
    }
    return result;
  }, [slotCount, radius]);

  const getSlotForWorldPosition = (
    worldPosition: [number, number, number]
  ): { inSlot: boolean; slotIndex?: number } => {
    const point = new THREE.Vector3(...worldPosition);
    let closestIndex: number | undefined;
    let closestDistance = Infinity;

    slots.forEach((slotPos, index) => {
      const dist = slotPos.distanceTo(point);
      if (dist < closestDistance) {
        closestDistance = dist;
        closestIndex = index;
      }
    });

    if (closestIndex != null && closestDistance <= slotRadius) {
      return { inSlot: true, slotIndex: closestIndex };
    }

    return { inSlot: false };
  };

  return { getSlotForWorldPosition };
};

export const LifeboatSlots: React.FC<LifeboatSlotsProps> = ({
  slotCount = 6,
  radius = 1.2,
  slotRadius = 0.35,
}) => {
  const { getSlotForWorldPosition } = useLifeboatSlots(slotCount, radius, slotRadius);

  const positions = useMemo(() => {
    const result: [number, number, number][] = [];
    const angleStep = (Math.PI * 0.8) / (slotCount - 1);
    const startAngle = -Math.PI * 0.4;
    for (let i = 0; i < slotCount; i++) {
      const angle = startAngle + i * angleStep;
      result.push([
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius,
      ]);
    }
    return result;
  }, [slotCount, radius]);

  return (
    <group>
      <mesh receiveShadow>
        <boxGeometry args={[3, 0.2, 1.2]} />
        <meshStandardMaterial color="#3a2a1c" />
      </mesh>
      {positions.map((pos, index) => (
        <mesh key={index} position={pos}>
          <ringGeometry args={[slotRadius * 0.8, slotRadius, 32]} />
          <meshBasicMaterial color="#ffdd88" />
        </mesh>
      ))}
    </group>
  );
};
