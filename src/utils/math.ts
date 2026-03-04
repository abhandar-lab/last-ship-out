// src/utils/math.ts

export const distance2D = (
  a: { x: number; y: number },
  b: { x: number; y: number }
): number => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

export const lerp = (a: number, b: number, t: number): number =>
  a + (b - a) * t;

export const smoothstep = (t: number): number =>
  t * t * (3 - 2 * t);

export const computePathStats = (path: { x: number; y: number }[]) => {
  if (path.length < 2) {
    return {
      pathLength: 0,
      straightLineDistance: 0,
      deviationRatio: 1,
    };
  }

  let length = 0;
  for (let i = 1; i < path.length; i++) {
    length += distance2D(path[i - 1], path[i]);
  }

  const straightLineDistance = distance2D(path[0], path[path.length - 1]);
  const deviationRatio =
    straightLineDistance === 0 ? 1 : length / straightLineDistance;

  return {
    pathLength: length,
    straightLineDistance,
    deviationRatio,
};

export const normalizeScore = (
  raw: number,
  min: number,
  max: number
): number => {
  if (max === min) return 50;
  return clamp(((raw - min) / (max - min)) * 100, 0, 100);
};
