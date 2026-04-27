// =============================================================================
// Plantão USG — Design Tokens
// Direção estética: NOSTROMO (terminal clínico + telemetria sutil)
// Filosofia: "Instrumento, não interface."
// =============================================================================

export const Colors = {
  bgPrimary: '#000000',
  bgElevated: '#0A0A0A',
  bgInput: '#141414',
  borderSubtle: '#1F1F1F',
  borderDefault: '#2E2E2E',
  textPrimary: '#FFFFFF',
  textSecondary: '#A3A3A3',
  textMuted: '#525252',
  accent: '#FFFFFF',
  emergencyRed: '#C62828',
} as const;

// Apelido semântico — `signal.danger` aponta para `emergencyRed`.
// Nostromo: SOMENTE danger. Não criar warn / ok / info.
export const Signal = {
  danger: Colors.emergencyRed,
} as const;

export const FontSize = {
  display: 28,
  title: 22, // novo — número heroico (níveis, scores), hero de tela
  heading: 20,
  body: 16,
  read: 15, // novo — textos longos no Curso (IBM Plex Sans)
  label: 14,
  caption: 12,
  micro: 10,
} as const;

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

// Mapa canônico de famílias. Sempre referenciar via FontFamily.<token>.
// Mono: voz "instrumento" (UI, números, labels).
// Sans: voz "leitura" (somente body do Curso).
export const FontFamily = {
  mono: {
    regular: 'IBMPlexMono_400Regular',
    medium: 'IBMPlexMono_500Medium',
    semibold: 'IBMPlexMono_600SemiBold',
    bold: 'IBMPlexMono_700Bold',
  },
  sans: {
    regular: 'IBMPlexSans_400Regular',
    medium: 'IBMPlexSans_500Medium',
    bold: 'IBMPlexSans_700Bold',
  },
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
} as const;

export const Radius = {
  none: 0,
  micro: 2,
  sm: 4,
  md: 8,
} as const;

// Sistema de motion. Toda animação do app deve usar uma destas durations.
// Filosofia: motion como confirmação, nunca decoração.
export const Motion = {
  duration: {
    instant: 80, // press feedback (opacity)
    fast: 200, // transição de tela, fade
    base: 300, // entry stagger de cards
    slow: 400, // marco unlock pulse
    counter: 600, // count-up de números
    cursor: 600, // ciclo on/off do cursor piscante (1 fase)
    scanline: 1200, // ciclo de varredura (top → bottom)
  },
  easing: {
    // Use `Easing.out(Easing.cubic)` no consumidor — token aqui é referência.
    label: 'out(cubic)',
  },
  // Tamanhos de pulse / overlay
  scanlineOpacity: 0.08, // ~8% de luminosidade — reforça sem competir
} as const;

// Tipos exportados para uso em componentes
export type ColorToken = keyof typeof Colors;
export type SpacingToken = keyof typeof Spacing;
