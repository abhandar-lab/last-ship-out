// __tests__/scoring.test.ts
import { useScoringStore } from '../src/stores/scoringStore';
import { TelemetryEvent, DragTelemetryEvent } from '../src/types/telemetry';

const makeDragEvent = (
  overrides: Partial<DragTelemetryEvent>
): TelemetryEvent =>
  ({
    eventId: 'test-1',
    sessionId: 'sess-1',
    timestampMs: 1000,
    chapter: 1,
    scene: '1A',
    eventType: 'token_drag_end',
    tokenId: 'P06',
    positionStart: [0, 0, 0],
    positionEnd: [1, 0, 1],
    dragDurationMs: 400,
    dragPathLengthPx: 200,
    dragPathDeviation: 1.1,
    dragSpeedPxPerMs: 0.5,
    isFirstInteraction: true,
    timerRemainingMs: 20000,
    ...overrides,
  } as TelemetryEvent);

describe('ScoringEngine', () => {
  beforeEach(() => {
    useScoringStore.getState().resetScores();
  });

  it('should compute prosociality for fast prosocial drag', () => {
    const events: TelemetryEvent[] = [
      makeDragEvent({ tokenId: 'P06', dragDurationMs: 300 }),
    ];
    useScoringStore.getState().computeScoresFromEvents(events);
    const scores = useScoringStore.getState().scores;
    expect(scores['Prosociality']).toBeDefined();
    expect(scores['Prosociality'].rawScore).toBeGreaterThan(0);
  });

  it('should compute dark trait for fast self-serving drag', () => {
    const events: TelemetryEvent[] = [
      makeDragEvent({ tokenId: 'O05', dragDurationMs: 300 }),
    ];
    useScoringStore.getState().computeScoresFromEvents(events);
    const scores = useScoringStore.getState().scores;
    expect(scores['Dark_trait']).toBeDefined();
    expect(scores['Dark_trait'].rawScore).toBeGreaterThan(0);
  });

  it('should compute anxiety for high path deviation', () => {
    const events: TelemetryEvent[] = [
      makeDragEvent({ dragPathDeviation: 1.5 }),
    ];
    useScoringStore.getState().computeScoresFromEvents(events);
    const scores = useScoringStore.getState().scores;
    expect(scores['Anxiety_marker']).toBeDefined();
    expect(scores['Anxiety_marker'].rawScore).toBeGreaterThan(0);
  });

  it('should normalize scores to 0-100 range', () => {
    const events: TelemetryEvent[] = [
      makeDragEvent({ tokenId: 'P06', dragDurationMs: 200 }),
      makeDragEvent({ tokenId: 'P06', dragDurationMs: 250 }),
      makeDragEvent({ tokenId: 'P06', dragDurationMs: 300 }),
    ];
    useScoringStore.getState().computeScoresFromEvents(events);
    const scores = useScoringStore.getState().scores;
    for (const key of Object.keys(scores)) {
      expect(scores[key].normalizedScore).toBeGreaterThanOrEqual(0);
      expect(scores[key].normalizedScore).toBeLessThanOrEqual(100);
    }
  });

  it('should reset scores cleanly', () => {
    const events: TelemetryEvent[] = [makeDragEvent({})];
    useScoringStore.getState().computeScoresFromEvents(events);
    useScoringStore.getState().resetScores();
    expect(Object.keys(useScoringStore.getState().scores).length).toBe(0);
  });
});
