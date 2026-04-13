import { useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSize, Radius } from '@/constants/theme';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface ChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function Chip({ label, selected, onPress }: ChipProps) {
  const scale = useSharedValue(1);
  const progress = useSharedValue(selected ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(selected ? 1 : 0, { duration: 120 });
  }, [selected]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    borderWidth: 1,
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      ['#2A2A2A', Colors.emergencyRed]
    ),
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [Colors.bgInput, '#1A0000']
    ),
  }));

  const handlePress = () => {
    scale.value = withSequence(
      withTiming(0.96, { duration: 75 }),
      withTiming(1, { duration: 75 })
    );
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <AnimatedTouchable
      style={[styles.chip, animatedStyle]}
      onPress={handlePress}
      activeOpacity={1}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>
        {label}
      </Text>
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.micro,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  label: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
    letterSpacing: 0.04 * FontSize.caption,
  },
  labelSelected: {
    color: Colors.textPrimary,
    fontFamily: 'IBMPlexMono_500Medium',
  },
});
