# Laudador UX Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the JanelaBlock accordion UX with a compact window-list + bottom-sheet flow that shows only altered findings and treats normal as the default.

**Architecture:** The main screen becomes a flat list of `JanelaRow` components; tapping a row opens a `JanelaSheet` that presents only altered-category chips for that window. A `LimitacoesDropdown` inline block replaces the flat chip section for limitations. The `InputBruto` payload now always includes all visible windows (with either `achados` or `status: 'normal'`), and the SYSTEM_PROMPT is updated to describe all received windows.

**Tech Stack:** React Native, react-native-reanimated v4, Expo Router, TypeScript

---

## Task 1 — Update `InputBruto` in `src/services/llmClient.ts`

**Why first:** Every downstream task depends on the correct payload type. Fixing the type first lets TypeScript catch mismatches in later tasks at compile time.

### Files
- Modify: `/Users/luizprazeres/PlantaoUSG/plantao-usg/src/services/llmClient.ts`

### Steps
- [ ] Add `JanelaPayload` discriminated union type
- [ ] Replace `janelasComInput` field with `janelas: JanelaPayload[]` in `InputBruto`

### Complete Code

```ts
import Constants from 'expo-constants';

const API_URL =
  (Constants.expoConfig?.extra?.apiUrl as string | undefined) ??
  'http://localhost:3000';

export type JanelaPayload =
  | { nome: string; achados: string[] }
  | { nome: string; status: 'normal' };

export interface InputBruto {
  protocolo: string;
  transdutor: string;
  janelas: JanelaPayload[];
  observacoes: string;
  limitacoes: string[];
}

export interface LaudoGerado {
  extenso: string;
  objetivo: string;
}

export async function gerarLaudo(
  protocolo: string,
  inputBruto: InputBruto
): Promise<LaudoGerado> {
  const response = await fetch(`${API_URL}/api/gerar-laudo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ protocolo, inputBruto }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
    throw new Error((err as { error: string }).error ?? `Erro ${response.status}`);
  }

  return response.json() as Promise<LaudoGerado>;
}
```

### Verification
```
npx tsc --noEmit
```
Expected: no errors in `src/services/llmClient.ts`.

### Commit
```
feat(llm): update InputBruto to include all windows with normal/altered status
```

---

## Task 2 — Create `JanelaRow` Component

### Files
- Create: `/Users/luizprazeres/PlantaoUSG/plantao-usg/src/components/laudador/JanelaRow.tsx`

### Steps
- [ ] Create file with props interface
- [ ] Implement row with "sem alteração" fallback text
- [ ] Implement tag pills for selected findings
- [ ] Tag pill × button stops propagation and calls onRemoveAchado

### Complete Code

```tsx
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, Spacing, Radius } from '@/constants/theme';
import type { Janela } from '@/data/protocolos/tipos';

interface JanelaRowProps {
  janela: Janela;
  selecionados: string[];
  onPress: () => void;
  onRemoveAchado: (achadoId: string) => void;
}

