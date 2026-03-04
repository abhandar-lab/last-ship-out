// src/utils/timing.ts

/**
 * High‑resolution timestamp in milliseconds.
 */
export const nowMs = (): number => {
  if (typeof performance !== 'undefined' && performance.now) {
    return performance.now();
  }
  return Date.now();
};

export const msSince = (startMs: number): number => nowMs() - startMs;

export const toSeconds = (ms: number): number => ms / 1000;

export const fromSeconds = (seconds: number): number => seconds * 1000;
