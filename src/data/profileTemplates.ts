// src/data/profileTemplates.ts
import { ConstructId } from '@/types/constructs';

export interface ProfileSection {
  title: string;
  key: 'melt_points' | 'love_language' | 'relationship_reflexes' | 'usage_note';
}

export const PROFILE_SECTIONS: ProfileSection[] = [
  { title: 'Your Melt Points', key: 'melt_points' },
  { title: 'How You Feel Loved', key: 'love_language' },
  { title: 'Your Relationship Reflexes', key: 'relationship_reflexes' },
  { title: 'How This Shapes Your Experience', key: 'usage_note' },
];

export interface KryptoniteTemplate {
  construct: ConstructId;
  label: string;
  description: string;
}

export const KRYPTONITE_TEMPLATES: KryptoniteTemplate[] = [
  { construct: 'Kryptonite_affirmer', label: 'The Affirmer', description: 'You light up when someone believes in you out loud — words of encouragement are your fuel.' },
  { construct: 'Kryptonite_organizer', label: 'The Organizer', description: 'Someone who quietly handles logistics makes you feel deeply cared for.' },
  { construct: 'Kryptonite_adventurer', label: 'The Adventurer', description: 'You crave shared excitement — spontaneity and new experiences are magnetic to you.' },
  { construct: 'Kryptonite_touch', label: 'The Gentle Touch', description: 'Physical presence and calm touch ground you more than words ever could.' },
  { construct: 'Kryptonite_gifter', label: 'The Gifter', description: 'Thoughtful surprises make you feel seen — the gesture matters more than the price.' },
  { construct: 'Kryptonite_defender', label: 'The Defender', description: 'Nothing melts you like someone who has your back publicly and fiercely.' },
  { construct: 'Kryptonite_detail_noticer', label: 'The Detail Noticer', description: 'When someone remembers small things you said, it tells you they truly listen.' },
  { construct: 'Kryptonite_planner', label: 'The Planner', description: "Someone who plans around your needs shows love in a way that hits deep." },
  { construct: 'Kryptonite_silent_helper', label: 'The Silent Helper', description: 'You value people who act without being asked — invisible labor is the ultimate love.' },
  { construct: 'Kryptonite_vault', label: 'The Vault', description: 'Trust is everything. Someone who holds your secrets without judgment is irreplaceable.' },
  { construct: 'Kryptonite_listener', label: 'The Listener', description: 'Deep conversation where someone truly hears you is your version of intimacy.' },
  { construct: 'Kryptonite_silent_touch', label: 'The Silent Comfort', description: "A hand reached out in silence when you're overwhelmed says more than a thousand words." },
  { construct: 'Kryptonite_reliable', label: 'The Reliable One', description: 'Consistency is romantic to you. Someone who shows up on time, every time, wins your heart.' },
];

export const LOVE_LANGUAGE_LABELS: Record<string, string> = {
  LL_words_recv: 'Words of Affirmation',
  LL_touch_recv: 'Physical Touch',
  LL_acts_recv: 'Acts of Service',
  LL_gifts_recv: 'Receiving Gifts',
  LL_quality_recv: 'Quality Time',
};

export const CONFLICT_TEMPLATES: Record<string, string> = {
  Secure_communication: 'Under pressure, you seek understanding and middle ground — a sign of secure communication.',
  Criticism: 'When pushed, you tend toward criticism — naming patterns as character flaws rather than specific behaviors.',
  Contempt: "Stress brings out sarcasm or dismissiveness — contempt can erode connection even when you're right.",
  Defensiveness: 'You deflect blame when cornered — a natural reflex, but one that blocks resolution.',
  Conflict_avoid: "You'd rather walk away than fight — avoidance keeps peace short-term but builds distance.",
  Conflict_accom: 'You tend to yield to keep harmony — but self-silencing can quietly build resentment.',
  Conflict_collab: 'You instinctively look for win-win solutions — collaboration is your conflict superpower.',
  Conflict_compete: 'You stand firm on principle — which shows conviction, but can feel adversarial to a partner.',
};
