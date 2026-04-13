import { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { ProtocoloCard } from '@/components/home/ProtocoloCard';
import { FunilFooter } from '@/components/ui/FunilFooter';
import { PROTOCOLOS } from '@/data/protocolos';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { Analytics } from '@/utils/analytics';
import { useLaudadorStore } from '@/stores/laudadorStore';

const DISPONIVEIS = ['efast', 'blue'];

const PLACEHOLDER_PROTOCOLOS = [
  { id: 'cardiaco', nome: 'Cardíaco', indicacao: 'Função ventricular, câmaras, pericárdio', categoria: 'CARDÍACO' },
  { id: 'rush', nome: 'Protocolo RUSH', indicacao: 'Choque indiferenciado — avaliação integrada cardíaca, pulmonar e vascular', categoria: 'CHOQUE' },
  { id: 'vascular2', nome: 'Vascular', indicacao: 'Aorta abdominal, veia cava, vasos periféricos', categoria: 'VASCULAR' },
  { id: 'acessos', nome: 'Acessos guiados', indicacao: 'VJI, subclávia, femoral, artéria radial', categoria: 'ACESSO' },
];

const TODOS = [...PROTOCOLOS, ...PLACEHOLDER_PROTOCOLOS];

function AnimatedCard({
  item,
  index,
  onPress,
}: {
  item: typeof TODOS[number];
  index: number;
  onPress: () => void;
}) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(12);

  useEffect(() => {
    opacity.value = withDelay(
      index * 80,
      withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) })
    );
    translateY.value = withDelay(
      index * 80,
      withTiming(0, { duration: 300, easing: Easing.out(Easing.cubic) })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[{ flex: 1 }, animatedStyle]}>
      <ProtocoloCard
        protocolo={item}
        disponivel={DISPONIVEIS.includes(item.id)}
        onPress={onPress}
      />
    </Animated.View>
  );
}

export default function HomeScreen() {
  const iniciar = useLaudadorStore((s) => s.iniciar);

  useEffect(() => {
    Analytics.appOpened();
  }, []);

  const pares: typeof TODOS[number][][] = [];
  for (let i = 0; i < TODOS.length; i += 2) {
    pares.push(TODOS.slice(i, i + 2));
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Header centralizado */}
        <View style={styles.header}>
          <Text style={styles.title}>Plantão USG</Text>
          <Text style={styles.subtitle}>POCUS · LAUDOS · EMERGÊNCIA</Text>
        </View>

        {/* Nav links */}
        <View style={styles.nav}>
          <TouchableOpacity onPress={() => router.push('/historico')}>
            <Text style={styles.navLink}>HISTÓRICO</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/tira-duvidas')}>
            <Text style={styles.navLink}>DÚVIDAS</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/sobre')}>
            <Text style={styles.navLink}>SOBRE</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.separator} />

        {/* Grid de cards com stagger */}
        <View style={styles.grid}>
          {pares.map((par, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {par.map((p, colIndex) => {
                const cardIndex = rowIndex * 2 + colIndex;
                return (
                  <AnimatedCard
                    key={p.id}
                    item={p}
                    index={cardIndex}
                    onPress={() => {
                      iniciar(p.id);
                      Analytics.protocolSelected(p.id);
                      router.push(`/laudador/${p.id}`);
                    }}
                  />
                );
              })}
              {par.length === 1 && <View style={{ flex: 1, margin: Spacing.xs }} />}
            </View>
          ))}
        </View>

        <FunilFooter posicao="home" copy="Parceria LaudoUSG →" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPrimary },
  scroll: { paddingBottom: Spacing.xl },
  header: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#0F0F0F',
  },
  title: {
    fontFamily: 'IBMPlexMono_700Bold',
    fontSize: FontSize.heading,
    color: Colors.textPrimary,
    letterSpacing: 1.5,
  },
  subtitle: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 9,
    color: Colors.textPrimary,
    letterSpacing: 2.5,
    marginTop: 5,
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#0F0F0F',
  },
  navLink: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 9,
    color: Colors.textPrimary,
    letterSpacing: 1.5,
  },
  separator: {
    height: 1,
    backgroundColor: '#0F0F0F',
  },
  grid: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
  },
  row: { flexDirection: 'row' },
});
