import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Lock, CheckCircle, BookOpen } from 'lucide-react-native';
import { MODULOS } from '@/data/curso';
import type { Modulo, NivelCurso } from '@/data/curso';
import { Colors, FontSize, Spacing } from '@/constants/theme';

const NIVEL_LABEL: Record<NivelCurso, string> = {
  iniciante: 'BÁSICO',
  intermediario: 'INTERMEDIÁRIO',
  avancado: 'AVANÇADO',
};

const NIVEL_COR: Record<NivelCurso, string> = {
  iniciante: '#4CAF50',
  intermediario: '#FF9800',
  avancado: '#F44336',
};

function ModuloCard({ modulo, disponivel }: { modulo: Modulo; disponivel: boolean }) {
  const totalAulas = modulo.aulas.length;
  const totalQuestoes = modulo.aulas.reduce((acc, a) => acc + a.questoes.length, 0);

  return (
    <TouchableOpacity
      style={[styles.card, !disponivel && styles.cardBloqueado]}
      activeOpacity={disponivel ? 0.85 : 1}
      onPress={() => {
        if (disponivel) router.push(`/curso/${modulo.id}`);
      }}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.icone}>{modulo.icone}</Text>
        <View style={styles.cardHeaderInfo}>
          <View style={styles.nivelBadge}>
            <View style={[styles.nivelDot, { backgroundColor: NIVEL_COR[modulo.nivel] }]} />
            <Text style={styles.nivelText}>{NIVEL_LABEL[modulo.nivel]}</Text>
          </View>
          <Text style={styles.protocolo}>{modulo.protocolo.toUpperCase()}</Text>
        </View>
        {disponivel ? (
          <BookOpen size={18} color={Colors.textMuted} />
        ) : (
          <Lock size={18} color={Colors.textMuted} />
        )}
      </View>

      <Text style={styles.titulo}>{modulo.titulo}</Text>
      <Text style={styles.subtitulo}>{modulo.subtitulo}</Text>
      <Text style={styles.descricao} numberOfLines={2}>{modulo.descricao}</Text>

      <View style={styles.stats}>
        <Text style={styles.statText}>{totalAulas} aulas</Text>
        <Text style={styles.statSep}>·</Text>
        <Text style={styles.statText}>{totalQuestoes} questões</Text>
        <Text style={styles.statSep}>·</Text>
        <Text style={styles.statText}>{modulo.pontosTotal} pts</Text>
      </View>

      {!disponivel && (
        <View style={styles.emBreve}>
          <Text style={styles.emBreveText}>EM BREVE</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const PLACEHOLDERS = [
  { id: 'p_efast', protocolo: 'efast', titulo: 'Protocolo eFAST', subtitulo: 'Extended Focused Assessment with Sonography in Trauma', icone: '🩺', nivel: 'iniciante' as NivelCurso, descricao: 'Diagnóstico ultrassonográfico de emergências traumáticas. Líquido livre, pneumotórax e tamponamento.', aulas: [], pontosTotal: 0 },
  { id: 'p_rush', protocolo: 'rush', titulo: 'Protocolo RUSH', subtitulo: 'Rapid Ultrasound in Shock and Hypotension', icone: '🫀', nivel: 'intermediario' as NivelCurso, descricao: 'Avaliação hemodinâmica do paciente em choque. Bomba, tanque e canos em 3 minutos.', aulas: [], pontosTotal: 0 },
  { id: 'p_cardiac', protocolo: 'cardiac', titulo: 'Cardíaco POCUS', subtitulo: 'Focused Cardiac Ultrasound', icone: '❤️', nivel: 'intermediario' as NivelCurso, descricao: 'Função ventricular, derrame pericárdico, VD e VCI. Base do ecocardiograma point-of-care.', aulas: [], pontosTotal: 0 },
  { id: 'p_vexus', protocolo: 'vexus', titulo: 'VExUS', subtitulo: 'Venous Excess Ultrasound', icone: '🩸', nivel: 'avancado' as NivelCurso, descricao: 'Gradação da congestão venosa sistêmica. Predição de injúria renal aguda por sobrecarga de fluidos.', aulas: [], pontosTotal: 0 },
  { id: 'p_obs', protocolo: 'obstetrico', titulo: 'Obstétrico POCUS', subtitulo: 'POCUS Obstétrico de Emergência', icone: '🤰', nivel: 'intermediario' as NivelCurso, descricao: 'Gestação ectópica, vitalidade fetal, apresentação e localização placentária.', aulas: [], pontosTotal: 0 },
];

export default function CursoScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <ArrowLeft size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitulo}>CURSO POCUS</Text>
          <Text style={styles.headerSub}>MÓDULOS · QUESTÕES · PONTOS</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.secao}>DISPONÍVEIS</Text>
        {MODULOS.map((m) => (
          <ModuloCard key={m.id} modulo={m} disponivel />
        ))}

        <Text style={[styles.secao, { marginTop: Spacing.lg }]}>EM DESENVOLVIMENTO</Text>
        {PLACEHOLDERS.map((p) => (
          <ModuloCard key={p.id} modulo={p as Modulo} disponivel={false} />
        ))}
      </ScrollView>
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  back: { marginRight: Spacing.md },
  headerTitulo: {
    fontFamily: 'IBMPlexMono_700Bold',
    fontSize: FontSize.heading,
    color: Colors.textPrimary,
  },
  headerSub: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 9,
    color: Colors.textMuted,
    letterSpacing: 2,
    marginTop: 2,
  },
  scroll: { padding: Spacing.base, paddingBottom: Spacing.xl, gap: Spacing.sm },
  secao: {
    fontFamily: 'IBMPlexMono_700Bold',
    fontSize: FontSize.micro,
    color: Colors.textMuted,
    letterSpacing: 2,
    marginBottom: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.bgElevated,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  cardBloqueado: { opacity: 0.5 },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  icone: { fontSize: 24 },
  cardHeaderInfo: { flex: 1 },
  nivelBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  nivelDot: { width: 6, height: 6, borderRadius: 3 },
  nivelText: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: FontSize.micro,
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  protocolo: {
    fontFamily: 'IBMPlexMono_700Bold',
    fontSize: FontSize.micro,
    color: Colors.textMuted,
    letterSpacing: 1.5,
    marginTop: 2,
  },
  titulo: {
    fontFamily: 'IBMPlexMono_700Bold',
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  subtitulo: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.caption,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  descricao: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
    lineHeight: FontSize.caption * 1.6,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  statText: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: FontSize.micro,
    color: Colors.textMuted,
  },
  statSep: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.micro,
    color: Colors.textMuted,
  },
  emBreve: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    marginTop: Spacing.xs,
  },
  emBreveText: {
    fontFamily: 'IBMPlexMono_700Bold',
    fontSize: FontSize.micro,
    color: Colors.textMuted,
    letterSpacing: 1,
  },
});
