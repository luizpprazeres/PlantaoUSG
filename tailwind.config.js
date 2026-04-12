module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#000000',
        'bg-elevated': '#0A0A0A',
        'bg-input': '#141414',
        'border-subtle': '#1F1F1F',
        'border-default': '#2E2E2E',
        'text-primary': '#FFFFFF',
        'text-secondary': '#A3A3A3',
        'text-muted': '#525252',
        accent: '#FFFFFF',
      },
      fontFamily: {
        mono: ['IBMPlexMono_400Regular'],
        'mono-medium': ['IBMPlexMono_500Medium'],
        'mono-semibold': ['IBMPlexMono_600SemiBold'],
        'mono-bold': ['IBMPlexMono_700Bold'],
      },
    },
  },
};
