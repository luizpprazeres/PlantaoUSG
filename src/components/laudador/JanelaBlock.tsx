import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { GrupoChips } from './GrupoChips';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import type { Janela } from '@/data/protocolos/tipos';

interface JanelaBlockProps {
  janela: Janela;
  selecionados: string[];
  onToggle: (achadoId: string) => void;
  startExpanded?: boolean;
}

export function JanelaBlock({ janela, selecionados, onToggle, startExpanded = false }: JanelaBlockProps) {
  const [expanded, setExpanded] = useState(startExpanded);
  const opacity = useSharedValue(startExpanded ? 1 : 0);

  const toggle = () => {
    const next = !expanded;
    setExpanded(next);
    opacity.value = withTiming(next ? 1 : 0, { duration: 220 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    display: opacity.value === 0 ? 'none' : 'flex',
  }));

  const temSelecionados = selecionados.length > 0;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggle} style={styles.header}>
        <Text style={[styles.nome, temSelecionados && styles.nomeAtivo]}>
          {janela.nome}
          {temSelecionados && ` (${selecionados.length})`}
        </Text>
        {expanded
          ? <ChevronUp size={16} color={Colors.textMuted} />
          : <ChevronDown size={16} color={Colors.textMuted} />}
      </TouchableOpacity>
      {expanded && (
        <Animated.View style={[animatedStyle, styles.content]}>
          {janela.grupos.map((grupo) => (
            <GrupoChips
              key={grupo.categoria}
              grupo={grupo}
              janelaId={janela.id}
              selecionados={selecionados}
              onToggle={onToggle}
            />
          ))}
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.xs },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.base,
  },
  nome: {
    fontFamily: 'IBMPlexMono_600SemiBold',
    fontSize: FontSize.label,
    color: Colors.textSecondary,
    flex: 1,
    letterSpacing: 0.04 * FontSize.label,
  },
  nomeAtivo: { color: Colors.textPrimary },
  content: { paddingBottom: Spacing.base },
});
