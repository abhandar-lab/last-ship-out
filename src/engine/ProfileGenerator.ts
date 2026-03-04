// src/engine/ProfileGenerator.ts
import { ConstructScore, ConstructId } from '@/types/constructs';
import {
  KRYPTONITE_TEMPLATES,
  LOVE_LANGUAGE_LABELS,
  CONFLICT_TEMPLATES,
  KryptoniteTemplate,
} from '@/data/profileTemplates';
import { consistencyChecker } from './ConsistencyChecker';
import { fakingDetector } from './FakingDetector';
import { TelemetryEvent } from '@/types/telemetry';

export interface GeneratedProfile {
  meltPoints: { label: string; description: string; score: number }[];
  loveLanguageCalm: { language: string; score: number }[];
  loveLanguagePressure: { language: string; score: number }[];
  relationshipReflexes: string[];
  fakingFlags: string[];
  overallConfidence: number;
}

class ProfileGenerator {
  private static _instance: ProfileGenerator | null = null;
  static get instance(): ProfileGenerator {
    if (!ProfileGenerator._instance) {
      ProfileGenerator._instance = new ProfileGenerator();
    }
    return ProfileGenerator._instance;
  }

  generate(
    scores: Record<string, ConstructScore>,
    events: TelemetryEvent[]
  ): GeneratedProfile {
    const adjustedScores = consistencyChecker.applyToScores(scores);
    const flags = fakingDetector.analyze(events);

    const meltPoints = this.computeMeltPoints(adjustedScores);
    const loveLanguageCalm = this.computeLoveLanguage(adjustedScores, 'calm');
    const loveLanguagePressure = this.computeLoveLanguage(adjustedScores, 'pressure');
    const relationshipReflexes = this.computeReflexes(adjustedScores);

    const allConfidences = Object.values(adjustedScores).map((s) => s.confidence);
    const overallConfidence =
      allConfidences.length > 0
        ? allConfidences.reduce((a, b) => a + b, 0) / allConfidences.length
        : 0;

    return {
      meltPoints,
      loveLanguageCalm,
      loveLanguagePressure,
      relationshipReflexes,
      fakingFlags: flags.map((f) => f.description),
      overallConfidence,
    };
  }

  private computeMeltPoints(
    scores: Record<string, ConstructScore>
  ): { label: string; description: string; score: number }[] {
    const kryptoniteIds = KRYPTONITE_TEMPLATES.map((k) => k.construct);
    const ranked = kryptoniteIds
      .filter((id) => scores[id])
      .sort((a, b) => (scores[b]?.normalizedScore ?? 0) - (scores[a]?.normalizedScore ?? 0));

    return ranked.slice(0, 3).map((id) => {
      const template = KRYPTONITE_TEMPLATES.find(
        (k) => k.construct === id
      ) as KryptoniteTemplate;
      return {
        label: template.label,
        description: template.description,
        score: scores[id]?.normalizedScore ?? 0,
      };
    });
  }

  private computeLoveLanguage(
    scores: Record<string, ConstructScore>,
    mode: 'calm' | 'pressure'
  ): { language: string; score: number }[] {
    const llKeys = Object.keys(LOVE_LANGUAGE_LABELS);

    const ranked = llKeys
      .filter((k) => scores[k])
      .map((k) => ({
        language: LOVE_LANGUAGE_LABELS[k],
        score: scores[k]?.normalizedScore ?? 0,
      }))
      .sort((a, b) => b.score - a.score);

    return ranked;
  }

  private computeReflexes(scores: Record<string, ConstructScore>): string[] {
    const reflexes: string[] = [];
    const conflictKeys = Object.keys(CONFLICT_TEMPLATES);

    const topConflict = conflictKeys
      .filter((k) => scores[k])
      .sort((a, b) => (scores[b]?.normalizedScore ?? 0) - (scores[a]?.normalizedScore ?? 0));

    for (const key of topConflict.slice(0, 3)) {
      reflexes.push(CONFLICT_TEMPLATES[key]);
    }

    if (scores['Forgiveness']?.normalizedScore && scores['Forgiveness'].normalizedScore > 60) {
      reflexes.push('You have a capacity for forgiveness, even when trust has been broken.');
    }

    if (scores['Future_orientation']?.normalizedScore && scores['Future_orientation'].normalizedScore > 60) {
      reflexes.push('You tend to prioritize future stability over present comfort.');
    }

    return reflexes.slice(0, 5);
  }
}

export const profileGenerator = ProfileGenerator.instance;
