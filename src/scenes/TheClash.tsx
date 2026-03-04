// src/scenes/TheClash.tsx
import React, { useState, useCallback, useRef } from 'react';
import { Environment, Stars } from '@react-three/drei';
import { Ocean } from '@/components/3d/Ocean';
import { ShipmateNPC } from '@/components/3d/ShipmateNPC';
import { PostFX } from '@/components/effects/PostFX';
import { useCameraAnimation } from '@/hooks/useCameraAnimation';
import { useChoiceStore } from '@/stores/choiceStore';
import { useTelemetryStore } from '@/stores/telemetryStore';
import { useGameStore } from '@/stores/gameStore';
import { DIALOGUE_TREE, shouldShowTurn2, getTurn } from '@/data/dialogueTree';
import { nowMs } from '@/utils/timing';

interface ClashOverlayProps {
  turn: number;
  turn1Choice: string | null;
  onChoose: (choiceId: string) => void;
}

export const TheClash: React.FC = () => {
  const [turn, setTurn] = useState(1);
  const [turn1Choice, setTurn1Choice] = useState<string | null>(null);
  const [expression, setExpression] = useState<'neutral' | 'tense' | 'softened'>('neutral');
  const optionsAppearMs = useRef(nowMs());
  const { addDialogueChoice } = useChoiceStore();
  const { addEvent } = useTelemetryStore();

  useCameraAnimation({
    keyframes: [{ position: [0, 1.8, 3.5], lookAt: [0, 1.4, 0], duration: 1.5 }],
    playing: true,
    onComplete: () => {
      useGameStore.getState().setScenePhase('active');
      optionsAppearMs.current = nowMs();
    },
  });

  const handleChoose = useCallback(
    (choiceId: string) => {
      const now = nowMs();
      const timeToChoose = now - optionsAppearMs.current;

      addDialogueChoice(choiceId);
      addEvent({
        chapter: 3,
        scene: '3A',
        eventType: 'dialogue_choice',
        choiceId,
        timeToChooseMs: timeToChoose,
        turn,
      } as any);

      if (turn === 1) {
        setTurn1Choice(choiceId);
        if (shouldShowTurn2(choiceId)) {
          setTurn(2);
          setExpression('tense');
          optionsAppearMs.current = nowMs();
        } else {
          setExpression('softened');
          setTimeout(() => {
            useGameStore.getState().endScene();
            useGameStore.getState().goToNextScene();
          }, 1500);
        }
      } else {
        setExpression('softened');
        setTimeout(() => {
          useGameStore.getState().endScene();
          useGameStore.getState().goToNextScene();
        }, 1500);
      }
    },
    [turn, addDialogueChoice, addEvent]
  );

  // Expose current turn data — the DialogueBox overlay reads from gameStore
  const currentTurn = getTurn(turn);

  return (
    <>
      <Environment preset="dawn" />
      <Stars radius={60} depth={30} count={1000} factor={2} />
      <Ocean color="#1a3050" opacity={0.8} waveSpeed={0.25} waveHeight={0.1} />

      {/* Golden dawn light */}
      <directionalLight position={[5, 4, 2]} intensity={0.8} color="#ffd080" />

      <ShipmateNPC position={[0, 0, 0]} expression={expression} />

      <PostFX pressureVignette={0} />
    </>
  );
};

// Export turn data for the overlay in game.tsx
export { getTurn, shouldShowTurn2 };
