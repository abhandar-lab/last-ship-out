// src/engine/ScoringEngine.ts
import { TelemetryEvent } from '@/types/telemetry';
import { ConstructScore } from '@/types/constructs';
import { useScoringStore } from '@/stores/scoringStore';
import { useTelemetryStore } from '@/stores/telemetryStore';

class ScoringEngine {
  private static _instance: ScoringEngine | null = null;

  static get instance(): ScoringEngine {
    if (!ScoringEngine._instance) {
      ScoringEngine._instance = new ScoringEngine();
    }
    return ScoringEngine._instance;
  }

  computeFromCurrentSession(): Record<string, ConstructScore> {
    const telemetryState = useTelemetryStore.getState();
    const scoringState = useScoringStore.getState();

    const events: TelemetryEvent[] = telemetryState.events;
    scoringState.computeScoresFromEvents(events);

    return useScoringStore.getState().scores;
  }

  getScores(): Record<string, ConstructScore> {
    return useScoringStore.getState().scores;
  }

  reset() {
    useScoringStore.getState().resetScores();
  }
}

export const scoringEngine = ScoringEngine.instance;
