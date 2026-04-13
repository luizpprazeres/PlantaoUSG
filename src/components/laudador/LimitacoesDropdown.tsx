import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { ChevronDown } from 'lucide-react-native';
import { Chip } from '@/components/ui/Chip';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import type { LimitacaoTecnica } from '@/data/protocolos/tipos';

interface LimitacoesDropdownProps {
  limitacoes: LimitacaoTecnica[];
  selecionadas: string[];
  onToggle: (limitacaoId: string) => void;
}

export function LimitacoesDropdown({ limitacoes, selecionadas, onToggle }: LimitacoesDropdownProps) {
  const [expanded, setExpanded] = useState(false);
  const progress = useSharedValue(0);

  const toggle = () => {
    const next = !expanded;
    setExpanded(next);
    progress.value = withSpring(next ? 1 : 0, { damping: 20, stiffness: 300 });
  };

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{
      rotate: `${interpolate(progress.value, [0, 1], [0, 180], Extrapolation.CLAMP)}deg`,
    }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.5, 1], [0, 0, 1], Extrapolation.CLAMP),
    maxHeight: interpolate(progress.value, [0, 1], [0, 300], Extrapolation.CLAMP),
    overflow: 'hidden',
  }));

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={toggle} activeOpacity={0.7}>
        <Text style={styles.label}>LIMITAÇÕES TÉCNICAS</Text>
        <Animated.View style={chevronStyle}>
          <ChevronDown size={14} color={Colors.textMuted} />
        </Animated.View>
      </TouchableOpacity>
      <Animated.View style={[styles.chips, contentStyle]}>
        {limitacoes.map((l) => (
          <Chip
            key={l.id}
            label={l.label}
            selected={selecionadas.includes(l.id)}
            onPress={() => onToggle(l.id)}
          />
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  label: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: FontSize.micro,
    color: Colors.textMuted,
    letterSpacing: 0.08 * FontSize.micro,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: Spacing.md,
    paddingBottom: Spacing.base,
  },
});
