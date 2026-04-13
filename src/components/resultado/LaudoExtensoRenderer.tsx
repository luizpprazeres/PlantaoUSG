import { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '@/constants/theme';

interface Section {
  header: string;
  lines: string[];
}

function parseExtenso(text: string): Section[] {
  const HEADERS = ['TÉCNICA', 'ACHADOS', 'IMPRESSÃO', 'REFERÊNCIAS'];
  const sections: Section[] = [];

  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');

  let currentHeader: string | null = null;
  let currentLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    // Header só reconhecido no início da linha (linha inteira OU "HEADER: conteúdo")
    const matchedHeader = HEADERS.find(h => {
      const upper = trimmed.toUpperCase();
      return upper === h || upper.startsWith(`${h}:`) || upper.startsWith(`${h} `);
    });

    if (matchedHeader) {
      if (currentHeader !== null) {
        sections.push({ header: currentHeader, lines: currentLines });
      }
      currentHeader = matchedHeader;
      // Conteúdo após o header na mesma linha (ex: "TÉCNICA: Transdutor...")
      const afterHeader = trimmed.slice(matchedHeader.length).replace(/^:\s*/, '').trim();
      currentLines = afterHeader ? [afterHeader] : [];
    } else if (currentHeader !== null && trimmed) {
      currentLines.push(trimmed);
    }
  }

  if (currentHeader !== null) {
    sections.push({ header: currentHeader, lines: currentLines });
  }

  return sections;
}

interface AnimatedLineProps {
  text: string;
  globalIndex: number;
  fontSize: number;
  isBold?: boolean;
}

function AnimatedLine({ text, globalIndex, fontSize, isBold }: AnimatedLineProps) {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(-6);

  useEffect(() => {
    const delay = globalIndex * 30;
    opacity.value = withDelay(delay, withTiming(1, { duration: 150 }));
    translateX.value = withDelay(
      delay,
      withTiming(0, { duration: 150, easing: Easing.out(Easing.cubic) })
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.Text
      style={[
        {
          fontFamily: isBold ? 'IBMPlexMono_700Bold' : 'IBMPlexMono_400Regular',
          fontSize: isBold ? fontSize - 1 : fontSize,
          color: isBold ? Colors.textPrimary : Colors.textSecondary,
          lineHeight: isBold ? (fontSize - 1) * 1.5 : fontSize * 1.75,
          letterSpacing: isBold ? 0.06 : 0.01 * fontSize,
        },
        animStyle,
      ]}
    >
      {text}
    </Animated.Text>
  );
}

interface LaudoExtensoRendererProps {
  text: string;
  fontSize?: number;
  onComplete?: () => void;
}

export function LaudoExtensoRenderer({ text, fontSize = 13, onComplete }: LaudoExtensoRendererProps) {
  const sections = parseExtenso(text);
  const calledRef = useRef(false);

  // Contar total de "linhas" para calcular delay total e chamar onComplete
  useEffect(() => {
    if (!onComplete) return;
    let totalLines = 0;
    sections.forEach(s => {
      totalLines += 1; // header
      totalLines += s.lines.length;
    });
    const totalDuration = totalLines * 30 + 150 + 50;
    const timer = setTimeout(() => {
      if (!calledRef.current) {
        calledRef.current = true;
        onComplete();
      }
    }, totalDuration);
    return () => clearTimeout(timer);
  }, [text]);

  let globalIndex = 0;

  return (
    <View>
      {sections.map((section, sIdx) => {
        const headerIndex = globalIndex++;
        const lineIndices = section.lines.map(() => globalIndex++);

        return (
          <View key={sIdx} style={sIdx > 0 ? styles.sectionGap : undefined}>
            {/* Header em bold */}
            <AnimatedLine
              text={section.header}
              globalIndex={headerIndex}
              fontSize={fontSize}
              isBold
            />
            {/* Linhas de conteúdo */}
            {section.lines.map((line, lIdx) => (
              <AnimatedLine
                key={lIdx}
                text={line}
                globalIndex={lineIndices[lIdx]}
                fontSize={fontSize}
              />
            ))}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionGap: {
    marginTop: 16,
  },
});
