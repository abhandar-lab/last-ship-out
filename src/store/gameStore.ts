// src/stores/gameStore.ts
import { create } from 'zustand';
import {
  ChapterNumber,
  SceneId,
  GamePhase,
  ScenePhase,
  GameState,
  SCENE_CONFIGS,
  SCENE_ORDER,
  getNextScene,
} from '@/types/game';
import { nowMs } from '@/utils/timing';

interface GameStoreState extends GameState {
  setPhase: (phase: GamePhase) => void;
  setScenePhase: (scenePhase: ScenePhase) => void;
  startSession: () => void;
  startScene: (sceneId: SceneId) => void;
  endScene: () => void;
  goToNextScene: () => void;
  setTimerActive: (active: boolean) => void;
  setTimerRemainingMs: (ms: number) => void;
  tickTimer: (deltaMs: number) => void;
  pause: () => void;
  resume: () => void;
}

const initialState: GameState = {
  phase: 'splash',
  chapter: 1,
  scene: '1A',
  scenePhase: 'intro',
  isTimerActive: false,
  timerRemainingMs: SCENE_CONFIGS['1A'].timerDurationMs ?? 0,
  isPaused: false,
  sessionStartTime: nowMs(),
};

export const useGameStore = create<GameStoreState>((set, get) => ({
  ...initialState,

  setPhase: (phase) => set({ phase }),

  setScenePhase: (scenePhase) => set({ scenePhase }),

  startSession: () => {
    const start = nowMs();
    set({
      ...initialState,
      sessionStartTime: start,
      phase: 'content_warning',
      scene: '1A',
      chapter: 1,
    });
  },

  startScene: (sceneId) => {
    const config = SCENE_CONFIGS[sceneId];
    set({
      scene: sceneId,
      chapter: config.chapter,
      scenePhase: 'intro',
      isTimerActive: !!config.timerDurationMs,
      timerRemainingMs: config.timerDurationMs ?? 0,
    });
  },

  endScene: () => {
    set({ scenePhase: 'outro', isTimerActive: false });
  },

  goToNextScene: () => {
    const { scene } = get();
    const next = getNextScene(scene);
    if (!next) {
      set({ phase: 'scoring', isTimerActive: false });
      return;
    }
    const config = SCENE_CONFIGS[next];
    set({
      scene: next,
      chapter: config.chapter,
      scenePhase: 'intro',
      isTimerActive: !!config.timerDurationMs,
      timerRemainingMs: config.timerDurationMs ?? 0,
    });
  },

  setTimerActive: (active) => set({ isTimerActive: active }),

  setTimerRemainingMs: (ms) => set({ timerRemainingMs: Math.max(ms, 0) }),

  tickTimer: (deltaMs) => {
    const { isTimerActive, timerRemainingMs, scenePhase } = get();
    if (!isTimerActive || scenePhase !== 'active') return;
    const next = timerRemainingMs - deltaMs;
    if (next <= 0) {
      set({ timerRemainingMs: 0, isTimerActive: false });
    } else {
      set({ timerRemainingMs: next });
    }
  },

  pause: () => set({ isPaused: true, isTimerActive: false }),

  resume: () => {
    const state = get();
    if (state.scenePhase === 'active' && SCENE_CONFIGS[state.scene].timerDurationMs) {
      set({ isPaused: false, isTimerActive: true });
    } else {
      set({ isPaused: false });
    }
  },
}));
