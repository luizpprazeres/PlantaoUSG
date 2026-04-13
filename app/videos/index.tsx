import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Image,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Play, Clock, Globe, ExternalLink } from 'lucide-react-native';
import { VIDEOS, FILTROS, RECURSOS_EXTERNOS, filtrarVideos } from '@/data/videos';
import type { ProtocoloVideo, RecursoExterno } from '@/data/videos/tipos';
import { Colors, FontSize, Spacing, Radius } from '@/constants/theme';

function VideoCard({ item }: { item: ReturnType<typeof filtrarVideos>[number] }) {
  const thumbUri = `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`;

  const abrir = async () => {
    const url = `https://www.youtube.com/watch?v=${item.youtubeId}`;
    const podeAbrir = await Linking.canOpenURL(url);
    if (podeAbrir) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Erro', 'Não foi possível abrir o YouTube.');
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={abrir} activeOpacity={0.85}>
      <View style={styles.thumb}>
        <Image
          source={{ uri: thumbUri }}
          style={styles.thumbImage}
          resizeMode="cover"
        />
        <View style={styles.playOverlay}>
          <Play size={24} color="#FFFFFF" fill="#FFFFFF" />
        </View>
        <View style={styles.duracao}>
          <Clock size={10} color="#FFFFFF" />
          <Text style={styles.duracaoText}>{item.duracaoMin} min</Text>
        </View>
      </View>

      <View style={styles.cardInfo}>
        <Text style={styles.cardTitulo} numberOfLines={2}>
          {item.titulo}
        </Text>
        <View style={styles.cardMeta}>
          <Text style={styles.cardCanal} numberOfLines={1}>
            {item.canal}
          </Text>
          <View style={styles.idiomaTag}>
            <Globe size={9} color={Colors.textMuted} />
            <Text style={styles.idiomaText}>
              {item.idioma === 'pt' ? 'PT' : 'EN'}
            </Text>
          </View>
        </View>
        <View style={styles.tagsList}>
          {item.tags.slice(0, 3).map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
          {item.nivel === 'avancado' && (
            <View style={[styles.tag, styles.tagAvancado]}>
              <Text style={styles.tagText}>avançado</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

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

function EstadoVazio() {
  return (
    <View style={styles.vazio}>
      <Text style={styles.vazioTitle}>Em breve</Text>
      <Text style={styles.vazioBody}>
        Vídeos selecionados sobre este protocolo{'\n'}serão adicionados em breve.
      </Text>
    </View>
  );
}

export default function VideosScreen() {
  const [filtro, setFiltro] = useState<ProtocoloVideo | 'todos'>('todos');
  const videosFiltrados = filtrarVideos(VIDEOS, filtro);

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

      {/* Filtros horizontais */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtrosContainer}
        style={styles.filtrosScroll}
      >
        {FILTROS.map((f) => (
          <TouchableOpacity
            key={f.valor}
            style={[styles.filtroChip, filtro === f.valor && styles.filtroChipAtivo]}
            onPress={() => setFiltro(f.valor)}
            activeOpacity={0.7}
          >
            <Text
              style={[styles.filtroText, filtro === f.valor && styles.filtroTextAtivo]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Lista de vídeos */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {videosFiltrados.length === 0 ? (
          <EstadoVazio />
        ) : (
          videosFiltrados.map((v) => <VideoCard key={v.id} item={v} />)
        )}

        {/* Recursos externos */}
        <View style={styles.recursosSection}>
          <Text style={styles.recursosSectionTitle}>RECURSOS EXTERNOS</Text>
          <Text style={styles.recursosSectionDesc}>
            Sites e plataformas de referência para estudo de POCUS
          </Text>
        </View>
        {RECURSOS_EXTERNOS.map((r) => (
          <RecursoCard key={r.id} item={r} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const THUMB_HEIGHT = 180;

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
  filtrosScroll: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  filtrosContainer: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  filtroChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  filtroChipAtivo: {
    backgroundColor: Colors.textPrimary,
    borderColor: Colors.textPrimary,
  },
  filtroText: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: FontSize.micro,
    color: Colors.textSecondary,
    letterSpacing: 1,
  },
  filtroTextAtivo: {
    color: Colors.bgPrimary,
  },
  scroll: { flex: 1 },
  scrollContent: {
    padding: Spacing.base,
    gap: Spacing.base,
  },

  // Card
  card: {
    backgroundColor: Colors.bgElevated,
    borderRadius: Radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  thumb: {
    height: THUMB_HEIGHT,
    backgroundColor: Colors.bgInput,
    position: 'relative',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  duracao: {
    position: 'absolute',
    bottom: Spacing.sm,
    right: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: Radius.micro,
  },
  duracaoText: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: FontSize.micro,
    color: '#FFFFFF',
  },
  cardInfo: {
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  cardTitulo: {
    fontFamily: 'IBMPlexMono_600SemiBold',
    fontSize: FontSize.label,
    color: Colors.textPrimary,
    lineHeight: FontSize.label * 1.5,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardCanal: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.caption,
    color: Colors.textMuted,
    flex: 1,
  },
  idiomaTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  idiomaText: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: FontSize.micro,
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: 2,
  },
  tag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.micro,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  tagAvancado: {
    borderColor: Colors.textMuted,
  },
  tagText: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.micro,
    color: Colors.textMuted,
  },

  // Recursos externos
  recursosSection: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
  },
  recursosSectionTitle: {
    fontFamily: 'IBMPlexMono_700Bold',
    fontSize: FontSize.label,
    color: Colors.textPrimary,
    letterSpacing: 1,
  },
  recursosSectionDesc: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.caption,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
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
  recursoTags: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  recursoTag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  recursoTagGratis: {
    borderColor: '#2A5C2A',
  },
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

  // Vazio
  vazio: {
    paddingTop: Spacing['2xl'],
    alignItems: 'center',
    gap: Spacing.md,
  },
  vazioTitle: {
    fontFamily: 'IBMPlexMono_600SemiBold',
    fontSize: FontSize.body,
    color: Colors.textSecondary,
  },
  vazioBody: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.caption,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: FontSize.caption * 1.8,
  },
});
