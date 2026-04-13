# Spec: Laudador UX Redesign

**Date:** 2026-04-11
**Status:** Approved

---

## 1. Context and Motivation

The current laudador screen (`app/laudador/[protocolo].tsx`) uses `JanelaBlock` components rendered as expandable accordion cards. Each card exposes all finding groups (normal + altered) as chips. This creates a dense, slow interaction: users must expand each window, read through normal findings they do not intend to select, and hunt for the relevant altered findings.

The redesigned flow removes the accordion entirely. The main screen becomes a compact list of window rows. Selecting findings for a window happens inside a bottom sheet that shows **only altered findings**. Normal status is implied by omission. Limitations are managed through an inline collapsible dropdown — no sheet.

This spec covers all structural changes required to implement that redesign.

---

## 2. Architecture of Components

### 2.1 Components to Create

| Component | Path | Purpose |
|---|---|---|
| `JanelaRow` | `src/components/laudador/JanelaRow.tsx` | Single row in the window list — name left, selected-finding tags right |
| `JanelaSheet` | `src/components/laudador/JanelaSheet.tsx` | Bottom sheet for selecting altered findings of one window |
| `LimitacoesDropdown` | `src/components/laudador/LimitacoesDropdown.tsx` | Inline collapsible section for limitation chips |

### 2.2 Components to Modify

| Component | Path | Change |
|---|---|---|
| `app/laudador/[protocolo].tsx` | Existing | Full rewrite of layout; remove JanelaBlock usage; add JanelaRow list + JanelaSheet + LimitacoesDropdown |
| `src/services/llmClient.ts` | Existing | Update `InputBruto` interface to support `janelas` array with both `achados` and `status: 'normal'` variants |

### 2.3 Components to Delete (or Retire)

`JanelaBlock` and `GrupoChips` are no longer rendered in the laudador screen. They must not be deleted from the filesystem until confirmed no other screen imports them. For this redesign, they are simply no longer used in `[protocolo].tsx`. No file deletion required.

---

## 3. Store Changes (`src/stores/laudadorStore.ts`)

### 3.1 Current State Shape

```ts
achadosSelecionados: Record<string, string[]>
// keyed by janelaId, value is array of achadoId strings
```

This shape is already correct for the new design. No structural change to `achadosSelecionados` is needed.

### 3.2 No Changes Required

The existing `toggleAchado(janelaId, achadoId)` action works as-is for toggling chips in the sheet. The existing `toggleLimitacao` and `toggleChipAtivador` actions are also unchanged.

The store does not need to track "which sheet is open" — that is local UI state managed inside `[protocolo].tsx` with `useState`.

---

## 4. JanelaRow Component

### 4.1 Props

```ts
interface JanelaRowProps {
  janela: Janela;
  selecionados: string[];         // achadoId[]
  onPress: () => void;            // opens the sheet for this window
  onRemoveAchado: (achadoId: string) => void;
}
```

### 4.2 Rendering Logic

- Container is a full-width `TouchableOpacity` that calls `onPress` anywhere it is tapped.
- Left side: window name (`janela.nome`) in `IBMPlexMono_600SemiBold`, `FontSize.label`, `Colors.textPrimary`.
- Right side (flex row, wrapping):
  - If `selecionados.length === 0`: render the text `"sem alteração"` in `Colors.textMuted`, `FontSize.caption`, `IBMPlexMono_400Regular`.
  - If `selecionados.length > 0`: for each selected achado ID, find the label by searching `janela.grupos` (all groups, all achados). Render a tag pill: white background (`Colors.textPrimary`), text in `Colors.bgPrimary`, `IBMPlexMono_500Medium`, `FontSize.caption`. The tag has a `×` button that calls `onRemoveAchado(achadoId)` and stops event propagation.
- Separator line at the bottom: 1px, `Colors.borderSubtle`.

### 4.3 Tag Pill Anatomy

```
[ label text   × ]
```

