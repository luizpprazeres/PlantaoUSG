# Plantão USG — UI Guidelines

## Filosofia de Design

**Clínico. Direto. Sem ruído.**

O design do Plantão USG imita a estética de terminais médicos e monitores de UTI — monocromático, de alto contraste, sem distração. Cada pixel deve servir à tomada de decisão clínica. Se um elemento não comunica informação útil, não existe.

O médico usa o app sob pressão. A interface deve ser invisível no sentido de que o profissional nunca precisa pensar sobre ela — só sobre o paciente.

---

## Paleta de Cores

```typescript
// src/constants/theme.ts

const Colors = {
  bgPrimary:    '#000000',  // Fundo principal (preto absoluto)
  bgElevated:   '#0A0A0A',  // Cards, seções elevadas
  bgInput:      '#141414',  // Campos de input, tags selecionadas
  borderSubtle: '#1F1F1F',  // Bordas suaves, separadores
  borderDefault:'#2E2E2E',  // Bordas padrão de cards
  textPrimary:  '#FFFFFF',  // Texto principal, títulos
  textSecondary:'#A3A3A3',  // Texto secundário, descrições
  textMuted:    '#525252',  // Texto de baixa ênfase, labels, datas
  accent:       '#FFFFFF',  // Acento (mesmo que textPrimary — sem cores de acento)
  emergencyRed: '#C62828',  // EXCLUSIVO: alertas críticos, avisos de risco clínico
}
```

**Regras:**
- A paleta tem ZERO cores de marca — só tons de cinza + branco + vermelho de emergência
- `emergencyRed` é reservado para alertas genuínos (ex: limitações críticas do protocolo)
- Não adicionar cores. Nunca. A ausência de cor é a identidade
- Exceção: tela de Curso usa fundo branco com texto preto (inversão intencional para legibilidade didática)

---

## Tipografia

**Fonte única:** IBM Plex Mono (monospace)

| Weight | Token | Uso |
|--------|-------|-----|
| 400 Regular | `IBMPlexMono_400Regular` | Texto corrido, descrições, labels secundários |
| 500 Medium | `IBMPlexMono_500Medium` | Itens de lista, botões de seleção |
| 600 SemiBold | `IBMPlexMono_600SemiBold` | Títulos de tela, seções |
| 700 Bold | `IBMPlexMono_700Bold` | Valores numéricos, nomes de protocolo, destaque |

**Escala tipográfica:**

```typescript
const FontSize = {
  display: 28,   // Números grandes (nível de competência, estatísticas)
  heading: 20,   // Título de tela (ex: "PROGRESSO", "LAUDADOR")
  body:    16,   // Nome de protocolo nos cards
  label:   14,   // Labels de campo, texto de botão
  caption: 12,   // Descrições curtas, achados no laudo
  micro:   10,   // Tags, metadados, datas, letterSpacing alto
}
```

**Convenções:**
- Títulos de seção: UPPERCASE + `letterSpacing: 2`
- Subtítulos: UPPERCASE + `letterSpacing: 2–2.5`, `textMuted`, `fontSize: 9`
- Tags/chips: UPPERCASE, `IBMPlexMono_500Medium`, `micro`
- Texto corrido: `caption` ou `body`, `textSecondary`
- Emojis: **proibidos em telas clínicas**; permitidos apenas em onboarding e curso

---

## Espaçamentos

```typescript
const Spacing = {
  xs:   4,   // Gap mínimo entre elementos inline
  sm:   8,   // Gap interno de cards, entre ícone e texto
  md:   12,  // Padding de cards compactos
  base: 16,  // Padding horizontal padrão de tela, padding de cards normais
  lg:   24,  // Gap entre seções
  xl:   32,  // Padding bottom de ScrollView
  '2xl': 48, // Seções principais
  '3xl': 64, // Margens grandes (raramente usado)
}
```

---

## Bordas e Arredondamento

```typescript
const Radius = {
  none:  0,  // Padrão para a maioria dos elementos
  micro: 2,  // Raramente usado (tags muito pequenas)
  sm:    4,  // Permitido em elementos de input
  md:    8,  // Evitar — destoa do visual clínico
}
```

**Regra:** Preferir `borderRadius: 0` em quase tudo. O estilo "terminal" não tem cantos arredondados. `sm: 4` é o máximo razoável para elementos interativos pequenos.

---

## Componentes — Padrões

### Cards de Protocolo
```typescript
// backgroundColor: Colors.bgElevated
// borderWidth: 1, borderColor: Colors.borderDefault
// padding: Spacing.md
// borderRadius: 0  (sem arredondamento)
```

### Cards Secundários (Calculadoras, Dúvidas)
```typescript
// backgroundColor: Colors.bgElevated
// SEM borderWidth  (diferencia dos cards primários)
// flexDirection: 'row', gap: Spacing.sm
```

### Tags / Chips
```typescript
// paddingHorizontal: Spacing.sm, paddingVertical: 2
// borderWidth: 1, borderColor: Colors.borderDefault
// IBMPlexMono_500Medium, FontSize.micro, Colors.textMuted
// UPPERCASE, letterSpacing: 0.5
```

