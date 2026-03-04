// src/hooks/useSceneTimerController.ts
import { useCallback, useEffect } from 'react';
import { SceneId } from '@/types/game';
import { useGameStore } from '@/stores/gameStore';
import { useGameTimer } from '@/hooks/useGameTimer';

interface UseSceneTimerControllerParams {
  sceneId: SceneId;
  autoStartOnPhaseActive?: boolean;
  onExpire: () => void;
}

export const useSceneTimerController = ({
  sceneId,
  autoStartOnPhaseActive = true,
  onExpire,
}: UseSceneTimerControllerParams) => {
  const { scene, scenePhase, setScenePhase, setTimerActive } = useGameStore();

  const handleExpire = useCallback(() => {
    onExpire();
  }, [onExpire]);

  const timer = useGameTimer({ sceneId, onExpire: handleExpire });

  useEffect(() => {
    if (scene !== sceneId) return;
    if (scenePhase === 'intro' && autoStartOnPhaseActive) {
      setScenePhase('active');
      if (timer.timerRemainingMs > 0) {
        setTimerActive(true);
      }
    }
  }, [
    scene,
    sceneId,
    scenePhase,
    autoStartOnPhaseActive,
    setScenePhase,
    setTimerActive,
    timer.timerRemainingMs,
  ]);

  return timer;
};
