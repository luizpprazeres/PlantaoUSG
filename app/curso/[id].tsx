import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, StatusBar,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react-native';
import { MODULO_MAP } from '@/data/curso';
import type { Aula, QuestaoAula } from '@/data/curso';
import { MarkdownText } from '@/components/ui/MarkdownText';
import { HtmlRenderer } from '@/components/ui/HtmlRenderer';

// ── PALETA (fundo branco) ──────────────────────────────────────────────────
const C = {
  bg: '#FFFFFF',
  surface: '#F5F5F5',
  border: '#E0E0E0',
  text: '#1a1a1a',
  textSub: '#555555',
  textMuted: '#888888',
  correct: '#4CAF50',
  correctBg: '#F0FBF0',
  wrong: '#F44336',
  wrongBg: '#FFF0F0',
  accent: '#1a1a1a',
  accentText: '#FFFFFF',
  progress: '#1a1a1a',
} as const;

type FaseAula = 'conteudo' | 'quiz' | 'resultado';

function QuizQuestao({
  questao,
  onResponder,
}: {
  questao: QuestaoAula;
  onResponder: (correta: boolean) => void;
}) {
  const [selecionado, setSelecionado] = useState<number | null>(null);
  const respondido = selecionado !== null;

  const handleSeleção = (idx: number) => {
    if (respondido) return;
    setSelecionado(idx);
    onResponder(idx === questao.correta);
  };

  return (
    <View style={s.questao}>
      <View style={s.questaoCard}>
        <Text style={s.questaoEnunciado}>{questao.enunciado}</Text>
      </View>

      <View style={s.opcoes}>
        {questao.opcoes.map((opcao, idx) => {
          const correta = respondido && idx === questao.correta;
          const errada = respondido && idx === selecionado && idx !== questao.correta;
          const selecionadaAtual = !respondido && selecionado === idx;

          return (
            <TouchableOpacity
              key={idx}
              style={[
                s.opcaoBtn,
                selecionadaAtual && s.opcaoBtnSelecionada,
                correta && s.opcaoBtnCorreta,
                errada && s.opcaoBtnErrada,
              ]}
              onPress={() => handleSeleção(idx)}
              activeOpacity={respondido ? 1 : 0.7}
            >
              <Text style={[
                s.opcaoText,
                correta && s.opcaoTextCorreta,
                errada && s.opcaoTextErrada,
              ]}>
                {opcao}
              </Text>
              {correta && <Check size={16} color={C.correct} />}
              {errada && <X size={16} color={C.wrong} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {respondido && (
        <View style={s.explicacaoBox}>
          <Text style={s.explicacaoLabel}>EXPLICAÇÃO</Text>
          <Text style={s.explicacaoText}>{questao.explicacao}</Text>
        </View>
      )}
    </View>
  );
}

export default function CursoModuloScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const modulo = MODULO_MAP[id ?? ''];

  const [aulaIdx, setAulaIdx] = useState(0);
  const [fase, setFase] = useState<FaseAula>('conteudo');
  const [acertosTotal, setAcertosTotal] = useState(0);
  const [questaoIdx, setQuestaoIdx] = useState(0);
  const [respostas, setRespostas] = useState<boolean[]>([]);

  if (!modulo) {
    return (
      <SafeAreaView style={s.safe}>
        <Text style={{ color: C.text, padding: 16 }}>Módulo não encontrado.</Text>
      </SafeAreaView>
    );
  }

  const aula: Aula = modulo.aulas[aulaIdx];
  const totalAulas = modulo.aulas.length;
  const questao = aula.questoes[questaoIdx];
  const progressoPct = (aulaIdx / totalAulas) * 100;

  const handleResponder = (correta: boolean) => {
    const novasRespostas = [...respostas, correta];
    setRespostas(novasRespostas);
    if (correta) setAcertosTotal((a) => a + 1);

    setTimeout(() => {
      const proxima = questaoIdx + 1;
      if (proxima < aula.questoes.length) {
        setQuestaoIdx(proxima);
      } else {
        setFase('resultado');
      }
    }, 1400);
  };

  const proximaAula = () => {
    if (aulaIdx + 1 < totalAulas) {
      setAulaIdx((i) => i + 1);
      setFase('conteudo');
      setQuestaoIdx(0);
      setRespostas([]);
    } else {
      const totalAcertos = acertosTotal;
      const totalQuestoes = modulo.aulas.reduce((acc, a) => acc + a.questoes.length, 0);
      Alert.alert(
        '✓ Módulo concluído',
        `${modulo.titulo}\n\n${totalAcertos}/${totalQuestoes} questões corretas\n+${totalAcertos * 10} pontos`,
        [{ text: 'Voltar ao curso', onPress: () => router.back() }]
      );
    }
  };

  const acertosAula = respostas.filter(Boolean).length;
  const totalQuestoesAula = aula.questoes.length;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <ArrowLeft size={20} color={C.text} />
        </TouchableOpacity>
        <View style={s.headerCenter}>
          <Text style={s.headerModulo}>{modulo.titulo}</Text>
          <Text style={s.headerAula}>Aula {aulaIdx + 1} de {totalAulas}</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      {/* Barra de progresso */}
      <View style={s.progressTrack}>
        <View style={[s.progressFill, { width: `${progressoPct}%` as any }]} />
      </View>

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* ── CONTEÚDO ──────────────────────────────────────────────────── */}
        {fase === 'conteudo' && (
          <>
            <Text style={s.aulaTitulo}>{aula.titulo}</Text>
            <Text style={s.aulaSubtitulo}>~{aula.duracaoMin} min · {aula.questoes.length} questões</Text>

            <MarkdownText
              text={aula.conteudo}
              color={C.text}
              style={s.conteudo}
            />

            {aula.esquemaHtml && (
              <View style={s.esquemaContainer}>
                <Text style={s.esquemaLabel}>ESQUEMA</Text>
                <HtmlRenderer html={aula.esquemaHtml} />
              </View>
            )}

            <TouchableOpacity style={s.btnPrimario} onPress={() => setFase('quiz')} activeOpacity={0.85}>
              <Text style={s.btnPrimarioText}>INICIAR QUIZ</Text>
              <ArrowRight size={16} color={C.accentText} />
            </TouchableOpacity>
          </>
        )}

        {/* ── QUIZ ──────────────────────────────────────────────────────── */}
        {fase === 'quiz' && questao && (
          <>
            <View style={s.quizHeader}>
              <Text style={s.quizProgresso}>
                QUESTÃO {questaoIdx + 1} / {totalQuestoesAula}
              </Text>
              <View style={s.quizProgressoBar}>
                {aula.questoes.map((_, i) => (
                  <View
                    key={i}
                    style={[
                      s.quizProgressoDot,
                      i < questaoIdx && s.quizProgressoDotFeito,
                      i === questaoIdx && s.quizProgressoDotAtual,
                    ]}
                  />
                ))}
              </View>
            </View>

            <QuizQuestao questao={questao} onResponder={handleResponder} />
          </>
        )}

        {/* ── RESULTADO ─────────────────────────────────────────────────── */}
        {fase === 'resultado' && (
          <View style={s.resultadoContainer}>
            <Text style={s.resultadoEmoji}>
              {acertosAula === totalQuestoesAula ? '🏆' : acertosAula >= Math.ceil(totalQuestoesAula / 2) ? '✓' : '📖'}
            </Text>
            <Text style={s.resultadoTitulo}>{acertosAula}/{totalQuestoesAula} corretas</Text>
            <Text style={s.resultadoPontos}>+{acertosAula * 10} pontos</Text>

            <View style={s.resultadoMsgBox}>
              <Text style={s.resultadoMsg}>
                {acertosAula === totalQuestoesAula
                  ? 'Excelente. Todas as questões corretas.'
                  : acertosAula >= Math.ceil(totalQuestoesAula / 2)
                  ? 'Bom resultado. Revise as questões erradas antes de avançar.'
                  : 'Revise o conteúdo desta aula. O material permanece disponível.'}
              </Text>
            </View>

            <TouchableOpacity style={s.btnPrimario} onPress={proximaAula} activeOpacity={0.85}>
              <Text style={s.btnPrimarioText}>
                {aulaIdx + 1 < totalAulas ? 'PRÓXIMA AULA' : 'CONCLUIR MÓDULO'}
              </Text>
              <ArrowRight size={16} color={C.accentText} />
            </TouchableOpacity>

            {aulaIdx + 1 < totalAulas && (
              <Text style={s.proximaAulaNome}>
                A seguir: {modulo.aulas[aulaIdx + 1].titulo}
              </Text>
            )}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    backgroundColor: C.bg,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerModulo: {
    fontFamily: 'IBMPlexMono_700Bold',
    fontSize: 13,
    color: C.text,
    letterSpacing: 0.3,
  },
  headerAula: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 10,
    color: C.textMuted,
    marginTop: 2,
  },

  // Progress
  progressTrack: { height: 3, backgroundColor: C.border },
  progressFill: { height: 3, backgroundColor: C.progress },

  // Scroll
  scroll: {
    padding: 20,
    paddingBottom: 48,
  },

  // Conteúdo
  aulaTitulo: {
    fontFamily: 'IBMPlexMono_700Bold',
    fontSize: 20,
    color: C.text,
    lineHeight: 28,
    marginBottom: 6,
  },
  aulaSubtitulo: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 11,
    color: C.textMuted,
    letterSpacing: 0.5,
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    paddingBottom: 16,
  },
  conteudo: { marginBottom: 24 },
  esquemaContainer: {
    borderWidth: 1,
    borderColor: C.border,
    padding: 16,
    marginBottom: 24,
    backgroundColor: '#FAFAFA',
  },
  esquemaLabel: {
    fontFamily: 'IBMPlexMono_700Bold',
    fontSize: 10,
    color: C.textMuted,
    letterSpacing: 1.5,
    marginBottom: 12,
  },

  // Quiz header
  quizHeader: { marginBottom: 24 },
  quizProgresso: {
    fontFamily: 'IBMPlexMono_700Bold',
    fontSize: 11,
    color: C.textMuted,
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  quizProgressoBar: { flexDirection: 'row', gap: 6 },
  quizProgressoDot: {
    width: 28,
    height: 4,
    backgroundColor: C.border,
    borderRadius: 2,
  },
  quizProgressoDotFeito: { backgroundColor: C.correct },
  quizProgressoDotAtual: { backgroundColor: C.text },

  // Questão
  questao: { gap: 16 },
  questaoCard: {
    backgroundColor: C.surface,
    padding: 20,
    borderLeftWidth: 3,
    borderLeftColor: C.text,
  },
  questaoEnunciado: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 15,
    color: C.text,
    lineHeight: 24,
  },
  opcoes: { gap: 10 },
  opcaoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.bg,
    padding: 14,
    gap: 12,
  },
  opcaoBtnSelecionada: { borderColor: C.text, backgroundColor: C.surface },
  opcaoBtnCorreta: { borderColor: C.correct, backgroundColor: C.correctBg },
  opcaoBtnErrada: { borderColor: C.wrong, backgroundColor: C.wrongBg },
  opcaoText: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 13,
    color: C.textSub,
    flex: 1,
    lineHeight: 20,
  },
  opcaoTextCorreta: { color: C.correct, fontFamily: 'IBMPlexMono_500Medium' },
  opcaoTextErrada: { color: C.wrong },
  explicacaoBox: {
    borderLeftWidth: 3,
    borderLeftColor: C.border,
    paddingLeft: 16,
    paddingVertical: 12,
    backgroundColor: C.surface,
    padding: 16,
  },
  explicacaoLabel: {
    fontFamily: 'IBMPlexMono_700Bold',
    fontSize: 10,
    color: C.textMuted,
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  explicacaoText: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 12,
    color: C.textSub,
    lineHeight: 20,
  },

  // Resultado
  resultadoContainer: {
    alignItems: 'center',
    paddingTop: 40,
    gap: 16,
  },
  resultadoEmoji: { fontSize: 52 },
  resultadoTitulo: {
    fontFamily: 'IBMPlexMono_700Bold',
    fontSize: 22,
    color: C.text,
  },
  resultadoPontos: {
    fontFamily: 'IBMPlexMono_700Bold',
    fontSize: 14,
    color: C.correct,
    letterSpacing: 0.5,
  },
  resultadoMsgBox: {
    backgroundColor: C.surface,
    padding: 16,
    width: '100%',
  },
  resultadoMsg: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 13,
    color: C.textSub,
    textAlign: 'center',
    lineHeight: 22,
  },
  proximaAulaNome: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 11,
    color: C.textMuted,
    textAlign: 'center',
    marginTop: 4,
  },

  // Botão primário
  btnPrimario: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.accent,
    padding: 16,
    gap: 10,
    marginTop: 8,
    width: '100%',
  },
  btnPrimarioText: {
    fontFamily: 'IBMPlexMono_700Bold',
    fontSize: 13,
    color: C.accentText,
    letterSpacing: 1,
  },
});
