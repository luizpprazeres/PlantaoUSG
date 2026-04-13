import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import { ArrowLeft, Copy } from 'lucide-react-native';
import { TypewriterText } from '@/components/ui/TypewriterText';
import { LaudoExtensoRenderer } from '@/components/resultado/LaudoExtensoRenderer';
import { FunilFooter } from '@/components/ui/FunilFooter';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { useLaudos } from '@/hooks/useLaudos';
import { useLaudadorStore } from '@/stores/laudadorStore';
import { Analytics } from '@/utils/analytics';
import { useTextCase } from '@/hooks/useTextCase';
import { applyTextCase } from '@/utils/textCase';

type Aba = 'extenso' | 'objetivo';

export default function ResultadoScreen() {
  const params = useLocalSearchParams<{
    extenso: string;
    objetivo: string;
    protocoloId: string;
  }>();
  const [aba, setAba] = useState<Aba>('extenso');
  const [saved, setSaved] = useState(false);
  const { salvarLaudo } = useLaudos();
  const { achadosSelecionados, observacoes, limitacoesSelecionadas, resetar } =
    useLaudadorStore();
  const { mode: textCaseMode } = useTextCase();

  const textoRaw = aba === 'extenso' ? (params.extenso ?? '') : (params.objetivo ?? '');
  const texto = applyTextCase(textoRaw, textCaseMode);

  const copiar = async () => {
    await Clipboard.setStringAsync(texto);
    Analytics.laudoCopied();
    if (Platform.OS === 'ios') {
      Alert.alert('', 'Laudo copiado para a área de transferência.', [
        { text: 'OK', style: 'cancel' },
      ]);
    }
  };

  const salvar = async () => {
    if (saved) return;
    try {
      await salvarLaudo({
        protocolo: params.protocoloId ?? '',
        inputRawJson: JSON.stringify({ achadosSelecionados, observacoes, limitacoesSelecionadas }),
        outputExtenso: params.extenso ?? '',
        outputObjetivo: params.objetivo ?? '',
      });
      setSaved(true);
      Analytics.laudoSavedHistory();
    } catch (e) {
      console.error('Erro ao salvar laudo:', e);
    }
  };

  // Salvar automaticamente ao entrar na tela
  useEffect(() => {
    salvar();
  }, []);

  const voltar = () => {
    resetar();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={voltar} style={styles.back}>
          <ArrowLeft size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.titulo}>LAUDO</Text>
        <TouchableOpacity onPress={copiar}>
          <Copy size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.abas}>
        {(['extenso', 'objetivo'] as Aba[]).map((a) => (
          <TouchableOpacity
            key={a}
            onPress={() => setAba(a)}
            style={[styles.aba, aba === a && styles.abaAtiva]}
          >
            <Text style={[styles.abaLabel, aba === a && styles.abaLabelAtiva]}>
              {a.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {aba === 'extenso' ? (
          <LaudoExtensoRenderer text={texto} fontSize={13} />
        ) : (
          <TypewriterText key={aba} text={texto} fontSize={13} />
        )}
        <FunilFooter
          posicao="resultado"
          copy="Laudos mais extensos ou outros tipos? Laudo USG →"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPrimary },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  back: {},
  titulo: {
    fontFamily: 'IBMPlexMono_700Bold',
    fontSize: FontSize.label,
    color: Colors.textPrimary,
    letterSpacing: 0.08,
  },
  abas: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.base,
  },
  aba: { marginRight: Spacing.lg, paddingBottom: Spacing.xs },
  abaAtiva: { borderBottomWidth: 1, borderBottomColor: Colors.textPrimary },
  abaLabel: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: FontSize.caption,
    color: Colors.textMuted,
    letterSpacing: 0.06,
  },
  abaLabelAtiva: { color: Colors.textPrimary },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing.base, paddingBottom: Spacing.xl },
});
