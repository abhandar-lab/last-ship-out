// src/stores/telemetryStore.ts
import { create } from 'zustand';
import { MMKV } from 'react-native-mmkv';
import { v4 as uuidv4 } from 'uuid';
import { TelemetryEvent, SessionSummary } from '@/types/telemetry';
import { SceneId, ChapterNumber } from '@/types/game';
import { nowMs } from '@/utils/timing';

const storage = new MMKV({ id: 'telemetry-buffer' });

interface TelemetryState {
  sessionId: string;
  sessionStartMs: number;
  events: TelemetryEvent[];
  scenesCompleted: SceneId[];
  abandonedScene?: SceneId;
  setAbandonedScene: (scene: SceneId) => void;
  addEvent: (event: Omit<TelemetryEvent, 'eventId' | 'sessionId' | 'timestampMs'>) => void;
  addEventsBatch: (
    events: Array<Omit<TelemetryEvent, 'eventId' | 'sessionId' | 'timestampMs'>>
  ) => void;
  markSceneCompleted: (scene: SceneId) => void;
  flushToStorage: () => void;
  clear: () => void;
  getSessionSummary: () => SessionSummary;
}

const TELEMETRY_KEY = 'telemetry_events';
const SESSION_META_KEY = 'telemetry_session_meta';

interface StoredTelemetryPayload {
  sessionId: string;
  events: TelemetryEvent[];
}

interface SessionMeta {
  sessionId: string;
  sessionStartMs: number;
  scenesCompleted: SceneId[];
  abandonedScene?: SceneId;
}

export const useTelemetryStore = create<TelemetryState>((set, get) => {
  const initialSessionId = uuidv4();
  const initialStartMs = nowMs();

  const seedFromStorage = (): {
    sessionId: string;
    sessionStartMs: number;
    scenesCompleted: SceneId[];
    abandonedScene?: SceneId;
    events: TelemetryEvent[];
  } => {
    try {
      const metaRaw = storage.getString(SESSION_META_KEY);
      const eventsRaw = storage.getString(TELEMETRY_KEY);

      if (!metaRaw || !eventsRaw) {
        return {
          sessionId: initialSessionId,
          sessionStartMs: initialStartMs,
          scenesCompleted: [],
          abandonedScene: undefined,
          events: [],
        };
      }

      const meta = JSON.parse(metaRaw) as SessionMeta;
      const payload = JSON.parse(eventsRaw) as StoredTelemetryPayload;

      if (meta.sessionId !== payload.sessionId) {
        return {
          sessionId: initialSessionId,
          sessionStartMs: initialStartMs,
          scenesCompleted: [],
          abandonedScene: undefined,
          events: [],
        };
      }

      return {
        sessionId: meta.sessionId,
        sessionStartMs: meta.sessionStartMs,
        scenesCompleted: meta.scenesCompleted,
        abandonedScene: meta.abandonedScene,
        events: payload.events,
      };
    } catch (e) {
      console.warn('[TelemetryStore] Failed to read from MMKV', e);
      return {
        sessionId: initialSessionId,
        sessionStartMs: initialStartMs,
        scenesCompleted: [],
        abandonedScene: undefined,
        events: [],
      };
    }
  };

  const seeded = seedFromStorage();

  return {
    sessionId: seeded.sessionId,
    sessionStartMs: seeded.sessionStartMs,
    events: seeded.events,
    scenesCompleted: seeded.scenesCompleted,
    abandonedScene: seeded.abandonedScene,

    setAbandonedScene: (scene: SceneId) => {
      set({ abandonedScene: scene });
    },

    addEvent: (partial) => {
      const { sessionId, events } = get();
      const fullEvent: TelemetryEvent = {
        ...partial,
        eventId: uuidv4(),
        sessionId,
        timestampMs: nowMs(),
      } as TelemetryEvent;

      set({ events: [...events, fullEvent] });
    },

    addEventsBatch: (partials) => {
      if (!partials.length) return;
      const { sessionId, events } = get();
      const now = nowMs();
      const mapped: TelemetryEvent[] = partials.map((p) => ({
        ...p,
        eventId: uuidv4(),
        sessionId,
        timestampMs: now,
      })) as TelemetryEvent[];
      set({ events: [...events, ...mapped] });
    },

    markSceneCompleted: (scene: SceneId) => {
      const { scenesCompleted } = get();
      if (scenesCompleted.includes(scene)) return;
      set({ scenesCompleted: [...scenesCompleted, scene] });
    },

    flushToStorage: () => {
      const { sessionId, sessionStartMs, events, scenesCompleted, abandonedScene } = get();
      try {
        const payload: StoredTelemetryPayload = { sessionId, events };
        const meta: SessionMeta = {
          sessionId,
          sessionStartMs,
          scenesCompleted,
          abandonedScene,
        };
        storage.set(TELEMETRY_KEY, JSON.stringify(payload));
        storage.set(SESSION_META_KEY, JSON.stringify(meta));
      } catch (e) {
        console.warn('[TelemetryStore] Failed to flush to MMKV', e);
      }
    },

    clear: () => {
      const newSessionId = uuidv4();
      const newStartMs = nowMs();
      set({
        sessionId: newSessionId,
        sessionStartMs: newStartMs,
        events: [],
        scenesCompleted: [],
        abandonedScene: undefined,
      });
      storage.delete(TELEMETRY_KEY);
      storage.delete(SESSION_META_KEY);
    },

    getSessionSummary: () => {
      const { sessionId, sessionStartMs, scenesCompleted, events, abandonedScene } = get();
      const endTime = nowMs();
      const totalDurationMs = endTime - sessionStartMs;
      return {
        sessionId,
        startTime: sessionStartMs,
        endTime,
        totalDurationMs,
        scenesCompleted,
        totalEvents: events.length,
        abandonedScene,
      };
    },
  };
});
