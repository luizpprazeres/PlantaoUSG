import { useEffect, useState } from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { Colors, FontSize } from '@/constants/theme';

interface AnimatedLinhaProps {
  texto: string;
  index: number;
  total: number;
  onLastComplete?: () => void;
  skipped: boolean;
  fontSize?: number;
}

function AnimatedLinha({ texto, index, total, onLastComplete, skipped, fontSize }: AnimatedLinhaProps) {
  const opacity = useSharedValue(skipped ? 1 : 0);
  const translateX = useSharedValue(skipped ? 0 : -8);

  useEffect(() => {
    if (skipped) {
      opacity.value = 1;
      translateX.value = 0;
      return;
    }
    const delay = index * 40;
    const isLast = index === total - 1;
    opacity.value = withDelay(delay, withTiming(1, { duration: 180 }));
    translateX.value = withDelay(
      delay,
      withTiming(0, { duration: 180, easing: Easing.out(Easing.cubic) }, (finished) => {
        if (finished && isLast && onLastComplete) {
          runOnJS(onLastComplete)();
        }
      })
    );
  }, [skipped]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  const fs = fontSize ?? 13;
  return (
    <Animated.Text
      style={[styles.text, { fontSize: fs, lineHeight: fs * 1.7, letterSpacing: 0.02 * fs }, animStyle]}
    >
      {texto}
    </Animated.Text>
  );
}

interface TypewriterTextProps {
  text: string;
  style?: object;
  fontSize?: number;
  onComplete?: () => void;
}

export function TypewriterText({ text, style, fontSize, onComplete }: TypewriterTextProps) {
  const [skipped, setSkipped] = useState(false);
  const [done, setDone] = useState(false);
  const linhas = text.split('\n').filter(Boolean);

  const handleComplete = () => {
    setDone(true);
    onComplete?.();
  };

  const skip = () => {
    setSkipped(true);
    setDone(true);
    onComplete?.();
  };

  return (
    <View style={style}>
      {linhas.map((linha, index) => (
        <AnimatedLinha
          key={index}
          texto={linha}
          index={index}
          total={linhas.length}
          onLastComplete={skipped ? undefined : handleComplete}
          skipped={skipped}
          fontSize={fontSize}
        />
      ))}
      {!done && (
        <TouchableOpacity onPress={skip} style={styles.skipBtn}>
          <Text style={styles.skipText}>›› pular</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'IBMPlexMono_400Regular',
    color: Colors.textPrimary,
  },
  skipBtn: {
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  skipText: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 10,
    color: Colors.textMuted,
    letterSpacing: 1,
  },
});
