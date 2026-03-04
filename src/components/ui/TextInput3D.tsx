// src/components/ui/TextInput3D.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import { useTelemetryStore } from '@/stores/telemetryStore';
import { useChoiceStore } from '@/stores/choiceStore';
import { nowMs } from '@/utils/timing';

interface TextInput3DProps {
  prompt: string;
  ghostSuggestions?: [string, string];
  onSubmit: (text: string) => void;
}

export const TextInput3D: React.FC<TextInput3DProps> = ({
  prompt,
  ghostSuggestions = ['losing them', 'failing myself'],
  onSubmit,
}) => {
  const [text, setText] = useState('');
  const [showGhosts, setShowGhosts] = useState(true);
  const { addEvent } = useTelemetryStore();
  const { setFreeText } = useChoiceStore();

  const promptDisplayMs = useRef(nowMs());
  const lastKeystrokeMs = useRef<number | null>(null);
  const totalKeystrokes = useRef(0);
  const totalBackspaces = useRef(0);
  const firstKeyMs = useRef<number | null>(null);
  const longestPauseMs = useRef(0);
  const longestPauseAfterWord = useRef('');
  const ikiValues = useRef<number[]>([]);

  useEffect(() => {
    promptDisplayMs.current = nowMs();
    const timer = setTimeout(() => setShowGhosts(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleKeyPress = useCallback(
    (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
      const now = nowMs();
      const key = e.nativeEvent.key;

      if (firstKeyMs.current == null) {
        firstKeyMs.current = now;
      }

      let keyType: 'char' | 'backspace' | 'space' | 'punctuation' = 'char';
      if (key === 'Backspace') {
        keyType = 'backspace';
        totalBackspaces.current += 1;
      } else if (key === ' ') {
        keyType = 'space';
      } else if (/[^a-zA-Z0-9]/.test(key)) {
        keyType = 'punctuation';
      }

      totalKeystrokes.current += 1;

      const iki =
        lastKeystrokeMs.current != null ? now - lastKeystrokeMs.current : 0;
      if (iki > 0) {
        ikiValues.current.push(iki);
      }

      if (iki > longestPauseMs.current) {
        longestPauseMs.current = iki;
        const words = text.split(' ');
        longestPauseAfterWord.current = words[words.length - 1] || '';
      }

      lastKeystrokeMs.current = now;

      addEvent({
        chapter: 3,
        scene: '3B',
        eventType: 'keystroke',
        keyType,
        interKeyIntervalMs: iki,
        cumulativeCharCount: text.length,
        cumulativeBackspaceCount: totalBackspaces.current,
        backspaceRate:
          totalKeystrokes.current > 0
            ? totalBackspaces.current / totalKeystrokes.current
            : 0,
      } as any);
    },
    [addEvent, text]
  );

  const handleSubmit = useCallback(() => {
    const now = nowMs();
    const ikis = ikiValues.current;
    const meanIki =
      ikis.length > 0 ? ikis.reduce((a, b) => a + b, 0) / ikis.length : 0;
    const ikiVariance =
      ikis.length > 1
        ? ikis.reduce((sum, v) => sum + (v - meanIki) ** 2, 0) / ikis.length
        : 0;

    addEvent({
      chapter: 3,
      scene: '3B',
      eventType: 'keystroke_summary',
      timeToFirstKeyMs: firstKeyMs.current
        ? firstKeyMs.current - promptDisplayMs.current
        : 0,
      totalTypingTimeMs: now - (firstKeyMs.current ?? now),
      totalCharsTyped: totalKeystrokes.current,
      finalTextLength: text.length,
      backspaceRate:
        totalKeystrokes.current > 0
          ? totalBackspaces.current / totalKeystrokes.current
          : 0,
      meanInterKeyIntervalMs: meanIki,
      ikiVariance,
      longestPauseMs: longestPauseMs.current,
      longestPauseAfterWord: longestPauseAfterWord.current,
      finalText: text,
    } as any);

    setFreeText(text);
    onSubmit(text);
  }, [addEvent, text, setFreeText, onSubmit]);

  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>{prompt}</Text>
      <View style={styles.inputWrapper}>
        {showGhosts && text.length === 0 && (
          <View style={styles.ghostContainer}>
            <Text style={styles.ghostText}>{ghostSuggestions[0]}</Text>
            <Text style={styles.ghostText}>{ghostSuggestions[1]}</Text>
          </View>
        )}
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          onKeyPress={handleKeyPress}
          onSubmitEditing={handleSubmit}
          placeholder="Type here..."
          placeholderTextColor="#555555"
          multiline={false}
          maxLength={200}
          autoFocus
          returnKeyType="done"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 100,
    zIndex: 25,
  },
  prompt: {
    color: '#e0d5c0',
    fontSize: 18,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 26,
  },
  inputWrapper: {
    position: 'relative',
  },
  ghostContainer: {
    position: 'absolute',
    top: 14,
    left: 16,
    flexDirection: 'row',
    gap: 24,
    zIndex: 1,
  },
  ghostText: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 16,
    fontStyle: 'italic',
  },
  input: {
    backgroundColor: 'rgba(40,30,20,0.85)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(200,180,140,0.3)',
    paddingVertical: 14,
    paddingHorizontal: 16,
    color: '#ffffff',
    fontSize: 16,
    zIndex: 2,
  },
});
