// src/scenes/FutureRaft.tsx
import React, { useState, useCallback } from 'react';
import { Environment, Stars } from '@react-three/drei';
import { FutureCard } from '@/components/3d/FutureCard';
import { Ocean } from '@/components/3d/Ocean';
import { PostFX } from '@/components/effects/PostFX';
import { useCameraAnimation } from '@/hooks/useCameraAnimation';
import { useChoiceStore } from '@/stores/choiceStore';
import { useTelemetryStore } from '@/stores/telemetryStore';
import { useGameStore } from '@/stores/gameStore';
import { TOKENS_3C } from '@/data/tokens';
import { nowMs } from '@/utils/timing';

export const FutureRaft: React.FC = () => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const { selectFutureCard, deselectFutureCard } = useChoiceStore();
  const { addEvent } = useTelemetryStore();

  useCameraAnimation({
    keyframes: [{ position: [0, 2, 6], lookAt: [0, 1.5, 0], duration: 2 }],
    playing: true,
    onComplete: () => useGameStore.getState().setScenePhase('active'),
  });

  const handleToggle = useCallback(
    (id: string) => {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
          deselectFutureCard(id);
          addEvent({
            chapter: 3,
            scene: '3C',
            eventType: 'future_card_deselect',
            cardId: id,
          } as any);
        } else {
          if (next.size >= 2) return prev;
          next.add(id);
          selectFutureCard(id);
          addEvent({
            chapter: 3,
            scene: '3C',
            eventType: 'future_card_select',
            cardId: id,
          } as any);
        }
        return next;
      });
    },
    [selectFutureCard, deselectFutureCard, addEvent]
  );

  const cardPositions: [number, number, number][] = [
    [-3.2, 1.5, 0],
    [-1.6, 1.5, 0],
    [0, 1.5, 0],
    [1.6, 1.5, 0],
    [3.2, 1.5, 0],
  ];

  return (
    <>
      <Environment preset="dawn" />
      <Stars radius={80} depth={40} count={1500} factor={3} />
      <Ocean color="#1a3a5c" opacity={0.85} waveSpeed={0.3} waveHeight={0.1} />

      <directionalLight position={[4, 6, 3]} intensity={1.2} color="#ffeedd" />
      <ambientLight intensity={0.3} />

      {TOKENS_3C.map((card, index) => (
        <FutureCard
          key={card.id}
          id={card.id}
          title={card.label}
          subtext={card.description}
          position={cardPositions[index]}
          isSelected={selectedIds.has(card.id)}
          onToggle={handleToggle}
        />
      ))}

      <PostFX pressureVignette={0} />
    </>
  );
};
