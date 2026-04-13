import { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { Calculator, MessageCircle } from 'lucide-react-native';
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
import { usePreferences } from '@/hooks/usePreferences';

const DISPONIVEIS = ['efast', 'blue', 'rush', 'cardiac', 'vexus', 'obstetrico'];

const PLACEHOLDER_PROTOCOLOS = [
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
  const { get } = usePreferences();

  useEffect(() => {
    Analytics.appOpened();
    get('onboarding_done').then((done) => {
      if (!done) router.replace('/onboarding');
    });
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
          <TouchableOpacity onPress={() => router.push('/videos')}>
            <Text style={styles.navLink}>VÍDEOS</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/curso')}>
            <Text style={styles.navLink}>CURSO</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/preferencias')}>
            <Text style={styles.navLink}>PREF.</Text>
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

        <View style={styles.bottomRow}>
          <Pressable style={styles.bottomCard} onPress={() => router.push('/calculadoras')}>
            <Calculator size={15} color={Colors.textMuted} />
            <View style={styles.bottomCardText}>
              <Text style={styles.bottomCardNome}>CALCULADORAS</Text>
              <Text style={styles.bottomCardDesc}>PAM, qSOFA, débito cardíaco...</Text>
            </View>
          </Pressable>
          <Pressable style={styles.bottomCard} onPress={() => router.push('/tira-duvidas')}>
            <MessageCircle size={15} color={Colors.textMuted} />
            <View style={styles.bottomCardText}>
              <Text style={styles.bottomCardNome}>DÚVIDAS</Text>
              <Text style={styles.bottomCardDesc}>POCUS · AI</Text>
            </View>
          </Pressable>
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
  bottomRow: {
    flexDirection: 'row',
    marginHorizontal: Spacing.base,
    marginTop: Spacing.base,
    gap: Spacing.sm,
  },
  bottomCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.bgElevated,
    padding: Spacing.md,
  },
  bottomCardText: { flex: 1 },
  bottomCardNome: {
    fontFamily: 'IBMPlexMono_700Bold',
    fontSize: FontSize.caption,
    color: Colors.textPrimary,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  bottomCardDesc: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 10,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
});
