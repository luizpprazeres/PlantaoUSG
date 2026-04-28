# Plantão USG — Design System

> **Documento canônico da identidade visual.** Auto-suficiente. Qualquer pessoa ou IA deve ser capaz de ler **somente este arquivo** e entender integralmente como o Plantão USG se apresenta visualmente, sem precisar consultar nenhuma outra fonte.
>
> Página viva equivalente: `/design-system` (deploy web no Vercel).

---

## 1. Identidade

### 1.1 Mantra

> **Instrumento, não interface.**
> O médico não usa um app. Ele lê um instrumento.

### 1.2 Três adjetivos guia

**Calibrado · Denso · Silencioso.**

### 1.3 Direção estética

**Nostromo.** Terminal clínico (referência: monitores de UTI, Bloomberg, terminais de equipamentos médicos, cockpit Nostromo de Alien) com toques *muito* sutis de telemetria — cursor de terminal, glyphs em colchetes, scanline discreta. Sensação de instrumento ativo, em espera, pronto.

A direção **não** é gamer, nem RPG, nem app de consumo, nem app de saúde "fofo". É instrumento técnico.

### 1.4 Perfil de usuário

- Médicos emergencistas, intensivistas, residentes — 25–45 anos.
- Contexto de uso: sala vermelha, UTI, plantão, leito de pronto-socorro.
- Alta carga cognitiva no momento do uso. Pouco tempo. Estrutura limitada (frequentemente apenas o celular).
- Já usa POCUS no dia a dia, precisa de apoio para documentação e tomada de decisão.

### 1.5 Princípios de interface

1. **Cada pixel serve à decisão clínica.** Se um elemento não comunica informação útil, não existe.
2. **Invisibilidade.** O médico nunca pensa sobre a interface — só sobre o paciente.
3. **Densidade > respiro.** O usuário tem pressa. Informação acessível em menos toques.
4. **Sem decoração.** Sem sombras, sem gradientes, sem ilustrações, sem ícones excessivos, sem badges fofos.
5. **Cor é dado, nunca enfeite.** Fora do core monocromático, só `danger` aparece — e apenas para risco clínico real.
6. **Texto em maiúsculas é status.** Toda label de seção, chip ou estado vai em UPPERCASE com letterspacing alto. Carrega a sensação de etiqueta de equipamento.
7. **Animação confirma, não decora.** Toda transição é curta (≤ 400ms) e linear-ish.
8. **Offline é padrão.** Tudo o que importa renderiza sem rede.
9. **Gamificação vestida de telemetria.** Progresso é dado: nível, marco, certificado — nunca medalha, troféu, confete ou som.
10. **Educação tem tela própria.** O Curso é a única zona "respiratória" — fundo branco, IBM Plex Sans para body. Mas mantém o mesmo logo, a mesma barra superior, o mesmo DNA.

### 1.6 Estilo da comunicação

- **Voz:** clínica, direta, breve. Frases curtas. Verbos no imperativo nas ações.
- **Vocabulário:** clínico técnico (POCUS, eFAST, BLUE, RUSH, VExUS, qSOFA, PAM). Nada infantilizado.
- **Status:** sempre em colchetes UPPERCASE — `[OK]`, `[PENDENTE]`, `[BLOQUEADO]`, `[NÍVEL III]`.
- **Mensagens de erro:** factuais. *"Falha ao gerar laudo. Tente novamente."* — não *"Ops! Algo deu errado :("*.
- **Disclaimers clínicos:** obrigatórios nos pontos relevantes (Resolução CFM nº 2.314/2022).
- **Emojis:** proibidos em telas clínicas. Permitidos apenas em onboarding e em corpo de aula do Curso (e mesmo lá, com moderação extrema).

---

## 2. Logotipo

### 2.1 Wordmark

O logotipo é **puramente tipográfico** — não há ícone separado. O wordmark é a marca.

```
plantãoUSG_
```

