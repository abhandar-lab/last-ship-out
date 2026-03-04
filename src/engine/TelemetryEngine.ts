// src/engine/TelemetryEngine.ts
import { useTelemetryStore } from '@/stores/telemetryStore';
import {
  TelemetryEvent,
  DragTelemetryEvent,
  BurnTelemetryEvent,
  SceneSummaryEvent,
} from '@/types/telemetry';
import { ChapterNumber, SceneId } from '@/types/game';
import { nowMs } from '@/utils/timing';
import { computePathStats } from '@/utils/math';

type DragPoint = { x: number; y: number; t: number };

interface ActiveDragState {
  tokenId: string;
  chapter: ChapterNumber;
  scene: SceneId;
  startMs: number;
  startWorldPos: [number, number, number];
  lastWorldPos: [number, number, number];
  path: DragPoint[];
  timerRemainingMs?: number;
  isFirstInteraction: boolean;
}

class TelemetryEngine {
  private static _instance: TelemetryEngine | null = null;

  static get instance(): TelemetryEngine {
    if (!TelemetryEngine._instance) {
      TelemetryEngine._instance = new TelemetryEngine();
    }
    return TelemetryEngine._instance;
  }

  private activeDrags: Map<string, ActiveDragState> = new Map();

  private get store() {
    return useTelemetryStore.getState();
  }

  startDrag(params: {
    tokenId: string;
    chapter: ChapterNumber;
    scene: SceneId;
    worldPosition: [number, number, number];
    screenX: number;
    screenY: number;
    timerRemainingMs?: number;
    isFirstInteraction: boolean;
  }) {
    const { tokenId, chapter, scene, worldPosition, screenX, screenY, timerRemainingMs, isFirstInteraction } =
      params;
    const startMs = nowMs();
    const dragKey = this.getDragKey(tokenId, scene);

    this.activeDrags.set(dragKey, {
      tokenId,
      chapter,
      scene,
      startMs,
      startWorldPos: worldPosition,
      lastWorldPos: worldPosition,
      path: [{ x: screenX, y: screenY, t: startMs }],
      timerRemainingMs,
      isFirstInteraction,
    });

    this.store.addEvent({
      chapter,
      scene,
      eventType: 'token_touch_start',
      tokenId,
      positionStart: worldPosition,
      positionEnd: worldPosition,
      dragDurationMs: 0,
      dragPathLengthPx: 0,
      dragPathDeviation: 1,
      dragSpeedPxPerMs: 0,
      isFirstInteraction,
      timerRemainingMs,
    } as Omit<DragTelemetryEvent, 'eventId' | 'sessionId' | 'timestampMs'>);
  }

  updateDrag(params: {
    tokenId: string;
    scene: SceneId;
    worldPosition: [number, number, number];
    screenX: number;
    screenY: number;
  }) {
    const dragKey = this.getDragKey(params.tokenId, params.scene);
    const active = this.activeDrags.get(dragKey);
    if (!active) return;

    const now = nowMs();
    const lastPathPoint = active.path[active.path.length - 1];
    if (!lastPathPoint || now - lastPathPoint.t >= 50) {
      active.path.push({ x: params.screenX, y: params.screenY, t: now });
    }
    active.lastWorldPos = params.worldPosition;

    this.activeDrags.set(dragKey, active);

    this.store.addEvent({
      chapter: active.chapter,
      scene: active.scene,
      eventType: 'token_drag_move',
      tokenId: active.tokenId,
      positionStart: active.startWorldPos,
      positionEnd: params.worldPosition,
      dragDurationMs: now - active.startMs,
      dragPathLengthPx: 0,
      dragPathDeviation: 1,
      dragSpeedPxPerMs: 0,
      isFirstInteraction: active.isFirstInteraction,
      timerRemainingMs: active.timerRemainingMs,
    } as Omit<DragTelemetryEvent, 'eventId' | 'sessionId' | 'timestampMs'>);
  }

