# Plantão USG — Arquitetura e Contexto

> **Documento mestre.** Sempre que precisar reestabelecer contexto em uma nova sessão, peça ao agente para ler este arquivo. Atualize-o quando houver mudanças estruturais (novo protocolo, troca de modelo LLM, nova camada na arquitetura de IA).

**Última atualização:** 2026-04-27
**Versão do app:** 1.0 (pré-launch App Store)
**Working dir:** `/Users/luizprazeres/PlantaoUSG/plantao-usg`

---

## 1. Identidade do Produto

| Campo | Valor |
|---|---|
| Nome | **Plantão USG** |
| Tagline | "Seu parceiro de ultrassom no plantão." |
| Criador | Luiz Paulo — médico intensivista/ultrassonografista, criador do Laudo USG (laudousg.com) |
| Plataforma | iOS (v1) → Android (v2) |
| Idioma | PT-BR (v1) |
| Status | Pré-launch — **a ser publicado em breve na App Store** |
| Modelo de negócio | **Gratuito permanente.** Funil de marketing para Laudo USG (web SaaS pago). Nunca compete com Laudo USG. |

### 1.1 Problema clínico

Intensivistas, emergencistas e plantonistas usam **POCUS (Point-of-Care Ultrasound)** à beira-leito, mas **não são ultrassonografistas certificados**. Sabem fazer o exame, mas falham em **descrever os achados** de forma estruturada no prontuário, comprometendo:
- Documentação clínica
- Reavaliação longitudinal
- Validade jurídica
- Credibilidade profissional do registro

### 1.2 Solução

App **mobile minimalista, device-only**, que gera laudos POCUS estruturados em **<90 segundos**. O médico combina três modos simultâneos de input:
1. **Tap em chips pré-definidos** (frases clínicas completas, hierarquizadas)
2. **Texto livre** digitado
3. **Transcrição de voz** nativa iOS

Hoje, o backend funde tudo via LLM em laudo final estruturado. **A nova arquitetura (seção 7) reduz drasticamente essa dependência.**

### 1.3 Público-alvo

- Médicos emergencistas, intensivistas, residentes de medicina de emergência e UTI
- Faixa etária 25–45 anos
- Contexto de uso: sala de emergência, sala vermelha, UTI, pronto-socorro
- **Característica crítica:** alta carga cognitiva no momento do uso, internet instável, aparelho modesto, uso quase sempre pelo celular. **Tudo deve funcionar com o mínimo de fricção, idealmente offline.**

### 1.4 Posicionamento vs. Laudo USG

| Dimensão | Plantão USG | Laudo USG |
|---|---|---|
| Target | Intensivista/emergencista no plantão | Ultrassonografista formal |
| Escopo | POCUS focado, 6 protocolos | 20+ tipos de exame |
| Plataforma | iOS mobile | Web |
| Modelo | Gratuito sempre | SaaS pago |
| Dados | Device-only | Cloud |
| Velocidade | <90s | Laudos extensos/formais |

---

## 2. Princípios e Filosofia

1. **Simplicidade radical** — em dúvida, corte.
2. **Preto infinito** — separação por respiração, bordas só quando funcional.
3. **Velocidade no plantão** — <90s da abertura ao laudo copiado.
4. **Device-only** — zero PII no servidor, zero login, zero sync cloud.
5. **Funil, nunca concorrente do Laudo USG.**
6. **Funcionar offline** — funcionalidades core não devem depender de rede.
7. **Disclaimer permanente** — "POCUS focado e complementar; não substitui avaliação ultrassonográfica formal".

---

## 3. Stack Técnica

