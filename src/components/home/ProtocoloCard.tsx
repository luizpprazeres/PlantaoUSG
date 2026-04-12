import { Pressable, Text, View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Colors, FontSize, Spacing, Radius } from '@/constants/theme';
import type { Protocolo } from '@/data/protocolos/tipos';

interface ProtocoloCardProps {
  protocolo: Pick<Protocolo, 'id' | 'nome' | 'indicacao' | 'categoria'>;
  disponivel: boolean;
  onPress: () => void;
}

export function ProtocoloCard({ protocolo, disponivel, onPress }: ProtocoloCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  function handlePressIn() {
    if (!disponivel) return;
    scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
  }

  function handlePressOut() {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  }

  return (
    <Pressable
      onPress={disponivel ? onPress : undefined}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.pressable}
    >
      <Animated.View style={[styles.card, !disponivel && styles.cardDisabled, animatedStyle]}>
        {protocolo.categoria ? (
          <Text style={styles.categoria}>{protocolo.categoria}</Text>
        ) : null}
        <Text style={styles.nome}>{protocolo.nome}</Text>
        <View style={styles.divisor} />
        <Text style={styles.indicacao} numberOfLines={2}>
          {disponivel ? protocolo.indicacao : 'EM BREVE'}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
    margin: Spacing.xs,
  },
  card: {
    flex: 1,
    backgroundColor: Colors.bgElevated,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    padding: Spacing.base,
    minHeight: 110,
  },
  cardDisabled: {
    opacity: 0.3,
    borderColor: '#141414',
  },
  categoria: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 9,
    color: '#2E2E2E',
    letterSpacing: 3,
    marginBottom: 8,
  },
  nome: {
    fontFamily: 'IBMPlexMono_700Bold',
    fontSize: 16,
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
  divisor: {
    width: 20,
    height: 0.5,
    backgroundColor: '#2A2A2A',
    marginVertical: 8,
  },
  indicacao: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 10,
    color: '#3A3A3A',
    lineHeight: 16,
  },
});
