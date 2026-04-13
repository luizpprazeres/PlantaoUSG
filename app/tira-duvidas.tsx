import { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Send } from 'lucide-react-native';
import { tirarDuvida, type MensagemChat } from '@/services/llmClient';
import { useVoz } from '@/hooks/useVoz';
import { VoiceButton } from '@/components/ui/VoiceButton';
import { Colors, FontSize, Spacing, Radius } from '@/constants/theme';
import { MarkdownText } from '@/components/ui/MarkdownText';

const SUGESTOES = [
  'Qual o TAPSE normal?',
  'Como identificar pneumotórax?',
  'O que é VExUS?',
  'Sinal A vs sinal B',
  'Como medir a VCI?',
  'FEVE visual: como estimar?',
];

interface Mensagem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function TiraDuvidasScreen() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [input, setInput] = useState('');
  const [carregando, setCarregando] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();

  const { listening, toggle: toggleVoz } = useVoz((text) => {
    setInput((prev) => (prev ? `${prev} ${text}` : text));
  });

  const enviar = useCallback(async (texto: string) => {
    const pergunta = texto.trim();
    if (!pergunta || carregando) return;

    const novaMsgUser: Mensagem = {
      id: Date.now().toString(),
      role: 'user',
      content: pergunta,
    };

    const novaLista = [...mensagens, novaMsgUser];
    setMensagens(novaLista);
    setInput('');
    setCarregando(true);

    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      const historico: MensagemChat[] = novaLista.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const resposta = await tirarDuvida(historico);

      setMensagens((prev) => [
        ...prev,
        {
          id: `${Date.now()}-r`,
          role: 'assistant',
          content: resposta,
        },
      ]);
    } catch (err) {
      setMensagens((prev) => [
        ...prev,
        {
          id: `${Date.now()}-err`,
          role: 'assistant',
          content: `Erro ao buscar resposta: ${(err as Error).message}`,
        },
      ]);
    } finally {
      setCarregando(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [mensagens, carregando]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <ArrowLeft size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View>
          <Text style={styles.titulo}>TIRA-DÚVIDAS</Text>
          <Text style={styles.subtitulo}>POCUS · AI</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Área de mensagens */}
        <ScrollView
          ref={scrollRef}
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            mensagens.length === 0 && styles.scrollEmpty,
          ]}
          keyboardShouldPersistTaps="handled"
          scrollEventThrottle={16}
        >
          {mensagens.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Pergunte sobre POCUS</Text>
              <Text style={styles.emptySubtitle}>
                Técnica, interpretação, valores de referência, protocolos
              </Text>
              <View style={styles.sugestoesGrid}>
                {SUGESTOES.map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={styles.sugestao}
                    onPress={() => enviar(s)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.sugestaoText}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : (
            mensagens.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.bubble,
                  msg.role === 'user' ? styles.bubbleUser : styles.bubbleAssistant,
                ]}
              >
                {msg.role === 'user' ? (
                <Text style={[styles.bubbleText, styles.bubbleTextUser]}>
                  {msg.content}
                </Text>
              ) : (
                <MarkdownText text={msg.content} />
              )}
              </View>
            ))
          )}

          {carregando && (
            <View style={[styles.bubble, styles.bubbleAssistant, styles.bubbleLoading]}>
              <ActivityIndicator size="small" color={Colors.textMuted} />
            </View>
          )}
        </ScrollView>

        {/* Barra de input */}
        <View style={[styles.inputBar, { paddingBottom: insets.bottom + Spacing.sm }]}>
          <VoiceButton listening={listening} onPress={toggleVoz} />
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Sua dúvida sobre POCUS..."
            placeholderTextColor="#999999"
            multiline
            maxLength={500}
            returnKeyType="default"
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!input.trim() || carregando) && styles.sendBtnDisabled]}
            onPress={() => enviar(input)}
            disabled={!input.trim() || carregando}
            activeOpacity={0.7}
          >
            <Send size={18} color={!input.trim() || carregando ? Colors.textMuted : Colors.bgPrimary} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPrimary },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  back: { marginRight: Spacing.md },
  titulo: {
    fontFamily: 'IBMPlexMono_600SemiBold',
    fontSize: FontSize.heading,
    color: Colors.textPrimary,
  },
  subtitulo: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 9,
    color: Colors.textMuted,
    letterSpacing: 2,
    marginTop: 2,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.base,
  },
  scrollEmpty: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  emptyTitle: {
    fontFamily: 'IBMPlexMono_600SemiBold',
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  emptySubtitle: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.caption,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  sugestoesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  sugestao: {
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  sugestaoText: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
  },
  bubble: {
    maxWidth: '85%',
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  bubbleUser: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.textPrimary,
  },
  bubbleAssistant: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.bgElevated,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  bubbleLoading: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  bubbleText: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.caption,
    lineHeight: 18,
  },
  bubbleTextUser: {
    color: Colors.bgPrimary,
  },
  bubbleTextAssistant: {
    color: Colors.textSecondary,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
    backgroundColor: Colors.bgElevated,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.caption,
    color: '#000000',
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  sendBtn: {
    width: 40,
    height: 40,
    backgroundColor: Colors.textPrimary,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: Colors.bgInput,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
});
