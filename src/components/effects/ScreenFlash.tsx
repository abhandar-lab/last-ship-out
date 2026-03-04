// src/components/effects/ScreenFlash.tsx
import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

interface ScreenFlashProps {
  trigger: number;
  duration?: number;
  maxOpacity?: number;
}

export const ScreenFlash: React.FC<ScreenFlashProps> = ({
  trigger,
  duration = 200,
  maxOpacity = 0.9,
}) => {
  const materialRef = useRef<any>(null);
  const startTimeRef = useRef<number | null>(null);
  const lastTriggerRef = useRef(trigger);

  useEffect(() => {
    if (trigger !== lastTriggerRef.current) {
      lastTriggerRef.current = trigger;
      startTimeRef.current = performance.now();
    }
  }, [trigger]);

  useFrame(() => {
    if (!materialRef.current || startTimeRef.current == null) return;
    const now = performance.now();
    const elapsed = now - startTimeRef.current;
    const progress = elapsed / duration;
    if (progress >= 1) {
      materialRef.current.opacity = 0;
      startTimeRef.current = null;
      return;
    }
    const opacity = maxOpacity * (1 - progress);
    materialRef.current.opacity = opacity;
  });

  return (
    <mesh position={[0, 0, -1]}>
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial
        ref={materialRef}
        color="white"
        transparent
        opacity={0}
      />
    </mesh>
  );
};
