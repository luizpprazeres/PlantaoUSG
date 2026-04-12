import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Colors, FontSize, Spacing, Radius } from '@/constants/theme';
import type { Protocolo } from '@/data/protocolos/tipos';

interface ProtocoloCardProps {
  protocolo: Pick<Protocolo, 'id' | 'nome' | 'indicacao'>;
  disponivel: boolean;
  onPress: () => void;
}

export function ProtocoloCard({ protocolo, disponivel, onPress }: ProtocoloCardProps) {
  return (
    <TouchableOpacity
      onPress={disponivel ? onPress : undefined}
      style={[styles.card, !disponivel && styles.cardDisabled]}
      activeOpacity={0.7}
    >
      <Text style={styles.nome}>{protocolo.nome}</Text>
      <Text style={styles.indicacao} numberOfLines={2}>
        {protocolo.indicacao}
      </Text>
      {!disponivel && <Text style={styles.emBreve}>EM BREVE</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.bgElevated,
    borderRadius: Radius.md,
    padding: Spacing.base,
    minHeight: 100,
    margin: Spacing.xs,
  },
  cardDisabled: { opacity: 0.4 },
  nome: {
    fontFamily: 'IBMPlexMono_700Bold',
    fontSize: FontSize.heading,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  indicacao: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
    lineHeight: FontSize.caption * 1.6,
  },
  emBreve: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: FontSize.micro,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
    letterSpacing: 0.06,
  },
});