export function JanelaRow({ janela, selecionados, onPress, onRemoveAchado }: JanelaRowProps) {
  const allAchados = janela.grupos.flatMap((g) => g.achados);

  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.nome}>{janela.nome}</Text>
      <View style={styles.tagsContainer}>
        {selecionados.length === 0 ? (
          <Text style={styles.semAlteracao}>sem alteração</Text>
        ) : (
          selecionados.map((achadoId) => {
            const achado = allAchados.find((a) => a.id === achadoId);
            if (!achado) return null;
            return (
              <View key={achadoId} style={styles.tag}>
                <Text style={styles.tagLabel} numberOfLines={1}>
                  {achado.label}
                </Text>
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={(e) => {
                    e.stopPropagation?.();
                    onRemoveAchado(achadoId);
                  }}
                  hitSlop={{ top: 8, bottom: 8, left: 4, right: 8 }}
                >
                  <Text style={styles.removeText}>×</Text>
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  nome: {
    fontFamily: 'IBMPlexMono_600SemiBold',
    fontSize: FontSize.label,
    color: Colors.textPrimary,
    flex: 1,
    marginRight: Spacing.sm,
    paddingTop: 2,
  },
  tagsContainer: {
    flex: 1.2,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  semAlteracao: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: FontSize.caption,
    color: Colors.textMuted,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.textPrimary,
    borderRadius: Radius.micro,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    marginLeft: Spacing.xs,
    marginBottom: Spacing.xs,
    maxWidth: 180,
  },
  tagLabel: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: FontSize.caption,
    color: Colors.bgPrimary,
    flex: 1,
  },
  removeBtn: {
    marginLeft: 4,
  },
  removeText: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: FontSize.caption,
    color: Colors.bgPrimary,
  },
});
```

### Verification
```
npx tsc --noEmit
```

### Commit
```
feat(laudador): add JanelaRow component for compact window list
```

---

## Task 3 — Create `JanelaSheet` Component

### Files
- Create: `/Users/luizprazeres/PlantaoUSG/plantao-usg/src/components/laudador/JanelaSheet.tsx`

### Steps
- [ ] Implement backdrop with semi-transparent overlay
- [ ] Implement sheet panel with handle pill
- [ ] Implement title (uppercase, letter-spacing)
- [ ] Filter and render only "alterado" category groups
- [ ] Integrate existing Chip component
- [ ] Implement spring animation open/close
- [ ] Implement swipe-down dismiss with PanResponder

### Complete Code

```tsx
import { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PanResponder,
  ScrollView,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Chip } from '@/components/ui/Chip';
import { Colors, FontSize, Spacing, Radius } from '@/constants/theme';
import type { Janela } from '@/data/protocolos/tipos';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.6;
const SWIPE_THRESHOLD = 80;

interface JanelaSheetProps {
  janela: Janela | null;
  selecionados: string[];
  onToggle: (achadoId: string) => void;
  onClose: () => void;
}

export function JanelaSheet({ janela, selecionados, onToggle, onClose }: JanelaSheetProps) {
  const translateY = useSharedValue(SHEET_MAX_HEIGHT);
  const closing = useRef(false);

  const close = () => {
    if (closing.current) return;
    closing.current = true;
    translateY.value = withSpring(SHEET_MAX_HEIGHT, { damping: 20, stiffness: 200 }, () => {
      runOnJS(onClose)();
    });
  };

  useEffect(() => {
    if (janela) {
      closing.current = false;
      translateY.value = withSpring(0, { damping: 20, stiffness: 200 });
    }
  }, [janela]);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gs) => gs.dy > 5,
    onPanResponderMove: (_, gs) => {
      if (gs.dy > 0) {
        translateY.value = gs.dy;
      }
    },
    onPanResponderRelease: (_, gs) => {
      if (gs.dy > SWIPE_THRESHOLD) {
        close();
      } else {
        translateY.value = withSpring(0, { damping: 20, stiffness: 200 });
      }
    },
  });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!janela) return null;

  const alteredGroups = janela.grupos.filter((g) => g.categoria === 'alterado');

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={close} />
      <Animated.View style={[styles.sheet, sheetStyle]} {...panResponder.panHandlers}>
        <View style={styles.handle} />
        <Text style={styles.titulo}>{janela.nome.toUpperCase()}</Text>
        <ScrollView
          style={styles.chipsScroll}
          contentContainerStyle={styles.chipsContent}
          showsVerticalScrollIndicator={false}
        >
          {alteredGroups.flatMap((g) =>
            g.achados.map((achado) => (
              <Chip
                key={achado.id}
                label={achado.label}
                selected={selecionados.includes(achado.id)}
                onPress={() => onToggle(achado.id)}
              />
            ))
          )}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    backgroundColor: Colors.bgElevated,
    borderTopLeftRadius: Radius.md,
    borderTopRightRadius: Radius.md,
    maxHeight: SHEET_MAX_HEIGHT,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.xl,
  },
  handle: {
    width: 32,
    height: 3,
    backgroundColor: Colors.textMuted,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.base,
  },
  titulo: {
    fontFamily: 'IBMPlexMono_600SemiBold',
    fontSize: FontSize.label,
    color: Colors.textPrimary,
    letterSpacing: 1.5,
    marginBottom: Spacing.base,
  },
  chipsScroll: {
    flexGrow: 0,
  },
  chipsContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
