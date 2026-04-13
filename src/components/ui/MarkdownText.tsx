import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize } from '@/constants/theme';

interface MarkdownTextProps {
  text: string;
  color?: string;
  style?: object;
}

function parseInline(line: string, baseColor: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      parts.push(
        <Text key={lastIndex} style={[styles.regular, { color: baseColor }]}>
          {line.slice(lastIndex, match.index)}
        </Text>
      );
    }
    parts.push(
      <Text key={match.index} style={[styles.bold, { color: baseColor }]}>
        {match[1]}
      </Text>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < line.length) {
    parts.push(
      <Text key={lastIndex} style={[styles.regular, { color: baseColor }]}>
        {line.slice(lastIndex)}
      </Text>
    );
  }

  return parts;
}

export function MarkdownText({ text, color = Colors.textSecondary, style }: MarkdownTextProps) {
  const lines = text.split('\n');

  return (
    <View style={style}>
      {lines.map((line, i) => {
        if (line.trim() === '') {
          return <View key={i} style={styles.spacer} />;
        }

        const bulletMatch = line.match(/^[\-\*] (.+)/);
        const numberedMatch = line.match(/^(\d+)\. (.+)/);

        if (bulletMatch) {
          return (
            <Text key={i} style={styles.line}>
              <Text style={[styles.regular, { color }]}>{'· '}</Text>
              {parseInline(bulletMatch[1], color)}
            </Text>
          );
        }

        if (numberedMatch) {
          return (
            <Text key={i} style={styles.line}>
              <Text style={[styles.regular, { color }]}>{numberedMatch[1] + '. '}</Text>
              {parseInline(numberedMatch[2], color)}
            </Text>
          );
        }

        return (
          <Text key={i} style={styles.line}>
            {parseInline(line, color)}
          </Text>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  line: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.caption,
    lineHeight: 18,
    marginBottom: 2,
  },
  regular: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.caption,
    lineHeight: 18,
  },
  bold: {
    fontFamily: 'IBMPlexMono_700Bold',
    fontSize: FontSize.caption,
    lineHeight: 18,
  },
  spacer: {
    height: 6,
  },
});
