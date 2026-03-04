// src/utils/hapticPatterns.ts
import * as Haptics from 'expo-haptics';

export const hapticPatterns = {
  tripleHeavy: async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    await new Promise((r) => setTimeout(r, 60));
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    await new Promise((r) => setTimeout(r, 60));
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  },

  doublePulse: async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await new Promise((r) => setTimeout(r, 80));
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  },

  resistanceDrag: async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    await new Promise((r) => setTimeout(r, 120));
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  },

  celebrationBurst: async () => {
    for (let i = 0; i < 5; i++) {
      await Haptics.selectionAsync();
      await new Promise((r) => setTimeout(r, 40));
    }
  },

  warningEscalation: async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await new Promise((r) => setTimeout(r, 150));
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await new Promise((r) => setTimeout(r, 150));
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  },
};
