import { TouchableOpacity, Text, StyleSheet, Linking } from 'react-native';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { FunilURLs } from '@/constants/funil';
import { Analytics } from '@/utils/analytics';

interface FunilFooterProps {
  posicao: keyof typeof FunilURLs;
  copy: string;
}

export function FunilFooter({ posicao, copy }: FunilFooterProps) {
  const handlePress = () => {
    Analytics.laudousgClicked(posicao);
    Linking.openURL(FunilURLs[posicao]);
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <Text style={styles.text}>{copy}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.base,
    alignItems: 'center',
  },
  text: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.caption,
    color: Colors.textMuted,
    letterSpacing: 0.04 * FontSize.caption,
  },
});
