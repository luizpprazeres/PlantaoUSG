import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  TextInput, Linking,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, CheckCircle, Circle, Award, Lock } from 'lucide-react-native';
import { Colors, FontSize, Spacing, Radius } from '@/constants/theme';
import { useTextCase } from '@/hooks/useTextCase';
import { useTextSize } from '@/hooks/useTextSize';
import { useMedico } from '@/hooks/useMedico';
import { useEstatisticas } from '@/hooks/useEstatisticas';
import { MARCOS, CERTIFICADOS } from '@/utils/marcos';

const PROTOCOLO_LABELS: Record<string, string> = {
  efast: 'eFAST', blue: 'BLUE', rush: 'RUSH',
  cardiac: 'Cardíaco', vexus: 'VExUS', obstetrico: 'Obstétrico',
};

function NivelBar({ progresso }: { progresso: number }) {
  return (
    <View style={styles.barTrack}>
      <View style={[styles.barFill, { width: `${Math.min(progresso * 100, 100)}%` as any }]} />
    </View>
  );
}

export default function PreferenciasScreen() {
  const { mode, toggle } = useTextCase();
  const { mode: textSizeMode, cycle: cycleTextSize } = useTextSize();
  const { medico, atualizar } = useMedico();
  const stats = useEstatisticas();
  const { nivel, total, protocolosDistintos, sequenciaDias, porProtocolo, laudos } = stats;
  const marcosConquistados = MARCOS.filter((m) => m.conquistado(laudos)).length;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.titulo}>PREFERÊNCIAS</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── IDENTIFICAÇÃO MÉDICA ─────────────────────────────────── */}
        <Text style={styles.sectionLabel}>IDENTIFICAÇÃO MÉDICA</Text>
        <Text style={styles.hint}>Usado no cabeçalho do PDF exportado.</Text>

        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Nome</Text>
          <TextInput
            style={styles.input}
            value={medico.nome}
            onChangeText={(v) => atualizar('nome', v)}
            placeholder="Dr(a). Nome Completo"
            placeholderTextColor={Colors.textMuted}
            autoCapitalize="words"
          />
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>CRM</Text>
          <View style={styles.crmRow}>
            <TextInput
              style={[styles.input, { flex: 3 }]}
              value={medico.crm}
              onChangeText={(v) => atualizar('crm', v.replace(/\D/g, ''))}
              placeholder="123456"
              placeholderTextColor={Colors.textMuted}
              keyboardType="numeric"
              maxLength={7}
            />
            <TextInput
              style={[styles.input, { flex: 1, textAlign: 'center' }]}
              value={medico.crmEstado}
              onChangeText={(v) => atualizar('crmEstado', v.toUpperCase().slice(0, 2))}
              placeholder="SP"
              placeholderTextColor={Colors.textMuted}
              autoCapitalize="characters"
              maxLength={2}
            />
          </View>
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Especialidade</Text>
          <TextInput
            style={styles.input}
            value={medico.especialidade}
            onChangeText={(v) => atualizar('especialidade', v)}
            placeholder="Medicina de Emergência"
            placeholderTextColor={Colors.textMuted}
            autoCapitalize="words"
          />
        </View>

        {/* ── LAUDO ─────────────────────────────────────────────────── */}
        <Text style={styles.sectionLabel}>LAUDO</Text>
        <View style={styles.prefCard}>
          <TouchableOpacity onPress={toggle} style={styles.prefRow}>
            <Text style={styles.prefLabel}>Formato do texto</Text>
            <Text style={styles.prefValue}>{mode === 'normal' ? 'Aa' : 'AA'}</Text>
          </TouchableOpacity>
          <View style={styles.prefDivider} />
          <TouchableOpacity onPress={cycleTextSize} style={styles.prefRow}>
            <Text style={styles.prefLabel}>Tamanho do texto</Text>
            <Text style={styles.prefValue}>
              {textSizeMode === 'sm' ? 'Compacto' : textSizeMode === 'md' ? 'Normal' : 'Grande'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── PROGRESSO ─────────────────────────────────────────────── */}
        <Text style={styles.sectionLabel}>PROGRESSO</Text>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{total}</Text>
            <Text style={styles.statLabel}>LAUDOS</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{protocolosDistintos}</Text>
            <Text style={styles.statLabel}>PROTOCOLOS</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{sequenciaDias}<Text style={styles.statUnit}> d</Text></Text>
            <Text style={styles.statLabel}>SEQUÊNCIA</Text>
          </View>
        </View>

        {/* Nível */}
        <View style={styles.nivelCard}>
          <View style={styles.nivelHeader}>
            <View>
              <Text style={styles.nivelRomanico}>{nivel.nivel}</Text>
              <Text style={styles.nivelTitulo}>{nivel.titulo}</Text>
            </View>
            {nivel.nivel !== 'IV' && (
              <Text style={styles.nivelMeta}>{nivel.laudosAtuais}/{nivel.proximoMarco}</Text>
            )}
          </View>
          <NivelBar progresso={nivel.progresso} />
          <Text style={styles.nivelHint}>
            {nivel.nivel !== 'IV'
              ? `${nivel.proximoMarco - nivel.laudosAtuais} laudos para Nível ${{ I: 'II', II: 'III', III: 'IV' }[nivel.nivel]}`
              : 'Nível máximo atingido'}
          </Text>
        </View>

        {/* Marcos resumo */}
        <View style={styles.marcosHeader}>
          <Text style={styles.marcosLabel}>MARCOS</Text>
          <Text style={styles.marcosCount}>{marcosConquistados}/{MARCOS.length}</Text>
        </View>
        <View style={styles.prefCard}>
          {MARCOS.map((marco, i) => {
            const ok = marco.conquistado(laudos);
            return (
              <View key={marco.id}>
                {i > 0 && <View style={styles.prefDivider} />}
                <View style={styles.marcoRow}>
                  {ok
                    ? <CheckCircle size={14} color={Colors.textPrimary} />
                    : <Circle size={14} color={Colors.textMuted} />}
                  <Text style={[styles.marcoText, !ok && styles.marcoTextPendente]}>
                    {marco.titulo}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Certificados */}
        <Text style={[styles.sectionLabel, { marginTop: Spacing.lg }]}>CERTIFICADOS</Text>
        {CERTIFICADOS.map((cert) => {
          const ok = cert.conquistado(laudos);
          return (
            <View key={cert.id} style={[styles.certCard, !ok && { opacity: 0.45 }]}>
              <View style={styles.certIcon}>
                {ok
                  ? <Award size={18} color={Colors.textPrimary} />
                  : <Lock size={14} color={Colors.textMuted} />}
              </View>
              <View style={{ flex: 1, gap: 3 }}>
                <View style={styles.certTitleRow}>
                  <Text style={styles.certTitulo}>{cert.titulo}</Text>
                  <Text style={styles.certNivel}>{cert.subtitulo}</Text>
                </View>
                <Text style={styles.certDesc}>{cert.descricao}</Text>
              </View>
            </View>
          );
        })}

        {/* ── LAUDOUSG ──────────────────────────────────────────────── */}
        <View style={styles.laudoUsgBox}>
          <Text style={styles.laudoUsgTitulo}>Plantão USG</Text>
          <Text style={styles.laudoUsgTexto}>
            Este app nasceu de uma demanda real — dos próprios médicos que usam o LaudoUSG no dia a dia. Eles queriam algo mais ágil, mais focado, feito para a sala vermelha: sem rodeios, sem burocracia, só o essencial para documentar um POCUS à beira-leito.
          </Text>
          <Text style={styles.laudoUsgTexto}>
            O LaudoUSG é a plataforma completa de laudos com IA para ultrassonografistas. O Plantão USG é sua extensão na emergência — pensado especialmente para intensivistas, emergencistas e médicos que atuam em contextos críticos.
          </Text>
          <TouchableOpacity
            onPress={() => Linking.openURL('https://laudousg.com/?utm_source=plantao_usg&utm_medium=app&utm_campaign=preferencias')}
          >
            <Text style={styles.laudoUsgLink}>laudousg.com →</Text>
          </TouchableOpacity>
          <Text style={styles.laudoUsgAutor}>por Luiz Paulo · médico intensivista e ultrassonografista</Text>
        </View>

        {/* Disclaimer */}
        <Text style={styles.disclaimer}>
          Ferramenta de suporte à documentação clínica. Não substitui avaliação médica ou laudo formal por profissional habilitado. Dados armazenados localmente · LGPD.
        </Text>

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
  backBtn: { width: 28 },
  titulo: {
    fontFamily: 'IBMPlexMono_700Bold',
    fontSize: FontSize.label,
    color: Colors.textPrimary,
    letterSpacing: 1.5,
  },
  scroll: { paddingHorizontal: Spacing.base, paddingBottom: Spacing['2xl'] },

  sectionLabel: {
    fontFamily: 'IBMPlexMono_600SemiBold',
    fontSize: FontSize.micro,
    color: Colors.textMuted,
    letterSpacing: 2,
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
  },
  hint: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.caption,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },

  // Inputs
  inputRow: { marginBottom: Spacing.sm },
  inputLabel: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: FontSize.caption,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  input: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.label,
    color: Colors.textPrimary,
    backgroundColor: Colors.bgInput,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    flex: 1,
  },
  crmRow: { flexDirection: 'row', gap: Spacing.sm },

  // Prefs
  prefCard: {
    backgroundColor: Colors.bgElevated,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  prefRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  prefDivider: { height: 1, backgroundColor: Colors.borderSubtle },
  prefLabel: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
  },
  prefValue: {
    fontFamily: 'IBMPlexMono_600SemiBold',
    fontSize: FontSize.caption,
    color: Colors.textPrimary,
  },

  // Stats
  statsRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.sm },
  statCard: {
    flex: 1,
    backgroundColor: Colors.bgElevated,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    padding: Spacing.md,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'IBMPlexMono_700Bold',
    fontSize: FontSize.heading,
    color: Colors.textPrimary,
  },
  statUnit: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.caption,
    color: Colors.textMuted,
  },
  statLabel: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.micro,
    color: Colors.textMuted,
    letterSpacing: 1,
    marginTop: 2,
  },

  // Nível
  nivelCard: {
    backgroundColor: Colors.bgElevated,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    padding: Spacing.base,
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  nivelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  nivelRomanico: {
    fontFamily: 'IBMPlexMono_700Bold',
    fontSize: FontSize.display,
    color: Colors.textPrimary,
    lineHeight: FontSize.display,
  },
  nivelTitulo: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  nivelMeta: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.caption,
    color: Colors.textMuted,
  },
  barTrack: { height: 2, backgroundColor: Colors.borderSubtle },
  barFill: { height: 2, backgroundColor: Colors.textPrimary },
  nivelHint: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.micro,
    color: Colors.textMuted,
  },

  // Marcos
  marcosHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  marcosLabel: {
    fontFamily: 'IBMPlexMono_600SemiBold',
    fontSize: FontSize.micro,
    color: Colors.textMuted,
    letterSpacing: 2,
  },
  marcosCount: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.micro,
    color: Colors.textMuted,
  },
  marcoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  marcoText: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.caption,
    color: Colors.textPrimary,
    flex: 1,
  },
  marcoTextPendente: { color: Colors.textMuted },

  // Certificados
  certCard: {
    backgroundColor: Colors.bgElevated,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    padding: Spacing.md,
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  certIcon: {
    width: 30,
    height: 30,
    backgroundColor: Colors.bgInput,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    alignItems: 'center',
    justifyContent: 'center',
  },
  certTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  certTitulo: {
    fontFamily: 'IBMPlexMono_600SemiBold',
    fontSize: FontSize.caption,
    color: Colors.textPrimary,
  },
  certNivel: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.micro,
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  certDesc: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.micro,
    color: Colors.textSecondary,
    lineHeight: 16,
  },

  // LaudoUSG
  laudoUsgBox: {
    marginTop: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
    paddingTop: Spacing.lg,
    gap: Spacing.sm,
  },
  laudoUsgTitulo: {
    fontFamily: 'IBMPlexMono_700Bold',
    fontSize: FontSize.label,
    color: Colors.textPrimary,
    letterSpacing: 1,
  },
  laudoUsgTexto: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
    lineHeight: FontSize.caption * 1.8,
  },
  laudoUsgLink: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: FontSize.caption,
    color: Colors.textPrimary,
    textDecorationLine: 'underline',
  },
  laudoUsgAutor: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.micro,
    color: Colors.textMuted,
    marginTop: 2,
  },

  // Disclaimer
  disclaimer: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.micro,
    color: Colors.textMuted,
    lineHeight: 16,
    marginTop: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
  },
});
