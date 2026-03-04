// src/data/tokens.ts
import { ConstructId } from '@/types/constructs';

interface ConstructTag {
  construct: ConstructId;
  weight: number;
}

export interface TokenDefinition {
  id: string;
  label: string;
  description: string;
  icon: string;
  category: 'people' | 'object' | 'comfort' | 'lastslot' | 'burn' | 'future';
  scene: '1A' | '1B' | '2A' | '2B' | '3C';
  tags: ConstructTag[];
}

export const TOKENS_1A: TokenDefinition[] = [
  { id: 'P01', label: 'Believes in you', description: 'The one who always believes in you', icon: 'hands_clapping', category: 'people', scene: '1A', tags: [{ construct: 'LL_words_recv', weight: 3 }, { construct: 'Kryptonite_affirmer', weight: 3 }, { construct: 'HEXACO_A', weight: 1 }] },
  { id: 'P02', label: 'Keeps things running', description: 'The one who quietly keeps everything running', icon: 'clipboard', category: 'people', scene: '1A', tags: [{ construct: 'LL_acts_recv', weight: 3 }, { construct: 'Kryptonite_organizer', weight: 3 }, { construct: 'HEXACO_C', weight: 2 }] },
  { id: 'P03', label: 'Exciting one', description: 'The one who makes everything feel exciting', icon: 'firework', category: 'people', scene: '1A', tags: [{ construct: 'LL_quality_recv', weight: 2 }, { construct: 'LL_touch_recv', weight: 1 }, { construct: 'Kryptonite_adventurer', weight: 3 }, { construct: 'HEXACO_O', weight: 1 }, { construct: 'HEXACO_X', weight: 1 }] },
  { id: 'P04', label: 'Calm touch', description: 'The one whose calm touch grounds you', icon: 'open_palm', category: 'people', scene: '1A', tags: [{ construct: 'LL_touch_recv', weight: 3 }, { construct: 'Kryptonite_touch', weight: 3 }, { construct: 'HEXACO_E', weight: 2 }, { construct: 'Co_regulation', weight: 2 }] },
  { id: 'P05', label: 'Shows up with needs', description: 'The one who always shows up with exactly what you need', icon: 'gift_box', category: 'people', scene: '1A', tags: [{ construct: 'LL_gifts_recv', weight: 3 }, { construct: 'Kryptonite_gifter', weight: 3 }, { construct: 'Status_orientation', weight: 1 }] },
  { id: 'P06', label: 'Tiny kid', description: 'A tiny kid clutching an oversized life jacket', icon: 'child_face', category: 'people', scene: '1A', tags: [{ construct: 'Prosociality', weight: 4 }, { construct: 'HEXACO_H', weight: 3 }, { construct: 'HEXACO_A', weight: 2 }, { construct: 'Dark_trait', weight: -3 }] },
  { id: 'P07', label: 'Older smiler', description: 'An older person who moves slowly but smiles at everyone', icon: 'elder_face', category: 'people', scene: '1A', tags: [{ construct: 'Family_loyalty', weight: 2 }, { construct: 'Tradition', weight: 1 }, { construct: 'HEXACO_A', weight: 1 }] },
  { id: 'P08', label: 'Engineer', description: "The ship's engineer who knows how to keep boats running", icon: 'wrench', category: 'people', scene: '1A', tags: [{ construct: 'Utilitarian', weight: 3 }, { construct: 'HEXACO_C', weight: 1 }, { construct: 'Problem_solving', weight: 2 }] },
  { id: 'O01', label: 'Cash & docs', description: 'Emergency cash & identity documents', icon: 'envelope', category: 'object', scene: '1A', tags: [{ construct: 'Security', weight: 3 }, { construct: 'Practicality', weight: 2 }, { construct: 'Future_planning', weight: 1 }] },
  { id: 'O02', label: 'Photo album', description: 'Photo album of your favorite memories', icon: 'album', category: 'object', scene: '1A', tags: [{ construct: 'Memory_value', weight: 3 }, { construct: 'LL_quality_recv', weight: 1 }, { construct: 'HEXACO_E', weight: 1 }] },
  { id: 'O03', label: 'Toolkit', description: 'Toolkit & repair gear', icon: 'toolbox', category: 'object', scene: '1A', tags: [{ construct: 'Practicality', weight: 3 }, { construct: 'HEXACO_C', weight: 2 }] },
  { id: 'O04', label: 'Medical kit', description: 'Medical kit', icon: 'red_cross', category: 'object', scene: '1A', tags: [{ construct: 'Care_for_others', weight: 2 }, { construct: 'Conscientious_help', weight: 2 }] },
  { id: 'O05', label: 'Luxury items', description: 'Expensive jewelry & luxury items', icon: 'diamond', category: 'object', scene: '1A', tags: [{ construct: 'Status_orientation', weight: 3 }, { construct: 'Materialism', weight: 3 }, { construct: 'Dark_trait', weight: 1 }] },
  { id: 'O06', label: 'Journal', description: 'A worn, handwritten journal', icon: 'notebook', category: 'object', scene: '1A', tags: [{ construct: 'Introspection', weight: 3 }, { construct: 'HEXACO_O', weight: 1 }, { construct: 'HEXACO_E', weight: 1 }] },
];