| Camada | Tecnologia |
|---|---|
| Framework | **Expo SDK 54** (managed) |
| Linguagem | **TypeScript strict** |
| Navegação | Expo Router (file-based) |
| Estado | **Zustand** |
| Storage local | **expo-sqlite** + **Drizzle ORM** |
| Voz | `expo-speech-recognition` (Speech Framework nativo iOS) |
| Haptics | `expo-haptics` |
| Animações | `react-native-reanimated` + `moti` |
| Tipografia | **IBM Plex Mono** (400/500/600/700) — única fonte do app |
| Ícones | `lucide-react-native` |
| Estilização | **NativeWind** (Tailwind RN) |
| i18n | `i18n-js` + `expo-localization` |
| PDF | `expo-print` + `expo-sharing` |
| Build | EAS Build → TestFlight → App Store |
| Backend | **Vercel Edge Functions** (proxy stateless) |
| Analytics | PostHog (free tier, eventos zero-PII) |
| LLM atual | **gpt-4.1-mini** (anteriormente gpt-4o-mini) via proxy |
| Alias TS | `@/*` → `./src/*` |

**Notas críticas:**
- App **não é git repo** no `working dir` raiz — usar git com path absoluto se necessário.
- SafeAreaView **sempre** de `react-native-safe-area-context`, **nunca** do React Native core.
- `useSafeAreaInsets()` na BottomBar fixa e inputs fixos.

---

## 3.1 Tríade Reanimated v4 (atenção crítica)

O app usa `react-native-reanimated` v4 para microanimações (BlinkingCursor, Scanline, Chip tap, Typewriter, etc.). Reanimated v4 só funciona se as **três** peças abaixo estiverem alinhadas:

| Peça | Onde | Estado obrigatório |
|---|---|---|
| **Plugin Babel** | `babel.config.js` → `plugins: ['react-native-worklets/plugin']` | **Último plugin da lista.** Sem ele: `Exception in HostFunction: <unknown>` ao montar qualquer worklet. |
| **Pacote nativo** | `package.json` → `react-native-worklets` (≥ 0.8.x) | Vem com Reanimated v4. **NÃO instalar `react-native-worklets-core`** — é lib legacy de outro ecossistema (Vision Camera/Margelo) e causa conflito. |
| **Build nativo iOS** | `ios/build` + `ios/Pods` | Recompilar (`npx expo run:ios`) sempre que mudar `babel.config.js`, `package.json` (deps nativas), ou versão do Reanimated/Worklets. **Não basta `--clear` no Metro.** |

### Sintomas de tríade quebrada

- `Exception in HostFunction: <unknown>` no `constructor` de `NativeWorklets.native.ts`
- Crash no startup ao importar qualquer hook/API do Reanimated (`useSharedValue`, `useAnimatedStyle`, `withRepeat`, `Animated.View`, etc.)
- Stack mencionando `loadModuleImplementation → guardedLoadModule → metroRequire → featureFlags.native.ts`

### Reset rápido

```bash
npm run reset:cache    # tenta primeiro: limpa Metro + transformer cache
npm run reset:native   # se persistir: rm -rf node_modules + Pods + ios/build, reinstala tudo
npx expo run:ios       # rebuild nativo (obrigatório após reset:native)
```

---

## 3.2 Regra crítica de gerenciamento de pacotes Expo

Sempre que adicionar ou atualizar **qualquer pacote do ecossistema Expo** (`expo-*`):

```bash
npx expo install <pacote>      # ✅ canônico — respeita SDK ativa
```

**Nunca** usar:

```bash
npm install <pacote>           # ❌ puxa ^latest, pode pular 1+ SDK
```

### Por quê

`npm install` resolve para `^latest` no momento da execução. Se o pacote teve um lançamento para a próxima SDK (ex: `expo-sharing@55.x` enquanto `expo@~54.x`), o resultado fica latente no `package.json`. Tudo funciona até alguém regenerar o lock (CI, outro dev, `reset:native`) — aí o build quebra com erro de Swift do tipo:

```
type 'FileSystemUtilities' has no member 'isReadableFile'
```

(API que só existe na SDK posterior).

### Auditoria periódica

```bash
npx expo install --check   # dry-run: lista desalinhamentos sem mudar nada
npx expo install --fix     # corrige automaticamente (não combina com --check)
```

> ⚠️ Em versões recentes do Expo CLI, `--check` e `--fix` são **mutuamente exclusivos**. Use um por vez.

Rodar antes de qualquer release para App Store.

---

## 4. Estrutura de Diretórios