  endDrag(params: {
    tokenId: string;
    scene: SceneId;
    finalWorldPosition: [number, number, number];
    slotIndex?: number;
    timerRemainingMs?: number;
  }) {
    const dragKey = this.getDragKey(params.tokenId, params.scene);
    const active = this.activeDrags.get(dragKey);
    const endMs = nowMs();

    if (!active) {
      return;
    }

    active.lastWorldPos = params.finalWorldPosition;
    const { pathLength, straightLineDistance, deviationRatio } = computePathStats(
      active.path
    );
    const dragDurationMs = endMs - active.startMs;
    const dragSpeed = dragDurationMs > 0 ? pathLength / dragDurationMs : 0;

    this.store.addEvent({
      chapter: active.chapter,
      scene: active.scene,
      eventType: 'token_drag_end',
      tokenId: active.tokenId,
      slotIndex: params.slotIndex,
      positionStart: active.startWorldPos,
      positionEnd: params.finalWorldPosition,
      dragDurationMs,
      dragPathLengthPx: pathLength,
      dragPathDeviation: deviationRatio,
      dragSpeedPxPerMs: dragSpeed,
      isFirstInteraction: active.isFirstInteraction,
      timerRemainingMs: params.timerRemainingMs ?? active.timerRemainingMs,
    } as Omit<DragTelemetryEvent, 'eventId' | 'sessionId' | 'timestampMs'>);

    this.activeDrags.delete(dragKey);
  }

  logPlacement(params: {
    tokenId: string;
    chapter: ChapterNumber;
    scene: SceneId;
    slotIndex: number;
    positionStart: [number, number, number];
    positionEnd: [number, number, number];
    timerRemainingMs?: number;
  }) {
    const { tokenId, chapter, scene, slotIndex, positionStart, positionEnd, timerRemainingMs } =
      params;
    this.store.addEvent({
      chapter,
      scene,
      eventType: 'token_placed',
      tokenId,
      slotIndex,
      positionStart,
      positionEnd,
      dragDurationMs: 0,
      dragPathLengthPx: 0,
      dragPathDeviation: 1,
      dragSpeedPxPerMs: 0,
      isFirstInteraction: false,
      timerRemainingMs,
    } as Omit<DragTelemetryEvent, 'eventId' | 'sessionId' | 'timestampMs'>);
  }

  logRemoval(params: {
    tokenId: string;
    chapter: ChapterNumber;
    scene: SceneId;
    slotIndex: number;
    positionStart: [number, number, number];
    positionEnd: [number, number, number];
    timerRemainingMs?: number;
  }) {
    const { tokenId, chapter, scene, slotIndex, positionStart, positionEnd, timerRemainingMs } =
      params;
    this.store.addEvent({
      chapter,
      scene,
      eventType: 'token_removed',
      tokenId,
      slotIndex,
      positionStart,
      positionEnd,
      dragDurationMs: 0,
      dragPathLengthPx: 0,
      dragPathDeviation: 1,
      dragSpeedPxPerMs: 0,
      isFirstInteraction: false,
      timerRemainingMs,
    } as Omit<DragTelemetryEvent, 'eventId' | 'sessionId' | 'timestampMs'>);
  }

  logBurnEvent(partial: Omit<BurnTelemetryEvent, 'eventId' | 'sessionId' | 'timestampMs'>) {
    this.store.addEvent(partial);
  }

  logSceneSummary(summary: Omit<SceneSummaryEvent, 'eventId' | 'sessionId' | 'timestampMs'>) {
    this.store.addEvent(summary);
  }

  flush() {
    this.store.flushToStorage();
  }

  clearSession() {
    this.store.clear();
  }

  private getDragKey(tokenId: string, scene: SceneId): string {
    return `${scene}:${tokenId}`;
  }
}

export const telemetryEngine = TelemetryEngine.instance;
