export type ConstructCategory =
  | 'love_language'
  | 'kryptonite'
  | 'hexaco'
  | 'attachment'
  | 'conflict'
  | 'dark_trait'
  | 'values'
  | 'relationship_template'
  | 'behavioral_marker';

export type LoveLanguageConstruct =
  | 'LL_words_recv'
  | 'LL_acts_recv'
  | 'LL_quality_recv'
  | 'LL_touch_recv'
  | 'LL_gifts_recv';

export type KryptoniteConstruct =
  | 'Kryptonite_affirmer'
  | 'Kryptonite_organizer'
  | 'Kryptonite_adventurer'
  | 'Kryptonite_touch'
  | 'Kryptonite_gifter'
  | 'Kryptonite_defender'
  | 'Kryptonite_detail_noticer'
  | 'Kryptonite_planner'
  | 'Kryptonite_silent_helper'
  | 'Kryptonite_vault'
  | 'Kryptonite_listener'
  | 'Kryptonite_silent_touch'
  | 'Kryptonite_reliable';

export type HEXACOConstruct =
  | 'HEXACO_H'
  | 'HEXACO_E'
  | 'HEXACO_X'
  | 'HEXACO_A'
  | 'HEXACO_C'
  | 'HEXACO_O';

export type AttachmentConstruct =
  | 'Secure_attach_desire'
  | 'Anxious_attach'
  | 'Avoidant_attach'
  | 'Avoidant_attraction';

export type ConflictConstruct =
  | 'Conflict_compete'
  | 'Conflict_collab'
  | 'Conflict_accom'
  | 'Conflict_avoid'
  | 'Secure_communication'
  | 'Criticism'
  | 'Contempt'
  | 'Defensiveness'
  | 'Stonewalling'
  | 'FourHorsemen';

export type ValuesConstruct =
  | 'Prosociality'
  | 'Security'
  | 'Practicality'
  | 'Status_orientation'
  | 'Materialism'
  | 'Introspection'
  | 'Family_loyalty'
  | 'Tradition'
  | 'Utilitarian'
  | 'Forgiveness'
  | 'Justice_reciprocity'
  | 'Complexity_tolerance'
  | 'Memory_value'
  | 'Future_planning'
  | 'Care_for_others'
  | 'Problem_solving'
  | 'Co_regulation'
  | 'Emotionality'
  | 'Risk_tolerance'
  | 'Emotional_intensity'
  | 'Vulnerability'
  | 'Self_silencing';

export type RelationshipTemplate =
  | 'Template_security'
  | 'Template_passion'
  | 'Template_stability'
  | 'Template_status'
  | 'Template_honesty';

export type BehavioralMarker =
  | 'Dark_trait'
  | 'Conflict_marker'
  | 'Anxiety_marker'
  | 'Romantic_memory'
  | 'Past_attachment'
  | 'Unresolved_past'
  | 'Boundary_risk'
  | 'Emotional_ambivalence'
  | 'Pain_holding'
  | 'Self_narrative'
  | 'Commitment_symbol'
  | 'Future_orientation'
  | 'Boundary_test'
  | 'Heroism_recognition'
  | 'Group_survival'
  | 'Sacrifice'
  | 'Loyalty'
  | 'Trust'
  | 'Shared_experience'
  | 'Shared_rituals'
  | 'Invisible_labor'
  | 'Physical_comfort'
  | 'Attachment_to_words'
  | 'Identity_narrative'
  | 'Resentment_work'
  | 'Impulsivity_tolerance'
  | 'Security_partner'
  | 'Passion_partner'
  | 'Conscientious_help';

export type ConstructId =
  | LoveLanguageConstruct
  | KryptoniteConstruct
  | HEXACOConstruct
  | AttachmentConstruct
  | ConflictConstruct
  | ValuesConstruct
  | RelationshipTemplate
  | BehavioralMarker;

export interface ConstructScore {
  construct: ConstructId;
  rawScore: number;
  normalizedScore: number;
  confidence: number;
  evidenceCount: number;
  evidenceSources: string[];
}

export interface ConstructTagMap {
  [key: string]: number;
}

export interface ProfileSection {
  title: string;
  content: string;
  highlights: string[];
}

export interface UserProfile {
  meltPoints: ProfileSection;
  howYouFeelLoved: {
    calm: ProfileSection;
    crisis: ProfileSection;
  };
  relationshipReflexes: ProfileSection;
  mayaAIUsage: ProfileSection;
  rawScores: ConstructScore[];
}
