// src/hooks/useDragToken.ts
import { useRef, useState, useCallback } from 'react';
import { ChapterNumber, SceneId } from '@/types/game';
import { useTelemetryStore } from '@/stores/telemetryStore';
import { nowMs } from '@/utils/timing';
import { computePathStats } from '@/utils/math';

type Vec3 = [number, number, number];

interface DragPoint {
  x: number;
  y: number;
  t: number;
}

interface UseDragTokenParams {
  tokenId: string;
  chapter: ChapterNumber;
  scene: SceneId;
  getTimerRemainingMs?: () => number | undefined;
  onDragStartWorld: (screenX: number, screenY: number) => Vec3 | null;
  onDragMoveWorld: (screenX: number, screenY: number) => Vec3 | null;
  onDragEndWorld: (screenX: number, screenY: number) => Vec3 | null;
  onDropInSlot?: (worldPosition: Vec3) => { inSlot: boolean; slotIndex?: number };
}

interface UseDragTokenResult {
  isDragging: boolean;
  onPointerDown: (screenX: number, screenY: number, touchPressure?: number) => void;
  onPointerMove: (screenX: number, screenY: number) => void;
  onPointerUp: (screenX: number, screenY: number) => void;
}

export const useDragToken = (params: UseDragTokenParams): UseDragTokenResult => {
  const {
    tokenId,
    chapter,
    scene,
    getTimerRemainingMs,
    onDragStartWorld,
    onDragMoveWorld,
    onDragEndWorld,
    onDropInSlot,
  } = params;

  const { addEvent } = useTelemetryStore();

  const [isDragging, setIsDragging] = useState(false);
  const dragPathRef = useRef<DragPoint[]>([]);
  const dragStartWorldRef = useRef<Vec3 | null>(null);
  const dragStartMsRef = useRef<number>(0);
  const lastDragWorldRef = useRef<Vec3 | null>(null);
  const isFirstInteractionRef = useRef<boolean>(true);
  const hoverStartMsRef = useRef<number | null>(null);
  const hoverActiveRef = useRef<boolean>(false);

  const endHoverIfNeeded = useCallback(() => {
    if (hoverActiveRef.current && hoverStartMsRef.current != null) {
      const hoverDurationMs = nowMs() - hoverStartMsRef.current;
      addEvent({
        chapter,
        scene,
        eventType: 'token_hover_end',
        tokenId,
        hoverDurationMs,
      });
      hoverActiveRef.current = false;
      hoverStartMsRef.current = null;
    }
  }, [addEvent, chapter, scene, tokenId]);

  const onPointerDown = useCallback(
    (screenX: number, screenY: number, touchPressure?: number) => {
      const world = onDragStartWorld(screenX, screenY);
      if (!world) return;

      const now = nowMs();
      const timerRemainingMs = getTimerRemainingMs?.();
      dragPathRef.current = [{ x: screenX, y: screenY, t: now }];
      dragStartWorldRef.current = world;
      lastDragWorldRef.current = world;
      dragStartMsRef.current = now;
      setIsDragging(false);

      hoverStartMsRef.current = now;
      hoverActiveRef.current = true;

      addEvent({
        chapter,
        scene,
        eventType: 'token_touch_start',
        tokenId,
        slotIndex: undefined,
        positionStart: world,
        positionEnd: world,
        dragDurationMs: 0,
        dragPathLengthPx: 0,
        dragPathDeviation: 1,
        dragSpeedPxPerMs: 0,
        touchPressure,
        isFirstInteraction: isFirstInteractionRef.current,
        timerRemainingMs,
      });
    },
    [
      addEvent,
      chapter,
      scene,
      tokenId,
      onDragStartWorld,
      getTimerRemainingMs,
    ]
  );

  const onPointerMove = useCallback(
    (screenX: number, screenY: number) => {
      const world = onDragMoveWorld(screenX, screenY);
      if (!world || !dragStartWorldRef.current) return;

      const now = nowMs();
      const path = dragPathRef.current;
      const last = path[path.length - 1];

      if (!isDragging) {
        if (hoverActiveRef.current && hoverStartMsRef.current != null) {
          const hoverDurationMs = now - hoverStartMsRef.current;
          addEvent({
            chapter,
            scene,
            eventType: 'token_hover_end',
            tokenId,
            hoverDurationMs,
          });
          hoverActiveRef.current = false;
          hoverStartMsRef.current = null;
        }
        setIsDragging(true);
      }

      if (!last || now - last.t >= 50) {
        path.push({ x: screenX, y: screenY, t: now });
      }

      dragPathRef.current = path;
      lastDragWorldRef.current = world;

      const timerRemainingMs = getTimerRemainingMs?.();

      addEvent({
        chapter,
        scene,
        eventType: 'token_drag_move',
        tokenId,
        slotIndex: undefined,
        positionStart: dragStartWorldRef.current,
        positionEnd: world,
        dragDurationMs: now - dragStartMsRef.current,
        dragPathLengthPx: 0,
        dragPathDeviation: 1,
        dragSpeedPxPerMs: 0,
        isFirstInteraction: isFirstInteractionRef.current,
        timerRemainingMs,
      });
    },
    [
      addEvent,
      chapter,
      scene,
      tokenId,
      isDragging,
      onDragMoveWorld,
      getTimerRemainingMs,
    ]
  );

  const onPointerUp = useCallback(
    (screenX: number, screenY: number) => {
      const world = onDragEndWorld(screenX, screenY);
      const startWorld = dragStartWorldRef.current;
      const startMs = dragStartMsRef.current;

      const timerRemainingMs = getTimerRemainingMs?.();
      const now = nowMs();

      if (!world || !startWorld || !startMs) {
        endHoverIfNeeded();
        return;
      }

      endHoverIfNeeded();

      const path = dragPathRef.current;
      const { pathLength, straightLineDistance, deviationRatio } = computePathStats(
        path
      );
      const dragDurationMs = now - startMs;
      const dragSpeed = dragDurationMs > 0 ? pathLength / dragDurationMs : 0;

      let slotIndex: number | undefined;
      if (onDropInSlot) {
        const result = onDropInSlot(world);
        if (result.inSlot) {
          slotIndex = result.slotIndex;
        }
      }

      addEvent({
        chapter,
        scene,
        eventType: 'token_drag_end',
        tokenId,
        slotIndex,
        positionStart: startWorld,
        positionEnd: world,
        dragDurationMs,
        dragPathLengthPx: pathLength,
        dragPathDeviation: deviationRatio,
        dragSpeedPxPerMs: dragSpeed,
        isFirstInteraction: isFirstInteractionRef.current,
        timerRemainingMs,
      });

      if (slotIndex != null) {
        addEvent({
          chapter,
          scene,
          eventType: 'token_placed',
          tokenId,
          slotIndex,
          positionStart: startWorld,
          positionEnd: world,
          dragDurationMs,
          dragPathLengthPx: pathLength,
          dragPathDeviation: deviationRatio,
          dragSpeedPxPerMs: dragSpeed,
          isFirstInteraction: isFirstInteractionRef.current,
          timerRemainingMs,
        });
      }

      isFirstInteractionRef.current = false;
      dragPathRef.current = [];
      dragStartWorldRef.current = null;
      lastDragWorldRef.current = null;
      hoverStartMsRef.current = null;
      hoverActiveRef.current = false;
      setIsDragging(false);
    },
    [
      addEvent,
      chapter,
      scene,
      tokenId,
      getTimerRemainingMs,
      onDragEndWorld,
      onDropInSlot,
      endHoverIfNeeded,
    ]
  );

  return {
    isDragging,
    onPointerDown,
    onPointerMove,
    onPointerUp,
  };
};