- **Caixa:** "plantão" minúsculo, "USG" maiúsculo, **tudo junto, sem espaço**.
- **Fonte:** IBM Plex Mono.
- **Peso:** Medium 500 (mono-peso, sem contraste de peso entre as duas partes).
- **LetterSpacing:** -0.5 (apertado, denso, parece etiqueta de equipamento).
- **Cor:** `Colors.textPrimary` (`#FFFFFF`) sobre fundo escuro · `Colors.bgPrimary` (`#000000`) sobre fundo claro (Curso).

### 2.2 Cursor de terminal (modificador opcional)

Ao final do wordmark, um cursor de terminal pode aparecer:

```
plantãoUSG_     ← com cursor
plantãoUSG      ← sem cursor (fallback)
```

**Quando piscar:**
- Splash screen (1.5s ao abrir).
- Página `/design-system` (demonstração permanente).

**Quando estático (aceso, parado):**
- Header da Home.

**Quando ausente:**
- Telas clínicas de fluxo: Laudador, Resultado, Calculadoras, Curso, Tira-Dúvidas, Histórico.
- Qualquer contexto de leitura prolongada.

**Ciclo do piscar:** 600ms aceso · 600ms apagado · linear · sem fade.

### 2.3 Lockup com baseline

Sob o wordmark, opcionalmente, a baseline em micro letterspacing:

```
plantãoUSG_
POCUS · LAUDOS · EMERGÊNCIA
```

- Baseline: IBM Plex Mono 400, fontSize 9px, letterSpacing 2.5, `Colors.textPrimary`, marginTop 5.
- Separador: ponto médio `·`. Nunca bullet, nunca pipe.

### 2.4 Variações obrigatórias

| Variação | Uso |
|---|---|
| Branco sobre preto | Padrão (mobile escuro, splash, web Vercel) |
| Preto sobre branco | Curso, contexto impresso, contexto claro |
| Wordmark + baseline | Headers principais |
| Apenas wordmark | Espaços compactos (favicon, nav superior) |
| Monograma `pUSG` | Favicon, ícone PWA, badge interna (último recurso) |

### 2.5 Regras inegociáveis

- Nunca **outro tipo** de fonte.
- Nunca **bold completo** no "plantão" (mono-peso 500 é a regra).
- Nunca **espaço** entre "plantão" e "USG".
- Nunca **gradiente, sombra, contorno**.
- Nunca **outra cor** além de branco e preto.
- O cursor é o **único** elemento gráfico permitido junto à marca.

---

## 3. Tipografia

### 3.1 Famílias

| Família | Token | Uso |
|---|---|---|
| **IBM Plex Mono** | `FontFamily.mono` | UI (90% do app): navegação, números, labels, botões, chips, status, métricas, código de protocolo |
| **IBM Plex Sans** | `FontFamily.sans` | Apenas body de leitura prolongada no Curso |

Por que duas famílias da mesma "casa" (Plex): mantém DNA visual coerente. A transição Mono → Sans no Curso é natural, não parece outro app.

### 3.2 Pesos disponíveis

```typescript
FontFamily.mono.regular   // 'IBMPlexMono_400Regular'
FontFamily.mono.medium    // 'IBMPlexMono_500Medium'
FontFamily.mono.semibold  // 'IBMPlexMono_600SemiBold'
FontFamily.mono.bold      // 'IBMPlexMono_700Bold'

FontFamily.sans.regular   // 'IBMPlexSans_400Regular'
FontFamily.sans.medium    // 'IBMPlexSans_500Medium'
FontFamily.sans.bold      // 'IBMPlexSans_700Bold'
```

### 3.3 Escala tipográfica

```typescript
FontSize.display  // 28  números heroicos (níveis, scores, estatísticas)
FontSize.title    // 22  hero de tela, métrica grande secundária
FontSize.heading  // 20  título de tela
FontSize.body     // 16  texto corrido em UI
FontSize.read     // 15  texto longo de leitura no Curso (Sans)
FontSize.label    // 14  botões, labels, itens de lista
FontSize.caption  // 12  descrições, achados, metadados
FontSize.micro    // 10  tags, datas, letterSpacing alto
```

