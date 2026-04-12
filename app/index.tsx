import { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProtocoloCard } from '@/components/home/ProtocoloCard';
import { FunilFooter } from '@/components/ui/FunilFooter';
import { PROTOCOLOS } from '@/data/protocolos';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { Analytics } from '@/utils/analytics';
import { useLaudadorStore } from '@/stores/laudadorStore';

const DISPONIVEIS = ['efast', 'blue'];

const PLACEHOLDER_PROTOCOLOS = [
  { id: 'cardiaco', nome: 'Cardíaco', indicacao: 'Função ventricular, câmaras, pericárdio' },
  { id: 'abdominal', nome: 'Abdominal', indicacao: 'Aorta, bexiga, vias biliares, rins' },
  { id: 'aaa', nome: 'AAA', indicacao: 'Aneurisma de aorta abdominal' },
  { id: 'vascular', nome: 'Vascular', indicacao: 'VJI, subclávia, femoral, PAI' },
];

const TODOS = [...PROTOCOLOS, ...PLACEHOLDER_PROTOCOLOS];

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
        <View style={styles.header}>
          <Text style={styles.title}>Plantão USG</Text>
          <Text style={styles.subtitle}>POCUS à beira-leito</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={() => router.push('/historico')}>
              <Text style={styles.headerLink}>Histórico</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/sobre')}>
              <Text style={styles.headerLink}>Sobre</Text>
            </TouchableOpacity>
          </View>
        </View>

        {pares.map((par, i) => (
          <View key={i} style={styles.row}>
            {par.map((p) => (
              <ProtocoloCard
                key={p.id}
                protocolo={p}
                disponivel={DISPONIVEIS.includes(p.id)}
                onPress={() => {
                  iniciar(p.id);
                  Analytics.protocolSelected(p.id);
                  router.push(`/laudador/${p.id}`);
                }}
              />
            ))}
            {par.length === 1 && <View style={{ flex: 1, margin: Spacing.xs }} />}
          </View>
        ))}

        <FunilFooter posicao="home" copy="by Laudo USG →" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPrimary },
  scroll: { paddingHorizontal: Spacing.base, paddingBottom: Spacing.xl },
  header: { paddingTop: Spacing.lg, paddingBottom: Spacing.xl },
  title: {
    fontFamily: 'IBMPlexMono_700Bold',
    fontSize: FontSize.display,
    color: Colors.textPrimary,
    letterSpacing: 0.02 * 28,
  },
  subtitle: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.label,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.base,
    marginTop: Spacing.md,
  },
  headerLink: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.caption,
    color: Colors.textMuted,
  },
  row: { flexDirection: 'row' },
});