export const TOKENS_1B: TokenDefinition[] = [
  { id: 'C01', label: 'Love letters', description: 'A box of letters from people who love you', icon: 'sealed_letters', category: 'comfort', scene: '1B', tags: [{ construct: 'LL_words_recv', weight: 4 }, { construct: 'Emotionality', weight: 1 }, { construct: 'Attachment_to_words', weight: 2 }] },
  { id: 'C02', label: 'Blanket & hammock', description: 'A blanket & hammock for two', icon: 'hammock', category: 'comfort', scene: '1B', tags: [{ construct: 'LL_touch_recv', weight: 3 }, { construct: 'Co_regulation', weight: 2 }, { construct: 'Physical_comfort', weight: 2 }] },
  { id: 'C03', label: 'Playlist & headphones', description: 'A playlist & headphones to share', icon: 'headphones', category: 'comfort', scene: '1B', tags: [{ construct: 'LL_quality_recv', weight: 3 }, { construct: 'Shared_experience', weight: 2 }, { construct: 'HEXACO_O', weight: 1 }] },
  { id: 'C04', label: 'Task helper', description: 'Someone who quietly does all the tasks you hate', icon: 'broom', category: 'comfort', scene: '1B', tags: [{ construct: 'LL_acts_recv', weight: 4 }, { construct: 'HEXACO_C', weight: 2 }, { construct: 'Invisible_labor', weight: 2 }] },
  { id: 'C05', label: 'Surprise treats', description: 'A chest of surprise treats and small luxuries', icon: 'treasure_chest', category: 'comfort', scene: '1B', tags: [{ construct: 'LL_gifts_recv', weight: 4 }, { construct: 'Status_orientation', weight: 1 }] },
  { id: 'C06', label: 'Journal & pen', description: 'A journal & pen', icon: 'notebook', category: 'comfort', scene: '1B', tags: [{ construct: 'Introspection', weight: 3 }, { construct: 'HEXACO_O', weight: 1 }, { construct: 'Emotionality', weight: 1 }] },
  { id: 'C07', label: 'Film projector', description: 'A projector to rewatch favorite films together', icon: 'projector', category: 'comfort', scene: '1B', tags: [{ construct: 'LL_quality_recv', weight: 2 }, { construct: 'Memory_value', weight: 2 }, { construct: 'Shared_rituals', weight: 1 }] },
];

export const TOKENS_2A: TokenDefinition[] = [
  { id: 'L01', label: 'Reliable one', description: 'The reliable one — steady, calm, but hard to read emotionally', icon: 'shield', category: 'lastslot', scene: '2A', tags: [{ construct: 'Security_partner', weight: 3 }, { construct: 'Avoidant_attraction', weight: 1 }, { construct: 'HEXACO_C', weight: 1 }] },
  { id: 'L02', label: 'Passionate one', description: 'The passionate one — electric energy, but unpredictable', icon: 'lightning', category: 'lastslot', scene: '2A', tags: [{ construct: 'Passion_partner', weight: 3 }, { construct: 'LL_touch_recv', weight: 2 }, { construct: 'Impulsivity_tolerance', weight: 1 }] },
  { id: 'L03', label: 'Older helper', description: 'The older person who helped everyone else first', icon: 'elder_hands', category: 'lastslot', scene: '2A', tags: [{ construct: 'Family_loyalty', weight: 3 }, { construct: 'Tradition', weight: 1 }, { construct: 'Sacrifice', weight: 2 }] },
  { id: 'L04', label: 'Stranger + toddler', description: 'The stranger shielding the toddler', icon: 'adult_child', category: 'lastslot', scene: '2A', tags: [{ construct: 'Prosociality', weight: 4 }, { construct: 'HEXACO_H', weight: 3 }, { construct: 'HEXACO_A', weight: 2 }, { construct: 'Dark_trait', weight: -3 }] },
  { id: 'L05', label: 'Engineer', description: 'The engineer who can keep the other boats running', icon: 'gear', category: 'lastslot', scene: '2A', tags: [{ construct: 'Utilitarian', weight: 4 }, { construct: 'Group_survival', weight: 3 }, { construct: 'HEXACO_C', weight: 1 }] },
  { id: 'L06', label: 'Betrayer redeemed', description: 'The one who once betrayed your trust but saved two people tonight', icon: 'cracked_shield', category: 'lastslot', scene: '2A', tags: [{ construct: 'Forgiveness', weight: 3 }, { construct: 'Complexity_tolerance', weight: 2 }, { construct: 'Boundary_test', weight: 1 }] },
  { id: 'L07', label: 'Room unlocker', description: 'The one who freed trapped passengers from a locked room', icon: 'key', category: 'lastslot', scene: '2A', tags: [{ construct: 'Justice_reciprocity', weight: 3 }, { construct: 'HEXACO_H', weight: 1 }, { construct: 'Heroism_recognition', weight: 2 }] },
];