- `paddingHorizontal: Spacing.sm`, `paddingVertical: 3`
- `borderRadius: Radius.micro`
- `backgroundColor: Colors.textPrimary` (white)
- Text: `Colors.bgPrimary` (black), `IBMPlexMono_500Medium`, `FontSize.caption`
- The `×` is a plain `Text` element, `onPress` calls `onRemoveAchado` wrapped in `e.stopPropagation()` equivalent (use a separate `TouchableOpacity` with `onPress` that does NOT call the row's `onPress`).

---

## 5. JanelaSheet Component

### 5.1 Props

```ts
interface JanelaSheetProps {
  janela: Janela | null;          // null = sheet closed
  selecionados: string[];         // current selection for this window
  onToggle: (achadoId: string) => void;
  onClose: () => void;
}
```

### 5.2 Visibility and Animation

- When `janela` is null, the sheet is not mounted (return null).
- When `janela` is set, the sheet slides up from the bottom.
- Use `react-native-reanimated` v4 with `useSharedValue`, `useAnimatedStyle`, and `withSpring`.
- The sheet sits above a semi-transparent backdrop (`rgba(0,0,0,0.6)`).
- The backdrop covers the full screen and captures taps to call `onClose`.
- The sheet panel itself is anchored to the bottom of the screen.

### 5.3 Layout

```
┌──────────────────────────────┐
│ [handle: 32×3px, #525252,    │
│  centered, borderRadius 2]   │
│                              │
│  QUADRANTE SUPERIOR DIREITO  │  ← janela.nome uppercase, IBMPlexMono_600SemiBold,
│  (MORRISON)                  │     FontSize.label, letterSpacing 1.5, Colors.textPrimary
│                              │
│  [chip]  [chip]  [chip]      │  ← only "alterado" categoria groups
│  [chip]  [chip]              │
│                              │
└──────────────────────────────┘
```

### 5.4 Chips Inside the Sheet

- Only show groups where `grupo.categoria === 'alterado'`.
- Each chip uses the existing `Chip` component from `@/components/ui/Chip`.
- `selected` = `selecionados.includes(achado.id)`.
- `onPress` calls `onToggle(achado.id)`.
- Chips are rendered in a `flexWrap: 'wrap'` row.
- The group label is NOT shown (there is only one group "alterado" per window; the header is the window name).

### 5.5 Dismissal

- Swiping down: detect via `PanResponder` or `react-native-gesture-handler`'s `PanGestureHandler`. If `translationY > 80`, call `onClose`.
- Tapping outside: the backdrop `TouchableOpacity` calls `onClose`.
- On close, the sheet animates back down before unmounting (animate then call `onClose` after animation completes).

### 5.6 Spring Animation Parameters

```ts
withSpring(0, { damping: 20, stiffness: 200 })   // open: translateY → 0
withSpring(sheetHeight, { damping: 20, stiffness: 200 })  // close: translateY → sheetHeight
```

### 5.7 State Management in Parent

The parent (`[protocolo].tsx`) holds:
```ts
const [sheetJanela, setSheetJanela] = useState<Janela | null>(null);
```
Opening: `setSheetJanela(janela)`.
Closing: `setSheetJanela(null)`.

Saving happens automatically because `toggleAchado` writes directly to the store; there is no pending state in the sheet.

---

## 6. LimitacoesDropdown Component

### 6.1 Props

```ts
interface LimitacoesDropdownProps {
  limitacoes: LimitacaoTecnica[];
  selecionadas: string[];         // limitacaoId[]
  onToggle: (limitacaoId: string) => void;
}
```

### 6.2 Behavior

- The dropdown header renders `"LIMITAÇÕES TÉCNICAS"` + a `ChevronDown` / `ChevronUp` icon.
- Tapping the header toggles `expanded` local state.
- When expanded, the chip grid slides into view. Use `useSharedValue` + `withTiming` for height animation (or simple conditional render with opacity fade is acceptable since the list is short).
- Chips use the existing `Chip` component.
- This component is NOT a sheet — it is an inline block within the `ScrollView`.

### 6.3 Styling

- Header: `flexDirection: 'row'`, `justifyContent: 'space-between'`, `paddingVertical: Spacing.md`.
- Header text: `IBMPlexMono_500Medium`, `FontSize.micro`, `Colors.textMuted`, `letterSpacing: 0.08`.
- Chip row: `flexDirection: 'row'`, `flexWrap: 'wrap'`, `paddingBottom: Spacing.base`.

---

## 7. Main Screen Rewrite (`app/laudador/[protocolo].tsx`)

### 7.1 Layout Structure

```
<SafeAreaView>
  <Header />                          ← ← button + protocol name (unchanged)
  <ScrollView>
    {janelasOpcionais activators?}    ← if protocol has optional windows (unchanged logic)
    {janelasVisiveis.map(j =>
      <JanelaRow ... />
    )}
    <LimitacoesDropdown ... />
  </ScrollView>
  <ObservacoesBar ... />              ← unchanged
  <BottomBar>
    <VoiceButton ... />               ← unchanged
    <GerarButton ... />               ← unchanged
  </BottomBar>
  <JanelaSheet ... />                 ← rendered outside ScrollView, over everything
</SafeAreaView>
```

### 7.2 JanelaSheet Positioning

`JanelaSheet` is rendered as the last child of `SafeAreaView`. It uses `StyleSheet.absoluteFillObject` for the backdrop and `position: 'absolute', bottom: 0, left: 0, right: 0` for the panel.

---

## 8. InputBruto Changes

### 8.1 New Shape

The `InputBruto` interface in `src/services/llmClient.ts` changes from a single `janelasComInput` array to a unified `janelas` array where each entry is one of two shapes:

```ts
type JanelaPayload =
  | { nome: string; achados: string[] }    // has altered findings
  | { nome: string; status: 'normal' }     // no selections = normal

export interface InputBruto {
  protocolo: string;
  transdutor: string;
  janelas: JanelaPayload[];               // ALL windows, always present
  observacoes: string;
  limitacoes: string[];
}
```

### 8.2 Construction in `[protocolo].tsx`

```ts
const janelas: JanelaPayload[] = janelasVisiveis.map((j) => {
  const sel = achadosSelecionados[j.id] ?? [];
  if (sel.length > 0) {
    const achados = j.grupos
      .flatMap((g) => g.achados)
      .filter((a) => sel.includes(a.id))
      .map((a) => a.label);
    return { nome: j.nome, achados };
  }
  return { nome: j.nome, status: 'normal' as const };
});
```

### 8.3 Guard for GERAR Button

Remove the `totalChips === 0` guard. The new behavior always sends all windows. GERAR may proceed with all windows as normal (the user may intentionally generate a "no findings" report). The only remaining guard is for completely empty protocols (no windows), which cannot happen given the data structure.

Actually: keep a soft guard to prevent generating a report when both `janelas` are all-normal AND `observacoes` is empty — this is a meaningless report. Alert: "Selecione pelo menos um achado ou adicione observações para gerar o laudo."

---

## 9. SYSTEM_PROMPT Changes in `api/gerar-laudo.ts`

### 9.1 Line to Remove

```
- Laudar APENAS janelas com input. NUNCA descrever janelas vazias, NUNCA assumir normal por omissão, NUNCA escrever "não avaliada"
```

### 9.2 Lines to Add (replacing the removed rule)

```
- TODAS as janelas são sempre incluídas no payload. Janelas com `status: "normal"` → descrever brevemente como "sem alterações ecográficas" ou equivalente clínico ("espaço hepatorrenal sem evidência de líquido livre", etc.). Janelas com `achados: [...]` → descrever os achados listados.
- Nunca escrever "não avaliada". Toda janela recebida deve aparecer nos ACHADOS.
```

### 9.3 Full Updated Rules Block

The replacement block in SYSTEM_PROMPT (the "Regras estritas" section):

```
Regras estritas:
- PT-BR técnico médico
- TODAS as janelas recebidas devem ser descritas nos ACHADOS. Janelas com status "normal" → descrever como sem alterações ecográficas (use frases clínicas apropriadas ao contexto). Janelas com achados → descrever os achados listados.
- Nunca inventar achados
- Nunca escrever "não avaliada"
- Linguagem comedida: "sugestivo de", "compatível com", "sem sinais ecográficos de". Nunca afirmação diagnóstica absoluta
- Preservar sinais técnicos entre aspas tal como nos chips, mantendo formato bilíngue: "termo PT" ("termo EN")
- Mesclar coerentemente chips + texto + voz. Priorizar o mais específico em caso de conflito
```

---

## 10. Type Consistency Checklist

| Type/Interface | Location | Change |
|---|---|---|
| `InputBruto` | `src/services/llmClient.ts` | Replace `janelasComInput` with `janelas: JanelaPayload[]` |
| `JanelaPayload` | `src/services/llmClient.ts` | New discriminated union type |
| `JanelaRowProps` | `src/components/laudador/JanelaRow.tsx` | New |
| `JanelaSheetProps` | `src/components/laudador/JanelaSheet.tsx` | New |
| `LimitacoesDropdownProps` | `src/components/laudador/LimitacoesDropdown.tsx` | New |
| `Janela`, `LimitacaoTecnica` | `src/data/protocolos/tipos.ts` | No change |
| `LaudadorState` | `src/stores/laudadorStore.ts` | No change |

---

## 11. Files NOT Touched

- `src/data/protocolos/tipos.ts` — No change
- `src/stores/laudadorStore.ts` — No change
- `src/components/ui/Chip.tsx` — No change (reused as-is inside JanelaSheet and LimitacoesDropdown)
- `src/components/laudador/ObservacoesBar.tsx` — No change
- `src/components/ui/VoiceButton.tsx` — No change
- `src/data/protocolos/efast.ts`, `blue.ts` — No change
- `src/data/limitacoes.ts` — No change
