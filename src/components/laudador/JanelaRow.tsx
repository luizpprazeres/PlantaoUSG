import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, Spacing, Radius } from '@/constants/theme';
import type { Janela } from '@/data/protocolos/tipos';

interface JanelaRowProps {
  janela: Janela;
  selecionados: string[];
  onPress: () => void;
  onRemoveAchado: (achadoId: string) => void;
}

export function JanelaRow({ janela, selecionados, onPress, onRemoveAchado }: JanelaRowProps) {
  const allAchados = janela.grupos.flatMap((g) => g.achados);

  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.nome}>{janela.nome}</Text>
      <View style={styles.tagsContainer}>
        {selecionados.length === 0 ? (
          <Text style={styles.semAlteracao}>sem alteração</Text>
        ) : (
          selecionados.map((achadoId) => {
            const achado = allAchados.find((a) => a.id === achadoId);
            if (!achado) return null;
            return (
              <View key={achadoId} style={styles.tag}>
                <Text style={styles.tagLabel} numberOfLines={1}>
                  {achado.label}
                </Text>
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={(e) => {
                    e.stopPropagation?.();
                    onRemoveAchado(achadoId);
                  }}
                  hitSlop={{ top: 8, bottom: 8, left: 4, right: 8 }}
                >
                  <Text style={styles.removeText}>×</Text>
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  nome: {
    fontFamily: 'IBMPlexMono_600SemiBold',
    fontSize: FontSize.label,
    color: Colors.textPrimary,
    flex: 1,
    marginRight: Spacing.sm,
    paddingTop: 2,
  },
  tagsContainer: {
    flex: 1.2,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  semAlteracao: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.caption,
    color: Colors.textMuted,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.textPrimary,
    borderRadius: Radius.micro,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    marginLeft: Spacing.xs,
    marginBottom: Spacing.xs,
    maxWidth: 180,
  },
  tagLabel: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: FontSize.caption,
    color: Colors.bgPrimary,
    flex: 1,
  },
  removeBtn: {
    marginLeft: 4,
  },
  removeText: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: FontSize.caption,
    color: Colors.bgPrimary,
  },
});
