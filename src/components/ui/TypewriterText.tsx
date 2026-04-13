import { useEffect, useState } from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
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
}

function AnimatedLinha({ texto, index, total, onLastComplete, skipped }: AnimatedLinhaProps) {
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

  return <Animated.Text style={[styles.text, animStyle]}>{texto}</Animated.Text>;
}

interface TypewriterTextProps {
  text: string;
  style?: object;
  onComplete?: () => void;
}

export function TypewriterText({ text, style, onComplete }: TypewriterTextProps) {
  const [skipped, setSkipped] = useState(false);
  const linhas = text.split('\n').filter(Boolean);

  const skip = () => {
    setSkipped(true);
    onComplete?.();
  };

  return (
    <TouchableOpacity onPress={!skipped ? skip : undefined} activeOpacity={1}>
      <View style={style}>
        {linhas.map((linha, index) => (
          <AnimatedLinha
            key={index}
            texto={linha}
            index={index}
            total={linhas.length}
            onLastComplete={skipped ? undefined : onComplete}
            skipped={skipped}
          />
        ))}
      </View>
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
});
