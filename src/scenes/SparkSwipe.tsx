// src/scenes/SparkSwipe.tsx
import React, { useState, useCallback } from 'react';
import { Stars, Environment } from '@react-three/drei';
import { VignetteCard } from '@/components/3d/VignetteCard';
import { Ocean } from '@/components/3d/Ocean';
import { PostFX } from '@/components/effects/PostFX';
import { useCameraAnimation } from '@/hooks/useCameraAnimation';
import { useChoiceStore } from '@/stores/choiceStore';
import { useTelemetryStore } from '@/stores/telemetryStore';
import { useGameStore } from '@/stores/gameStore';
import { VIGNETTES } from '@/data/vignettes';
import { nowMs } from '@/utils/timing';

export const SparkSwipe: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sparked, setSparked] = useState<Set<string>>(new Set());
  const { sparkVignette } = useChoiceStore();
  const { addEvent } = useTelemetryStore();
  const cardAppearMs = React.useRef(nowMs());

  useCameraAnimation({
    keyframes: [{ position: [0, 2, 5], lookAt: [0, 1, 0], duration: 1 }],
    playing: true,
  });

  React.useEffect(() => {
    useGameStore.getState().setScenePhase('active');
  }, []);

  React.useEffect(() => {
    cardAppearMs.current = nowMs();
  }, [currentIndex]);

  const handleSpark = useCallback(
    (id: string) => {
      const now = nowMs();
      const timeToTap = now - cardAppearMs.current;

      setSparked((prev) => new Set(prev).add(id));
      sparkVignette(id);

      addEvent({
        chapter: 1,
        scene: '1C',
        eventType: 'vignette_spark',
        vignetteId: id,
        viewStartMs: cardAppearMs.current,
        tapMs: now,
        timeToTapMs: timeToTap,
      } as any);
    },
    [addEvent, sparkVignette]
  );

  const handleNext = useCallback(() => {
    if (currentIndex < VIGNETTES.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      useGameStore.getState().endScene();
      useGameStore.getState().goToNextScene();
    }
  }, [currentIndex]);

  const vignette = VIGNETTES[currentIndex];

  return (
    <>
      <Environment preset="night" />
      <Stars radius={80} depth={40} count={2000} factor={3} />
      <Ocean color="#0a1a30" opacity={0.7} waveSpeed={0.15} waveHeight={0.05} />

      {vignette && (
        <VignetteCard
          key={vignette.id}
          id={vignette.id}
          description={vignette.description}
          position={[0, 1.5, 0]}
          isSparked={sparked.has(vignette.id)}
          onSpark={handleSpark}
        />
      )}

      {/* "Next" trigger — user taps empty area or a next button in overlay */}
      <mesh
        position={[0, -0.5, 0]}
        onClick={handleNext}
        visible={false}
      >
        <planeGeometry args={[10, 2]} />
      </mesh>

      <PostFX pressureVignette={0} />
    </>
  );
};