### 3.4 Convenções

- **Títulos de seção:** UPPERCASE + letterSpacing 2 + `mono.semibold`.
- **Subtítulos / labels:** UPPERCASE + letterSpacing 2–2.5 + `mono.regular` + `Colors.textMuted` + fontSize 9–10.
- **Tags / chips:** UPPERCASE + `mono.medium` + `FontSize.micro` + letterSpacing 0.5.
- **Texto corrido em UI:** `mono.regular` + `FontSize.caption` ou `body` + `Colors.textSecondary`.
- **Texto de aula no Curso:** `sans.regular` + `FontSize.read` + lineHeight 1.55 + `#1a1a1a` sobre `#FFFFFF`.
- **Números (métricas, percentuais, contagens):** sempre `fontVariant: ['tabular-nums']`. Garante alinhamento de algarismos.
- **Status entre colchetes:** `[OK]`, `[PENDENTE]`, `[BLOQUEADO]` — sempre `mono.medium` + UPPERCASE.

### 3.5 Proibições

- Nunca usar mais de duas famílias.
- Nunca italic (a estética terminal não tem itálico).
- Nunca underline em texto que não é link.
- Nunca text-shadow.
- Nunca `text-align: center` em telas de fluxo (header centralizado é a única exceção atual).

---

## 4. Paleta de cores

### 4.1 Core monocromático (intocável)

```typescript
Colors.bgPrimary      '#000000'   Fundo principal (preto absoluto)
Colors.bgElevated     '#0A0A0A'   Cards, seções elevadas
Colors.bgInput        '#141414'   Campos de input, tags selecionadas
Colors.borderSubtle   '#1F1F1F'   Bordas suaves, separadores
Colors.borderDefault  '#2E2E2E'   Bordas padrão de cards
Colors.textPrimary    '#FFFFFF'   Texto principal, títulos
Colors.textSecondary  '#A3A3A3'   Texto secundário, descrições
Colors.textMuted      '#525252'   Texto de baixa ênfase, labels
Colors.accent         '#FFFFFF'   Acento (igual a textPrimary — sem cor de marca)
```

### 4.2 Signal — apenas Danger

```typescript
Colors.emergencyRed   '#C62828'   Alertas críticos, risco clínico
Signal.danger         '#C62828'   (alias semântico)
```

**Direção Nostromo: nenhum outro `signal` color.** Não existe `warn` (âmbar), `ok` (verde), `info` (azul) neste momento. Se for necessário comunicar progresso ou sucesso, fazer com **estrutura** (borda mais grossa, ícone, glyph `[OK]`, barra preenchida) — não com cor.

### 4.3 Curso — fundo branco (exceção intencional)

```typescript
const CursoColors = {
  bg:          '#FFFFFF',
  surface:     '#F5F5F5',
  border:      '#E0E0E0',
  text:        '#1a1a1a',
  textSub:     '#555555',
  textMuted:   '#888888',
  correct:     '#4CAF50',  // exclusivo do Curso (quiz)
  correctBg:   '#F0FBF0',
  wrong:       '#F44336',  // exclusivo do Curso (quiz)
  wrongBg:     '#FFF0F0',
  accent:      '#1a1a1a',
  accentText:  '#FFFFFF',
  progress:    '#1a1a1a',
}
```

A inversão do tema no Curso é **propósito didático**: contexto de leitura, melhor legibilidade, sinalização de "modo aprendizado". As cores `correct` e `wrong` do quiz **só existem dentro do Curso**, nunca migram para o app principal.

### 4.4 Regras

- Nunca adicionar cores ao core monocromático.
- Nunca usar `emergencyRed` para feedback positivo, links, ou destaque genérico — exclusivo de **risco clínico real**.
- Nunca preencher botão ou card inteiro com `emergencyRed` — apenas borda 1px, ícone, ou pequeno indicador.
- Nunca dois usos simultâneos de `emergencyRed` na mesma tela (exceto na própria página `/design-system`).

