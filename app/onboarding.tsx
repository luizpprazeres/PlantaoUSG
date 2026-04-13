import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Dimensions,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { useMedico } from '@/hooks/useMedico';
import { usePreferences } from '@/hooks/usePreferences';
import { Colors, FontSize, Spacing, Radius } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TOTAL_STEPS = 3;

// ------- Tela 1: Boas-vindas -------
function StepBoasVindas() {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(16);

  useEffect(() => {
    opacity.value = withDelay(100, withTiming(1, { duration: 400 }));
    translateY.value = withDelay(100, withTiming(0, { duration: 400, easing: Easing.out(Easing.cubic) }));
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.stepContent, animStyle]}>
      <Text style={styles.appName}>Plantão USG</Text>
      <Text style={styles.appSub}>POCUS · LAUDOS · EMERGÊNCIA</Text>

      <Text style={styles.headline}>
        Laudo POCUS{'\n'}em segundos.
      </Text>

      <Text style={styles.body}>
        Selecione achados com um toque, e a IA gera o laudo estruturado pronto para o prontuário.
      </Text>

      <View style={styles.featureList}>
        {[
          '5 protocolos: eFAST, BLUE, RUSH, Cardíaco, VExUS',
          '10 calculadoras clínicas especializadas',
          'Tira-dúvidas com IA especializada em POCUS',
          'Export PDF com identificação médico-legal',
        ].map((item, i) => (
          <View key={i} style={styles.featureItem}>
            <Text style={styles.featureDot}>·</Text>
            <Text style={styles.featureText}>{item}</Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );
}

// ------- Tela 2: Como funciona -------
function StepComoFunciona() {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(16);

  useEffect(() => {
    opacity.value = withDelay(80, withTiming(1, { duration: 400 }));
    translateY.value = withDelay(80, withTiming(0, { duration: 400, easing: Easing.out(Easing.cubic) }));
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const steps = [
    {
      num: '01',
      title: 'Escolha o protocolo',
      desc: 'eFAST, BLUE, RUSH, Cardíaco ou VExUS — selecione o exame que está realizando.',
    },
    {
      num: '02',
      title: 'Marque os achados',
      desc: 'Toque nas janelas ecográficas e selecione os achados com chips. Ou dite por voz.',
    },
    {
      num: '03',
      title: 'Gere o laudo',
      desc: 'A IA estrutura extenso + versão objetiva para prontuário. Copie, compartilhe ou exporte em PDF.',
    },
  ];

  return (
    <Animated.View style={[styles.stepContent, animStyle]}>
      <Text style={styles.stepLabel}>COMO FUNCIONA</Text>
      <Text style={styles.headline}>Três passos.{'\n'}Um laudo.</Text>

      <View style={styles.stepsList}>
        {steps.map((s) => (
          <View key={s.num} style={styles.stepItem}>
            <Text style={styles.stepNum}>{s.num}</Text>
            <View style={styles.stepTextBlock}>
              <Text style={styles.stepTitle}>{s.title}</Text>
              <Text style={styles.stepDesc}>{s.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.disclaimerBox}>
        <Text style={styles.disclaimerText}>
          Laudos elaborados pelo médico com auxílio de IA. A responsabilidade clínica é sempre do profissional.
        </Text>
      </View>
    </Animated.View>
  );
}

// ------- Tela 3: Identificação médica -------
function StepIdentificacao() {
  const { medico, atualizar } = useMedico();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(16);

  useEffect(() => {
    opacity.value = withDelay(80, withTiming(1, { duration: 400 }));
    translateY.value = withDelay(80, withTiming(0, { duration: 400, easing: Easing.out(Easing.cubic) }));
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.stepContent, animStyle]}>
      <Text style={styles.stepLabel}>IDENTIFICAÇÃO</Text>
      <Text style={styles.headline}>Seu laudo,{'\n'}sua assinatura.</Text>
      <Text style={styles.body}>
        Preencha para que seus dados apareçam no PDF exportado. Pode alterar depois em Sobre.
      </Text>

      <View style={styles.formBlock}>
        <Text style={styles.fieldLabel}>Nome completo</Text>
        <TextInput
          style={styles.fieldInput}
          value={medico.nome}
          onChangeText={(v) => atualizar('nome', v)}
          placeholder="Dr(a). Nome Sobrenome"
          placeholderTextColor={Colors.textMuted}
          autoCapitalize="words"
          returnKeyType="next"
        />

        <Text style={styles.fieldLabel}>CRM</Text>
        <View style={styles.crmRow}>
          <TextInput
            style={[styles.fieldInput, { flex: 3 }]}
            value={medico.crm}
            onChangeText={(v) => atualizar('crm', v.replace(/\D/g, ''))}
            placeholder="123456"
            placeholderTextColor={Colors.textMuted}
            keyboardType="numeric"
            maxLength={7}
            returnKeyType="next"
          />
          <TextInput
            style={[styles.fieldInput, { flex: 1, textAlign: 'center', marginLeft: Spacing.sm }]}
            value={medico.crmEstado}
            onChangeText={(v) => atualizar('crmEstado', v.toUpperCase().slice(0, 2))}
            placeholder="SP"
            placeholderTextColor={Colors.textMuted}
            autoCapitalize="characters"
            maxLength={2}
            returnKeyType="next"
          />
        </View>

        <Text style={styles.fieldLabel}>Especialidade</Text>
        <TextInput
          style={styles.fieldInput}
          value={medico.especialidade}
          onChangeText={(v) => atualizar('especialidade', v)}
          placeholder="Medicina de Emergência"
          placeholderTextColor={Colors.textMuted}
          autoCapitalize="words"
          returnKeyType="done"
        />
      </View>

      <Text style={styles.skipHint}>Pode pular — preenchível depois em Sobre →</Text>
    </Animated.View>
  );
}

// ------- Paginação -------
function Dots({ current }: { current: number }) {
  return (
    <View style={styles.dots}>
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <View
          key={i}
          style={[styles.dot, i === current && styles.dotActive]}
        />
      ))}
    </View>
  );
}

// ------- Componente principal -------
export default function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const { set } = usePreferences();

  const isLast = step === TOTAL_STEPS - 1;

  const concluir = async () => {
    await set('onboarding_done', 'true');
    router.replace('/');
  };

  const avancar = () => {
    if (transitioning) return;
    if (isLast) {
      concluir();
    } else {
      setTransitioning(true);
      setStep((s) => s + 1);
      setTimeout(() => setTransitioning(false), 50);
    }
  };

  const steps = [<StepBoasVindas />, <StepComoFunciona />, <StepIdentificacao />];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inner}>
          <View style={styles.stepArea} key={step}>
            {steps[step]}
          </View>

          <View style={styles.bottom}>
            <Dots current={step} />
            <TouchableOpacity style={styles.btn} onPress={avancar} activeOpacity={0.85}>
              <Text style={styles.btnText}>
                {isLast ? 'COMEÇAR' : 'PRÓXIMO →'}
              </Text>
            </TouchableOpacity>

            {!isLast && (
              <TouchableOpacity onPress={concluir} style={styles.skipBtn}>
                <Text style={styles.skipText}>pular</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPrimary },
  scroll: { flexGrow: 1 },
  inner: {
    flex: 1,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    justifyContent: 'space-between',
    minHeight: '100%',
  },
  stepArea: { flex: 1 },
  stepContent: { flex: 1 },

  // Tela 1
  appName: {
    fontFamily: 'IBMPlexMono_700Bold',
    fontSize: 22,
    color: Colors.textPrimary,
    letterSpacing: 2,
    marginBottom: 2,
  },
  appSub: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 9,
    color: Colors.textMuted,
    letterSpacing: 2.5,
    marginBottom: Spacing.xl,
  },
  headline: {
    fontFamily: 'IBMPlexMono_700Bold',
    fontSize: 28,
    color: Colors.textPrimary,
    lineHeight: 36,
    marginBottom: Spacing.base,
  },
  body: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.label,
    color: Colors.textSecondary,
    lineHeight: FontSize.label * 1.75,
    marginBottom: Spacing.lg,
  },
  featureList: { gap: Spacing.sm },
  featureItem: { flexDirection: 'row', alignItems: 'flex-start' },
  featureDot: {
    fontFamily: 'IBMPlexMono_700Bold',
    fontSize: FontSize.label,
    color: Colors.textMuted,
    marginRight: Spacing.sm,
    lineHeight: FontSize.label * 1.75,
  },
  featureText: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.label,
    color: Colors.textSecondary,
    lineHeight: FontSize.label * 1.75,
    flex: 1,
  },

  // Tela 2
  stepLabel: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: FontSize.micro,
    color: Colors.textMuted,
    letterSpacing: 2,
    marginBottom: Spacing.sm,
  },
  stepsList: { gap: Spacing.lg, marginTop: Spacing.base },
  stepItem: { flexDirection: 'row', alignItems: 'flex-start' },
  stepNum: {
    fontFamily: 'IBMPlexMono_700Bold',
    fontSize: 11,
    color: Colors.textMuted,
    marginRight: Spacing.md,
    marginTop: 2,
    letterSpacing: 1,
    width: 24,
  },
  stepTextBlock: { flex: 1 },
  stepTitle: {
    fontFamily: 'IBMPlexMono_600SemiBold',
    fontSize: FontSize.label,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  stepDesc: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
    lineHeight: FontSize.caption * 1.7,
  },
  disclaimerBox: {
    marginTop: Spacing.xl,
    borderLeftWidth: 2,
    borderLeftColor: Colors.borderDefault,
    paddingLeft: Spacing.md,
  },
  disclaimerText: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.caption,
    color: Colors.textMuted,
    lineHeight: FontSize.caption * 1.7,
  },

  // Tela 3
  formBlock: { gap: Spacing.sm, marginTop: Spacing.base },
  fieldLabel: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: FontSize.caption,
    color: Colors.textMuted,
    marginBottom: 2,
    letterSpacing: 0.04,
  },
  fieldInput: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.label,
    color: Colors.textPrimary,
    backgroundColor: Colors.bgInput,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  crmRow: { flexDirection: 'row' },
  skipHint: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.caption,
    color: Colors.textMuted,
    marginTop: Spacing.md,
  },

  // Bottom
  bottom: {
    paddingTop: Spacing.lg,
    gap: Spacing.md,
    alignItems: 'center',
  },
  dots: { flexDirection: 'row', gap: 8 },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.borderDefault,
  },
  dotActive: { backgroundColor: Colors.textPrimary, width: 20, borderRadius: 3 },
  btn: {
    width: '100%',
    backgroundColor: Colors.textPrimary,
    paddingVertical: Spacing.md,
    borderRadius: Radius.sm,
    alignItems: 'center',
  },
  btnText: {
    fontFamily: 'IBMPlexMono_700Bold',
    fontSize: FontSize.label,
    color: Colors.bgPrimary,
    letterSpacing: 0.08,
  },
  skipBtn: { paddingVertical: Spacing.xs },
  skipText: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.caption,
    color: Colors.textMuted,
  },
});
