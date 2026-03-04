// src/stores/scoringStore.ts
import { create } from 'zustand';
import { TelemetryEvent } from '@/types/telemetry';
import { ConstructScore, ConstructId } from '@/types/constructs';
import { SceneId } from '@/types/game';

interface ScoringState {
  scores: Record<ConstructId, ConstructScore>;
  lastComputedAtMs: number | null;
  computeScoresFromEvents: (events: TelemetryEvent[]) => void;
  resetScores: () => void;
}

export const useScoringStore = create<ScoringState>((set) => ({
  scores: {} as Record<ConstructId, ConstructScore>,
  lastComputedAtMs: null,

  computeScoresFromEvents: (events) => {
    const raw: Record<ConstructId, ConstructScore> = {} as any;

    const ensure = (id: ConstructId): ConstructScore => {
      if (!raw[id]) {
        raw[id] = {
          construct: id,
          rawScore: 0,
          normalizedScore: 0,
          confidence: 0,
          evidenceCount: 0,
          evidenceSources: [],
        };
      }
      return raw[id];
    };

    const mark = (
      id: ConstructId,
      delta: number,
      scene: SceneId
    ) => {
      const cs = ensure(id);
      cs.rawScore += delta;
      cs.evidenceCount += 1;
      if (!cs.evidenceSources.includes(scene)) {
        cs.evidenceSources.push(scene);
      }
    };

    // Walk telemetry and apply very simple weights – you will refine this
    for (const ev of events) {
      switch (ev.eventType) {
        case 'token_drag_end': {
          const { tokenId, dragDurationMs, dragPathDeviation, timerRemainingMs, scene } =
            ev;
          if (!tokenId) break;

          const fast = dragDurationMs && dragDurationMs < 500;
          const highDeviation = dragPathDeviation && dragPathDeviation > 1.2;

          const isProsocialToken = ['P06', 'P07', 'L04'].includes(tokenId);
          const isSelfServingToken = ['O05', 'R04'].includes(tokenId);

          if (isProsocialToken && fast) mark('Prosociality', 1.3, scene);
          if (isSelfServingToken && fast) mark('Dark_trait', 1.3, scene);
          if (highDeviation) mark('Anxiety_marker', 1, scene);

          if (timerRemainingMs && timerRemainingMs > 15000) {
            mark('Decisiveness', 0.5, scene);
          }

          break;
        }

        case 'token_hover_end': {
          const { hoverDurationMs, tokenId, scene } = ev;
          if (!hoverDurationMs || !tokenId) break;
          if (hoverDurationMs > 3000) {
            mark('Conflict_marker', 1, scene);
          }
          break;
        }

        case 'scene_summary': {
          const { tokensNeverTouched, scene } = ev;
          if (tokensNeverTouched && tokensNeverTouched.length > 0) {
            for (const tid of tokensNeverTouched) {
              // Very rough negative signal
              mark('Avoidance_marker', 0.5, scene);
            }
          }
          break;
        }

        case 'keystroke_summary': {
          const {
            backspaceRate,
            ikiVariance,
            longestPauseMs,
            scene,
          } = ev as any;
          if (backspaceRate && backspaceRate > 0.3) {
            mark('Self_editing', 1, scene);
          }
          if (ikiVariance && ikiVariance > 0.5) {
            mark('Emotional_intensity', 1, scene);
          }
          if (longestPauseMs && longestPauseMs > 3000) {
            mark('Rumination', 1, scene);
          }
          break;
        }

        default:
          break;
      }
    }

    // Normalize 0–100 and confidence
    const scores: Record<ConstructId, ConstructScore> = {} as any;
    const now = Date.now();
    const entries = Object.entries(raw) as [ConstructId, ConstructScore][];
    const maxAbs =
      entries.reduce((m, [, cs]) => Math.max(m, Math.abs(cs.rawScore)), 0) || 1;

    for (const [id, cs] of entries) {
      const normalized =
        ((cs.rawScore / maxAbs) * 50 + 50); // map [-max,max] to [0,100]
      const evidenceScenes = cs.evidenceSources.length;
      const evidenceCount = cs.evidenceCount;
      const confidenceBase = Math.min(1, evidenceCount / 10);
      const consistencyModifier = 1; // placeholder – plug in ConsistencyChecker later

      scores[id] = {
        ...cs,
        normalizedScore: Math.max(0, Math.min(100, normalized)),
        confidence: confidenceBase * consistencyModifier,
        evidenceCount,
      };
    }

    set({ scores, lastComputedAtMs: now });
  },

  resetScores: () => set({ scores: {} as any, lastComputedAtMs: null }),
}));
