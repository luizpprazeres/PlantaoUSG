import { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { JanelaBlock } from '@/components/laudador/JanelaBlock';
import { ObservacoesBar } from '@/components/laudador/ObservacoesBar';
import { VoiceButton } from '@/components/ui/VoiceButton';
import { Chip } from '@/components/ui/Chip';
import { useLaudadorStore } from '@/stores/laudadorStore';
import { PROTOCOLO_MAP } from '@/data/protocolos';
import { gerarLaudo } from '@/services/llmClient';
import { useVoz } from '@/hooks/useVoz';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { Analytics } from '@/utils/analytics';

export default function LaudadorScreen() {
  const { protocolo: protocoloId } = useLocalSearchParams<{ protocolo: string }>();
  const protocolo = PROTOCOLO_MAP[protocoloId ?? ''];
  const [gerando, setGerando] = useState(false);
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

  const handleGerar = useCallback(async () => {
    const totalChips = Object.values(achadosSelecionados).flat().length;
    if (totalChips === 0 && !observacoes.trim()) {
      Alert.alert('Nenhum achado', 'Selecione pelo menos um achado ou adicione observações.');
      return;
    }

    setGerando(true);
    const inicio = Date.now();
    Analytics.chipsCount(totalChips);
    if (observacoes.trim()) Analytics.textFreeUsed();

    try {
      const janelasComInput = protocolo.janelas
        .filter((j) => (achadosSelecionados[j.id]?.length ?? 0) > 0)
        .map((j) => ({
          nome: j.nome,
          achados: j.grupos
            .flatMap((g) => g.achados)
            .filter((a) => achadosSelecionados[j.id]?.includes(a.id))
            .map((a) => a.label),
        }));

      const limitacoes = protocolo.limitacoesTecnicas
        .filter((l) => limitacoesSelecionadas.includes(l.id))
        .map((l) => l.label);

      const resultado = await gerarLaudo({
        protocolo: protocolo.nomeCompleto,
        transdutor: protocolo.transdutor,
        janelas: janelasComInput,
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
      Alert.alert('Erro ao gerar laudo', (err as Error).message);
    } finally {
      setGerando(false);
    }
  }, [achadosSelecionados, observacoes, limitacoesSelecionadas, protocolo]);

  const janelasVisiveis = [
    ...protocolo.janelas,
    ...(protocolo.janelasOpcionais ?? []).filter((j) =>
      chipAtivadoresAtivos.includes(j.chipAtivadorId)
    ),
  ];

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
          <JanelaBlock
            key={janela.id}
            janela={janela}
            selecionados={achadosSelecionados[janela.id] ?? []}
            onToggle={(achadoId) => toggleAchado(janela.id, achadoId)}
          />
        ))}

        <Text style={styles.sectionLabel}>LIMITAÇÕES TÉCNICAS</Text>
        <View style={styles.limitacoes}>
          {protocolo.limitacoesTecnicas.map((l) => (
            <Chip
              key={l.id}
              label={l.label}
              selected={limitacoesSelecionadas.includes(l.id)}
              onPress={() => toggleLimitacao(l.id)}
            />
          ))}
        </View>
      </ScrollView>

      <ObservacoesBar value={observacoes} onChange={setObservacoes} />

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + Spacing.md }]}>
        <VoiceButton listening={listening} onPress={toggleVoz} />
        <TouchableOpacity
          style={[styles.gerarBtn, gerando && styles.gerarBtnDisabled]}
          onPress={handleGerar}
          disabled={gerando}
        >
          {gerando ? (
            <ActivityIndicator color={Colors.bgPrimary} size="small" />
          ) : (
            <Text style={styles.gerarText}>GERAR</Text>
          )}
        </TouchableOpacity>
      </View>
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
  sectionLabel: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: FontSize.micro,
    color: Colors.textMuted,
    letterSpacing: 0.08,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  limitacoes: { flexDirection: 'row', flexWrap: 'wrap' },
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
  gerarBtnDisabled: { opacity: 0.5 },
  gerarText: {
    fontFamily: 'IBMPlexMono_700Bold',
    fontSize: FontSize.label,
    color: Colors.bgPrimary,
    letterSpacing: 0.06,
  },
});
