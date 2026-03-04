// src/data/constructWeights.ts
import { ConstructId } from '@/types/constructs';

export interface MicroModifierRule {
  id: string;
  description: string;
  condition: 'first_two_drags' | 'pick_put_back' | 'never_touched' | 'fast_drag_prosocial' | 'fast_drag_selfserving' | 'long_hover_no_action' | 'high_jitter';
  targetConstructs: ConstructId[];
  modifier: number;
}

export const MICRO_MODIFIERS: MicroModifierRule[] = [
  { id: 'MM01', description: 'Token in first 2 drags of any scene', condition: 'first_two_drags', targetConstructs: [], modifier: 1.5 },
  { id: 'MM02', description: 'Token picked up then removed', condition: 'pick_put_back', targetConstructs: [], modifier: 0.5 },
  { id: 'MM03', description: 'Token never touched', condition: 'never_touched', targetConstructs: [], modifier: -1 },
  { id: 'MM04', description: 'Very fast drag + prosocial token', condition: 'fast_drag_prosocial', targetConstructs: ['Prosociality', 'HEXACO_H'], modifier: 1.3 },
  { id: 'MM05', description: 'Very fast drag + self-serving token', condition: 'fast_drag_selfserving', targetConstructs: ['Dark_trait'], modifier: 1.3 },
  { id: 'MM06', description: 'Long hover (>3s) then no action', condition: 'long_hover_no_action', targetConstructs: ['Conflict_marker'], modifier: 1 },
  { id: 'MM07', description: 'High drag jitter (>20% path deviation)', condition: 'high_jitter', targetConstructs: ['Anxiety_marker'], modifier: 1 },
];

export const NORMALIZATION_RANGES: Partial<Record<ConstructId, { min: number; max: number }>> = {
  LL_words_recv: { min: 0, max: 15 },
  LL_touch_recv: { min: 0, max: 12 },
  LL_acts_recv: { min: 0, max: 15 },
  LL_gifts_recv: { min: 0, max: 12 },
  LL_quality_recv: { min: 0, max: 12 },
  Prosociality: { min: -5, max: 15 },
  Dark_trait: { min: -5, max: 10 },
  Security: { min: 0, max: 12 },
  HEXACO_H: { min: -3, max: 12 },
  HEXACO_A: { min: 0, max: 8 },
  HEXACO_C: { min: 0, max: 12 },
  HEXACO_E: { min: 0, max: 8 },
  HEXACO_O: { min: 0, max: 8 },
};
