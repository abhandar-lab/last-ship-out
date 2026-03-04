// src/hooks/useAudio.ts
import { useEffect, useRef } from 'react';
import { Audio, AVPlaybackSource } from 'expo-av';

type SoundKey =
  | 'chapter1_intro'
  | 'chapter1A_urgency'
  | 'chapter1B_calm'
  | 'chapter1C_reflective'
  | 'chapter2A_heartbeat'
  | 'chapter2B_fire'
  | 'chapter3A_tense'
  | 'chapter3B_gentle'
  | 'chapter3C_dawn'
  | 'sfx_explosion'
  | 'sfx_alarm'
  | 'sfx_token_pickup'
  | 'sfx_token_place'
  | 'sfx_token_remove'
  | 'sfx_timer_tick'
  | 'sfx_fire_crackle'
  | 'sfx_item_ignite'
  | 'sfx_spark_tap'
  | 'sfx_dialogue_appear'
  | 'sfx_resistance_drag'
  | 'sfx_water_splash';

type LoadedSounds = Partial<Record<SoundKey, Audio.Sound>>;

const MUSIC_KEYS: SoundKey[] = [
  'chapter1_intro',
  'chapter1A_urgency',
  'chapter1B_calm',
  'chapter1C_reflective',
  'chapter2A_heartbeat',
  'chapter2B_fire',
  'chapter3A_tense',
  'chapter3B_gentle',
  'chapter3C_dawn',
];

const SFX_KEYS: SoundKey[] = [
  'sfx_explosion',
  'sfx_alarm',
  'sfx_token_pickup',
  'sfx_token_place',
  'sfx_token_remove',
  'sfx_timer_tick',
  'sfx_fire_crackle',
  'sfx_item_ignite',
  'sfx_spark_tap',
  'sfx_dialogue_appear',
  'sfx_resistance_drag',
  'sfx_water_splash',
];

const SOUND_SOURCES: Record<SoundKey, AVPlaybackSource> = {
  chapter1_intro: require('../../assets/audio/ch1_intro.mp3'),
  chapter1A_urgency: require('../../assets/audio/ch1A_urgency.mp3'),
  chapter1B_calm: require('../../assets/audio/ch1B_calm.mp3'),
  chapter1C_reflective: require('../../assets/audio/ch1C_reflective.mp3'),
  chapter2A_heartbeat: require('../../assets/audio/ch2A_heartbeat.mp3'),
  chapter2B_fire: require('../../assets/audio/ch2B_fire.mp3'),
  chapter3A_tense: require('../../assets/audio/ch3A_tense.mp3'),
  chapter3B_gentle: require('../../assets/audio/ch3B_gentle.mp3'),
  chapter3C_dawn: require('../../assets/audio/ch3C_dawn.mp3'),
  sfx_explosion: require('../../assets/audio/sfx_explosion.mp3'),
  sfx_alarm: require('../../assets/audio/sfx_alarm.mp3'),
  sfx_token_pickup: require('../../assets/audio/sfx_token_pickup.mp3'),
  sfx_token_place: require('../../assets/audio/sfx_token_place.mp3'),
  sfx_token_remove: require('../../assets/audio/sfx_token_remove.mp3'),
  sfx_timer_tick: require('../../assets/audio/sfx_timer_tick.mp3'),
  sfx_fire_crackle: require('../../assets/audio/sfx_fire_crackle.mp3'),
  sfx_item_ignite: require('../../assets/audio/sfx_item_ignite.mp3'),
  sfx_spark_tap: require('../../assets/audio/sfx_spark_tap.mp3'),
  sfx_dialogue_appear: require('../../assets/audio/sfx_dialogue_appear.mp3'),
  sfx_resistance_drag: require('../../assets/audio/sfx_resistance_drag.mp3'),
  sfx_water_splash: require('../../assets/audio/sfx_water_splash.mp3'),
};

export const useAudio = () => {
  const soundsRef = useRef<LoadedSounds>({});
  const currentMusicKeyRef = useRef<SoundKey | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadAll = async () => {
      const entries = Object.entries(SOUND_SOURCES) as [SoundKey, AVPlaybackSource][];
      for (const [key, source] of entries) {
        try {
          const { sound } = await Audio.Sound.createAsync(source, {
            shouldPlay: false,
            isLooping: MUSIC_KEYS.includes(key),
            volume: MUSIC_KEYS.includes(key) ? 0.8 : 1,
          });
          if (!mounted) {
            await sound.unloadAsync();
            return;
          }
          soundsRef.current[key] = sound;
        } catch (e) {
          console.warn(`[Audio] Failed to load sound: ${key}`, e);
        }
      }
    };

    loadAll();

    return () => {
      mounted = false;
      const sounds = soundsRef.current;
      const unload = async () => {
        for (const key of Object.keys(sounds) as SoundKey[]) {
          try {
            await sounds[key]?.unloadAsync();
          } catch (e) {
            console.warn(`[Audio] Failed to unload sound: ${key}`, e);
          }
        }
      };
      unload();
    };
  }, []);

  const playMusic = async (key: SoundKey) => {
    if (!MUSIC_KEYS.includes(key)) return;
    const sounds = soundsRef.current;
    try {
      if (currentMusicKeyRef.current && currentMusicKeyRef.current !== key) {
        await sounds[currentMusicKeyRef.current!]?.stopAsync();
      }
      currentMusicKeyRef.current = key;
      await sounds[key]?.setPositionAsync(0);
      await sounds[key]?.playAsync();
    } catch (e) {
      console.warn(`[Audio] Failed to play music: ${key}`, e);
    }
  };

  const fadeOutMusic = async (durationMs = 1000) => {
    const currentKey = currentMusicKeyRef.current;
    if (!currentKey) return;
    const sound = soundsRef.current[currentKey];
    if (!sound) return;
    try {
      const status = await sound.getStatusAsync();
      if (!status.isLoaded || !status.isPlaying) return;
      const startVolume = (status as any).volume ?? 1;
      const steps = 10;
      const stepDuration = durationMs / steps;
      for (let i = 1; i <= steps; i++) {
        const vol = startVolume * (1 - i / steps);
        await sound.setVolumeAsync(vol);
        await new Promise((resolve) => setTimeout(resolve, stepDuration));
      }
      await sound.stopAsync();
      currentMusicKeyRef.current = null;
    } catch (e) {
      console.warn('[Audio] Failed to fade out music', e);
    }
  };

  const playSfx = async (key: SoundKey) => {
    if (!SFX_KEYS.includes(key)) return;
    const sound = soundsRef.current[key];
    try {
      await sound?.setPositionAsync(0);
      await sound?.playAsync();
    } catch (e) {
      console.warn(`[Audio] Failed to play sfx: ${key}`, e);
    }
  };

  return {
    playMusic,
    fadeOutMusic,
    playSfx,
  };
};
