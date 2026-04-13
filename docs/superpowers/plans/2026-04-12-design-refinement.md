# Design Refinement — Home Screen & Animations

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesenhar os cards da Home com categoria tipográfica, centralizar o header e adicionar animações de stagger e spring.

**Architecture:** Três mudanças independentes em sequência: (1) tipo de dados `categoria` nos protocolos, (2) novo layout do `ProtocoloCard` com animação de press, (3) header centralizado + stagger na Home. A transição de tela (`animation: 'fade'`) já está implementada em `_layout.tsx` — não precisa de alteração.

**Tech Stack:** React Native, react-native-reanimated (já instalado), Expo Router, IBM Plex Mono, TypeScript

---

## Arquivos

| Arquivo | Ação |
|---------|------|
| `src/data/protocolos/tipos.ts` | Adicionar `categoria?: string` ao tipo `Protocolo` |
| `src/data/protocolos/efast.ts` | Adicionar `categoria: 'TRAUMA'` |
| `src/data/protocolos/blue.ts` | Adicionar `categoria: 'PULMONAR'` |
| `src/components/home/ProtocoloCard.tsx` | Novo layout + Animated.View + spring no press |
| `app/index.tsx` | Header centralizado + categoria nos placeholders + stagger |

---

### Task 1: Adicionar campo `categoria` ao tipo Protocolo e aos dados

**Files:**
- Modify: `src/data/protocolos/tipos.ts`
- Modify: `src/data/protocolos/efast.ts`
- Modify: `src/data/protocolos/blue.ts`

- [ ] **Step 1: Adicionar `categoria` ao tipo Protocolo**

Abra `src/data/protocolos/tipos.ts` e adicione o campo `categoria` como opcional:

```typescript
export type Protocolo = {
  id: string;
  nome: string;
  nomeCompleto: string;
  indicacao: string;
  icone: string;
  transdutor: string;
  janelas: Janela[];
  janelasOpcionais?: JanelaOpcional[];
  limitacoesTecnicas: LimitacaoTecnica[];
  categoria?: string;
};
```

- [ ] **Step 2: Adicionar categoria ao eFAST**

Em `src/data/protocolos/efast.ts`, adicione `categoria: 'TRAUMA'` ao objeto `EFAST`, após o campo `icone`:

```typescript
export const EFAST: Protocolo = {
  id: 'efast',
  nome: 'eFAST',
  nomeCompleto: 'Extended Focused Assessment with Sonography in Trauma',
  indicacao: 'Líquido livre em cavidades + pneumotórax/hemotórax na emergência',
  icone: 'Crosshair',
  categoria: 'TRAUMA',
  // ... resto dos campos inalterado
```

- [ ] **Step 3: Adicionar categoria ao BLUE**

Em `src/data/protocolos/blue.ts`, adicione `categoria: 'PULMONAR'` após o campo `icone`:

```typescript
export const BLUE: Protocolo = {
  id: 'blue',
  nome: 'BLUE',
  // ...
  icone: '...',
  categoria: 'PULMONAR',
  // ... resto inalterado
```

- [ ] **Step 4: Verificar que não há erros de TypeScript**

```bash
cd /Users/luizprazeres/PlantaoUSG/plantao-usg
npx tsc --noEmit 2>&1 | head -20
```

Esperado: sem erros relacionados a `categoria`.

- [ ] **Step 5: Commit**

```bash
git add src/data/protocolos/tipos.ts src/data/protocolos/efast.ts src/data/protocolos/blue.ts
git commit -m "feat: add categoria field to Protocolo type and data"
```

---

### Task 2: Redesenhar ProtocoloCard com novo layout e animação de press

**Files:**
- Modify: `src/components/home/ProtocoloCard.tsx`

- [ ] **Step 1: Reescrever o componente completo**

Substitua todo o conteúdo de `src/components/home/ProtocoloCard.tsx` por:

```typescript
import { Pressable, Text, View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Colors, FontSize, Spacing, Radius } from '@/constants/theme';
import type { Protocolo } from '@/data/protocolos/tipos';

interface ProtocoloCardProps {
  protocolo: Pick<Protocolo, 'id' | 'nome' | 'indicacao' | 'categoria'>;
  disponivel: boolean;
  onPress: () => void;
}

export function ProtocoloCard({ protocolo, disponivel, onPress }: ProtocoloCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  function handlePressIn() {
    if (!disponivel) return;
    scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
  }

  function handlePressOut() {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  }

  return (
    <Pressable
      onPress={disponivel ? onPress : undefined}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.pressable}
    >
      <Animated.View style={[styles.card, !disponivel && styles.cardDisabled, animatedStyle]}>
        {protocolo.categoria ? (
          <Text style={styles.categoria}>{protocolo.categoria}</Text>
        ) : null}
        <Text style={styles.nome}>{protocolo.nome}</Text>
        <View style={styles.divisor} />
        <Text style={styles.indicacao} numberOfLines={2}>
          {disponivel ? protocolo.indicacao : 'EM BREVE'}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
    margin: Spacing.xs,
  },
  card: {
    flex: 1,
    backgroundColor: Colors.bgElevated,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    padding: Spacing.base,
    minHeight: 110,
  },
  cardDisabled: {
    opacity: 0.3,
    borderColor: '#141414',
  },
  categoria: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 9,
    color: '#2E2E2E',
    letterSpacing: 3,
    marginBottom: 8,
  },
  nome: {
    fontFamily: 'IBMPlexMono_700Bold',
    fontSize: 16,
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
  divisor: {
    width: 20,
    height: 0.5,
    backgroundColor: '#2A2A2A',
    marginVertical: 8,
  },
  indicacao: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 10,
    color: '#3A3A3A',
    lineHeight: 16,
  },
});
```

