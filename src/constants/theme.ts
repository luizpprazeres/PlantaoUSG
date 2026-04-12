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
} as const;

export const FontSize = {
  display: 28,
  heading: 20,
  body: 16,
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
