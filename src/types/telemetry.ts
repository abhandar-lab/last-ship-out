import { ChapterNumber, SceneId } from './game';

export interface BaseTelemetryEvent {
  eventId: string;
  sessionId: string;
  timestampMs: number;
  chapter: ChapterNumber;
  scene: SceneId;
}

export interface DragTelemetryEvent extends BaseTelemetryEvent {
  eventType:
    | 'token_touch_start'
    | 'token_drag_move'
    | 'token_drag_end'
    | 'token_placed'
    | 'token_removed'
    | 'token_hover_start'
    | 'token_hover_end';
  tokenId: string;
  slotIndex?: number;
  positionStart: [number, number, number];
  positionEnd: [number, number, number];
  dragDurationMs: number;
  dragPathLengthPx: number;
  dragPathDeviation: number;
  dragSpeedPxPerMs: number;
  touchPressure?: number;
  isFirstInteraction: boolean;
  timerRemainingMs?: number;
}

export interface HoverTelemetryEvent extends BaseTelemetryEvent {
  eventType: 'token_hover_start' | 'token_hover_end';
  tokenId: string;
  hoverDurationMs: number;
}

export interface SelectionTelemetryEvent extends BaseTelemetryEvent {
  eventType: 'token_selected' | 'token_deselected' | 'card_tapped' | 'card_sparked';
  tokenId: string;
  selectionOrder: number;
  timeToSelectMs: number;
}

export interface ChoiceTelemetryEvent extends BaseTelemetryEvent {
  eventType: 'dialogue_choice';
  choiceId: string;
  turnNumber: number;
  timeToChooseMs: number;
}

export interface KeystrokeEvent extends BaseTelemetryEvent {
  eventType: 'keystroke';
  keyType: 'char' | 'backspace' | 'space' | 'punctuation';
  interKeyIntervalMs: number;
  cumulativeCharCount: number;
  cumulativeBackspaceCount: number;
  backspaceRate: number;
}

export interface TextSessionSummary extends BaseTelemetryEvent {
  eventType: 'text_session_summary';
  timeToFirstKeyMs: number;
  totalTypingTimeMs: number;
  totalCharsTyped: number;
  finalTextLength: number;
  backspaceRate: number;
  meanInterKeyIntervalMs: number;
  ikiVariance: number;
  longestPauseMs: number;
  longestPauseAfterWord: string;
  finalText: string;
  usedAutoSuggest: boolean;
  autoSuggestAction: 'accepted' | 'deleted' | 'ignored' | null;
}

export interface BurnTelemetryEvent extends BaseTelemetryEvent {
  eventType: 'item_burn_start' | 'item_burned' | 'item_burn_cancelled';
  tokenId: string;
  burnOrder: number;
  hesitationMs: number;
  resistanceOvercomeSpeedPxPerMs: number;
  dragPathDuringResistance: number;
  timeInFireRadiusMs: number;
}

export interface SceneSummaryEvent extends BaseTelemetryEvent {
  eventType: 'scene_summary';
  sceneStartMs: number;
  sceneEndMs: number;
  sceneDurationMs: number;
  tokensPlaced: string[];
  tokensRemoved: string[];
  tokensNeverTouched: string[];
  totalDragCount: number;
  totalHoverCount: number;
  pickPutBackCount: Record<string, number>;
}

export interface NudgeTelemetryEvent extends BaseTelemetryEvent {
  eventType: 'nudge_shown' | 'nudge_followed' | 'nudge_ignored';
  nudgedTokenId: string;
  interactedTokenId?: string;
  timeSinceLastInteractionMs: number;
}

export interface AppLifecycleEvent extends BaseTelemetryEvent {
  eventType: 'app_backgrounded' | 'app_foregrounded' | 'device_rotated';
  gapDurationMs?: number;
  previousScene?: SceneId;
}

export type TelemetryEvent =
  | DragTelemetryEvent
  | HoverTelemetryEvent
  | SelectionTelemetryEvent
  | ChoiceTelemetryEvent
  | KeystrokeEvent
  | TextSessionSummary
  | BurnTelemetryEvent
  | SceneSummaryEvent
  | NudgeTelemetryEvent
  | AppLifecycleEvent;

export interface SessionSummary {
  sessionId: string;
  startTime: number;
  endTime: number;
  totalDurationMs: number;
  scenesCompleted: SceneId[];
  totalEvents: number;
  abandonedScene?: SceneId;
}
