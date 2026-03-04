export type ChapterNumber = 1 | 2 | 3;

export type SceneId =
  | '1A' | '1B' | '1C'
  | '2A' | '2B'
  | '3A' | '3B' | '3C';

export type GamePhase =
  | 'splash'
  | 'content_warning'
  | 'playing'
  | 'transition'
  | 'scoring'
  | 'results';

export type ScenePhase =
  | 'intro'
  | 'active'
  | 'outro';

export interface GameState {
  phase: GamePhase;
  chapter: ChapterNumber;
  scene: SceneId;
  scenePhase: ScenePhase;
  isTimerActive: boolean;
  timerRemainingMs: number;
  isPaused: boolean;
  sessionStartTime: number;
}

export interface SceneConfig {
  id: SceneId;
  chapter: ChapterNumber;
  title: string;
  timerDurationMs: number | null;
  maxSelections: number;
  minSelections: number;
}

export const SCENE_CONFIGS: Record<SceneId, SceneConfig> = {
  '1A': {
    id: '1A',
    chapter: 1,
    title: 'Survival Scramble',
    timerDurationMs: 25000,
    maxSelections: 6,
    minSelections: 0,
  },
  '1B': {
    id: '1B',
    chapter: 1,
    title: 'Comfort Pack',
    timerDurationMs: null,
    maxSelections: 3,
    minSelections: 0,
  },
  '1C': {
    id: '1C',
    chapter: 1,
    title: 'Spark Swipe',
    timerDurationMs: null,
    maxSelections: 10,
    minSelections: 0,
  },
  '2A': {
    id: '2A',
    chapter: 2,
    title: 'The Last Slot',
    timerDurationMs: 15000,
    maxSelections: 1,
    minSelections: 0,
  },
  '2B': {
    id: '2B',
    chapter: 2,
    title: 'Burn Three',
    timerDurationMs: null,
    maxSelections: 3,
    minSelections: 3,
  },
  '3A': {
    id: '3A',
    chapter: 3,
    title: 'The Clash',
    timerDurationMs: null,
    maxSelections: 1,
    minSelections: 1,
  },
  '3B': {
    id: '3B',
    chapter: 3,
    title: 'One Sentence',
    timerDurationMs: null,
    maxSelections: 0,
    minSelections: 0,
  },
  '3C': {
    id: '3C',
    chapter: 3,
    title: 'The Future Raft',
    timerDurationMs: null,
    maxSelections: 2,
    minSelections: 2,
  },
};

export const SCENE_ORDER: readonly SceneId[] = [
  '1A', '1B', '1C', '2A', '2B', '3A', '3B', '3C',
] as const;

export function getNextScene(current: SceneId): SceneId | null {
  const idx = SCENE_ORDER.indexOf(current);
  if (idx === -1 || idx === SCENE_ORDER.length - 1) return null;
  return SCENE_ORDER[idx + 1] ?? null;
}
