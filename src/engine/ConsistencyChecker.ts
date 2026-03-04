// src/engine/ConsistencyChecker.ts
import { ConstructScore, ConstructId } from '@/types/constructs';

interface ConsistencyResult {
  construct: ConstructId;
  isConsistent: boolean;
  contradictions: string[];
  confidenceModifier: number;
}

class ConsistencyChecker {
  private static _instance: ConsistencyChecker | null = null;
  static get instance(): ConsistencyChecker {
    if (!ConsistencyChecker._instance) {
      ConsistencyChecker._instance = new ConsistencyChecker();
    }
    return ConsistencyChecker._instance;
  }

  private contradictionPairs: [ConstructId, ConstructId][] = [
    ['Prosociality', 'Dark_trait'],
    ['Security', 'Risk_tolerance'],
    ['Conflict_avoid', 'Conflict_compete'],
    ['Avoidant_attach', 'Anxious_attach'],
    ['Self_silencing', 'Secure_communication'],
    ['Contempt', 'HEXACO_A'],
  ];

  check(scores: Record<string, ConstructScore>): ConsistencyResult[] {
    const results: ConsistencyResult[] = [];

    for (const [a, b] of this.contradictionPairs) {
      const scoreA = scores[a];
      const scoreB = scores[b];
      if (!scoreA || !scoreB) continue;

      const bothHigh = scoreA.normalizedScore > 70 && scoreB.normalizedScore > 70;

      if (bothHigh) {
        const contradiction = `${a} (${scoreA.normalizedScore.toFixed(0)}) and ${b} (${scoreB.normalizedScore.toFixed(0)}) are both high`;

        results.push({
          construct: a,
          isConsistent: false,
          contradictions: [contradiction],
          confidenceModifier: 0.9,
        });
        results.push({
          construct: b,
          isConsistent: false,
          contradictions: [contradiction],
          confidenceModifier: 0.9,
        });
      }
    }

    const allConstructs = Object.keys(scores) as ConstructId[];
    for (const id of allConstructs) {
      const existing = results.find((r) => r.construct === id);
      if (!existing) {
        results.push({
          construct: id,
          isConsistent: true,
          contradictions: [],
          confidenceModifier: 1.0,
        });
      }
    }

    return results;
  }

  applyToScores(
    scores: Record<string, ConstructScore>
  ): Record<string, ConstructScore> {
    const results = this.check(scores);
    const updated = { ...scores };

    for (const result of results) {
      const score = updated[result.construct];
      if (!score) continue;
      updated[result.construct] = {
        ...score,
        confidence: score.confidence * result.confidenceModifier,
      };
    }

    return updated;
  }
}

export const consistencyChecker = ConsistencyChecker.instance;
