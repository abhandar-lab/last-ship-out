// src/data/dialogueTree.ts
import { ConstructId } from '@/types/constructs';

export interface DialogueOption {
  id: string;
  text: string;
  tags: { construct: ConstructId; weight: number }[];
  leadsToTurn?: number;
}

export interface DialogueTurn {
  turn: number;
  speaker: 'shipmate' | 'narrator';
  text: string;
  options: DialogueOption[];
  condition?: { requiresChoiceIn: string[] };
}

export const DIALOGUE_TREE: DialogueTurn[] = [
  {
    turn: 1,
    speaker: 'shipmate',
    text: "Listen — I think we should load our valuables and useful supplies first. We can't save everything for everyone.",
    options: [
      { id: 'CF01', text: 'No. We help the most vulnerable people first.', tags: [{ construct: 'Conflict_compete', weight: 2 }, { construct: 'Justice_orientation', weight: 2 }, { construct: 'HEXACO_H', weight: 2 }] },
      { id: 'CF02', text: "Let's think about this — what if we balance both?", tags: [{ construct: 'Conflict_collab', weight: 3 }, { construct: 'HEXACO_A', weight: 1 }, { construct: 'HEXACO_C', weight: 1 }] },
      { id: 'CF03', text: '…Okay. You probably know best.', tags: [{ construct: 'Conflict_accom', weight: 3 }, { construct: 'Self_silencing', weight: 2 }, { construct: 'Anxious_attach', weight: 1 }] },
      { id: 'CF04', text: "I don't want to argue about this.", tags: [{ construct: 'Conflict_avoid', weight: 3 }, { construct: 'Stonewalling', weight: 2 }, { construct: 'Avoidant_attach', weight: 1 }] },
    ],
  },
  {
    turn: 2,
    speaker: 'shipmate',
    text: "You're being naive. This isn't about feelings, it's about survival.",
    condition: { requiresChoiceIn: ['CF01', 'CF02'] },
    options: [
      { id: 'CF05', text: 'I hear you, but I feel strongly. Can we find a middle ground?', tags: [{ construct: 'Secure_communication', weight: 3 }, { construct: 'FourHorsemen', weight: -2 }] },
      { id: 'CF06', text: 'You never listen. You always do this.', tags: [{ construct: 'Criticism', weight: 3 }, { construct: 'FourHorsemen', weight: 2 }] },
      { id: 'CF07', text: 'Oh right, because your plan has been working great.', tags: [{ construct: 'Contempt', weight: 3 }, { construct: 'FourHorsemen', weight: 3 }] },
      { id: 'CF08', text: 'I only want to help because you keep getting things wrong.', tags: [{ construct: 'Defensiveness', weight: 2 }, { construct: 'FourHorsemen', weight: 1 }] },
    ],
  },
];

export const getTurn = (turnNumber: number): DialogueTurn | undefined =>
  DIALOGUE_TREE.find((t) => t.turn === turnNumber);

export const shouldShowTurn2 = (turn1ChoiceId: string): boolean =>
  ['CF01', 'CF02'].includes(turn1ChoiceId);
