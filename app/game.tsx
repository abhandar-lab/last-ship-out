// app/game.tsx
import React, { useCallback, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Canvas } from '@react-three/fiber';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useGameStore } from '@/stores/gameStore';
import { useTelemetryStore } from '@/stores/telemetryStore';
import { useAudio } from '@/hooks/useAudio';
import { SCENE_CONFIGS } from '@/types/game';

import { ShipInterior } from '@/scenes/ShipInterior';
import { ComfortPack } from '@/scenes/ComfortPack';
import { SparkSwipe } from '@/scenes/SparkSwipe';
import { LastSlot } from '@/scenes/LastSlot';
import { BurningDeck } from '@/scenes/BurningDeck';
import { TheClash } from '@/scenes/TheClash';
import { OneSentence } from '@/scenes/OneSentence';
import { FutureRaft } from '@/scenes/FutureRaft';

import { Timer } from '@/components/ui/Timer';
import { HUD } from '@/components/ui/HUD';
import { NarratorText } from '@/components/ui/NarratorText';
import { TransitionScreen } from '@/components/ui/TransitionScreen';
import { DialogueBox } from '@/components/ui/DialogueBox';
import { TextInput3D } from '@/components/ui/TextInput3D';

import { getTurn, shouldShowTurn2 } from '@/data/dialogueTree';

const SCENE_MUSIC: Record<string, string> = {
  '1A': 'chapter1A_urgency',
  '1B': 'chapter1B_calm',
  '1C': 'chapter1C_reflective',
  '2A': 'chapter2A_heartbeat',
  '2B': 'chapter2B_fire',
  '3A': 'chapter3A_tense',
  '3B': 'chapter3B_gentle',
  '3C': 'chapter3C_dawn',
};

const NARRATOR_TEXTS: Record<string, string> = {
  '1A_outro': "You've secured the essentials. But what about what keeps you sane?",
  '1B_outro': "Comfort chosen. Now — what sparks something deeper?",
  '1C_outro': "You know what moves you. But choices are about to get harder.",
  '2A_outro': "One seat. One choice. The weight stays with you.",
  '2B_outro': "What you burn says as much as what you keep.",
  '3A_outro': "How you fight reveals how you love.",
  '3B_outro': "Honesty is its own kind of courage.",
};

export default function GameScreen() {
  const router = useRouter();
  const scene = useGameStore((s) => s.scene);
  const phase = useGameStore((s) => s.phase);
  const scenePhase = useGameStore((s) => s.scenePhase);
  const timerRemainingMs = useGameStore((s) => s.timerRemainingMs);
  const { flushToStorage, markSceneCompleted } = useTelemetryStore();
  const { playMusic, fadeOutMusic } = useAudio();

  // Music per scene
  useEffect(() => {
    const musicKey = SCENE_MUSIC[scene];
    if (musicKey) {
      playMusic(musicKey as any);
    }
    return () => {
      fadeOutMusic(500);
    };
  }, [scene, playMusic, fadeOutMusic]);

  // Flush telemetry on scene transitions
  useEffect(() => {
    if (scenePhase === 'outro') {
      markSceneCompleted(scene);
      flushToStorage();
    }
  }, [scenePhase, scene, markSceneCompleted, flushToStorage]);

  // Navigate to results when scoring phase
  useEffect(() => {
    if (phase === 'scoring') {
      flushToStorage();
      router.replace('/results');
    }
  }, [phase, router, flushToStorage]);

  const totalMs = SCENE_CONFIGS[scene]?.timerDurationMs ?? 0;
  const showTimer = totalMs > 0 && scenePhase === 'active' && timerRemainingMs > 0;

  // Dialogue state for 3A
  const [dialogueTurn, setDialogueTurn] = React.useState(1);
  const [turn1Choice, setTurn1Choice] = React.useState<string | null>(null);
  const currentDialogueTurn = scene === '3A' ? getTurn(dialogueTurn) : null;

  const handleDialogueChoose = useCallback(
    (choiceId: string) => {
      if (dialogueTurn === 1) {
        setTurn1Choice(choiceId);
        if (shouldShowTurn2(choiceId)) {
          setDialogueTurn(2);
        } else {
          useGameStore.getState().endScene();
          useGameStore.getState().goToNextScene();
        }
      } else {
        useGameStore.getState().endScene();
        useGameStore.getState().goToNextScene();
      }
    },
    [dialogueTurn]
  );

  const handleTextSubmit = useCallback((text: string) => {
    useGameStore.getState().endScene();
    useGameStore.getState().goToNextScene();
  }, []);

  const waterProgress =
    scene === '1A' && totalMs > 0 ? 1 - timerRemainingMs / totalMs : 0;

  const narratorKey = `${scene}_outro`;
  const showNarrator = scenePhase === 'outro' && NARRATOR_TEXTS[narratorKey];

  return (
    <View style={styles.container}>
      <Canvas
        camera={{ fov: 45, near: 0.1, far: 100, position: [0, 5, 8] }}
        shadows
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 10, 5]} intensity={0.8} castShadow />

        {scene === '1A' && <ShipInterior />}
        {scene === '1B' && <ComfortPack />}
        {scene === '1C' && <SparkSwipe />}
        {scene === '2A' && <LastSlot />}
        {scene === '2B' && <BurningDeck />}
        {scene === '3A' && <TheClash />}
        {scene === '3B' && <OneSentence />}
        {scene === '3C' && <FutureRaft />}
      </Canvas>

      {/* Timer overlay */}
      {showTimer && <Timer remainingMs={timerRemainingMs} totalMs={totalMs} />}

      {/* HUD */}
      <HUD waterProgress={waterProgress} />

      {/* Narrator text on scene transitions */}
      {showNarrator && (
        <NarratorText
          text={NARRATOR_TEXTS[narratorKey]!}
          visible
          delayMs={300}
          durationMs={800}
        />
      )}

      {/* Transition between chapters */}
      <TransitionScreen
        title={
          scene === '2A'
            ? 'Chapter 2 — The Choices That Hurt'
            : scene === '3A'
            ? 'Chapter 3 — Not Just You Alone'
            : ''
        }
        visible={
          (scene === '2A' || scene === '3A') && scenePhase === 'intro'
        }
        durationMs={3000}
        onComplete={() => useGameStore.getState().setScenePhase('active')}
      />

      {/* Dialogue overlay for 3A */}
      {scene === '3A' && scenePhase === 'active' && currentDialogueTurn && (
        <DialogueBox
          speaker="Shipmate"
          text={currentDialogueTurn.text}
          options={currentDialogueTurn.options.map((o) => ({
            id: o.id,
            text: o.text,
          }))}
          onChoose={handleDialogueChoose}
        />
      )}

      {/* Text input for 3B */}
      {scene === '3B' && scenePhase === 'active' && (
        <TextInput3D
          prompt="In one sentence — what are you most afraid of losing?"
          onSubmit={handleTextSubmit}
        />
      )}

      {/* "Set Sail" button for 3C is handled inside FutureRaft via choiceStore */}

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0f1a',
  },
});
