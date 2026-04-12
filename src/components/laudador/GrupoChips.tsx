import { View, Text, StyleSheet } from 'react-native';
import { Chip } from '@/components/ui/Chip';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import type { GrupoAchados } from '@/data/protocolos/tipos';

interface GrupoChipsProps {
  grupo: GrupoAchados;
  janelaId: string;
  selecionados: string[];
  onToggle: (achadoId: string) => void;
}

export function GrupoChips({ grupo, selecionados, onToggle }: GrupoChipsProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{grupo.label.toUpperCase()}</Text>
      <View style={styles.chips}>
        {grupo.achados.map((achado) => (
          <Chip
            key={achado.id}
            label={achado.label}
            selected={selecionados.includes(achado.id)}
            onPress={() => onToggle(achado.id)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.base },
  label: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: FontSize.micro,
    color: Colors.textMuted,
    letterSpacing: 0.08 * FontSize.micro,
    marginBottom: Spacing.sm,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap' },
});
