// src/hooks/useGameTimer.ts
import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '@/stores/gameStore';
import { useTelemetryStore } from '@/stores/telemetryStore';
import { SceneId } from '@/types/game';
import { nowMs } from '@/utils/timing';

interface UseGameTimerParams {
  sceneId: SceneId;
  onExpire: () => void;
}

export const useGameTimer = ({ sceneId, onExpire }: UseGameTimerParams) => {
  const {
    scene,
    scenePhase,
    timerRemainingMs,
    isTimerActive,
    isPaused,
    setTimerRemainingMs,
    tickTimer,
  } = useGameStore();

  const { addEvent } = useTelemetryStore();
  const lastFrameTimeRef = useRef<number | null>(null);
  const hasExpiredRef = useRef(false);

  useEffect(() => {
    if (scene !== sceneId) return;
    hasExpiredRef.current = false;
    lastFrameTimeRef.current = null;
  }, [scene, sceneId]);

  useFrame(() => {
    if (scene !== sceneId) return;
    if (!isTimerActive || isPaused || scenePhase !== 'active') return;

    const now = nowMs();
    if (lastFrameTimeRef.current == null) {
      lastFrameTimeRef.current = now;
      return;
    }

    const delta = now - lastFrameTimeRef.current;
    lastFrameTimeRef.current = now;

    tickTimer(delta);

    const updatedRemaining = useGameStore.getState().timerRemainingMs;
    if (!hasExpiredRef.current && updatedRemaining <= 0) {
      hasExpiredRef.current = true;
      addEvent({
        chapter: useGameStore.getState().chapter,
        scene: sceneId,
        eventType: 'scene_summary',
        sceneStartMs: 0,
        sceneEndMs: now,
        sceneDurationMs: 0,
        tokensPlaced: [],
        tokensRemoved: [],
        tokensNeverTouched: [],
        totalDragCount: 0,
        totalHoverCount: 0,
        pickPutBackCount: {},
      });
      onExpire();
    }
  });

  useEffect(() => {
    if (scene !== sceneId) return;
    if (timerRemainingMs === 0 && !hasExpiredRef.current && isTimerActive === false) {
      hasExpiredRef.current = true;
      onExpire();
    }
  }, [scene, sceneId, timerRemainingMs, isTimerActive, onExpire]);

  return {
    timerRemainingMs,
    isTimerActive,
    isPaused,
    percentageRemaining:
      useGameStore.getState().scene &&
      useGameStore.getState().scene === sceneId &&
      useGameStore.getState().timerRemainingMs >= 0
        ? timerRemainingMs
        : 0,
  };
};
