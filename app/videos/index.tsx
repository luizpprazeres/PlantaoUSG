import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ExternalLink } from 'lucide-react-native';
import { RECURSOS_EXTERNOS } from '@/data/videos';
import type { RecursoExterno } from '@/data/videos/tipos';
import { Colors, FontSize, Spacing } from '@/constants/theme';

const CATEGORIA_LABEL: Record<RecursoExterno['categoria'], string> = {
  atlas: 'ATLAS',
  curso: 'CURSO',
  referencia: 'REFERÊNCIA',
  podcast: 'PODCAST',
};

function RecursoCard({ item }: { item: RecursoExterno }) {
  const abrir = async () => {
    const podeAbrir = await Linking.canOpenURL(item.url);
    if (podeAbrir) {
      await Linking.openURL(item.url);
    } else {
      Alert.alert('Erro', 'Não foi possível abrir o link.');
    }
  };

  return (
    <TouchableOpacity style={styles.recursoCard} onPress={abrir} activeOpacity={0.85}>
      <View style={styles.recursoTopo}>
        <View style={styles.recursoTags}>
          <View style={styles.recursoTag}>
            <Text style={styles.recursoTagText}>{CATEGORIA_LABEL[item.categoria]}</Text>
          </View>
          <View style={styles.recursoTag}>
            <Text style={styles.recursoTagText}>{item.idioma.toUpperCase()}</Text>
          </View>
          {item.gratuito && (
            <View style={[styles.recursoTag, styles.recursoTagGratis]}>
              <Text style={styles.recursoTagText}>GRATUITO</Text>
            </View>
          )}
        </View>
        <ExternalLink size={14} color={Colors.textMuted} />
      </View>
      <Text style={styles.recursoNome}>{item.nome}</Text>
      <Text style={styles.recursoDesc} numberOfLines={3}>{item.descricao}</Text>
    </TouchableOpacity>
  );
}

export default function VideosScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <ArrowLeft size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View>
          <Text style={styles.titulo}>VÍDEOS</Text>
          <Text style={styles.subtitulo}>CURADORIA POCUS</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Em breve */}
        <View style={styles.emBreveBox}>
          <Text style={styles.emBreveTitulo}>Vídeos em curadoria</Text>
          <Text style={styles.emBreveDesc}>
            Estamos selecionando os melhores vídeos sobre cada protocolo POCUS.
            Enquanto isso, acesse os recursos externos abaixo.
          </Text>
        </View>

        {/* Recursos externos */}
        <Text style={styles.secaoTitulo}>RECURSOS EXTERNOS</Text>
        <Text style={styles.secaoDesc}>
          Plataformas e referências selecionadas para estudo de POCUS
        </Text>

        {RECURSOS_EXTERNOS.map((r) => (
          <RecursoCard key={r.id} item={r} />
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
    padding: Spacing.base,
    gap: Spacing.sm,
    paddingBottom: Spacing.xl,
  },
  emBreveBox: {
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    borderStyle: 'dashed',
    padding: Spacing.base,
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  emBreveTitulo: {
    fontFamily: 'IBMPlexMono_600SemiBold',
    fontSize: FontSize.label,
    color: Colors.textSecondary,
  },
  emBreveDesc: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.caption,
    color: Colors.textMuted,
    lineHeight: FontSize.caption * 1.7,
  },
  secaoTitulo: {
    fontFamily: 'IBMPlexMono_700Bold',
    fontSize: FontSize.micro,
    color: Colors.textMuted,
    letterSpacing: 2,
    marginTop: Spacing.sm,
  },
  secaoDesc: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.caption,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
  },
  recursoCard: {
    backgroundColor: Colors.bgElevated,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  recursoTopo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recursoTags: { flexDirection: 'row', gap: Spacing.xs },
  recursoTag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  recursoTagGratis: { borderColor: '#2A5C2A' },
  recursoTagText: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: FontSize.micro,
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  recursoNome: {
    fontFamily: 'IBMPlexMono_700Bold',
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  recursoDesc: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
    lineHeight: FontSize.caption * 1.6,
  },
});
