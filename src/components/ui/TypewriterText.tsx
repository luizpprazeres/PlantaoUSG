import { useState, useEffect, useRef } from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, FontSize } from '@/constants/theme';

interface TypewriterTextProps {
  text: string;
  style?: object;
  onComplete?: () => void;
}

export function TypewriterText({ text, style, onComplete }: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    indexRef.current = 0;
    setDisplayed('');
    setDone(false);

    intervalRef.current = setInterval(() => {
      if (indexRef.current >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDone(true);
        onComplete?.();
        return;
      }
      setDisplayed(text.slice(0, indexRef.current + 1));
      indexRef.current += 1;
    }, 15);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text]);

  const skip = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDisplayed(text);
    setDone(true);
    onComplete?.();
  };

  return (
    <TouchableOpacity onPress={!done ? skip : undefined} activeOpacity={1}>
      <Text style={[styles.text, style]}>
        {displayed}
        {!done && <Text style={styles.cursor}>▌</Text>}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    lineHeight: FontSize.body * 1.7,
    letterSpacing: 0.02 * FontSize.body,
  },
  cursor: {
    color: Colors.textSecondary,
  },
});
