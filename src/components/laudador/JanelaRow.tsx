import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
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
  const bgOpacity = useSharedValue(0);

  const rowBgStyle = useAnimatedStyle(() => ({
    backgroundColor: `rgba(255, 255, 255, ${bgOpacity.value * 0.04})`,
  }));

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      onPressIn={() => { bgOpacity.value = withTiming(1, { duration: 60 }); }}
      onPressOut={() => { bgOpacity.value = withTiming(0, { duration: 200, easing: Easing.out(Easing.quad) }); }}
    >
      <Animated.View style={[styles.row, rowBgStyle]}>
        <Text style={styles.nome}>
          {selecionados.length > 0 && (
            <Text style={styles.indicator}>● </Text>
          )}
          {janela.nome}
        </Text>
        <View style={styles.tagsContainer}>
          {selecionados.length === 0 ? (
            <Text style={styles.semAlteracao}>—</Text>
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
                    onPress={() => {
                      onRemoveAchado(achadoId);
                    }}
                    activeOpacity={0.6}
                    hitSlop={{ top: 8, bottom: 8, left: 4, right: 8 }}
                  >
                    <Text style={styles.removeText}>×</Text>
                  </TouchableOpacity>
                </View>
              );
            })
          )}
        </View>
      </Animated.View>
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
  indicator: {
    color: Colors.emergencyRed,
    fontFamily: 'IBMPlexMono_600SemiBold',
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
    paddingVertical: Spacing.xs,
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
    marginLeft: Spacing.xs,
  },
  removeText: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: FontSize.caption,
    color: Colors.bgPrimary,
  },
});