```

### Verification
```
npx tsc --noEmit
```

### Commit
```
feat(laudador): add JanelaSheet bottom sheet component with spring animation
```

---

## Task 4 — Create `LimitacoesDropdown` Component

### Files
- Create: `/Users/luizprazeres/PlantaoUSG/plantao-usg/src/components/laudador/LimitacoesDropdown.tsx`

### Steps
- [ ] Implement collapsible header with chevron icon
- [ ] Implement chip grid, hidden when collapsed
- [ ] Animate opacity/height with withTiming

### Complete Code

```tsx
import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { Chip } from '@/components/ui/Chip';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import type { LimitacaoTecnica } from '@/data/protocolos/tipos';

interface LimitacoesDropdownProps {
  limitacoes: LimitacaoTecnica[];
  selecionadas: string[];
  onToggle: (limitacaoId: string) => void;
}

export function LimitacoesDropdown({ limitacoes, selecionadas, onToggle }: LimitacoesDropdownProps) {
  const [expanded, setExpanded] = useState(false);
  const opacity = useSharedValue(0);

  const toggle = () => {
    const next = !expanded;
    setExpanded(next);
    opacity.value = withTiming(next ? 1 : 0, { duration: 200 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    display: opacity.value === 0 && !expanded ? 'none' : 'flex',
  }));

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={toggle} activeOpacity={0.7}>
        <Text style={styles.label}>LIMITAÇÕES TÉCNICAS</Text>
        {expanded
          ? <ChevronUp size={14} color={Colors.textMuted} />
          : <ChevronDown size={14} color={Colors.textMuted} />}
      </TouchableOpacity>
      {expanded && (
        <Animated.View style={[styles.chips, animatedStyle]}>
          {limitacoes.map((l) => (
            <Chip
              key={l.id}
              label={l.label}
              selected={selecionadas.includes(l.id)}
              onPress={() => onToggle(l.id)}
            />
          ))}
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  label: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: FontSize.micro,
    color: Colors.textMuted,
    letterSpacing: 0.08 * FontSize.micro,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: Spacing.md,
    paddingBottom: Spacing.base,
  },
});
```

### Verification
```
npx tsc --noEmit
```

### Commit
```
feat(laudador): add LimitacoesDropdown inline collapsible component
```

---

## Task 5 — Rewrite `app/laudador/[protocolo].tsx`

**This is the main integration task.** Replace the existing screen with the new layout using all three new components.

### Files
- Modify: `/Users/luizprazeres/PlantaoUSG/plantao-usg/app/laudador/[protocolo].tsx`

### Steps
- [ ] Remove imports of JanelaBlock, GrupoChips
- [ ] Add imports for JanelaRow, JanelaSheet, LimitacoesDropdown
- [ ] Add `sheetJanela` useState
- [ ] Replace ScrollView contents: JanelaRow list + LimitacoesDropdown
- [ ] Add JanelaSheet as last child of SafeAreaView
- [ ] Keep chipAtivadores section if protocol has optional windows (unchanged logic)
- [ ] Update `handleGerar`: remove `janelasComInput`, use new `janelas` build logic
- [ ] Update soft guard: all windows normal AND observacoes empty → alert

### Complete Code

```tsx
import { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { JanelaRow } from '@/components/laudador/JanelaRow';
import { JanelaSheet } from '@/components/laudador/JanelaSheet';
import { LimitacoesDropdown } from '@/components/laudador/LimitacoesDropdown';
import { ObservacoesBar } from '@/components/laudador/ObservacoesBar';
import { VoiceButton } from '@/components/ui/VoiceButton';
import { Chip } from '@/components/ui/Chip';
import { useLaudadorStore } from '@/stores/laudadorStore';
import { PROTOCOLO_MAP } from '@/data/protocolos';
import { gerarLaudo } from '@/services/llmClient';
import type { JanelaPayload } from '@/services/llmClient';
import { useVoz } from '@/hooks/useVoz';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { Analytics } from '@/utils/analytics';
import type { Janela } from '@/data/protocolos/tipos';

export default function LaudadorScreen() {
  const { protocolo: protocoloId } = useLocalSearchParams<{ protocolo: string }>();
  const protocolo = PROTOCOLO_MAP[protocoloId ?? ''];
  const [gerando, setGerando] = useState(false);
  const [sheetJanela, setSheetJanela] = useState<Janela | null>(null);
  const insets = useSafeAreaInsets();

  const {
    achadosSelecionados,
    observacoes,
    limitacoesSelecionadas,
    chipAtivadoresAtivos,
    toggleAchado,
    setObservacoes,
    appendObservacoes,
    toggleLimitacao,
    toggleChipAtivador,
  } = useLaudadorStore();

  const { listening, toggle: toggleVoz } = useVoz((text) => {
    appendObservacoes(text);
    Analytics.voiceUsed();
  });

  if (!protocolo) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={{ color: Colors.textPrimary, padding: Spacing.base }}>
          Protocolo não encontrado
        </Text>
      </SafeAreaView>
    );
  }

  const janelasVisiveis: Janela[] = [
    ...protocolo.janelas,
    ...(protocolo.janelasOpcionais ?? []).filter((j) =>
      chipAtivadoresAtivos.includes(j.chipAtivadorId)
    ),
  ];

  const handleGerar = useCallback(async () => {
    const todasNormais = janelasVisiveis.every(
      (j) => (achadosSelecionados[j.id]?.length ?? 0) === 0
    );
    if (todasNormais && !observacoes.trim()) {
      Alert.alert(
        'Nenhum achado',
        'Selecione pelo menos um achado ou adicione observações para gerar o laudo.'
      );
      return;
    }

    setGerando(true);
    const inicio = Date.now();
    const totalChips = Object.values(achadosSelecionados).flat().length;
    Analytics.chipsCount(totalChips);
    if (observacoes.trim()) Analytics.textFreeUsed();

    try {
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

      const limitacoes = protocolo.limitacoesTecnicas
        .filter((l) => limitacoesSelecionadas.includes(l.id))
        .map((l) => l.label);

      const resultado = await gerarLaudo(protocolo.nomeCompleto, {
        protocolo: protocolo.nomeCompleto,
        transdutor: protocolo.transdutor,
        janelas,
        observacoes,
        limitacoes,
      });

      Analytics.laudoGenerated(protocolo.id, Date.now() - inicio);

      router.push({
        pathname: '/resultado',
        params: {
          extenso: resultado.extenso,
          objetivo: resultado.objetivo,
          protocoloId: protocolo.id,
        },
      });
    } catch (err) {
      Alert.alert('Erro ao gerar laudo', (err as Error).message);
    } finally {
      setGerando(false);
    }
  }, [achadosSelecionados, observacoes, limitacoesSelecionadas, janelasVisiveis, protocolo]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <ArrowLeft size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.titulo}>{protocolo.nome}</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {protocolo.janelasOpcionais && protocolo.janelasOpcionais.length > 0 && (
          <View style={styles.ativadores}>
            {protocolo.janelasOpcionais.map((j) => (
              <Chip
                key={j.chipAtivadorId}
                label={j.nome}
                selected={chipAtivadoresAtivos.includes(j.chipAtivadorId)}
                onPress={() => toggleChipAtivador(j.chipAtivadorId)}
              />
            ))}
          </View>
        )}

        {janelasVisiveis.map((janela) => (
          <JanelaRow
            key={janela.id}
            janela={janela}
            selecionados={achadosSelecionados[janela.id] ?? []}
            onPress={() => setSheetJanela(janela)}
            onRemoveAchado={(achadoId) => toggleAchado(janela.id, achadoId)}
          />
        ))}

        <LimitacoesDropdown
          limitacoes={protocolo.limitacoesTecnicas}
          selecionadas={limitacoesSelecionadas}
          onToggle={toggleLimitacao}
        />
      </ScrollView>

      <ObservacoesBar value={observacoes} onChange={setObservacoes} />

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + Spacing.md }]}>
        <VoiceButton listening={listening} onPress={toggleVoz} />
        <TouchableOpacity
          style={[styles.gerarBtn, gerando && styles.gerarBtnDisabled]}
          onPress={handleGerar}
          disabled={gerando}
        >
          {gerando ? (
            <ActivityIndicator color={Colors.bgPrimary} size="small" />
          ) : (
            <Text style={styles.gerarText}>GERAR</Text>
          )}
        </TouchableOpacity>
      </View>

      <JanelaSheet
        janela={sheetJanela}
        selecionados={sheetJanela ? (achadosSelecionados[sheetJanela.id] ?? []) : []}
        onToggle={(achadoId) => {
          if (sheetJanela) toggleAchado(sheetJanela.id, achadoId);
        }}
        onClose={() => setSheetJanela(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPrimary },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  back: { marginRight: Spacing.md },
  titulo: {
    fontFamily: 'IBMPlexMono_600SemiBold',
    fontSize: FontSize.heading,
    color: Colors.textPrimary,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing.base, paddingBottom: Spacing.xl },
  ativadores: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: Spacing.base },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
    backgroundColor: Colors.bgElevated,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
  },
  gerarBtn: {
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: 4,
    minWidth: 120,
    alignItems: 'center',
  },
  gerarBtnDisabled: { opacity: 0.5 },
  gerarText: {
    fontFamily: 'IBMPlexMono_700Bold',
    fontSize: FontSize.label,
    color: Colors.bgPrimary,
    letterSpacing: 0.06,
  },
});
```

### Verification
```
npx tsc --noEmit
```

### Commit
```
feat(laudador): rewrite screen with compact row list, JanelaSheet, and LimitacoesDropdown
```

---

## Task 6 — Update `api/gerar-laudo.ts` SYSTEM_PROMPT

### Files
- Modify: `/Users/luizprazeres/PlantaoUSG/plantao-usg/api/gerar-laudo.ts`

### Steps
- [ ] Replace the "Regras estritas" bullet that forbids normal-by-omission
- [ ] Add two new rules about status: "normal" handling
- [ ] Keep all other prompt content unchanged

### Exact Change

Replace this block in SYSTEM_PROMPT:
```
Regras estritas:
- PT-BR técnico médico
- Laudar APENAS janelas com input. NUNCA descrever janelas vazias, NUNCA assumir normal por omissão, NUNCA escrever "não avaliada"
- Nunca inventar achados
- Linguagem comedida: "sugestivo de", "compatível com", "sem sinais ecográficos de". Nunca afirmação diagnóstica absoluta
- Preservar sinais técnicos entre aspas tal como nos chips, mantendo formato bilíngue: "termo PT" ("termo EN")
- Mesclar coerentemente chips + texto + voz. Priorizar o mais específico em caso de conflito
```

With:
```
Regras estritas:
- PT-BR técnico médico
- TODAS as janelas recebidas devem ser descritas nos ACHADOS. Janelas com status "normal" → descrever como sem alterações ecográficas (use frases clínicas apropriadas ao contexto da janela). Janelas com achados → descrever os achados listados.
- Nunca escrever "não avaliada"
- Nunca inventar achados
- Linguagem comedida: "sugestivo de", "compatível com", "sem sinais ecográficos de". Nunca afirmação diagnóstica absoluta
- Preservar sinais técnicos entre aspas tal como nos chips, mantendo formato bilíngue: "termo PT" ("termo EN")
- Mesclar coerentemente chips + texto + voz. Priorizar o mais específico em caso de conflito
```

### Complete File After Change

```ts
const SYSTEM_PROMPT = `Você é um médico ultrassonografista especialista em POCUS gerando um laudo estruturado a partir de achados registrados por um intensivista à beira-leito.

Receba:
- Protocolo aplicado
- Data do exame
- Janelas com achados estruturados ou status "normal"
- Texto livre digitado
- Transcrição de voz (pode ser fragmentada)
- Limitações técnicas selecionadas

Gere DOIS laudos em JSON:

1. EXTENSO: laudo com 4 seções separadas por linha em branco, nesta ordem exata:

TÉCNICA: [transdutor utilizado, objetivo do exame e limitações técnicas se houver]

ACHADOS: [descrição pontual de todas as janelas recebidas]

IMPRESSÃO: [conclusão comedida com correlação diagnóstica. Ao final, adicione: "Exame POCUS à beira-leito, caráter focado e complementar. Não substitui avaliação ultrassonográfica formal."]

REFERÊNCIAS: [1 a 3 referências bibliográficas relevantes ao protocolo, formato: Sobrenome A et al. Título abreviado. Periódico Abrev. Ano;Vol(N):pp.]

2. OBJETIVO: parágrafo único para copiar/colar no prontuário, iniciando com:
"POCUS [nome do protocolo] ([data do exame]): "
seguido de 2-3 frases integrando transdutor, achados principais e impressão diagnóstica.
Exemplo: "POCUS eFAST (12/04/2026): Exame realizado com transdutor convexo, direcionado para pesquisa de trauma abdominal. Moderada quantidade de líquido livre no espaço hepatorrenal, compatível com hemorragia intraabdominal no contexto de trauma."

Regras estritas:
- PT-BR técnico médico
- TODAS as janelas recebidas devem ser descritas nos ACHADOS. Janelas com status "normal" → descrever como sem alterações ecográficas (use frases clínicas apropriadas ao contexto da janela). Janelas com achados → descrever os achados listados.
- Nunca escrever "não avaliada"
- Nunca inventar achados
- Linguagem comedida: "sugestivo de", "compatível com", "sem sinais ecográficos de". Nunca afirmação diagnóstica absoluta
- Preservar sinais técnicos entre aspas tal como nos chips, mantendo formato bilíngue: "termo PT" ("termo EN")
- Mesclar coerentemente chips + texto + voz. Priorizar o mais específico em caso de conflito

Retorne APENAS JSON válido: { "extenso": "...", "objetivo": "..." }`;

