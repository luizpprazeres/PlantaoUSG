import { useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { Colors, FontFamily, Motion } from '@/constants/theme';

interface BlinkingCursorProps {
  /** Tamanho da fonte do cursor — deve casar com o texto adjacente */
  size: number;
  /** true = pisca em loop · false = aceso e parado */
  blinking?: boolean;
  /** Cor do cursor (default: textPrimary) */
  color?: string;
  /** Caractere usado como cursor */
  glyph?: '_' | '▌' | '█';
}

/**
 * Cursor de terminal — peça-chave da identidade Nostromo.
 *
 * Uso recomendado:
 * - Splash + /design-system: blinking={true}
 * - Header da Home: blinking={false} (estático aceso)
 * - Telas clínicas (Laudador, Resultado, Calculadoras, Curso): NÃO usar.
 *
 * @example
 * <Text>plantãoUSG<BlinkingCursor size={20} /></Text>
 */
export function BlinkingCursor({
  size,
  blinking = false,
  color = Colors.textPrimary,
  glyph = '_',
}: BlinkingCursorProps) {
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (!blinking) {
      opacity.value = 1;
      return;
    }
    opacity.value = withRepeat(
      withSequence(
        withTiming(0, {
          duration: Motion.duration.cursor,
          easing: Easing.linear,
        }),
        withTiming(1, {
          duration: Motion.duration.cursor,
          easing: Easing.linear,
        })
      ),
      -1,
      false
    );
  }, [blinking]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.Text
      style={[
        styles.cursor,
        {
          fontSize: size,
          color,
          lineHeight: size * 1.1,
        },
        animatedStyle,
      ]}
      accessibilityElementsHidden
      importantForAccessibility="no"
    >
      {glyph}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  cursor: {
    fontFamily: FontFamily.mono.bold,
  },
});
