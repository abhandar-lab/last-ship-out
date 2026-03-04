// src/hooks/useHaptics.ts
import * as Haptics from 'expo-haptics';

export const useHaptics = () => {
  const tokenPickup = () =>
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

  const tokenPlace = () =>
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

  const explosion = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };

  const fireResistance = () =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

  const sparkTap = () => Haptics.selectionAsync();

  const timerExpire = () =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

  const cardSelect = () =>
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

  return {
    tokenPickup,
    tokenPlace,
    explosion,
    fireResistance,
    sparkTap,
    timerExpire,
    cardSelect,
  };
};
