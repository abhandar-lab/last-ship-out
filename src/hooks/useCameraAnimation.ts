// src/hooks/useCameraAnimation.ts
import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { lerp } from '@/utils/math';

interface CameraKeyframe {
  position: [number, number, number];
  lookAt: [number, number, number];
  duration: number;
}

interface UseCameraAnimationParams {
  keyframes: CameraKeyframe[];
  playing: boolean;
  onComplete?: () => void;
}

export const useCameraAnimation = ({
  keyframes,
  playing,
  onComplete,
}: UseCameraAnimationParams) => {
  const { camera } = useThree();
  const currentIndex = useRef(0);
  const elapsed = useRef(0);
  const completed = useRef(false);
  const lookAtTarget = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    if (!playing || completed.current || keyframes.length === 0) return;

    const kf = keyframes[currentIndex.current];
    if (!kf) return;

    elapsed.current += delta;
    const t = Math.min(elapsed.current / kf.duration, 1);
    const eased = t * t * (3 - 2 * t); // smoothstep

    const prevPos =
      currentIndex.current > 0
        ? keyframes[currentIndex.current - 1].position
        : [camera.position.x, camera.position.y, camera.position.z] as [number, number, number];
    const prevLookAt =
      currentIndex.current > 0
        ? keyframes[currentIndex.current - 1].lookAt
        : [0, 0, 0] as [number, number, number];

    camera.position.set(
      lerp(prevPos[0], kf.position[0], eased),
      lerp(prevPos[1], kf.position[1], eased),
      lerp(prevPos[2], kf.position[2], eased)
    );

    lookAtTarget.current.set(
      lerp(prevLookAt[0], kf.lookAt[0], eased),
      lerp(prevLookAt[1], kf.lookAt[1], eased),
      lerp(prevLookAt[2], kf.lookAt[2], eased)
    );
    camera.lookAt(lookAtTarget.current);

    if (t >= 1) {
      elapsed.current = 0;
      currentIndex.current += 1;
      if (currentIndex.current >= keyframes.length) {
        completed.current = true;
        onComplete?.();
      }
    }
  });

  const reset = () => {
    currentIndex.current = 0;
    elapsed.current = 0;
    completed.current = false;
  };

  return { reset };
};
