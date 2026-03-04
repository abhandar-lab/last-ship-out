import { ConstructTagMap } from './constructs';
import { SceneId } from './game';

export type TokenCategory = 'person' | 'object' | 'comfort' | 'last_slot' | 'burnable' | 'vignette' | 'future_card';

export interface TokenDefinition {
  id: string;
  scene: SceneId;
  category: TokenCategory;
  label: string;
  icon: string;
  description?: string;
  subtext?: string;
  tags: ConstructTagMap;
  position?: [number, number, number];
}

export interface VignetteDefinition {
  id: string;
  scene: '1C';
  description: string;
  animationKey: string;
  tags: ConstructTagMap;
}

export interface DialogueOption {
  id: string;
  text: string;
  tags: ConstructTagMap;
  leadsToTurn2: boolean;
}

export interface DialogueTurn {
  turnNumber: number;
  speakerLine: string;
  options: DialogueOption[];
}

export interface FutureCard {
  id: string;
  title: string;
  subtext: string;
  illustrationKey: string;
  tags: ConstructTagMap;
}

export interface SlotState {
  index: number;
  tokenId: string | null;
  isHighlighted: boolean;
}

export interface DragState {
  isDragging: boolean;
  tokenId: string | null;
  startPosition: [number, number, number];
  currentPosition: [number, number, number];
  pathPoints: Array<{ x: number; y: number; t: number }>;
  startTime: number;
}
