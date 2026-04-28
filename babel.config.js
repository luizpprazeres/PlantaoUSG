module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      // Reanimated v4 + Worklets: o plugin precisa ser o ÚLTIMO da lista.
      // Sem ele, qualquer import de `react-native-reanimated` quebra com
      // "Exception in HostFunction: <unknown>" ao construir worklets
      // (ex: BlinkingCursor.tsx ao usar useSharedValue/withRepeat).
      'react-native-worklets/plugin',
    ],
  };
};
