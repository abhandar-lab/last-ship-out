// src/stores/choiceStore.ts
import { create } from 'zustand';
import { SceneId } from '@/types/game';

interface SlotState {
  slotIndex: number;
  tokenId: string;
}

interface SceneChoices {
  placed: SlotState[];
  removed: string[];
  pickPutBackCount: Record<string, number>;
  sparked?: string[];
  burned?: string[];
  dialogueChoices?: string[];
  freeText?: string;
  futureCards?: string[];
}

interface ChoiceState {
  choices: Partial<Record<SceneId, SceneChoices>>;
  placeToken: (scene: SceneId, slotIndex: number, tokenId: string) => void;
  removeToken: (scene: SceneId, slotIndex: number, tokenId: string) => void;
  sparkVignette: (vignetteId: string) => void;
  burnItem: (tokenId: string) => void;
  addDialogueChoice: (choiceId: string) => void;
  setFreeText: (text: string) => void;
  selectFutureCard: (cardId: string) => void;
  deselectFutureCard: (cardId: string) => void;
  getSceneChoices: (scene: SceneId) => SceneChoices;
  reset: () => void;
}

const emptyScene = (): SceneChoices => ({
  placed: [],
  removed: [],
  pickPutBackCount: {},
  sparked: [],
  burned: [],
  dialogueChoices: [],
  freeText: '',
  futureCards: [],
});

export const useChoiceStore = create<ChoiceState>((set, get) => ({
  choices: {},

  placeToken: (scene, slotIndex, tokenId) => {
    const { choices } = get();
    const sc = { ...(choices[scene] ?? emptyScene()) };

    sc.placed = [...sc.placed.filter((s) => s.slotIndex !== slotIndex), { slotIndex, tokenId }];

    set({ choices: { ...choices, [scene]: sc } });
  },

  removeToken: (scene, slotIndex, tokenId) => {
    const { choices } = get();
    const sc = { ...(choices[scene] ?? emptyScene()) };

    sc.placed = sc.placed.filter((s) => s.slotIndex !== slotIndex);
    sc.removed = [...sc.removed, tokenId];
    sc.pickPutBackCount = {
      ...sc.pickPutBackCount,
      [tokenId]: (sc.pickPutBackCount[tokenId] ?? 0) + 1,
    };

    set({ choices: { ...choices, [scene]: sc } });
  },

  sparkVignette: (vignetteId) => {
    const { choices } = get();
    const sc = { ...(choices['1C'] ?? emptyScene()) };
    if (!sc.sparked!.includes(vignetteId)) {
      sc.sparked = [...sc.sparked!, vignetteId];
    }
    set({ choices: { ...choices, '1C': sc } });
  },

  burnItem: (tokenId) => {
    const { choices } = get();
    const sc = { ...(choices['2B'] ?? emptyScene()) };
    if (!sc.burned!.includes(tokenId)) {
      sc.burned = [...sc.burned!, tokenId];
    }
    set({ choices: { ...choices, '2B': sc } });
  },

  addDialogueChoice: (choiceId) => {
    const { choices } = get();
    const sc = { ...(choices['3A'] ?? emptyScene()) };
    sc.dialogueChoices = [...(sc.dialogueChoices ?? []), choiceId];
    set({ choices: { ...choices, '3A': sc } });
  },

  setFreeText: (text) => {
    const { choices } = get();
    const sc = { ...(choices['3B'] ?? emptyScene()) };
    sc.freeText = text;
    set({ choices: { ...choices, '3B': sc } });
  },

  selectFutureCard: (cardId) => {
    const { choices } = get();
    const sc = { ...(choices['3C'] ?? emptyScene()) };
    if (!sc.futureCards!.includes(cardId)) {
      sc.futureCards = [...sc.futureCards!, cardId];
    }
    set({ choices: { ...choices, '3C': sc } });
  },

  deselectFutureCard: (cardId) => {
    const { choices } = get();
    const sc = { ...(choices['3C'] ?? emptyScene()) };
    sc.futureCards = sc.futureCards!.filter((id) => id !== cardId);
    set({ choices: { ...choices, '3C': sc } });
  },

  getSceneChoices: (scene) => {
    return get().choices[scene] ?? emptyScene();
  },

  reset: () => set({ choices: {} }),
}));
