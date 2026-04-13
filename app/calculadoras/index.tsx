import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { CALCULADORAS, CATEGORIAS_CALCULADORAS } from '@/calculadoras/engine';
import { Colors, FontSize, Spacing } from '@/constants/theme';

export default function CalculadorasScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.titulo}>CALCULADORAS</Text>
        <View style={{ width: 20 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        {CATEGORIAS_CALCULADORAS.map((cat) => (
          <View key={cat} style={styles.grupo}>
            <Text style={styles.catLabel}>{cat}</Text>
            {CALCULADORAS.filter((c) => c.categoria === cat).map((calc) => (
              <TouchableOpacity
                key={calc.id}
                style={styles.card}
                onPress={() => router.push(`/calculadoras/${calc.id}`)}
                activeOpacity={0.7}
              >
                <Text style={styles.cardNome}>{calc.nome}</Text>
                <Text style={styles.cardDesc}>{calc.descricao}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPrimary },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
  },
  titulo: { fontFamily: 'IBMPlexMono_700Bold', fontSize: FontSize.label, color: Colors.textPrimary, letterSpacing: 0.08 },
  scroll: { paddingHorizontal: Spacing.base, paddingBottom: Spacing.xl },
  grupo: { marginBottom: Spacing.lg },
  catLabel: {
    fontFamily: 'IBMPlexMono_500Medium', fontSize: FontSize.micro,
    color: Colors.textMuted, letterSpacing: 0.08, marginBottom: Spacing.sm,
    marginTop: Spacing.base,
  },
  card: {
    borderBottomWidth: 1, borderBottomColor: Colors.borderSubtle,
    paddingVertical: Spacing.md,
  },
  cardNome: { fontFamily: 'IBMPlexMono_600SemiBold', fontSize: FontSize.label, color: Colors.textPrimary, marginBottom: 4 },
  cardDesc: { fontFamily: 'IBMPlexMono_400Regular', fontSize: FontSize.caption, color: Colors.textSecondary },
});