---

## 5. Espaçamentos

```typescript
Spacing.xs    4    Gap mínimo entre elementos inline
Spacing.sm    8    Gap interno de cards, entre ícone e texto
Spacing.md    12   Padding de cards compactos
Spacing.base  16   Padding horizontal padrão de tela
Spacing.lg    24   Gap entre seções
Spacing.xl    32   Padding bottom de ScrollView
Spacing['2xl'] 48  Seções principais
Spacing['3xl'] 64  Margens grandes (raramente usado)
```

**Regras:**
- Padding horizontal de tela: sempre `Spacing.base`.
- Gap entre cards de mesma família: `Spacing.sm`.
- Espaço vertical entre seções: `Spacing.lg`.
- ScrollView sempre com `paddingBottom: Spacing.xl`.

---

## 6. Bordas e arredondamento

```typescript
Radius.none   0    Padrão para a maioria dos elementos
Radius.micro  2    Tags muito pequenas (raramente usado)
Radius.sm     4    Permitido em inputs e elementos interativos pequenos
Radius.md     8    Evitar — destoa do visual clínico
```

**Regra:** preferir `borderRadius: 0` em quase tudo. O estilo terminal não tem cantos arredondados. `4` é o máximo razoável para inputs e botões. Cards de protocolo são sempre 0.

---

## 7. Iconografia

**Biblioteca:** `lucide-react-native`.

| Tamanho | Uso |
|---|---|
| 20 | Ícones de navegação (`ArrowLeft`, ações primárias) |
| 16 | Ícones em listas, marcos, checks |
| 15 | Cards compactos (Calculadoras, Dúvidas) |
| 14 | Tags, chips, metadados (`ExternalLink`, `Lock`) |

**Stroke:** 1.5 (lucide default é 2 — 1.5 fica mais técnico, combina com mono).
**Cor:**
- Decorativo: `Colors.textMuted`.
- Ação: `Colors.textPrimary`.
- Risco: `Colors.emergencyRed` (uso clínico real apenas).

**Proibições:**
- Ícones em duas cores.
- Ícones com fill.
- Mistura de bibliotecas de ícones.
- Emojis no lugar de ícones em telas clínicas.

---

## 8. Glyphs de telemetria

Para representar **progressão, gamificação e estados** sem usar imagem ou cor, o sistema usa caracteres tipográficos puros — fiéis à filosofia mono.

### 8.1 Níveis (competência)

```
[I]  [II]  [III]  [IV]
```
- IBM Plex Mono Bold + UPPERCASE.
- Sempre dentro de colchetes.
- Nunca usar números arábicos para nível (`Nível 3` é proibido — usar `[III]`).

### 8.2 Barras segmentadas (progresso)

```
▮▮▮▯▯   3 de 5
▮▮▮▮▮   completo
▯▯▯▯▯   nada feito
```
- Caractere preenchido: `▮` (U+25AE).
- Caractere vazio: `▯` (U+25AF).
- Cor preenchido: `Colors.textPrimary`.
- Cor vazio: `Colors.borderDefault`.

### 8.3 Status de item

```
◉   completo
○   pendente
●   em progresso (preenchido)
○   não iniciado
```

### 8.4 Tendências (estatísticas)

```
▲   +12%   tendência de alta
▼   −8%    tendência de baixa
─   0%     estável
```

### 8.5 Status entre colchetes

```
[OK]  [PENDENTE]  [BLOQUEADO]  [NÍVEL III]  [PROCESSANDO...]
```

### 8.6 Regras

- Glyphs **substituem** ícones gráficos para indicadores de progresso.
- Nunca misturar glyphs e ícones lucide no mesmo indicador.
- Nunca colorir glyphs com cores fora da paleta.

---

## 9. Componentes — padrões de estilo

### 9.1 Card de protocolo (ação primária)

