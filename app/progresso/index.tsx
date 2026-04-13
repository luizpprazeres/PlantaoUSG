import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, CheckCircle, Circle, Award, Lock } from 'lucide-react-native';
import { useEstatisticas } from '@/hooks/useEstatisticas';
import { MARCOS, CERTIFICADOS } from '@/utils/marcos';
import { Colors, FontSize, Spacing } from '@/constants/theme';

const PROTOCOLO_LABELS: Record<string, string> = {
  efast: 'eFAST',
  blue: 'BLUE',
  rush: 'RUSH',
  cardiac: 'Cardíaco',
  vexus: 'VExUS',
  obstetrico: 'Obstétrico',
};

function StatCard({ label, value, unit }: { label: string; value: string | number; unit?: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>
        {value}
        {unit && <Text style={styles.statUnit}>{unit}</Text>}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function NivelBar({ progresso }: { progresso: number }) {
  return (
    <View style={styles.barTrack}>
      <View style={[styles.barFill, { width: `${Math.min(progresso * 100, 100)}%` as any }]} />
    </View>
  );
}

function HistoricoChart({ historico }: { historico: { mes: string; count: number }[] }) {
  const max = Math.max(...historico.map((h) => h.count), 1);
  return (
    <View style={styles.chart}>
      {historico.map((h, i) => (
        <View key={i} style={styles.chartCol}>
          <View style={styles.chartBarWrap}>
            <View
              style={[
                styles.chartBar,
                { height: `${(h.count / max) * 100}%` as any },
                i === historico.length - 1 && styles.chartBarActive,
              ]}
            />
          </View>
          <Text style={styles.chartLabel}>{h.mes}</Text>
        </View>
      ))}
    </View>
  );
}

export default function ProgressoScreen() {
  const stats = useEstatisticas();
  const { nivel, total, protocolosDistintos, sequenciaDias, porProtocolo, historico, laudos } = stats;

  const marcosConquistados = MARCOS.filter((m) => m.conquistado(laudos)).length;
  const certificadosConquistados = CERTIFICADOS.filter((c) => c.conquistado(laudos));
  const proximoCertificado = CERTIFICADOS.find((c) => !c.conquistado(laudos));

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <ArrowLeft size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View>
          <Text style={styles.titulo}>PROGRESSO</Text>
          <Text style={styles.subtitulo}>POCUS · EVOLUÇÃO CLÍNICA</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <StatCard label="LAUDOS" value={total} />
          <StatCard label="PROTOCOLOS" value={protocolosDistintos} />
          <StatCard label="SEQUÊNCIA" value={sequenciaDias} unit=" d" />
        </View>

        {/* Nível de Competência */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>NÍVEL DE COMPETÊNCIA</Text>
          <View style={styles.nivelCard}>
            <View style={styles.nivelHeader}>
              <View>
                <Text style={styles.nivelRomanico}>{nivel.nivel}</Text>
                <Text style={styles.nivelTitulo}>{nivel.titulo}</Text>
              </View>
              {nivel.nivel !== 'IV' && (
                <Text style={styles.nivelMeta}>
                  {nivel.laudosAtuais}/{nivel.proximoMarco} laudos
                </Text>
              )}
            </View>
            <NivelBar progresso={nivel.progresso} />
            {nivel.nivel !== 'IV' ? (
              <Text style={styles.nivelHint}>
                {nivel.proximoMarco - nivel.laudosAtuais} laudos para Nível {
                  { I: 'II', II: 'III', III: 'IV' }[nivel.nivel]
                }
              </Text>
            ) : (
              <Text style={styles.nivelHint}>Nível máximo atingido</Text>
            )}
          </View>
        </View>

        {/* Histórico 6 meses */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ÚLTIMOS 6 MESES</Text>
          <View style={styles.card}>
            <HistoricoChart historico={historico} />
          </View>
        </View>

        {/* Distribuição por protocolo */}
        {total > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>LAUDOS POR PROTOCOLO</Text>
            <View style={styles.card}>
              {Object.entries(porProtocolo)
                .sort((a, b) => b[1] - a[1])
                .map(([proto, count]) => (
                  <View key={proto} style={styles.protoRow}>
                    <Text style={styles.protoLabel}>
                      {PROTOCOLO_LABELS[proto] ?? proto.toUpperCase()}
                    </Text>
                    <View style={styles.protoBarWrap}>
                      <View
                        style={[
                          styles.protoBar,
                          { width: `${(count / total) * 100}%` as any },
                        ]}
                      />
                    </View>
                    <Text style={styles.protoCount}>{count}</Text>
                  </View>
                ))}
            </View>
          </View>
        )}

        {/* Certificados */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CERTIFICADOS</Text>
          <View style={styles.certList}>
            {CERTIFICADOS.map((cert) => {
              const conquistado = cert.conquistado(laudos);
              return (
                <View
                  key={cert.id}
                  style={[styles.certCard, !conquistado && styles.certCardLocked]}
                >
                  <View style={styles.certIcon}>
                    {conquistado ? (
                      <Award size={20} color={Colors.textPrimary} />
                    ) : (
                      <Lock size={16} color={Colors.textMuted} />
                    )}
                  </View>
                  <View style={styles.certInfo}>
                    <View style={styles.certTitleRow}>
                      <Text style={[styles.certTitulo, !conquistado && styles.certTextLocked]}>
                        {cert.titulo}
                      </Text>
                      <Text style={[styles.certNivel, !conquistado && styles.certTextLocked]}>
                        {cert.subtitulo}
                      </Text>
                    </View>
                    <Text style={[styles.certDesc, !conquistado && styles.certDescLocked]}>
                      {cert.descricao}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Marcos */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>MARCOS</Text>
            <Text style={styles.sectionCount}>
              {marcosConquistados}/{MARCOS.length}
            </Text>
          </View>
          <View style={styles.card}>
            {MARCOS.map((marco, i) => {
              const conquistado = marco.conquistado(laudos);
              return (
                <View
                  key={marco.id}
                  style={[styles.marcoRow, i < MARCOS.length - 1 && styles.marcoDivider]}
                >
                  {conquistado ? (
                    <CheckCircle size={16} color={Colors.textPrimary} />
                  ) : (
                    <Circle size={16} color={Colors.textMuted} />
                  )}
                  <View style={styles.marcoInfo}>
                    <Text style={[styles.marcoTitulo, !conquistado && styles.marcoTextPendente]}>
                      {marco.titulo}
                    </Text>
                    <Text style={styles.marcoDesc}>{marco.descricao}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            Dados armazenados localmente · Apenas no dispositivo · LGPD
          </Text>
        </View>
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
    gap: Spacing.base,
    paddingBottom: Spacing.xl,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
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

  // Sections
  section: { gap: Spacing.sm },
  sectionTitle: {
    fontFamily: 'IBMPlexMono_600SemiBold',
    fontSize: FontSize.micro,
    color: Colors.textMuted,
    letterSpacing: 2,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionCount: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.micro,
    color: Colors.textMuted,
  },

  // Generic card
  card: {
    backgroundColor: Colors.bgElevated,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    padding: Spacing.md,
  },

  // Nível
  nivelCard: {
    backgroundColor: Colors.bgElevated,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    padding: Spacing.base,
    gap: Spacing.sm,
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
  barTrack: {
    height: 2,
    backgroundColor: Colors.borderSubtle,
  },
  barFill: {
    height: 2,
    backgroundColor: Colors.textPrimary,
  },
  nivelHint: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.micro,
    color: Colors.textMuted,
  },

  // Historico chart
  chart: {
    flexDirection: 'row',
    height: 80,
    gap: Spacing.xs,
    alignItems: 'flex-end',
  },
  chartCol: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    height: '100%',
  },
  chartBarWrap: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
  },
  chartBar: {
    width: '100%',
    backgroundColor: Colors.borderDefault,
    minHeight: 2,
  },
  chartBarActive: {
    backgroundColor: Colors.textPrimary,
  },
  chartLabel: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 8,
    color: Colors.textMuted,
  },

  // Proto distribution
  protoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: 5,
  },
  protoLabel: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.micro,
    color: Colors.textSecondary,
    width: 70,
  },
  protoBarWrap: {
    flex: 1,
    height: 2,
    backgroundColor: Colors.borderSubtle,
  },
  protoBar: {
    height: 2,
    backgroundColor: Colors.textSecondary,
  },
  protoCount: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: FontSize.micro,
    color: Colors.textMuted,
    width: 20,
    textAlign: 'right',
  },

  // Certificados
  certList: { gap: Spacing.sm },
  certCard: {
    backgroundColor: Colors.bgElevated,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    padding: Spacing.md,
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'flex-start',
  },
  certCardLocked: {
    opacity: 0.45,
  },
  certIcon: {
    width: 32,
    height: 32,
    backgroundColor: Colors.bgInput,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    alignItems: 'center',
    justifyContent: 'center',
  },
  certInfo: { flex: 1, gap: 4 },
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
  certTextLocked: {
    color: Colors.textMuted,
  },
  certDescLocked: {
    color: Colors.textMuted,
  },

  // Marcos
  marcoRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    alignItems: 'flex-start',
  },
  marcoDivider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  marcoInfo: { flex: 1, gap: 2 },
  marcoTitulo: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: FontSize.caption,
    color: Colors.textPrimary,
  },
  marcoTextPendente: {
    color: Colors.textMuted,
  },
  marcoDesc: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.micro,
    color: Colors.textMuted,
  },

  // Disclaimer
  disclaimer: {
    alignItems: 'center',
    paddingTop: Spacing.sm,
  },
  disclaimerText: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.micro,
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
});
