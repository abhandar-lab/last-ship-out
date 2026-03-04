// __tests__/telemetry.test.ts
jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn().mockImplementation(() => ({
    getString: jest.fn().mockReturnValue(undefined),
    set: jest.fn(),
    delete: jest.fn(),
  })),
}));

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('test-uuid'),
}));

import { useTelemetryStore } from '../src/stores/telemetryStore';

describe('TelemetryStore', () => {
  beforeEach(() => {
    useTelemetryStore.getState().clear();
  });

  it('should start with empty events', () => {
    expect(useTelemetryStore.getState().events.length).toBe(0);
  });

  it('should add events with auto-generated fields', () => {
    useTelemetryStore.getState().addEvent({
      chapter: 1,
      scene: '1A',
      eventType: 'token_touch_start',
      tokenId: 'P01',
    } as any);

    const events = useTelemetryStore.getState().events;
    expect(events.length).toBe(1);
    expect(events[0].eventId).toBe('test-uuid');
    expect(events[0].sessionId).toBeDefined();
    expect(events[0].timestampMs).toBeGreaterThan(0);
  });

  it('should batch add events', () => {
    useTelemetryStore.getState().addEventsBatch([
      { chapter: 1, scene: '1A', eventType: 'token_touch_start', tokenId: 'P01' } as any,
      { chapter: 1, scene: '1A', eventType: 'token_drag_end', tokenId: 'P02' } as any,
    ]);

    expect(useTelemetryStore.getState().events.length).toBe(2);
  });

  it('should track completed scenes', () => {
    useTelemetryStore.getState().markSceneCompleted('1A');
    useTelemetryStore.getState().markSceneCompleted('1A'); // duplicate
    useTelemetryStore.getState().markSceneCompleted('1B');
    expect(useTelemetryStore.getState().scenesCompleted).toEqual(['1A', '1B']);
  });

  it('should generate session summary', () => {
    useTelemetryStore.getState().addEvent({
      chapter: 1, scene: '1A', eventType: 'token_touch_start', tokenId: 'P01',
    } as any);
    useTelemetryStore.getState().markSceneCompleted('1A');

    const summary = useTelemetryStore.getState().getSessionSummary();
    expect(summary.sessionId).toBeDefined();
    expect(summary.totalEvents).toBe(1);
    expect(summary.scenesCompleted).toEqual(['1A']);
    expect(summary.totalDurationMs).toBeGreaterThanOrEqual(0);
  });

  it('should clear all state', () => {
    useTelemetryStore.getState().addEvent({
      chapter: 1, scene: '1A', eventType: 'token_touch_start', tokenId: 'P01',
    } as any);
    useTelemetryStore.getState().markSceneCompleted('1A');
    useTelemetryStore.getState().clear();

    expect(useTelemetryStore.getState().events.length).toBe(0);
    expect(useTelemetryStore.getState().scenesCompleted.length).toBe(0);
  });
});
