// __tests__/consistency.test.ts
import { consistencyChecker } from '../src/engine/ConsistencyChecker';
import { ConstructScore } from '../src/types/constructs';

const makeScore = (
  construct: string,
  normalizedScore: number,
  confidence = 0.8
): ConstructScore => ({
  construct,
  rawScore: normalizedScore / 10,
  normalizedScore,
  confidence,
  evidenceCount: 5,
  evidenceSources: ['1A', '2A'],
});

describe('ConsistencyChecker', () => {
  it('should flag contradictory high scores', () => {
    const scores: Record<string, ConstructScore> = {
      Prosociality: makeScore('Prosociality', 85),
      Dark_trait: makeScore('Dark_trait', 80),
    };

    const results = consistencyChecker.check(scores);
    const flagged = results.filter((r) => !r.isConsistent);
    expect(flagged.length).toBe(2);
    expect(flagged[0].contradictions.length).toBeGreaterThan(0);
  });

  it('should not flag when one score is low', () => {
    const scores: Record<string, ConstructScore> = {
      Prosociality: makeScore('Prosociality', 85),
      Dark_trait: makeScore('Dark_trait', 30),
    };

    const results = consistencyChecker.check(scores);
    const flagged = results.filter((r) => !r.isConsistent);
    expect(flagged.length).toBe(0);
  });

  it('should reduce confidence for contradictions', () => {
    const scores: Record<string, ConstructScore> = {
      Security: makeScore('Security', 90, 0.8),
      Risk_tolerance: makeScore('Risk_tolerance', 85, 0.8),
    };

    const adjusted = consistencyChecker.applyToScores(scores);
    expect(adjusted['Security'].confidence).toBeLessThan(0.8);
    expect(adjusted['Risk_tolerance'].confidence).toBeLessThan(0.8);
  });

  it('should preserve confidence for consistent scores', () => {
    const scores: Record<string, ConstructScore> = {
      HEXACO_C: makeScore('HEXACO_C', 70, 0.9),
      HEXACO_A: makeScore('HEXACO_A', 65, 0.85),
    };

    const adjusted = consistencyChecker.applyToScores(scores);
    expect(adjusted['HEXACO_C'].confidence).toBe(0.9);
    expect(adjusted['HEXACO_A'].confidence).toBe(0.85);
  });
});