```typescript
{
  backgroundColor: Colors.bgElevated,    // '#0A0A0A'
  borderWidth: 1,
  borderColor: Colors.borderDefault,     // '#2E2E2E'
  padding: Spacing.md,                   // 12
  borderRadius: Radius.none,             // 0
}
```

### 9.2 Card secundário (Calculadoras, Dúvidas)

```typescript
{
  backgroundColor: Colors.bgElevated,
  // SEM borderWidth — diferencia hierarquicamente do card primário
  flexDirection: 'row',
  gap: Spacing.sm,
  padding: Spacing.md,
}
```

A ausência de borda nos cards secundários é **intencional**: cria hierarquia visual sem usar cor.

### 9.3 Card de certificado (gamificação)

```typescript
{
  backgroundColor: Colors.bgElevated,
  borderWidth: 1,
  borderColor: Colors.textPrimary,       // borda branca = "carimbo de aprovação"
  padding: Spacing.base,
  borderRadius: Radius.none,
}
// Conteúdo: nome do médico, protocolo, [NÍVEL III], data, ID interno (BLUE/2026-04/CR-1294)
// Tipografia: mono.bold em UPPERCASE
```

### 9.4 Botões

| Tipo | Background | Borda | Texto | Quando |
|---|---|---|---|---|
| `primary` | `Colors.textPrimary` (branco) | nenhuma | `mono.bold` UPPERCASE letterSpacing 1, `Colors.bgPrimary` | Ação confirmatória de fluxo (Gerar laudo) |
| `ghost` | transparente | 1px `Colors.borderDefault` | `mono.medium` UPPERCASE, `Colors.textPrimary` | Ação secundária (Ver histórico) |
| `link` | nenhum | nenhuma (underline em press) | `mono.regular`, `Colors.textPrimary` | Navegação inline |
| `danger` | transparente | 1px `Colors.emergencyRed` | `mono.medium` UPPERCASE, `Colors.emergencyRed` | Destrutivo (apagar laudo) |

**Estados de todos:**
- `default` — visual base.
- `pressed` — `opacity: 0.7`. **Sem scale, sem ripple, sem bounce.**
- `disabled` — `opacity: 0.4`.
- `loading` — texto vira `[PROCESSANDO]` ou `[...]`.

**Tamanho padrão:** padding `Spacing.md` (12px), altura ~44px.

### 9.5 Input de texto

```typescript
{
  backgroundColor: Colors.bgInput,       // '#141414'
  borderWidth: 1,
  borderColor: Colors.borderSubtle,      // '#1F1F1F' default
  // borderColor focused: Colors.borderDefault ('#2E2E2E')
  padding: Spacing.md,
  fontFamily: FontFamily.mono.regular,
  color: Colors.textPrimary,
  borderRadius: Radius.sm,               // 4 (única exceção razoável)
}
```

Placeholder: `Colors.textMuted`, nunca italic.

### 9.6 Tag / chip

```typescript
{
  paddingHorizontal: Spacing.sm,
  paddingVertical: 2,
  borderWidth: 1,
  borderColor: Colors.borderDefault,
  fontFamily: FontFamily.mono.medium,
  fontSize: FontSize.micro,              // 10
  color: Colors.textMuted,
  letterSpacing: 0.5,
  textTransform: 'uppercase',
}
```

### 9.7 Header de tela

```typescript
{
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: Spacing.base,
  paddingVertical: Spacing.md,
  borderBottomWidth: 1,
  borderBottomColor: Colors.borderSubtle,
}
// Sempre: <ArrowLeft size={20} /> + título UPPERCASE + subtítulo muted (opcional)
```

### 9.8 Separador de seção

```typescript
{
  height: 1,
  backgroundColor: Colors.borderSubtle,
}
// Ou borderBottomWidth: 1 + borderBottomColor: Colors.borderSubtle no container.
```

---

## 10. Animações

**Biblioteca:** `react-native-reanimated`.
**Filosofia:** motion como confirmação, nunca decoração.

### 10.1 Inventário aprovado

