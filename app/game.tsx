// app/game.tsx snippet inside GameScreen component
import { SCENE_CONFIGS } from '@/types/game';
import { useGameStore } from '@/stores/gameStore';
import { useTelemetryStore } from '@/stores/telemetryStore';
import { Timer } from '@/components/ui/Timer';

// ...

const GameScreen: React.FC = () => {
  const scene = useGameStore((s) => s.scene);
  const timerRemainingMs = useGameStore((s) => s.timerRemainingMs);

  const totalMs = SCENE_CONFIGS[scene].timerDurationMs ?? 0;

  return (
    <GestureHandlerRootView style={styles.root}>
      <View style={styles.container}>
        <Canvas
          camera={{ fov: 45, near: 0.1, far: 100, position: [0, 5, 8] }}
          shadows
        >
          {/* ...lights... */}
          {scene === '1A' && <ShipInterior />}
        </Canvas>
        {totalMs > 0 && timerRemainingMs > 0 && (
          <Timer remainingMs={timerRemainingMs} totalMs={totalMs} />
        )}
        <StatusBar style="light" />
      </View>
    </GestureHandlerRootView>
  );
};