export const TOKENS_2B: TokenDefinition[] = [
  { id: 'B01', label: 'Love letters', description: 'A bundle of love letters', icon: 'letters', category: 'burn', scene: '2B', tags: [{ construct: 'Romantic_memory', weight: 3 }, { construct: 'LL_words_recv', weight: 2 }, { construct: 'Past_attachment', weight: 2 }] },
  { id: 'B02', label: 'Life photos', description: 'Photos of your biggest life moments', icon: 'photos', category: 'burn', scene: '2B', tags: [{ construct: 'Memory_value', weight: 3 }, { construct: 'Identity_narrative', weight: 2 }] },
  { id: 'B03', label: 'Draining contract', description: 'A signed contract tying you to a draining but high-status job', icon: 'contract', category: 'burn', scene: '2B', tags: [{ construct: 'Status_orientation', weight: 2 }, { construct: 'Security', weight: 2 }, { construct: 'Resentment_work', weight: 1 }] },
  { id: 'B04', label: 'Old flame chats', description: 'Secret chat log from an old flame', icon: 'phone', category: 'burn', scene: '2B', tags: [{ construct: 'Past_attachment', weight: 3 }, { construct: 'Unresolved_past', weight: 3 }, { construct: 'Boundary_risk', weight: 1 }] },
  { id: 'B05', label: 'Painful gift', description: 'A gift from someone who deeply hurt you', icon: 'cracked_gift', category: 'burn', scene: '2B', tags: [{ construct: 'Emotional_ambivalence', weight: 3 }, { construct: 'Pain_holding', weight: 2 }] },
  { id: 'B06', label: 'Childhood diary', description: 'Your childhood diary', icon: 'diary', category: 'burn', scene: '2B', tags: [{ construct: 'Self_narrative', weight: 3 }, { construct: 'Introspection', weight: 2 }, { construct: 'Vulnerability', weight: 1 }] },
  { id: 'B07', label: 'Commitment keys', description: 'Keys to a place that represents stability and commitment', icon: 'keys', category: 'burn', scene: '2B', tags: [{ construct: 'Security', weight: 3 }, { construct: 'Commitment_symbol', weight: 3 }, { construct: 'Future_orientation', weight: 2 }] },
];

export const TOKENS_3C: TokenDefinition[] = [
  { id: 'R01', label: 'Emotionally Safe', description: 'They see you, they validate you, they show up.', icon: 'heart_shield', category: 'future', scene: '3C', tags: [{ construct: 'Template_security', weight: 4 }, { construct: 'LL_words_recv', weight: 1 }, { construct: 'LL_quality_recv', weight: 1 }, { construct: 'Secure_attach_desire', weight: 2 }] },
  { id: 'R02', label: 'Electrically Alive', description: "High chemistry, shared adventures, even if it's chaotic.", icon: 'lightning_heart', category: 'future', scene: '3C', tags: [{ construct: 'Template_passion', weight: 4 }, { construct: 'LL_touch_recv', weight: 2 }, { construct: 'HEXACO_O', weight: 1 }, { construct: 'Risk_tolerance', weight: 1 }] },
  { id: 'R03', label: 'Exceptionally Stable', description: "Calm, orderly, predictable — even if it's not dramatic.", icon: 'anchor', category: 'future', scene: '3C', tags: [{ construct: 'Template_stability', weight: 4 }, { construct: 'HEXACO_C', weight: 2 }, { construct: 'LL_acts_recv', weight: 1 }] },
  { id: 'R04', label: 'Wildly Successful', description: "Ambition, status, resources — even if you're often apart.", icon: 'trophy', category: 'future', scene: '3C', tags: [{ construct: 'Template_status', weight: 4 }, { construct: 'Status_orientation', weight: 3 }] },
  { id: 'R05', label: 'Deeply Honest', description: "Radical truth, always — even when it's uncomfortable.", icon: 'mirror', category: 'future', scene: '3C', tags: [{ construct: 'Template_honesty', weight: 4 }, { construct: 'HEXACO_H', weight: 2 }, { construct: 'Emotional_intensity', weight: 1 }] },
];

export const ALL_TOKENS: TokenDefinition[] = [
  ...TOKENS_1A,
  ...TOKENS_1B,
  ...TOKENS_2A,
  ...TOKENS_2B,
  ...TOKENS_3C,
];

export const getTokenById = (id: string): TokenDefinition | undefined =>
  ALL_TOKENS.find((t) => t.id === id);

export const getTokensByScene = (scene: string): TokenDefinition[] =>
  ALL_TOKENS.filter((t) => t.scene === scene);
