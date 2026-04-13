import { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { JanelaRow } from '@/components/laudador/JanelaRow';
import { JanelaSheet } from '@/components/laudador/JanelaSheet';
import { LimitacoesDropdown } from '@/components/laudador/LimitacoesDropdown';
import { ObservacoesBar } from '@/components/laudador/ObservacoesBar';
import { VoiceButton } from '@/components/ui/VoiceButton';
import { Chip } from '@/components/ui/Chip';
import { useLaudadorStore } from '@/stores/laudadorStore';
import { PROTOCOLO_MAP } from '@/data/protocolos';
import { gerarLaudo } from '@/services/llmClient';
import type { JanelaPayload } from '@/services/llmClient';
import { useVoz } from '@/hooks/useVoz';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { Analytics } from '@/utils/analytics';
import type { Janela } from '@/data/protocolos/tipos';

function BotaoGerar({ onPress, isLoading }: { onPress: () => void; isLoading: boolean }) {
  const scale = useSharedValue(1);
  const pulseOpacity = useSharedValue(1);

  useEffect(() => {
    if (isLoading) {
      pulseOpacity.value = withRepeat(
        withTiming(0.35, { duration: 700, easing: Easing.inOut(Easing.quad) }),
        -1,
        true
      );
    } else {
      cancelAnimation(pulseOpacity);
      pulseOpacity.value = withTiming(1, { duration: 150 });
    }
  }, [isLoading]);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: pulseOpacity.value,
  }));

  return (
    <Pressable
      onPressIn={() => {
        scale.value = withSpring(0.96, { damping: 22, stiffness: 380 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 20, stiffness: 350 });
      }}
      onPress={onPress}
      disabled={isLoading}
    >
      <Animated.View style={[styles.gerarBtn, buttonStyle]}>
        <Text style={styles.gerarText}>{isLoading ? 'GERANDO...' : 'GERAR'}</Text>
      </Animated.View>
    </Pressable>
  );
}

export default function LaudadorScreen() {
  const { protocolo: protocoloId } = useLocalSearchParams<{ protocolo: string }>();
  const protocolo = PROTOCOLO_MAP[protocoloId ?? ''];
  const [gerando, setGerando] = useState(false);
  const [sheetJanela, setSheetJanela] = useState<Janela | null>(null);
  const insets = useSafeAreaInsets();

  const {
    achadosSelecionados,
    observacoes,
    limitacoesSelecionadas,
    chipAtivadoresAtivos,
    toggleAchado,
    setObservacoes,
    appendObservacoes,
    toggleLimitacao,
    toggleChipAtivador,
  } = useLaudadorStore();

  const { listening, toggle: toggleVoz } = useVoz((text) => {
    appendObservacoes(text);
    Analytics.voiceUsed();
  });

  if (!protocolo) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={{ color: Colors.textPrimary, padding: Spacing.base }}>
          Protocolo não encontrado
        </Text>
      </SafeAreaView>
    );
  }

  const janelasVisiveis: Janela[] = [
    ...protocolo.janelas,
    ...(protocolo.janelasOpcionais ?? []).filter((j) =>
      chipAtivadoresAtivos.includes(j.chipAtivadorId)
    ),
  ];

  const handleGerar = useCallback(async () => {
    const todasNormais = janelasVisiveis.every(
      (j) => (achadosSelecionados[j.id]?.length ?? 0) === 0
    );
    if (todasNormais && !observacoes.trim()) {
      Alert.alert(
        'Nenhum achado',
        'Selecione pelo menos um achado ou adicione observações para gerar o laudo.'
      );
      return;
    }

    setGerando(true);
    const inicio = Date.now();
    const totalChips = Object.values(achadosSelecionados).flat().length;
    Analytics.chipsCount(totalChips);
    if (observacoes.trim()) Analytics.textFreeUsed();

    try {
      const janelas: JanelaPayload[] = janelasVisiveis.map((j) => {
        const sel = achadosSelecionados[j.id] ?? [];
        if (sel.length > 0) {
          const achados = j.grupos
            .flatMap((g) => g.achados)
            .filter((a) => sel.includes(a.id))
            .map((a) => a.label);
          return { nome: j.nome, achados };
        }
        return { nome: j.nome, status: 'normal' as const };
      });

      const limitacoes = protocolo.limitacoesTecnicas
        .filter((l) => limitacoesSelecionadas.includes(l.id))
        .map((l) => l.label);

      const resultado = await gerarLaudo({
        protocolo: protocolo.nomeCompleto,
        transdutor: protocolo.transdutor,
        janelas,
        observacoes,
        limitacoes,
      });

      Analytics.laudoGenerated(protocolo.id, Date.now() - inicio);

      router.push({
        pathname: '/resultado',
        params: {
          extenso: resultado.extenso,
          objetivo: resultado.objetivo,
          protocoloId: protocolo.id,
        },
      });
    } catch (err) {
      Alert.alert('Erro', (err as Error).message);
    } finally {
      setGerando(false);
    }
  }, [achadosSelecionados, observacoes, limitacoesSelecionadas, janelasVisiveis, protocolo]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <ArrowLeft size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.titulo}>{protocolo.nome}</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {protocolo.janelasOpcionais && protocolo.janelasOpcionais.length > 0 && (
          <View style={styles.ativadores}>
            {protocolo.janelasOpcionais.map((j) => (
              <Chip
                key={j.chipAtivadorId}
                label={j.nome}
                selected={chipAtivadoresAtivos.includes(j.chipAtivadorId)}
                onPress={() => toggleChipAtivador(j.chipAtivadorId)}
              />
            ))}
          </View>
        )}

        {janelasVisiveis.map((janela) => (
          <JanelaRow
            key={janela.id}
            janela={janela}
            selecionados={achadosSelecionados[janela.id] ?? []}
            onPress={() => setSheetJanela(janela)}
            onRemoveAchado={(achadoId) => toggleAchado(janela.id, achadoId)}
          />
        ))}

        <LimitacoesDropdown
          limitacoes={protocolo.limitacoesTecnicas}
          selecionadas={limitacoesSelecionadas}
          onToggle={toggleLimitacao}
        />
      </ScrollView>

      <ObservacoesBar value={observacoes} onChange={setObservacoes} />

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + Spacing.md }]}>
        <VoiceButton listening={listening} onPress={toggleVoz} />
        <BotaoGerar onPress={handleGerar} isLoading={gerando} />
      </View>

      <JanelaSheet
        janela={sheetJanela}
        selecionados={sheetJanela ? (achadosSelecionados[sheetJanela.id] ?? []) : []}
        onToggle={(achadoId) => {
          if (sheetJanela) toggleAchado(sheetJanela.id, achadoId);
        }}
        onClose={() => setSheetJanela(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPrimary },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  back: { marginRight: Spacing.md },
  titulo: {
    fontFamily: 'IBMPlexMono_600SemiBold',
    fontSize: FontSize.heading,
    color: Colors.textPrimary,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing.base, paddingBottom: Spacing.xl },
  ativadores: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: Spacing.base },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
    backgroundColor: Colors.bgElevated,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
  },
  gerarBtn: {
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: 4,
    minWidth: 120,
    alignItems: 'center',
  },
  gerarText: {
    fontFamily: 'IBMPlexMono_700Bold',
    fontSize: FontSize.label,
    color: Colors.bgPrimary,
    letterSpacing: 0.06,
  },
});