```
plantao-usg/
├── app/                          # Telas (Expo Router, file-based)
│   ├── _layout.tsx               # Root: fonts, migrations, splash, dark stack
│   ├── index.tsx                 # Home (grid de protocolos)
│   ├── laudador/[protocolo].tsx  # Tela dinâmica de preenchimento
│   ├── resultado.tsx             # Laudo gerado (tabs Extenso/Objetivo)
│   ├── historico.tsx             # Laudos anteriores (swipe-delete)
│   ├── tira-duvidas.tsx          # Chat POCUS AI
│   ├── onboarding.tsx
│   ├── calculadoras/             # Lista + [id].tsx (calculadora individual)
│   ├── curso/                    # index.tsx (lista) + [id].tsx (aula, fundo BRANCO)
│   ├── videos/index.tsx          # Recursos externos
│   └── preferencias/             # Médico + progresso + sobre
├── api/                          # Vercel Edge Functions
│   ├── gerar-laudo.ts            # Geração de laudo via LLM
│   └── tira-duvidas.ts           # Chat POCUS AI
├── src/
│   ├── components/               # ui/, home/, laudador/, resultado/
│   ├── constants/theme.ts        # Cores, FontSize, Spacing, Radius
│   ├── data/
│   │   ├── protocolos/           # 6 protocolos POCUS (efast, blue, cardiac, rush, vexus, obstetrico)
│   │   ├── referencias/          # artigos.ts (208 linhas) + valores.ts (278 linhas)
│   │   ├── curso/                # Módulos didáticos (HTML estruturado)
│   │   └── videos/               # Curadoria externa
│   ├── calculadoras/             # engine (CALCULADORAS, CATEGORIAS_CALCULADORAS)
│   ├── db/
│   │   ├── schema.ts             # Drizzle: laudos, preferences
│   │   └── index.ts              # SQLite connection + runMigrations()
│   ├── hooks/                    # useLaudos, useMedico, usePreferences, useEstatisticas, useVoz, useTextSize, useTextCase
│   ├── services/
│   │   └── llmClient.ts          # Cliente HTTP do proxy Vercel
│   ├── stores/
│   │   ├── laudadorStore.ts      # Zustand — estado do laudador
│   │   └── cursoStore.ts
│   └── utils/                    # gerarPDF, analytics, marcos, sqliteStorage, textCase
├── architecture.md               # Versão antiga/curta (manter por hora)
├── ui-guidelines.md              # Diretrizes visuais
├── docs/                         # ESTE diretório — documentos vivos
│   ├── architecture.md           # Você está aqui
│   ├── plans/                    # Planos de implementação datados
│   └── superpowers/              # Specs e plans de design
└── ...
```

---

## 5. Modelo de Dados

### 5.1 SQLite local (Drizzle ORM)

```ts
laudos {
  id: text PK,
  protocolo: text,
  timestamp: integer (Date),
  inputRawJson: text,    // JSON do inputBruto enviado ao LLM
  outputExtenso: text,
  outputObjetivo: text,
}

preferences {
  key: text PK,
  value: text,
}
```

### 5.2 Protocolos (seed estático em TS, **não** vai ao SQLite)

```ts
type Protocolo = {
  id: string;
  nome: string;
  nomeCompleto: string;
  indicacao: string;
  icone: string;
  transdutor: string;
  janelas: Janela[];
  janelasOpcionais?: JanelaOpcional[];   // ativadas por chip
  limitacoesTecnicas: LimitacaoTecnica[];
  categoria?: string;
};

type Janela = { id, nome, grupos: GrupoAchados[] };
type GrupoAchados = { categoria, label, achados: Achado[] };
type Achado = { id, label };  // label = frase clínica COMPLETA
```

**Protocolos disponíveis (`src/data/protocolos/`):**
1. **eFAST** — trauma/líquido livre (6 janelas)
2. **BLUE** — POCUS pulmonar (6 zonas + ventilação opcional)
3. **Cardíaco** — função (4 janelas)
4. **RUSH** — choque indiferenciado (pump/tank/pipes)
5. **VExUS** — congestão venosa sistêmica
6. **Obstétrico** — IG, ILA, vitalidade

### 5.3 Princípio de privacidade