### Separadores de Seção
```typescript
// height: 1, backgroundColor: Colors.borderSubtle
// ou borderBottomWidth: 1, borderBottomColor: Colors.borderSubtle
// Preferir borderColor ao uso de View separator quando possível
```

### Header de Tela
```typescript
// flexDirection: 'row', alignItems: 'center'
// paddingHorizontal: Spacing.base, paddingVertical: Spacing.md
// borderBottomWidth: 1, borderBottomColor: Colors.borderSubtle
// Sempre: ArrowLeft (lucide) + título UPPERCASE + subtítulo muted
```

### Botão Primário (Ação Principal)
```typescript
// backgroundColor: Colors.textPrimary (branco)
// padding: Spacing.md
// IBMPlexMono_700Bold, color: Colors.bgPrimary (texto preto)
// UPPERCASE, letterSpacing: 1
// SEM sombra, SEM borderRadius
```

### Input de Texto
```typescript
// backgroundColor: Colors.bgInput
// borderWidth: 1, borderColor: Colors.borderSubtle
// padding: Spacing.md
// IBMPlexMono_400Regular, color: Colors.textPrimary
```

---

## Ícones

**Biblioteca:** `lucide-react-native`

| Tamanho | Uso |
|---------|-----|
| 20px | Ícones de navegação (ArrowLeft, botões de ação) |
| 16px | Ícones em listas (CheckCircle, Circle, marcos) |
| 15px | Ícones em cards compactos (Calculadoras, Dúvidas) |
| 14px | Ícones em tags/chips (ExternalLink, lock) |

**Cor padrão:** `Colors.textMuted` para ícones decorativos, `Colors.textPrimary` para ícones de ação.

---

## Animações

**Biblioteca:** `react-native-reanimated`

**Uso aprovado:**
- Entrada de cards com stagger (`withDelay` + `withTiming`) — `opacity: 0→1`, `translateY: 12→0`
- Duração: 300ms, `Easing.out(Easing.cubic)`
- Delay por card: `index * 80ms`

**Uso proibido:**
- Animações de scroll, parallax, transições de tela elaboradas
- Skeleton loaders ou shimmer effects
- Bounce, spring ou easing não-linear exagerado

---

## Hierarquia Visual na Home

```
Header (título + subtítulo)           ← identidade
Nav (HISTÓRICO | VÍDEOS | CURSO | PREF.)  ← navegação secundária
────────────────────────────────────
Grid de cards (protocolos)            ← AÇÃO PRIMÁRIA — com bordas
────────────────────────────────────
Cards inferiores (Calculadoras + Dúvidas) ← ação secundária — SEM bordas
Footer (FunilFooter)                  ← conversão
```

A ausência de borda nos cards inferiores é intencional: cria hierarquia visual sem usar cor.

---

## Tela de Curso (exceção ao tema escuro)

A tela de Curso usa **fundo branco + texto preto** — inversão intencional para:
1. Sinalizar mudança de contexto (aprendizado vs. trabalho clínico)
2. Melhor legibilidade de texto longo e esquemas didáticos
3. Diferenciar conteúdo educacional do fluxo clínico

**Regras do Curso:**
- `backgroundColor: '#FFFFFF'`, `color: '#000000'`
- IBM Plex Mono mantida
- Esquemas visuais em HTML (via WebView) — setas, boxes, diagramas simples
- Storytelling: cada protocolo tem uma narrativa com subtítulo criativo
- Sem emojis excessivos; formatação clara com pulos de linha

---

## O que Nunca Fazer

| Proibido | Motivo |
|----------|--------|
| Adicionar cores além da paleta | Quebra a identidade clínico-terminal |
| `borderRadius > 4` em cards | Destitui o estilo austero |
| Sombras (`shadow*`, `elevation`) | Contexto clínico não usa decoração |
| Múltiplas fontes | IBM Plex Mono é absoluta |
| Gradientes | Zero tolerância |
| Emojis em telas clínicas | Destitui seriedade |
| Botões com cores (verde, azul...) | Usar branco/preto sempre |
| Animações de mais de 400ms | Perda de tempo do médico |
| Texto centered em telas de fluxo | Left-align em 99% dos casos |
| Placeholder sem estilo consistente | Sempre `textMuted`, não italic |

---

## Checklist de Revisão de Componente

Antes de mergear qualquer tela nova:

- [ ] Usa apenas cores de `Colors` do `theme.ts`?
- [ ] Usa apenas IBM Plex Mono?
- [ ] `borderRadius` ≤ 4 em cards e inputs?
- [ ] Sem sombras?
- [ ] Sem gradientes?
- [ ] Header com `ArrowLeft` + título UPPERCASE + subtítulo muted?
- [ ] `SafeAreaView` com `edges={['top']}`?
- [ ] `ScrollView` com `paddingBottom: Spacing.xl`?
- [ ] Ícones de `lucide-react-native`?
- [ ] Sem emojis (exceto onboarding/curso)?
- [ ] Funciona offline (sem dependência de rede para renderização)?