| Padrão | Duração | Easing | Onde |
|---|---|---|---|
| **Card entry stagger** | 300ms | `out(cubic)` | Listas (Home, Histórico, Calculadoras) — `opacity 0→1` + `translateY 12→0`, `delay = index * 80ms` |
| **Press feedback** | 80ms | linear opacity | Todos botões e cards — `opacity 1→0.7` (haptic light pareado em mobile) |
| **Screen transition** | 200ms | fade | Configurado no `Stack` do `_layout.tsx` (`animation: 'fade'`) |
| **Counter count-up** | 600ms | `out(quad)` | Mudança de número de progresso (12 → 13 laudos) |
| **Marco unlock pulse** | 400ms | `out(cubic)` | Borda do card de certificado pulsa **1×** ao desbloquear — sem confete, sem som, sem modal |
| **Cursor blink** | 600ms on / 600ms off | linear | Splash + `/design-system`. No header da Home, **estático aceso** (sem piscar) |
| **Scanline sweep** | 1200ms | linear | Splash + header da Home (~8% opacidade) + `/design-system` |

### 10.2 Tokens de motion

```typescript
Motion.duration.instant   80
Motion.duration.fast      200
Motion.duration.base      300
Motion.duration.slow      400
Motion.duration.counter   600
Motion.duration.cursor    600
Motion.duration.scanline  1200

Motion.scanlineOpacity    0.08
```

### 10.3 Proibições

- Bounce, spring exagerado, parallax, shimmer, skeleton.
- Lottie animado.
- Sons de UI.
- Animações > 400ms (exceto cursor/scanline em loop e count-up).
- Animações em telas de fluxo crítico (Laudador em preenchimento, Resultado em geração).

---

## 11. Padrões de tela

### 11.1 Hierarquia da Home

```
┌─────────────────────────────────────────┐
│  plantãoUSG_                            │ ← logo (cursor estático aceso)
│  POCUS · LAUDOS · EMERGÊNCIA            │ ← baseline
│  ─ scanline ~8% varrendo verticalmente ─ │ ← motion sutil
├─────────────────────────────────────────┤
│  HISTÓRICO   VÍDEOS   CURSO   PREF.     │ ← nav links
├─────────────────────────────────────────┤
│  ┌─────────┐ ┌─────────┐                │
│  │ eFAST   │ │ BLUE    │ ← cards com    │
│  └─────────┘ └─────────┘   bordas       │
│  ┌─────────┐ ┌─────────┐                │
│  │ RUSH    │ │ CARDÍACO│                │
│  └─────────┘ └─────────┘                │
├─────────────────────────────────────────┤
│  CALCULADORAS    DÚVIDAS                │ ← cards SEM bordas
├─────────────────────────────────────────┤
│  Parceria LaudoUSG →                    │ ← FunilFooter
└─────────────────────────────────────────┘
```

### 11.2 SafeArea & ScrollView

```typescript
<SafeAreaView edges={['top']}>
  <ScrollView contentContainerStyle={{ paddingBottom: Spacing.xl }}>
    {...}
  </ScrollView>
</SafeAreaView>
```

### 11.3 Empty state

```
┌─────────────────────────┐
│                         │
│   ◉ NENHUM LAUDO        │ ← glyph + label UPPERCASE
│                         │
│   Gere seu primeiro     │ ← descrição em textSecondary
│   laudo a partir da     │
│   home.                 │
│                         │
│   [ + GERAR LAUDO ]     │ ← botão primary opcional
│                         │
└─────────────────────────┘
```

### 11.4 Loading state

Texto puro: `[PROCESSANDO...]` em mono.medium UPPERCASE com letterSpacing 2. Sem spinner, sem skeleton.

### 11.5 Error state

```
[FALHA]
Não foi possível gerar o laudo.
Verifique a conexão e tente novamente.

[ TENTAR NOVAMENTE ]
```

---

## 12. Tela de Curso (exceção controlada)