- **Zero login, zero sync cloud, zero backup.**
- Desinstalou, perdeu (trade-off consciente — elimina complexidade LGPD).
- Proxy é stateless: recebe `{protocolo, inputBruto}`, devolve `{extenso, objetivo}`. Nada identificável é logado.
- Voz pode capturar nome de paciente → proxy sanitiza via regex antes de qualquer log.

---

## 6. Fluxos Principais

### 6.1 Geração de laudo (atual)

```
Home → seleciona protocolo
  ↓
laudadorStore.iniciar(protocoloId)
  ↓
Laudador (chips + texto + voz)
  ↓
toggleAchado/setObservacoes/toggleLimitacao acumulam estado
  ↓
"GERAR" → POST /api/gerar-laudo { protocolo, inputBruto }
  ↓
Vercel Edge → OpenAI (gpt-4.1-mini, JSON mode)
  ↓
{ extenso, objetivo } → SQLite (useLaudos.salvarLaudo)
  ↓
Resultado (tabs Extenso/Objetivo, máquina-de-escrever 15ms/char)
```

### 6.2 Tira-Dúvidas (atual)

```
tira-duvidas.tsx → MensagemChat[] → POST /api/tira-duvidas
  ↓
Vercel Edge → OpenAI (gpt-4.1-mini, max_tokens 600)
  ↓
{ resposta } → exibe em chat
```

### 6.3 Estrutura obrigatória do laudo

Todos os laudos seguem **4 seções fixas**:

```
TÉCNICA
[Transdutor + objetivo + limitações técnicas]

ACHADOS
[Prosa clínica natural por janela avaliada]

IMPRESSÃO
[Conclusão comedida + disclaimer obrigatório]

REFERÊNCIAS
[Exatamente 2 artigos relevantes ao protocolo]
```

**Regras de prosa clínica:**
- Sem redundância de localização (`"Pleural direito: derrame pleural direito"` ❌)
- Linguagem comedida: "sugestivo de", "compatível com", nunca afirmação absoluta.
- Termos bilíngues entre aspas: `"sinal da praia" ("seashore sign")`.
- **Janelas vazias são omitidas.** Nunca "não avaliada" nem "normal por omissão".
- Disclaimer obrigatório no extenso: `"Exame POCUS à beira-leito, caráter focado e complementar. Não substitui avaliação ultrassonográfica formal."`

### 6.4 Versão "Objetivo" (prontuário)

Parágrafo único, máx. 6 linhas, iniciando com:
`"POCUS [SIGLA] ([data]): "` seguido de 2-3 frases integrando transdutor, achados principais e impressão.

---

## 7. Arquitetura de IA — Modelo em 4 Camadas (L1-L4)

> **Decisão estratégica (2026-04-27):** Reduzir dependência de LLM externo, latência e custo. Maximizar funcionamento offline. Cada camada cobre uma fatia do tráfego; o LLM externo só atende o que as camadas anteriores não conseguem resolver.

### 7.1 Visão

```
┌────────────────────────────────────────────────────────────┐
│ L1 — Determinístico no device (custo: 0, offline)          │
│  • gerar-laudo: templating TS por protocolo                │
│  • tira-duvidas: FAQ exata por keyword/tag                 │
│  Cobertura esperada: 60-80%                                │
├────────────────────────────────────────────────────────────┤
│ L2 — Embedding semântico no device (custo: ~0)             │
│  • 200-500 Q&A pré-embedadas (~750KB)                      │
│  • Modelo de embedding: MiniLM ONNX local OU endpoint      │
│  • Cosine similarity local, threshold > 0.85               │
│  Cobertura adicional: +15-20%                              │
├────────────────────────────────────────────────────────────┤
│ L3 — Cache semântico no servidor (custo: ~0)               │
│  • Redis/Upstash + embeddings de perguntas vistas          │
│  • Hit ≥ 0.85 → resposta cacheada (sem LLM)                │
│  Cobertura adicional: +10-15%                              │
├────────────────────────────────────────────────────────────┤
│ L4 — LLM externo (custo real, online)                      │
│  • Apenas perguntas verdadeiramente novas                  │
│  • Modelo: gpt-4.1-mini                                    │
│  • Telemetria de hit-rate alimenta L1/L2 nas releases      │
│  Cobertura: 5-15%                                          │
└────────────────────────────────────────────────────────────┘
```

