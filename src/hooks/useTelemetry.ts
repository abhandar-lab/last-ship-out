// src/hooks/useTelemetry.ts
import { useCallback } from 'react';
import { useTelemetryStore } from '@/stores/telemetryStore';
import { TelemetryEvent } from '@/types/telemetry';
import { ChapterNumber, SceneId } from '@/types/game';

export const useTelemetry = () => {
  const { addEvent, addEventsBatch, flushToStorage, getSessionSummary } =
    useTelemetryStore();

  const emit = useCallback(
    (
      partial: Omit<TelemetryEvent, 'eventId' | 'sessionId' | 'timestampMs'>
    ) => {
      addEvent(partial);
    },
    [addEvent]
  );

  const emitBatch = useCallback(
    (
      partials: Array<
        Omit<TelemetryEvent, 'eventId' | 'sessionId' | 'timestampMs'>
      >
    ) => {
      addEventsBatch(partials);
    },
    [addEventsBatch]
  );

  const flush = useCallback(() => {
    flushToStorage();
  }, [flushToStorage]);

  return { emit, emitBatch, flush, getSessionSummary };
};
