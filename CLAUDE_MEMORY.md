# CLAUDE_MEMORY — Plantão USG

## Sessão inicial — 2026-04-11
- PRD v1.1 lido integralmente
- Stack: Expo SDK 52 managed, TypeScript strict, Expo Router, Zustand, Drizzle+SQLite, NativeWind
- Dispositivos alvo: iPhone 14, 15, 16

## Decisões técnicas
- IBM Plex Mono via @expo-google-fonts/ibm-plex-mono
- SafeAreaView de react-native-safe-area-context (NUNCA do React Native core)
- useSafeAreaInsets() na BottomBar fixa e inputs fixos

## Aprendizados de armadilhas (atualizar quando novas surgirem)

### Reanimated v4 — tríade obrigatória
- `babel.config.js` precisa de `plugins: ['react-native-worklets/plugin']` (último da lista). Sem isso → `Exception in HostFunction: <unknown>`.
- Usar `react-native-worklets` (vem com Reanimated v4). **NÃO** instalar `react-native-worklets-core` (lib legacy do Vision Camera/Margelo) — causa conflito JSI.
- Após qualquer mudança em `babel.config.js` ou deps nativas, rebuild iOS é obrigatório (`npx expo run:ios`). `--clear` do Metro sozinho NÃO resolve.
- Comandos prontos: `npm run reset:cache` (leve) e `npm run reset:native` (limpeza completa).

### Pacotes Expo — sempre instalar via Expo CLI
- Para adicionar/atualizar pacotes Expo: **`npx expo install <pacote>`** (NUNCA `npm install` direto).
- Motivo: `npm install` puxa `^latest` que pode estar 1+ SDK à frente. Isso fica latente no `package.json` e quebra o build na próxima reinstalação.
- Sintoma típico: erro de compilação Swift tipo `type 'FileSystemUtilities' has no member 'isReadableFile'` (API de SDK mais nova que a do `expo` core).
- Correção: `npx expo install --fix` reescreve versões para alinhar com a SDK ativa. (Atenção: `--check` e `--fix` são mutuamente exclusivos em versões recentes do Expo CLI — usar um de cada vez.)
- Versão crítica do `expo` é tilde `~54.0.x` — não usar `^` aqui (deixaria saltar para SDK 55).

## Status das Tasks
- [x] Task 1: Scaffolding
- [ ] Task 2: Design System
- [ ] Task 3: DB Schema
- [ ] Task 4: eFAST Protocol
- [ ] Task 5: BLUE Protocol
- [ ] Task 6: Zustand + Analytics
- [ ] Task 7-8: Componentes UI
- [ ] Task 9: LLM Client + Proxy
- [ ] Task 10: Home
- [ ] Task 11: Laudador
- [ ] Task 12: Resultado
- [ ] Task 13: Histórico
- [ ] Task 14: Sobre