### 7.2 Aplicação por função

| Função | L1 | L2 | L3 | L4 |
|---|---|---|---|---|
| **gerar-laudo** | Templating TS por protocolo (90%+ dos casos só-chips) | — (não aplicável) | Opcional para textos livres recorrentes | Fallback quando texto livre/voz exige reescrita |
| **tira-duvidas** | FAQ exata + tags por protocolo | Q&A embedadas + similaridade local | Cache servidor por similaridade | Respostas verdadeiramente novas |

### 7.3 Modelo LLM atual

**`gpt-4.1-mini`** via proxy Vercel Edge.
- `gerar-laudo`: `temperature 0.3`, `response_format: json_object`.
- `tira-duvidas`: `temperature 0.4`, `max_tokens 600`.
- Decisão de migração de `gpt-4o-mini` → `gpt-4.1-mini` em 2026-04-27 (custo similar, melhor PT-BR e janela maior).

### 7.4 Roadmap de execução

Ver `docs/plans/2026-04-27-llm-architecture-l1-l4.md`.

### 7.5 Decisões descartadas (e por quê)

| Opção | Status | Razão |
|---|---|---|
| NotebookLM em produção | ❌ | Sem API pública estável; risco em App Store |
| SLM grande embutido (Phi/Llama 3B) | ❌ | IPA inflado, bateria, calor — deal-breaker mobile |
| Apple Foundation Models | ⏳ Adiar | Fragmenta base (só iPhone 15 Pro+); reavaliar em 12 meses |
| DeepSeek | ❌ por ora | Servidor China; percepção de mercado médico BR + privacy declarations |
| Vision análise de imagem POCUS on-device | ❌ | Acurácia clínica insuficiente; manter como feature paga futura |
| Fine-tuning gpt-4.1-mini | ⏳ Avaliar | Quando volume justificar (>10k laudos/mês) |

---

## 8. Design System — "NOSTROMO" (terminal clínico)

> **Direção estética atualizada (2026-04 em diante):** "Preto Infinito" evoluiu para **NOSTROMO** — terminal clínico com telemetria sutil. Filosofia: **"Instrumento, não interface."**

> **Fonte da verdade:** `src/constants/theme.ts` exporta os tokens canônicos. Sempre referenciar via tokens — não literais.

### 8.1 Paleta (dark-only v1)

| Token | Hex | Uso |
|---|---|---|
| `Colors.bgPrimary` | `#000000` | Fundo |
| `Colors.bgElevated` | `#0A0A0A` | Cards |
| `Colors.bgInput` | `#141414` | Inputs, chips inativos |
| `Colors.borderSubtle` | `#1F1F1F` | Bordas sutis |
| `Colors.borderDefault` | `#2E2E2E` | Bordas |
| `Colors.textPrimary` | `#FFFFFF` | Texto principal |
| `Colors.textSecondary` | `#A3A3A3` | Labels |
| `Colors.textMuted` | `#525252` | Placeholders |
| `Colors.accent` | `#FFFFFF` | Único acento |
| `Colors.emergencyRed` | `#C62828` | Reservado para sinal `danger` |

**Sinais semânticos** (`Signal.*`): **somente `danger`**. Nostromo NÃO usa `warn` / `ok` / `info`. Diferenciação clínica deve vir de peso/preenchimento/presença, não de cor adicional.

```ts
import { Signal } from '@/constants/theme';
Signal.danger // → #C62828 (alias de Colors.emergencyRed)
```

**Exceção intencional:** tela de aula (`app/curso/[id].tsx`) usa **fundo BRANCO** para legibilidade prolongada de conteúdo didático longo.

### 8.2 Tipografia — duas vozes deliberadas

