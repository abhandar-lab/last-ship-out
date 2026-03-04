// src/data/vignettes.ts
import { ConstructId } from '@/types/constructs';

export interface VignetteDefinition {
  id: string;
  description: string;
  tags: { construct: ConstructId; weight: number }[];
}

export const VIGNETTES: VignetteDefinition[] = [
  { id: 'V01', description: 'Someone fiercely defending you in front of others', tags: [{ construct: 'Kryptonite_defender', weight: 3 }, { construct: 'HEXACO_X', weight: 1 }, { construct: 'Loyalty', weight: 2 }] },
  { id: 'V02', description: 'Someone remembering a tiny detail you mentioned once', tags: [{ construct: 'Kryptonite_detail_noticer', weight: 3 }, { construct: 'LL_acts_recv', weight: 2 }, { construct: 'HEXACO_C', weight: 1 }] },
  { id: 'V03', description: 'Someone planning a full weekend around your recharge needs', tags: [{ construct: 'Kryptonite_planner', weight: 3 }, { construct: 'LL_quality_recv', weight: 2 }, { construct: 'HEXACO_C', weight: 1 }] },
  { id: 'V04', description: 'Someone leaving you a voice note hyping you up', tags: [{ construct: 'Kryptonite_affirmer', weight: 3 }, { construct: 'LL_words_recv', weight: 2 }] },
  { id: 'V05', description: 'Someone silently taking over a task you were stressed about', tags: [{ construct: 'Kryptonite_silent_helper', weight: 3 }, { construct: 'LL_acts_recv', weight: 2 }, { construct: 'HEXACO_C', weight: 1 }] },
  { id: 'V06', description: 'Someone bringing a small unexpected gift "just because"', tags: [{ construct: 'Kryptonite_gifter', weight: 3 }, { construct: 'LL_gifts_recv', weight: 2 }] },
  { id: 'V07', description: 'Someone keeping your deepest secret without judgment', tags: [{ construct: 'Kryptonite_vault', weight: 3 }, { construct: 'HEXACO_H', weight: 2 }, { construct: 'Trust', weight: 2 }] },
  { id: 'V08', description: 'Someone starting a deep conversation and really listening', tags: [{ construct: 'Kryptonite_listener', weight: 3 }, { construct: 'LL_quality_recv', weight: 2 }, { construct: 'HEXACO_A', weight: 1 }] },
  { id: 'V09', description: "Someone reaching for your hand in silence when you're overwhelmed", tags: [{ construct: 'Kryptonite_silent_touch', weight: 3 }, { construct: 'LL_touch_recv', weight: 2 }, { construct: 'Co_regulation', weight: 2 }] },
  { id: 'V10', description: 'Someone showing up on time, every single time', tags: [{ construct: 'Kryptonite_reliable', weight: 3 }, { construct: 'HEXACO_C', weight: 2 }, { construct: 'Security', weight: 1 }] },
];