- [ ] **Step 2: Verificar no web preview**

```bash
cd /Users/luizprazeres/PlantaoUSG/plantao-usg
npx expo start --web --port 8092
```

Abra http://localhost:8092 e confirme:
- Cards disponíveis mostram: categoria (cinza escuro) → nome → linha → indicação
- Cards indisponíveis mostram "EM BREVE" e estão opacos
- Sem erros no console

- [ ] **Step 3: Commit**

```bash
git add src/components/home/ProtocoloCard.tsx
git commit -m "feat: redesign ProtocoloCard with category label, divider and spring press animation"
```

---

### Task 3: Centralizar header e adicionar stagger de entrada na Home

**Files:**
- Modify: `app/index.tsx`

- [ ] **Step 1: Reescrever app/index.tsx completo**

Substitua todo o conteúdo de `app/index.tsx` por:

```typescript
import { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { ProtocoloCard } from '@/components/home/ProtocoloCard';
import { FunilFooter } from '@/components/ui/FunilFooter';
import { PROTOCOLOS } from '@/data/protocolos';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { Analytics } from '@/utils/analytics';
import { useLaudadorStore } from '@/stores/laudadorStore';

const DISPONIVEIS = ['efast', 'blue'];

const PLACEHOLDER_PROTOCOLOS = [
  { id: 'cardiaco', nome: 'Echo', indicacao: 'Função ventricular, câmaras, pericárdio', categoria: 'CARDÍACO' },
  { id: 'abdominal', nome: 'Abdominal', indicacao: 'Aorta, bexiga, vias biliares, rins', categoria: 'ABDOMINAL' },
  { id: 'aaa', nome: 'AAA', indicacao: 'Aneurisma de aorta abdominal', categoria: 'VASCULAR' },
  { id: 'vascular', nome: 'Vascular', indicacao: 'VJI, subclávia, femoral, PAI', categoria: 'ACESSO' },
];

const TODOS = [...PROTOCOLOS, ...PLACEHOLDER_PROTOCOLOS];

function AnimatedCard({
  item,
  index,
  onPress,
}: {
  item: typeof TODOS[number];
  index: number;
  onPress: () => void;
}) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(12);

  useEffect(() => {
    opacity.value = withDelay(
      index * 80,
      withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) })
    );
    translateY.value = withDelay(
      index * 80,
      withTiming(0, { duration: 300, easing: Easing.out(Easing.cubic) })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[{ flex: 1 }, animatedStyle]}>
      <ProtocoloCard
        protocolo={item}
        disponivel={DISPONIVEIS.includes(item.id)}
        onPress={onPress}
      />
    </Animated.View>
  );
}

export default function HomeScreen() {
  const iniciar = useLaudadorStore((s) => s.iniciar);

  useEffect(() => {
    Analytics.appOpened();
  }, []);

  const pares: typeof TODOS[number][][] = [];
  for (let i = 0; i < TODOS.length; i += 2) {
    pares.push(TODOS.slice(i, i + 2));
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Header centralizado */}
        <View style={styles.header}>
          <Text style={styles.title}>Plantão USG</Text>
          <Text style={styles.subtitle}>ULTRASSONOGRAFIA À BEIRA-LEITO</Text>
        </View>

        {/* Nav links */}
        <View style={styles.nav}>
          <TouchableOpacity onPress={() => router.push('/historico')}>
            <Text style={styles.navLink}>HISTÓRICO</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/sobre')}>
            <Text style={styles.navLink}>SOBRE</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.separator} />

        {/* Grid de cards com stagger */}
        <View style={styles.grid}>
          {pares.map((par, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {par.map((p, colIndex) => {
                const cardIndex = rowIndex * 2 + colIndex;
                return (
                  <AnimatedCard
                    key={p.id}
                    item={p}
                    index={cardIndex}
                    onPress={() => {
                      iniciar(p.id);
                      Analytics.protocolSelected(p.id);
                      router.push(`/laudador/${p.id}`);
                    }}
                  />
                );
              })}
              {par.length === 1 && <View style={{ flex: 1, margin: Spacing.xs }} />}
            </View>
          ))}
        </View>

        <FunilFooter posicao="home" copy="by Laudo USG →" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPrimary },
  scroll: { paddingBottom: Spacing.xl },
  header: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#0F0F0F',
  },
  title: {
    fontFamily: 'IBMPlexMono_700Bold',
    fontSize: FontSize.heading,
    color: Colors.textPrimary,
    letterSpacing: 1.5,
  },
  subtitle: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 9,
    color: '#2E2E2E',
    letterSpacing: 2.5,
    marginTop: 5,
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#0F0F0F',
  },
  navLink: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 9,
    color: '#222222',
    letterSpacing: 1.5,
  },
  separator: {
    height: 1,
    backgroundColor: '#0F0F0F',
  },
  grid: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
  },
  row: { flexDirection: 'row' },
});
```

- [ ] **Step 2: Verificar no web preview**

```bash
cd /Users/luizprazeres/PlantaoUSG/plantao-usg
npx expo start --web --port 8092
```

Abra http://localhost:8092 e confirme:
- Título e subtítulo centralizados no topo com linha separadora
- Links HISTÓRICO e SOBRE centralizados abaixo
- Cards aparecem em sequência (stagger visível no primeiro carregamento)
- Nomes dos placeholders: Echo, Abdominal, AAA, Vascular com categorias corretas
- Sem erros no console

- [ ] **Step 3: Commit**

```bash
git add app/index.tsx
git commit -m "feat: centered header, categoria labels in placeholders, stagger entrance animation"
```
