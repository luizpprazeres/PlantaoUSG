import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { SwipeableRow } from '@/components/ui/SwipeableRow';
import { FunilFooter } from '@/components/ui/FunilFooter';
import { useLaudos } from '@/hooks/useLaudos';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import type { Laudo } from '@/db/schema';

function LaudoItem({ laudo, onDelete }: { laudo: Laudo; onDelete: () => void }) {
  return (
    <SwipeableRow onDelete={onDelete}>
      <View style={styles.item}>
        <Text style={styles.protocolo}>{laudo.protocolo.toUpperCase()}</Text>
        <Text style={styles.data}>
          {new Date(laudo.timestamp).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
        <Text style={styles.preview} numberOfLines={2}>
          {laudo.outputObjetivo}
        </Text>
      </View>
    </SwipeableRow>
  );
}

export default function HistoricoScreen() {
  const { laudos, deletarLaudo } = useLaudos();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.titulo}>HISTÓRICO</Text>
        <View style={{ width: 20 }} />
      </View>

      {laudos.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Nenhum laudo ainda.</Text>
        </View>
      ) : (
        <FlatList
          data={laudos}
          keyExtractor={(l) => l.id}
          renderItem={({ item }) => (
            <LaudoItem laudo={item} onDelete={() => deletarLaudo(item.id)} />
          )}
          ItemSeparatorComponent={() => (
            <View style={{ height: 1, backgroundColor: Colors.borderSubtle }} />
          )}
          ListFooterComponent={
            <FunilFooter posicao="historico" copy="Histórico na nuvem no Laudo USG →" />
          }
        />
      )}
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
  item: { padding: Spacing.base },
  protocolo: {
    fontFamily: 'IBMPlexMono_700Bold',
    fontSize: FontSize.caption,
    color: Colors.textPrimary,
    letterSpacing: 0.06,
  },
  data: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.micro,
    color: Colors.textMuted,
    marginVertical: Spacing.xs,
  },
  preview: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
    lineHeight: FontSize.caption * 1.5,
  },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.body,
    color: Colors.textMuted,
  },
});
