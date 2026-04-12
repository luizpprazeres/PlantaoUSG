import { TouchableOpacity, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  cancelAnimation,
} from 'react-native-reanimated';
import { Mic, MicOff } from 'lucide-react-native';
import { Colors } from '@/constants/theme';

interface VoiceButtonProps {
  listening: boolean;
  onPress: () => void;
}

export function VoiceButton({ listening, onPress }: VoiceButtonProps) {
  const ring1 = useSharedValue(1);
  const ring2 = useSharedValue(1);
  const ring1Opacity = useSharedValue(0);
  const ring2Opacity = useSharedValue(0);

  const startAnimation = () => {
    ring1.value = withRepeat(
      withSequence(withTiming(1.8, { duration: 600 }), withTiming(1, { duration: 600 })),
      -1
    );
    ring1Opacity.value = withRepeat(
      withSequence(withTiming(0.3, { duration: 300 }), withTiming(0, { duration: 900 })),
      -1
    );
    ring2.value = withRepeat(
      withSequence(withTiming(1, { duration: 300 }), withTiming(2.2, { duration: 900 }), withTiming(1, { duration: 300 })),
      -1
    );
    ring2Opacity.value = withRepeat(
      withSequence(withTiming(0, { duration: 300 }), withTiming(0.2, { duration: 300 }), withTiming(0, { duration: 600 })),
      -1
    );
  };

  const stopAnimation = () => {
    cancelAnimation(ring1);
    cancelAnimation(ring2);
    cancelAnimation(ring1Opacity);
    cancelAnimation(ring2Opacity);
    ring1.value = withTiming(1);
    ring2.value = withTiming(1);
    ring1Opacity.value = withTiming(0);
    ring2Opacity.value = withTiming(0);
  };

  const ring1Style = useAnimatedStyle(() => ({
    transform: [{ scale: ring1.value }],
    opacity: ring1Opacity.value,
  }));
  const ring2Style = useAnimatedStyle(() => ({
    transform: [{ scale: ring2.value }],
    opacity: ring2Opacity.value,
  }));

  const handlePress = () => {
    if (listening) {
      stopAnimation();
    } else {
      startAnimation();
    }
    onPress();
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <Animated.View style={[styles.ring, ring2Style]} />
      <Animated.View style={[styles.ring, ring1Style]} />
      <View style={styles.button}>
        {listening
          ? <MicOff size={20} color={Colors.textPrimary} />
          : <Mic size={20} color={Colors.textSecondary} />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.textPrimary,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.bgElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
