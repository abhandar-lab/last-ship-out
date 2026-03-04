// src/utils/timing.ts
export const nowMs = (): number => {
  // performance.now is higher resolution when available
  if (typeof performance !== 'undefined' && performance.now) {
    return performance.now();
  }
  return Date.now();
};

export const msSince = (startMs: number): number => {
  return nowMs() - startMs;
};

export const toSeconds = (ms: number): number => ms / 1000;

export const fromSeconds = (s: number): number => s * 1000;
