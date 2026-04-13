import { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet, KeyboardAvoidingView, Platform
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { CALCULADORA_MAP } from '@/calculadoras/engine';
import type { ResultadoCor } from '@/calculadoras/definitions';
import { Colors, FontSize, Spacing } from '@/constants/theme';

const COR_MAP: Record<ResultadoCor, string> = {
  normal: '#4CAF50',
  atencao: '#FF9800',
  critico: '#F44336',
};

export default function CalculadoraScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const calc = CALCULADORA_MAP[id ?? ''];
  const [valores, setValores] = useState<Record<string, number>>({});
  const [resultado, setResultado] = useState<ReturnType<typeof calc.calcular> | null>(null);

  if (!calc) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={{ color: Colors.textPrimary, padding: Spacing.base }}>Calculadora não encontrada</Text>
      </SafeAreaView>
    );
  }

  const calcular = () => {
    try {
      const res = calc.calcular(valores);
      setResultado(res);
    } catch {
      // campos incompletos
    }
  };

  const allFilled = calc.campos.every((c) => valores[c.id] !== undefined && !isNaN(valores[c.id]));

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.titulo}>{calc.nome.toUpperCase()}</Text>
        <View style={{ width: 20 }} />
      </View>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.descricao}>{calc.descricao}</Text>

          {calc.campos.map((campo) => (
            <View key={campo.id} style={styles.campoContainer}>
              <Text style={styles.campoLabel}>{campo.label}{campo.unit ? ` (${campo.unit})` : ''}</Text>
              {campo.type === 'number' ? (
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder={campo.placeholder ?? ''}
                  placeholderTextColor={Colors.textMuted}
                  value={valores[campo.id] !== undefined ? String(valores[campo.id]) : ''}
                  onChangeText={(t) => {
                    const n = parseFloat(t);
                    setValores((prev) => ({ ...prev, [campo.id]: isNaN(n) ? undefined as any : n }));
                    setResultado(null);
                  }}
                />
              ) : (
                <View style={styles.opcoes}>
                  {campo.options?.map((opt) => (
                    <TouchableOpacity
                      key={opt.value}
                      style={[styles.opcaoBtn, valores[campo.id] === opt.value && styles.opcaoBtnAtivo]}
                      onPress={() => {
                        setValores((prev) => ({ ...prev, [campo.id]: opt.value }));
                        setResultado(null);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.opcaoLabel, valores[campo.id] === opt.value && styles.opcaoLabelAtivo]}>
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          ))}

          <TouchableOpacity
            style={[styles.calcBtn, !allFilled && styles.calcBtnDisabled]}
            onPress={calcular}
            disabled={!allFilled}
            activeOpacity={0.8}
          >
            <Text style={styles.calcBtnLabel}>CALCULAR</Text>
          </TouchableOpacity>

          {resultado && (
            <View style={[styles.resultado, { borderColor: COR_MAP[resultado.cor] }]}>
              <Text style={[styles.resultadoValor, { color: COR_MAP[resultado.cor] }]}>{resultado.valor}</Text>
              <Text style={styles.resultadoInterp}>{resultado.interpretacao}</Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPrimary },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
  },
  titulo: { fontFamily: 'IBMPlexMono_700Bold', fontSize: FontSize.label, color: Colors.textPrimary, letterSpacing: 0.06, flex: 1, textAlign: 'center' },
  scroll: { padding: Spacing.base, paddingBottom: Spacing.xl },
  descricao: { fontFamily: 'IBMPlexMono_400Regular', fontSize: FontSize.caption, color: Colors.textSecondary, marginBottom: Spacing.lg, lineHeight: FontSize.caption * 1.6 },
  campoContainer: { marginBottom: Spacing.base },
  campoLabel: { fontFamily: 'IBMPlexMono_500Medium', fontSize: FontSize.caption, color: Colors.textMuted, marginBottom: Spacing.xs, letterSpacing: 0.04 },
  input: {
    borderWidth: 1, borderColor: Colors.borderDefault, backgroundColor: Colors.bgInput,
    padding: Spacing.md, fontFamily: 'IBMPlexMono_400Regular', fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  opcoes: { flexDirection: 'column', gap: Spacing.xs },
  opcaoBtn: {
    borderWidth: 1, borderColor: Colors.borderDefault, padding: Spacing.sm, backgroundColor: Colors.bgInput,
  },
  opcaoBtnAtivo: { borderColor: Colors.textPrimary, backgroundColor: '#111' },
  opcaoLabel: { fontFamily: 'IBMPlexMono_400Regular', fontSize: FontSize.caption, color: Colors.textSecondary },
  opcaoLabelAtivo: { color: Colors.textPrimary },
  calcBtn: {
    backgroundColor: Colors.textPrimary, padding: Spacing.md, alignItems: 'center',
    marginTop: Spacing.lg,
  },
  calcBtnDisabled: { opacity: 0.3 },
  calcBtnLabel: { fontFamily: 'IBMPlexMono_700Bold', fontSize: FontSize.label, color: Colors.bgPrimary, letterSpacing: 0.06 },
  resultado: {
    borderWidth: 1, padding: Spacing.base, marginTop: Spacing.base,
  },
  resultadoValor: { fontFamily: 'IBMPlexMono_700Bold', fontSize: FontSize.heading, marginBottom: Spacing.sm },
  resultadoInterp: { fontFamily: 'IBMPlexMono_400Regular', fontSize: FontSize.caption, color: Colors.textSecondary, lineHeight: FontSize.caption * 1.7 },
});
