// src/components/ui/DialogueBox.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface DialogueOption {
  id: string;
  text: string;
}

interface DialogueBoxProps {
  speaker: string;
  text: string;
  options: DialogueOption[];
  onChoose: (optionId: string) => void;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({
  speaker,
  text,
  options,
  onChoose,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.speechBubble}>
        <Text style={styles.speaker}>{speaker}</Text>
        <Text style={styles.dialogue}>{text}</Text>
      </View>
      <View style={styles.optionsContainer}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt.id}
            style={styles.optionButton}
            onPress={() => onChoose(opt.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.optionText}>{opt.text}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 40,
    left: 16,
    right: 16,
    zIndex: 20,
  },
  speechBubble: {
    backgroundColor: 'rgba(10,15,30,0.9)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  speaker: {
    color: '#ffd85a',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  dialogue: {
    color: '#e0e0e0',
    fontSize: 16,
    lineHeight: 22,
  },
  optionsContainer: {
    gap: 8,
  },
  optionButton: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  optionText: {
    color: '#ffffff',
    fontSize: 15,
    lineHeight: 20,
  },
});