| Voz | Família | Tokens | Uso |
|---|---|---|---|
| **Mono ("instrumento")** | IBM Plex Mono | `FontFamily.mono.{regular, medium, semibold, bold}` | UI clínica, números, labels, chips, laudo final, calculadoras, tira-dúvidas, todos os telemetria. **Default em 95% do app.** |
| **Sans ("leitura")** | IBM Plex Sans | `FontFamily.sans.{regular, medium, bold}` | **Apenas body do Curso** (textos didáticos longos). Não usar em outras telas. |

**Escala (`FontSize`):**

```
display  28  Display hero (splash, /design-system)
title    22  Número heroico (níveis, scores, hero de tela)  ← novo
heading  20  Heading
body     16  Corpo padrão
read     15  Body do Curso (Sans)                            ← novo
label    14  Labels, ações
caption  12  Captions
micro    10  Tags, telemetria
```

Letter-spacing: +0.02em Body, +0.04em Labels/Captions.

### 8.3 Espaçamento (escala 4px)

`Spacing.{xs:4, sm:8, md:12, base:16, lg:24, xl:32, '2xl':48, '3xl':64}`. Rigoroso.

### 8.4 Raios

`Radius.{none:0, micro:2, sm:4, md:8}`. Chips: micro. Botões: sm. Cards: md.

### 8.5 Sistema de motion — `Motion.duration.*`

> **Filosofia:** motion como **confirmação**, nunca decoração. Toda animação do app usa um destes durations canônicos.

| Token | ms | Uso |
|---|---|---|
| `instant` | 80 | Press feedback (opacity) |
| `fast` | 200 | Transição de tela, fade |
| `base` | 300 | Entry stagger de cards |
| `slow` | 400 | Pulse de marco/unlock |
| `counter` | 600 | Count-up de números |
| `cursor` | 600 | Ciclo on/off do BlinkingCursor (1 fase) |
| `scanline` | 1200 | Ciclo de varredura (top → bottom) |

**Easing canônico:** `Easing.out(Easing.cubic)` (token de referência: `Motion.easing.label = 'out(cubic)'`).

**Overlay sutil:** `Motion.scanlineOpacity = 0.08` (8% — reforça presença sem competir com conteúdo).

### 8.6 Microanimações canônicas

- Chip tap: scale 1→0.96→1 + haptic light (`Motion.duration.fast`)
- Janela expand: height auto (`Motion.duration.base`)
- VoiceButton listening: anéis concêntricos (loop)
- BlinkingCursor: piscar (`Motion.duration.cursor`)
- Scanline: varredura sutil (`Motion.duration.scanline`, `Motion.scanlineOpacity`)
- **Efeito máquina-de-escrever no laudo** (15ms/char, skipável) — **assinatura visual, não remover**
- Copy toast: fade 1.5s

### 8.7 Tom de copy

Imperativo curto. Zero emojis nas telas clínicas (permitidos só em onboarding e curso). Zero infantilização. Erros sem culpabilizar. Empty states secos.

### 8.8 Componentes-assinatura do Nostromo

- **`BlinkingCursor`** — peça-chave da identidade. Splash + `/design-system` com `blinking={true}`; Header da Home estático (`blinking={false}`). **Não usar em telas clínicas** (Laudador, Resultado, Calculadoras, Curso).
- **`Scanline`** — overlay opcional para reforçar a leitura "telemetria". Discreto.
- **`TypewriterText`** — usado no `Resultado` (15ms/char, skipável).

---

## 9. Funil Laudo USG

| Tela | Posição | Copy | UTM |
|---|---|---|---|
| Home | Rodapé discreto | "by Laudo USG →" | `home` |
| Resultado | Rodapé | "Precisa de laudos mais extensos…" | `resultado` |
| Histórico | Rodapé | "Histórico em nuvem no Laudo USG →" | `historico` |
| Sobre | Seção dedicada | Créditos completos | `sobre` |
| Modal pós-5º laudo | Modal único | "Você já gerou 5 laudos…" | `modal_5` |

**URL base:** `https://laudousg.com/?utm_source=plantao_usg&utm_medium=app&utm_campaign=[posicao]`

**Regra de ouro:** nunca bloquear função. Funil é atração, nunca fricção.

---

## 10. Analytics (PostHog) — eventos zero-PII

