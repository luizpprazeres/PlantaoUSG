import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { FunilFooter } from '@/components/ui/FunilFooter';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { useTextCase } from '@/hooks/useTextCase';
import { useTextSize } from '@/hooks/useTextSize';

const REFERENCIAS = [
  'Volpicelli G. et al. International evidence-based recommendations for point-of-care lung ultrasound. Intensive Care Medicine. 2012',
  'Lichtenstein D. Lung Ultrasound in the Critically Ill (BLUE Protocol). Ann Intensive Care. 2014',
  'CBR — Colégio Brasileiro de Radiologia (recomendações POCUS)',
  'ACEP — American College of Emergency Physicians Clinical Policy (eFAST)',
  'ASE — American Society of Echocardiography Guidelines',
];

export default function SobreScreen() {
  const { mode, toggle } = useTextCase();
  const { mode: textSizeMode, cycle: cycleTextSize } = useTextSize();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.titulo}>SOBRE</Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.nome}>Plantão USG</Text>
        <Text style={styles.tagline}>Seu parceiro de ultrassom no plantão.</Text>

        <Text style={styles.sectionLabel}>PREFERÊNCIAS</Text>
        <TouchableOpacity onPress={toggle} style={styles.prefRow}>
          <Text style={styles.prefLabel}>Formato do laudo</Text>
          <Text style={styles.prefValue}>{mode === 'normal' ? 'Aa' : 'AA'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={cycleTextSize} style={styles.prefRow}>
          <Text style={styles.prefLabel}>Tamanho do laudo</Text>
          <Text style={styles.prefValue}>
            {textSizeMode === 'sm' ? 'Aa↓' : textSizeMode === 'md' ? 'Aa' : 'Aa↑'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.sectionLabel}>CRIADOR</Text>
        <Text style={styles.body}>
          Criado por Luiz Paulo — médico intensivista e ultrassonografista, criador da plataforma Laudo USG (laudousg.com).
        </Text>

        <Text style={styles.sectionLabel}>LAUDO USG</Text>
        <Text style={styles.body}>
          Plantão USG foi criado pela equipe do Laudo USG — plataforma completa de laudos com IA para ultrassonografistas.
        </Text>
        <TouchableOpacity
          onPress={() => Linking.openURL('https://laudousg.com/?utm_source=plantao_usg&utm_medium=app&utm_campaign=sobre')}
        >
          <Text style={styles.link}>laudousg.com →</Text>
        </TouchableOpacity>

        <Text style={styles.sectionLabel}>DISCLAIMER</Text>
        <Text style={styles.body}>
          Este aplicativo é uma ferramenta de suporte à documentação clínica. Não substitui avaliação médica, diagnóstico formal ou laudo ultrassonográfico por profissional habilitado.
        </Text>
        <Text style={styles.body}>
          Exames POCUS realizados com este aplicativo são de caráter focado e complementar, realizados exclusivamente por médicos no contexto clínico adequado.
        </Text>

        <Text style={styles.sectionLabel}>REFERÊNCIAS CLÍNICAS</Text>
        {REFERENCIAS.map((ref, i) => (
          <Text key={i} style={styles.ref}>• {ref}</Text>
        ))}

        <FunilFooter posicao="sobre" copy="Plantão USG — by Laudo USG" />
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
  titulo: {
    fontFamily: 'IBMPlexMono_700Bold',
    fontSize: FontSize.label,
    color: Colors.textPrimary,
    letterSpacing: 0.08,
  },
  scroll: { paddingHorizontal: Spacing.base, paddingBottom: Spacing.xl },
  nome: {
    fontFamily: 'IBMPlexMono_700Bold',
    fontSize: FontSize.display,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  tagline: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
  },
  sectionLabel: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: FontSize.micro,
    color: Colors.textMuted,
    letterSpacing: 0.08,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  body: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.body,
    color: Colors.textSecondary,
    lineHeight: FontSize.body * 1.7,
    marginBottom: Spacing.sm,
  },
  link: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    textDecorationLine: 'underline',
    marginBottom: Spacing.base,
  },
  ref: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
    lineHeight: FontSize.caption * 1.8,
    marginBottom: Spacing.xs,
  },
  prefRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  prefLabel: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.body,
    color: Colors.textSecondary,
  },
  prefValue: {
    fontFamily: 'IBMPlexMono_700Bold',
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    letterSpacing: 1,
  },
});
