// src/engine/FakingDetector.ts
import { TelemetryEvent, DragTelemetryEvent } from '@/types/telemetry';

interface FakingFlag {
  flagId: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  evidence: string;
}

class FakingDetector {
  private static _instance: FakingDetector | null = null;
  static get instance(): FakingDetector {
    if (!FakingDetector._instance) {
      FakingDetector._instance = new FakingDetector();
    }
    return FakingDetector._instance;
  }

  analyze(events: TelemetryEvent[]): FakingFlag[] {
    const flags: FakingFlag[] = [];

    this.checkUniformSpeed(events, flags);
    this.checkAlwaysProsocial(events, flags);
    this.checkZeroHesitation(events, flags);
    this.checkSuspiciouslyFastAllScenes(events, flags);

    return flags;
  }

  private getDragEvents(events: TelemetryEvent[]): DragTelemetryEvent[] {
    return events.filter(
      (e) => e.eventType === 'token_drag_end'
    ) as DragTelemetryEvent[];
  }

  private checkUniformSpeed(events: TelemetryEvent[], flags: FakingFlag[]) {
    const drags = this.getDragEvents(events);
    if (drags.length < 4) return;

    const speeds = drags
      .map((d) => d.dragSpeedPxPerMs)
      .filter((s): s is number => s != null && s > 0);
    if (speeds.length < 4) return;

    const mean = speeds.reduce((a, b) => a + b, 0) / speeds.length;
    const variance =
      speeds.reduce((sum, s) => sum + (s - mean) ** 2, 0) / speeds.length;
    const cv = mean > 0 ? Math.sqrt(variance) / mean : 0;

    if (cv < 0.1) {
      flags.push({
        flagId: 'FAKE_UNIFORM_SPEED',
        severity: 'medium',
        description: 'Drag speeds are suspiciously uniform across all tokens',
        evidence: `CV=${cv.toFixed(3)}, mean=${mean.toFixed(3)}`,
      });
    }
  }

  private checkAlwaysProsocial(events: TelemetryEvent[], flags: FakingFlag[]) {
    const prosocialTokens = ['P06', 'P07', 'L04', 'L03', 'O04'];
    const placed = events
      .filter((e) => e.eventType === 'token_placed')
      .map((e) => (e as DragTelemetryEvent).tokenId)
      .filter((t): t is string => t != null);

    const prosocialCount = placed.filter((t) => prosocialTokens.includes(t)).length;
    const ratio = placed.length > 0 ? prosocialCount / placed.length : 0;

    if (ratio > 0.8 && placed.length >= 5) {
      flags.push({
        flagId: 'FAKE_ALWAYS_PROSOCIAL',
        severity: 'high',
        description: 'Player exclusively chose prosocial tokens across all scenes',
        evidence: `${prosocialCount}/${placed.length} prosocial (${(ratio * 100).toFixed(0)}%)`,
      });
    }
  }

  private checkZeroHesitation(events: TelemetryEvent[], flags: FakingFlag[]) {
    const hovers = events.filter((e) => e.eventType === 'token_hover_end');
    const drags = this.getDragEvents(events);

    if (drags.length >= 6 && hovers.length === 0) {
      flags.push({
        flagId: 'FAKE_ZERO_HESITATION',
        severity: 'low',
        description: 'No hover/deliberation events across entire session',
        evidence: `${drags.length} drags, 0 hovers`,
      });
    }
  }

  private checkSuspiciouslyFastAllScenes(
    events: TelemetryEvent[],
    flags: FakingFlag[]
  ) {
    const drags = this.getDragEvents(events);
    if (drags.length < 6) return;

    const allFast = drags.every(
      (d) => d.dragDurationMs != null && d.dragDurationMs < 300
    );

    if (allFast) {
      flags.push({
        flagId: 'FAKE_ALL_INSTANT',
        severity: 'high',
        description: 'Every single drag completed in <300ms — possible rushing/gaming',
        evidence: `${drags.length} drags all <300ms`,
      });
    }
  }
}

export const fakingDetector = FakingDetector.instance;
