import { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PanResponder,
  ScrollView,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Chip } from '@/components/ui/Chip';
import { Colors, FontSize, Spacing, Radius } from '@/constants/theme';
import type { Janela } from '@/data/protocolos/tipos';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.6;
const SWIPE_THRESHOLD = 80;

interface JanelaSheetProps {
  janela: Janela | null;
  selecionados: string[];
  onToggle: (achadoId: string) => void;
  onClose: () => void;
}

export function JanelaSheet({ janela, selecionados, onToggle, onClose }: JanelaSheetProps) {
  const translateY = useSharedValue(SHEET_MAX_HEIGHT);
  const closing = useRef(false);

  const close = () => {
    if (closing.current) return;
    closing.current = true;
    translateY.value = withSpring(SHEET_MAX_HEIGHT, { damping: 20, stiffness: 200 }, () => {
      runOnJS(onClose)();
    });
  };

  useEffect(() => {
    if (janela) {
      closing.current = false;
      translateY.value = withSpring(0, { damping: 20, stiffness: 200 });
    }
  }, [janela]);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gs) => gs.dy > 5,
    onPanResponderMove: (_, gs) => {
      if (gs.dy > 0) {
        translateY.value = gs.dy;
      }
    },
    onPanResponderRelease: (_, gs) => {
      if (gs.dy > SWIPE_THRESHOLD) {
        close();
      } else {
        translateY.value = withSpring(0, { damping: 20, stiffness: 200 });
      }
    },
  });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!janela) return null;

  const alteredGroups = janela.grupos.filter((g) => g.categoria === 'alterado');

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={close} />
      <Animated.View style={[styles.sheet, sheetStyle]} {...panResponder.panHandlers}>
        <View style={styles.handle} />
        <Text style={styles.titulo}>{janela.nome.toUpperCase()}</Text>
        <ScrollView
          style={styles.chipsScroll}
          contentContainerStyle={styles.chipsContent}
          showsVerticalScrollIndicator={false}
        >
          {alteredGroups.flatMap((g) =>
            g.achados.map((achado) => (
              <Chip
                key={achado.id}
                label={achado.label}
                selected={selecionados.includes(achado.id)}
                onPress={() => onToggle(achado.id)}
              />
            ))
          )}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    backgroundColor: Colors.bgElevated,
    borderTopLeftRadius: Radius.md,
    borderTopRightRadius: Radius.md,
    maxHeight: SHEET_MAX_HEIGHT,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.xl,
  },
  handle: {
    width: 32,
    height: 3,
    backgroundColor: Colors.textMuted,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.base,
  },
  titulo: {
    fontFamily: 'IBMPlexMono_600SemiBold',
    fontSize: FontSize.label,
    color: Colors.textPrimary,
    letterSpacing: 1.5,
    marginBottom: Spacing.base,
  },
  chipsScroll: {
    flexGrow: 0,
  },
  chipsContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