**Regras especiais:**
- `backgroundColor: '#FFFFFF'` · `color: '#1a1a1a'`.
- Body em **IBM Plex Sans** (`FontFamily.sans.regular`, `FontSize.read` 15px, lineHeight 1.55).
- Headers, labels, botões, chips: continuam em **IBM Plex Mono**.
- Logo no header: versão preto-sobre-branco, **sem cursor**.
- Sem scanline.
- Sem cursor piscante.
- Quiz pode usar verde `#4CAF50` e vermelho `#F44336` — **exclusivamente dentro do contexto Curso**, nunca fora.
- Esquemas em HTML renderizados via `HtmlRenderer` (sem WebView).
- Storytelling permitido, com pulos de linha generosos para leitura.
- Emojis permitidos com moderação extrema (apenas didáticos).

---

## 13. Comportamento visual de gamificação

### 13.1 Vocabulário

| Em vez de | Use |
|---|---|
| XP, points | (não tem equivalente — não use sistema de pontos) |
| Level up | Atingiu `[NÍVEL III]` |
| Achievement | Marco · Certificação |
| Badge | Certificado |
| Rank | Nível de competência |
| Streak | Dias consecutivos |
| Reward | Marco desbloqueado |

### 13.2 Como o progresso aparece

- **Nível:** `[I]`, `[II]`, `[III]`, `[IV]`.
- **Barra de marcos:** `▮▮▮▯▯ 3 de 5`.
- **Certificado:** card com borda branca, título UPPERCASE, ID interno em formato `PROTOCOLO/AAAA-MM/CR-XXXX`.
- **Mudança de número:** count-up de 600ms (`out(quad)`).
- **Desbloqueio de marco:** borda do card pulsa 1× (`Motion.duration.slow`, `out(cubic)`).
- **Sem som. Sem confete. Sem modal celebrativo.**

### 13.3 O que nunca fazer

- Leaderboard ou ranking entre usuários.
- Comparação social.
- Streaks com punição ("você quebrou sua sequência!").
- Notificação de "volte ao app, sentimos sua falta".
- Coloração de progresso com verde/azul/dourado.
- Som ou vibração além de haptic light em interações já existentes.

---

## 14. Acessibilidade

- Contraste AA mínimo em todos os pares texto/fundo (`textPrimary` sobre `bgPrimary` = 21:1).
- Todos os botões com `accessibilityRole="button"` e `accessibilityLabel` claro.
- Cursor e scanline: marcados como `accessibilityElementsHidden` e `importantForAccessibility="no"` — são puramente decorativos.
- Glyphs (`▮`, `◉`, etc.) sempre acompanhados de texto descritivo (ex: `accessibilityLabel="3 de 5 marcos completos"`).
- Tamanhos de fonte: respeitar `Dynamic Type` no iOS quando possível.
- Touch targets: mínimo 44×44pt.

---

## 15. Do / Don't

| ✓ Do | ✗ Don't |
|---|---|
| Preto absoluto `#000` como fundo principal | Cinza escuro como fundo principal |
| `Colors.emergencyRed` apenas para risco clínico real | `emergencyRed` para destaque genérico |
| Glyphs `[III]`, `▮▮▮▯▯` para progresso | Medalhas, troféus, estrelas |
| Animação ≤ 400ms (exceto loops) | Animação > 400ms |
| `Spacing.base` = 16px de padding horizontal | Padding inconsistente entre telas |
| Header com `<ArrowLeft />` + título UPPERCASE | Header só com título |
| ScrollView com `paddingBottom: Spacing.xl` | ScrollView sem padding bottom |
| `mono.bold` para números, `tabular-nums` | `mono.regular` para números (desalinhamento) |
| `[PROCESSANDO...]` como loading | Spinner ou skeleton |
| Sans só no body do Curso | Sans em qualquer outro lugar |

---

## 16. Checklist de revisão de componente

Antes de mergear qualquer tela ou componente novo:

