import { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, FontSize, Spacing } from '@/constants/theme';

interface ObservacoesBarProps {
  value: string;
  onChange: (text: string) => void;
}

export function ObservacoesBar({ value, onChange }: ObservacoesBarProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setExpanded((e) => !e)}
        style={styles.header}
      >
        <Text style={styles.label}>OBSERVAÇÕES</Text>
        {value.length > 0 && (
          <Text style={styles.count}>{value.length} chars</Text>
        )}
      </TouchableOpacity>
      {expanded && (
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChange}
          multiline
          numberOfLines={4}
          placeholder="achados adicionais, técnica, limitações"
          placeholderTextColor={Colors.textMuted}
          autoFocus
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgElevated,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  label: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: FontSize.micro,
    color: Colors.textMuted,
    letterSpacing: 0.08 * FontSize.micro,
  },
  count: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.micro,
    color: Colors.textMuted,
  },
  input: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.base,
    minHeight: 100,
    textAlignVertical: 'top',
  },
});
