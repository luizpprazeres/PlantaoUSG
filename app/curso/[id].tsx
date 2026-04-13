import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react-native';
import { MODULO_MAP } from '@/data/curso';
import type { Aula, QuestaoAula } from '@/data/curso';
import { MarkdownText } from '@/components/ui/MarkdownText';
import { Colors, FontSize, Spacing } from '@/constants/theme';

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
    <View style={styles.questao}>
      <Text style={styles.questaoEnunciado}>{questao.enunciado}</Text>
      <View style={styles.opcoes}>
        {questao.opcoes.map((opcao, idx) => {
          const correta = respondido && idx === questao.correta;
          const errada = respondido && idx === selecionado && idx !== questao.correta;
          const selecionadaAtual = !respondido && selecionado === idx;

          return (
            <TouchableOpacity
              key={idx}
              style={[
                styles.opcaoBtn,
                selecionadaAtual && styles.opcaoBtnSelecionada,
                correta && styles.opcaoBtnCorreta,
                errada && styles.opcaoBtnErrada,
              ]}
              onPress={() => handleSeleção(idx)}
              activeOpacity={respondido ? 1 : 0.7}
            >
              <Text style={styles.opcaoText}>{opcao}</Text>
              {respondido && idx === questao.correta && (
                <Check size={14} color="#4CAF50" />
              )}
              {respondido && idx === selecionado && idx !== questao.correta && (
                <X size={14} color="#F44336" />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
      {respondido && (
        <View style={styles.explicacao}>
          <Text style={styles.explicacaoText}>{questao.explicacao}</Text>
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
  const [acertos, setAcertos] = useState(0);
  const [questaoIdx, setQuestaoIdx] = useState(0);
  const [respostas, setRespostas] = useState<boolean[]>([]);

  if (!modulo) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={{ color: Colors.textPrimary, padding: Spacing.base }}>Módulo não encontrado.</Text>
      </SafeAreaView>
    );
  }

  const aula: Aula = modulo.aulas[aulaIdx];
  const totalAulas = modulo.aulas.length;
  const questao = aula.questoes[questaoIdx];

  const handleResponder = (correta: boolean) => {
    const novasRespostas = [...respostas, correta];
    setRespostas(novasRespostas);
    if (correta) setAcertos((a) => a + 1);

    setTimeout(() => {
      const proxima = questaoIdx + 1;
      if (proxima < aula.questoes.length) {
        setQuestaoIdx(proxima);
      } else {
        setFase('resultado');
      }
    }, 1200);
  };

  const proximaAula = () => {
    if (aulaIdx + 1 < totalAulas) {
      setAulaIdx((i) => i + 1);
      setFase('conteudo');
      setQuestaoIdx(0);
      setRespostas([]);
    } else {
      Alert.alert(
        'Módulo concluído!',
        `Você completou o módulo ${modulo.titulo}.\n\nAcertos totais: ${acertos + (respostas.filter(Boolean).length)} questões.`,
        [{ text: 'Voltar ao curso', onPress: () => router.back() }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerModulo}>{modulo.titulo.toUpperCase()}</Text>
          <Text style={styles.headerAula}>
            AULA {aulaIdx + 1}/{totalAulas} · {aula.titulo.toUpperCase()}
          </Text>
        </View>
        <View style={{ width: 20 }} />
      </View>

      {/* Barra de progresso */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${((aulaIdx) / totalAulas) * 100}%` }]} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* FASE: CONTEÚDO */}
        {fase === 'conteudo' && (
          <View style={styles.conteudoContainer}>
            <Text style={styles.aulaTitulo}>{aula.titulo}</Text>
            <View style={styles.duracao}>
              <Text style={styles.duracaoText}>~{aula.duracaoMin} min · {aula.questoes.length} questões</Text>
            </View>
            <MarkdownText text={aula.conteudo} color={Colors.textSecondary} style={styles.conteudo} />
            <TouchableOpacity style={styles.btnPrimario} onPress={() => setFase('quiz')} activeOpacity={0.85}>
              <Text style={styles.btnPrimarioText}>INICIAR QUIZ</Text>
              <ArrowRight size={16} color={Colors.bgPrimary} />
            </TouchableOpacity>
          </View>
        )}

        {/* FASE: QUIZ */}
        {fase === 'quiz' && questao && (
          <View style={styles.quizContainer}>
            <Text style={styles.quizProgresso}>
              QUESTÃO {questaoIdx + 1}/{aula.questoes.length}
            </Text>
            <QuizQuestao
              questao={questao}
              onResponder={handleResponder}
            />
          </View>
        )}

        {/* FASE: RESULTADO */}
        {fase === 'resultado' && (
          <View style={styles.resultadoContainer}>
            <Text style={styles.resultadoEmoji}>
              {respostas.filter(Boolean).length === aula.questoes.length ? '🏆' : respostas.filter(Boolean).length >= Math.ceil(aula.questoes.length / 2) ? '✅' : '📖'}
            </Text>
            <Text style={styles.resultadoTitulo}>
              {respostas.filter(Boolean).length}/{aula.questoes.length} corretas
            </Text>
            <Text style={styles.resultadoPontos}>
              +{respostas.filter(Boolean).length * 10} pontos
            </Text>
            <Text style={styles.resultadoMsg}>
              {respostas.filter(Boolean).length === aula.questoes.length
                ? 'Perfeito! Todas as questões corretas.'
                : respostas.filter(Boolean).length >= Math.ceil(aula.questoes.length / 2)
                ? 'Bom trabalho. Revise os erros e avance.'
                : 'Revise o conteúdo e tente novamente na próxima sessão.'}
            </Text>
            <TouchableOpacity style={styles.btnPrimario} onPress={proximaAula} activeOpacity={0.85}>
              <Text style={styles.btnPrimarioText}>
                {aulaIdx + 1 < totalAulas ? 'PRÓXIMA AULA' : 'CONCLUIR MÓDULO'}
              </Text>
              <ArrowRight size={16} color={Colors.bgPrimary} />
            </TouchableOpacity>
          </View>
        )}
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  headerCenter: { flex: 1, alignItems: 'center', paddingHorizontal: Spacing.sm },
  headerModulo: {
    fontFamily: 'IBMPlexMono_700Bold',
    fontSize: FontSize.label,
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
  headerAula: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 9,
    color: Colors.textMuted,
    letterSpacing: 1,
    marginTop: 2,
  },
  progressBar: {
    height: 2,
    backgroundColor: Colors.bgElevated,
  },
  progressFill: {
    height: 2,
    backgroundColor: Colors.textPrimary,
  },
  scroll: { padding: Spacing.base, paddingBottom: Spacing.xl },

  // Conteúdo
  conteudoContainer: { gap: Spacing.md },
  aulaTitulo: {
    fontFamily: 'IBMPlexMono_700Bold',
    fontSize: FontSize.heading,
    color: Colors.textPrimary,
  },
  duracao: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  duracaoText: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.micro,
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  conteudo: { marginTop: Spacing.xs },

  // Quiz
  quizContainer: { gap: Spacing.md },
  quizProgresso: {
    fontFamily: 'IBMPlexMono_700Bold',
    fontSize: FontSize.micro,
    color: Colors.textMuted,
    letterSpacing: 2,
  },
  questao: { gap: Spacing.md },
  questaoEnunciado: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    lineHeight: FontSize.body * 1.5,
  },
  opcoes: { gap: Spacing.sm },
  opcaoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    backgroundColor: Colors.bgElevated,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  opcaoBtnSelecionada: {
    borderColor: Colors.textPrimary,
    backgroundColor: '#111',
  },
  opcaoBtnCorreta: {
    borderColor: '#4CAF50',
    backgroundColor: '#0A1A0A',
  },
  opcaoBtnErrada: {
    borderColor: '#F44336',
    backgroundColor: '#1A0A0A',
  },
  opcaoText: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: FontSize.caption * 1.5,
  },
  explicacao: {
    borderLeftWidth: 2,
    borderLeftColor: Colors.borderDefault,
    paddingLeft: Spacing.md,
    marginTop: Spacing.sm,
  },
  explicacaoText: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
    lineHeight: FontSize.caption * 1.7,
  },

  // Resultado
  resultadoContainer: {
    alignItems: 'center',
    paddingTop: Spacing.xl,
    gap: Spacing.md,
  },
  resultadoEmoji: { fontSize: 48 },
  resultadoTitulo: {
    fontFamily: 'IBMPlexMono_700Bold',
    fontSize: FontSize.heading,
    color: Colors.textPrimary,
  },
  resultadoPontos: {
    fontFamily: 'IBMPlexMono_700Bold',
    fontSize: FontSize.body,
    color: '#4CAF50',
  },
  resultadoMsg: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: FontSize.caption * 1.7,
  },

  // Botão primário
  btnPrimario: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.textPrimary,
    padding: Spacing.md,
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  btnPrimarioText: {
    fontFamily: 'IBMPlexMono_700Bold',
    fontSize: FontSize.label,
    color: Colors.bgPrimary,
    letterSpacing: 0.5,
  },
});