- [ ] Usa apenas tokens de `theme.ts` (sem `'#0F0F0F'` hardcoded etc.)?
- [ ] Usa apenas IBM Plex Mono (e Sans **somente** no body do Curso)?
- [ ] `borderRadius` ≤ 4 em cards e inputs?
- [ ] Sem sombras, sem `elevation`?
- [ ] Sem gradientes?
- [ ] Header com `<ArrowLeft size={20} />` + título UPPERCASE + subtítulo muted opcional?
- [ ] `SafeAreaView` com `edges={['top']}`?
- [ ] `ScrollView` com `paddingBottom: Spacing.xl`?
- [ ] Ícones de `lucide-react-native`, stroke 1.5?
- [ ] Sem emojis (exceto onboarding e Curso, com moderação)?
- [ ] Funciona offline (sem rede para renderização)?
- [ ] Estados de botão: `default`, `pressed` (opacity 0.7), `disabled` (opacity 0.4), `loading`?
- [ ] Números com `fontVariant: ['tabular-nums']`?
- [ ] Animações ≤ 400ms (exceto loops aprovados)?
- [ ] Sem `text-align: center` em fluxo (exceção: header)?
- [ ] Cursor e scanline ausentes em telas clínicas?

---

## 17. Stack visual de referência

| Camada | Tecnologia |
|---|---|
| Renderização | React Native 0.81 + Expo SDK 54 |
| Roteamento | Expo Router 6 (file-based) |
| Web | react-native-web 0.21 (Vercel) |
| Fontes | `@expo-google-fonts/ibm-plex-mono` + `@expo-google-fonts/ibm-plex-sans` |
| Ícones | `lucide-react-native` |
| Animações | `react-native-reanimated` 4 |
| Haptics | `expo-haptics` (light apenas) |
| SVG | `react-native-svg` (logos e diagramas inline) |

---

## 18. Tokens — referência rápida

Localização canônica: `src/constants/theme.ts`.

```typescript
import { Colors, Signal, FontSize, FontFamily, Spacing, Radius, Motion } from '@/constants/theme';
```

### Resumo

```typescript
Colors        // 10 cores (9 mono + 1 danger)
Signal        // { danger } (alias de emergencyRed)
FontSize      // 8 tamanhos (display 28 → micro 10)
FontFamily    // mono { regular/medium/semibold/bold } + sans { regular/medium/bold }
Spacing       // xs 4 → 3xl 64 (escala de 8 valores)
Radius        // none 0 → md 8 (preferir none)
Motion        // duration { instant/fast/base/slow/counter/cursor/scanline }
              // scanlineOpacity 0.08
```

---

## 19. Componentes utilitários do design system

### `<BlinkingCursor />`

Localização: `src/components/ui/BlinkingCursor.tsx`.

```typescript
<BlinkingCursor size={20} blinking={true} />   // splash, /design-system
<BlinkingCursor size={20} blinking={false} />  // header da Home (aceso, parado)
```

### `<Scanline />`

Localização: `src/components/ui/Scanline.tsx`.

```typescript
<View style={{ height: 80, overflow: 'hidden' }}>
  <HeaderContent />
  <Scanline height={80} />  {/* opacity default 0.08 */}
</View>
```

---

## 20. Página viva

A página `/design-system` é a versão **viva e renderizada** deste documento. Trata-se de uma **página web estática** (HTML+CSS puro) servida pela Vercel a partir de `public/design-system/index.html`. Permite visualizar e testar todos os elementos descritos aqui e serve como referência visual canônica.

A página é **independente do app mobile** — não usa Expo Router web, não compartilha bundle com o app, e não está exposta na navegação. Acessível apenas por URL direta (`/design-system`).

---

## 21. Versionamento deste documento

| Versão | Data | Mudança |
|---|---|---|
| 1.0 | 2026-04-27 | Versão inicial — direção Nostromo. IBM Plex Sans introduzido para body do Curso. Cursor e scanline formalizados. Glyphs de telemetria oficializados. |

---

**Fim do documento.** Este `design-system.md` é a fonte canônica da identidade visual do Plantão USG. Qualquer divergência entre código e este documento deve ser resolvida atualizando o código — não o documento.
