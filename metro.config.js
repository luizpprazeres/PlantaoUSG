const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const config = getDefaultConfig(__dirname);

// Suporte a .wasm para expo-sqlite no web
config.resolver.assetExts.push('wasm');

module.exports = withNativeWind(config, { input: './global.css' });