```
Ativação:    app_opened, protocol_selected, laudo_generated,
             laudo_copied, laudo_saved_history
Engajamento: voice_used, voice_duration_seconds, text_free_used,
             chips_selected_count
Funil:       laudousg_link_clicked {posicao}, laudousg_modal_shown
Sessão:      session_duration_seconds, laudos_per_session
IA (novo):   layer_resolved {l1|l2|l3|l4}, llm_fallback_reason
```

**KPIs:**
- Laudos/usuário/mês
- CTR Laudo USG
- Tempo seleção→laudo (meta <90s)
- % 2º laudo
- **Hit-rate L1+L2+L3** (meta: ≥85% dos atendimentos sem LLM externo)

---

## 11. Restrições (NÃO fazer)

- **Não adicionar cores** ao tema clínico (preto/branco/cinza).
- **Não usar fontes diferentes de IBM Plex Mono.**
- **Não criar leaderboards ou rankings** clínicos.
- **Não enviar laudos ou dados do paciente para servidores.**
- **Não fazer o app parecer um jogo.**
- **Não sobrecarregar o fluxo principal.**
- **Não adicionar animações pesadas** (Reanimated para entrada de cards, nada mais).
- **Não usar emojis nas telas clínicas** (permitidos só em onboarding e curso).
- **Não criar dependências de rede para funcionalidades core.**
- **Não substituir avaliação formal de ultrassonografia.**
- **Não criar telas com mais de uma responsabilidade.**
- **Não competir com Laudo USG.**

---

## 12. Riscos e Mitigações

| Risco | Mitigação |
|---|---|
| Aprovação Apple (medical) | Disclaimer explícito 1ª abertura + Sobre. Posicionar como "suporte à documentação". |
| Qualidade LLM PT-BR médico | gpt-4.1-mini + system prompts curados + L1 templating reduz superfície de erro |
| Custo proxy em escala | L1/L2/L3 absorvem 85%+. Rate limit por IP. Feature flag para degradar em pico. |
| LGPD / Resolução CFM nº 2.314/2022 | Device-only + sanitização de PII no proxy + disclaimers explícitos |
| Internet instável em plantão | L1 funciona offline (objetivo central da nova arquitetura) |
| Fragmentação de iPhone (modelos antigos) | Não depender de Apple Intelligence; SLM embutido descartado |

---

## 13. Convenções de Código

- Arquivos de tela: `app/[rota]/index.tsx` (pasta) ou `app/rota.tsx` (arquivo).
- Componentes: PascalCase, `StyleSheet.create` no final.
- Dados estáticos: `src/data/[domínio]/index.ts` + `tipos.ts`.
- Hooks: `use` prefix, sempre objeto nomeado (nunca array sem contexto).
- Stores: Zustand `useLaudadorStore`, `useCursoStore`.
- Commits: Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`).

---

## 14. Referências Clínicas (resumo)

- **POCUS Pulmonar:** Volpicelli 2012 (Intensive Care Med); Lichtenstein 2014/2019 (BLUE).
- **eFAST:** ACEP Clinical Policy; Rozycki et al.
- **Cardio POCUS:** ASE Guidelines; Via et al. (JASE).
- **VExUS:** Beaubien-Souligny et al.
- **Geral:** Moore & Copel 2011 (NEJM); Shokoohi 2021 (Ann Emerg Med).

Lista completa curada em `src/data/referencias/artigos.ts` e valores de referência em `src/data/referencias/valores.ts`.

---

## 15. Estado Atual (2026-04-27)

- ✅ App funcional com 6 protocolos
- ✅ Laudador, Resultado, Histórico, Curso, Calculadoras, Tira-Dúvidas, Vídeos, Onboarding, Preferências
- ✅ SQLite local + Drizzle migrations
- ✅ Vercel Edge proxy estável
- 🔄 **Em curso (este plano):** migração `gpt-4o-mini` → `gpt-4.1-mini` + arquitetura L1-L4
- 📋 Pré-launch App Store

---

## 16. Como retomar contexto em nova sessão

```
"Antes de começar, leia /docs/architecture.md e /docs/plans/<plano-atual>.md
para reestabelecer o contexto do projeto Plantão USG."
```
