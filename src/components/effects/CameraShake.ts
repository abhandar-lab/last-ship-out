// src/components/effects/CameraShake.tsx
import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CameraShakeProps {
  /** Trigger value, increment to start a shake. */
  trigger: number;
  duration?: number;
  intensity?: number;
}

export const CameraShake: React.FC<CameraShakeProps> = ({
  trigger,
  duration = 600,
  intensity = 0.2,
}) => {
  const { camera } = useThree();
  const basePosition = useRef(camera.position.clone());
  const startTimeRef = useRef<number | null>(null);
  const shakingRef = useRef(false);
  const lastTriggerRef = useRef(trigger);

  useEffect(() => {
    if (trigger !== lastTriggerRef.current) {
      lastTriggerRef.current = trigger;
      startTimeRef.current = performance.now();
      basePosition.current.copy(camera.position);
      shakingRef.current = true;
    }
  }, [trigger, camera]);

  useFrame(() => {
    if (!shakingRef.current || startTimeRef.current == null) return;
    const now = performance.now();
    const elapsed = now - startTimeRef.current;
    const progress = elapsed / duration;

    if (progress >= 1) {
      shakingRef.current = false;
      camera.position.copy(basePosition.current);
      return;
    }

    const decay = 1 - progress;
    const offsetX = (Math.random() - 0.5) * intensity * decay;
    const offsetY = (Math.random() - 0.5) * intensity * decay;
    const offsetZ = (Math.random() - 0.5) * intensity * decay;

    camera.position.set(
      basePosition.current.x + offsetX,
      basePosition.current.y + offsetY,
      basePosition.current.z + offsetZ
    );
  });

  return null;
};
