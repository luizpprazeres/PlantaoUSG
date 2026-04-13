# Design Refinement — Home Screen & Animations

**Goal:** Refinar a tela Home com novo layout de cards e adicionar animações em três camadas (stagger, transição de tela, micro-interações).

**Escopo:** Somente `app/index.tsx`, `src/components/home/ProtocoloCard.tsx` e `src/constants/theme.ts`. Nenhuma outra tela é alterada.

---

## 1. Cards da Home

### Estrutura do card
Cada `ProtocoloCard` passa a ter três elementos em ordem vertical:

1. **Categoria** — texto 9px, `letterSpacing: 3`, cor `#2E2E2E`, caixa alta (ex: `TRAUMA`, `PULMONAR`, `CARDÍACO`)
2. **Nome do protocolo** — texto 16px bold, cor `#FFFFFF`, `letterSpacing: 0.5`
3. **Linha divisória** — `width: 20`, `height: 0.5`, `backgroundColor: #2A2A2A`, margens verticais de 8px
4. **Indicação** — texto 10px, cor `#3A3A3A`, `lineHeight: 1.6 * 10`

Cards indisponíveis têm `opacity: 0.3` e a indicação é substituída por `"EM BREVE"` em 9px `letterSpacing: 1`.

### Mapeamento protocolo → categoria
| Protocolo | Categoria |
|-----------|-----------|
| eFAST     | TRAUMA    |
| BLUE      | PULMONAR  |
| Cardíaco  | CARDÍACO  |
| Abdominal | ABDOMINAL |
| AAA       | VASCULAR  |
| Vascular  | ACESSO    |

A categoria é um campo novo adicionado ao tipo `Protocolo` e aos objetos `PLACEHOLDER_PROTOCOLOS` em `app/index.tsx`.

### Ajuste de borda e radius
- `borderRadius: 10` (era 8)
- `border: 1px solid #2A2A2A` nos disponíveis (era `#1F1F1F`)
- `border: 1px solid #141414` nos indisponíveis

---

## 2. Header da Home

O bloco de header passa de alinhamento à esquerda para **centralizado**:

- `textAlign: 'center'` em título e subtítulo
- `alignItems: 'center'` no container
- Subtítulo muda de `"POCUS à beira-leito"` para `"ULTRASSONOGRAFIA À BEIRA-LEITO"` em `letterSpacing: 2.5`, cor `#2E2E2E`, tamanho 9px
- Links "Histórico" e "Sobre" passam para linha centralizada abaixo do subtítulo com `gap: 24`, `letterSpacing: 1.5`, tamanho 9px, cor `#222222`
- Linha separadora `1px solid #0F0F0F` divide header dos links e links dos cards
- `paddingTop` respeita safe area via `SafeAreaView` (já existente)

---

## 3. Animações

Todas implementadas com `react-native-reanimated` (já instalado).

### 3a. Stagger de entrada dos cards
Ao montar a tela Home, cada card entra com delay escalonado:

- Delay por índice: `index * 80ms`
- Propriedades animadas: `opacity` (0 → 1) e `translateY` (12 → 0)
- Duração: 300ms
- Easing: `Easing.out(Easing.cubic)`
- Implementação: `useSharedValue` + `withDelay` + `withTiming` em cada card

### 3b. Micro-interação no press do card
Ao pressionar um card disponível:

- `scale`: 1.0 → 0.97 no `onPressIn`, retorna a 1.0 no `onPressOut`
- Animação: `withSpring` com `damping: 15, stiffness: 300`
- Substituir `TouchableOpacity` por `Pressable` + `Animated.View`

### 3c. Transição de tela
Ao navegar para `/laudador/[protocolo]`:

- Usar `expo-router` com transição customizada via `<Stack.Screen options={{ animation: 'fade' }}` no `_layout.tsx`
- Fade cross-dissolve com duração padrão do sistema (~250ms)
- Não requer biblioteca adicional — `expo-router` suporta nativamente

---

## 4. Arquivos alterados

| Arquivo | Mudança |
|---------|---------|
| `src/components/home/ProtocoloCard.tsx` | Nova estrutura de card + Animated.View + spring no press |
| `app/index.tsx` | Header centralizado + campo `categoria` nos placeholders + stagger nos cards |
| `app/_layout.tsx` | `animation: 'fade'` no Stack.Screen do laudador |
| `src/data/protocolos/tipos.ts` | Adicionar campo `categoria?: string` ao tipo `Protocolo` |
| `src/data/protocolos/efast.ts` | Adicionar `categoria: 'TRAUMA'` |
| `src/data/protocolos/blue.ts` | Adicionar `categoria: 'PULMONAR'` |

---

## 5. O que NÃO muda

- Paleta de cores (`Colors` em `theme.ts`) — sem alteração
- Fonte IBM Plex Mono — sem alteração
- Lógica de navegação e store — sem alteração
- Telas de laudador, resultado, histórico e sobre — sem alteração
- `FunilFooter` — sem alteração
