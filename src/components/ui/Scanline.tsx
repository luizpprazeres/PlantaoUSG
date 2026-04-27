import { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Colors, Motion } from '@/constants/theme';

interface ScanlineProps {
  /** Altura da área onde a scanline irá varrer (em px) */
  height: number;
  /** Opacidade da linha (0–1). Default: Motion.scanlineOpacity (~8%) */
  opacity?: number;
  /** Cor da linha (default: textPrimary) */
  color?: string;
  /** Estilo extra do container (z-index, position, etc.) */
  style?: ViewStyle;
  /** Duração do ciclo top→bottom em ms (default: Motion.duration.scanline) */
  duration?: number;
  /** Pausa o loop (útil para a página /design-system) */
  paused?: boolean;
}

/**
 * Scanline — linha horizontal que varre verticalmente, sutil.
 * Referência: feixe de varredura do ultrassom.
 *
 * Uso recomendado (Nostromo):
 * - Splash screen
 * - Header da Home (sutil, ~8%)
 * - /design-system (demonstração)
 *
 * NÃO usar em:
 * - Telas clínicas de fluxo (Laudador, Resultado, Calculadoras, Curso)
 * - Áreas com texto de leitura
 *
 * @example
 * <View style={{ height: 80, overflow: 'hidden' }}>
 *   <Header />
 *   <Scanline height={80} />
 * </View>
 */
export function Scanline({
  height,
  opacity = Motion.scanlineOpacity,
  color = Colors.textPrimary,
  style,
  duration = Motion.duration.scanline,
  paused = false,
}: ScanlineProps) {
  const translateY = useSharedValue(-2);

  useEffect(() => {
    if (paused) {
      translateY.value = -2;
      return;
    }
    translateY.value = withRepeat(
      withTiming(height, {
        duration,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, [paused, height, duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View
      pointerEvents="none"
      style={[styles.container, style]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Animated.View
        style={[
          styles.line,
          { backgroundColor: color, opacity },
          animatedStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  line: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
  },
});