export const config = { runtime: 'edge' };

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  let body: { protocolo?: string; inputBruto?: unknown };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  const { protocolo, inputBruto } = body;

  if (!protocolo || !inputBruto) {
    return new Response(
      JSON.stringify({ error: 'protocolo e inputBruto são obrigatórios' }),
      { status: 400 }
    );
  }

  const dataExame = new Date().toLocaleDateString('pt-BR');
  const userPrompt = `Protocolo: ${protocolo}\nData do exame: ${dataExame}\n\n${JSON.stringify(inputBruto, null, 2)}`;

  const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    }),
  });

  if (!openaiRes.ok) {
    const err = await openaiRes.text();
    return new Response(JSON.stringify({ error: 'LLM error', detail: err }), { status: 502 });
  }

  const data = await openaiRes.json() as { choices: Array<{ message: { content: string } }> };
  const content = data.choices[0]?.message?.content ?? '{}';

  return new Response(content, {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
```

### Verification
```
npx tsc --noEmit
```

### Commit
```
feat(api): update SYSTEM_PROMPT to describe all windows including normal status
```

---

## Execution Order

Execute tasks strictly in this order (each task's types feed the next):

1. Task 1 — `llmClient.ts` (establishes `JanelaPayload` type)
2. Task 2 — `JanelaRow.tsx` (no upstream deps)
3. Task 3 — `JanelaSheet.tsx` (uses `Chip` and `Janela` type)
4. Task 4 — `LimitacoesDropdown.tsx` (uses `Chip` and `LimitacaoTecnica` type)
5. Task 5 — `[protocolo].tsx` (imports from tasks 1-4)
6. Task 6 — `api/gerar-laudo.ts` (independent, prompt-only change)

Run `npx tsc --noEmit` after each task. If TypeScript errors appear, fix before proceeding.

---

## Post-Implementation Checklist

- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] Sheet opens on row tap, closes on swipe-down and backdrop tap
- [ ] Only "alterado" chips appear in the sheet
- [ ] "sem alteração" text shows when no chip is selected for a window
- [ ] Tag pills appear on the row when chips are selected
- [ ] × button on tag pill removes the chip without opening the sheet
- [ ] LimitacoesDropdown toggles correctly (NOT a sheet)
- [ ] GERAR is blocked only when all windows are normal AND observacoes is empty
- [ ] Payload sent to API contains ALL visible windows (verified in network tab or console log)
- [ ] Windows with selections send `{ nome, achados: [...] }`
- [ ] Windows without selections send `{ nome, status: "normal" }`
- [ ] Generated laudo describes all windows (including normal ones)
