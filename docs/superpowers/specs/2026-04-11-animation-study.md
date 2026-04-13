# Animation Study — PlantaoUSG
**Data:** 2026-04-11
**Escopo:** Sistema de animações para app dark/monospace de médicos intensivistas
**Stack:** React Native + Expo + react-native-reanimated v3 (API compatível com v4)

---

## Estado Atual — Auditoria

### O que já existe

**`app/index.tsx` — Stagger de entrada dos cards**
- Opacity 0→1 + translateY 12→0, withDelay(index * 80), duration 300, Easing.out(Easing.cubic)
- Funciona bem. Discreto, não distrativo. O delay de 80ms por card é calibrado certo.

**`src/components/home/ProtocoloCard.tsx` — Press spring**
- withSpring scale 1→0.97, damping 15, stiffness 300
- Bom ponto de partida. Spring é a escolha certa para press feedback.
- Problema: damping 15 + stiffness 300 pode oscilar levemente em pressOut. Será refinado abaixo.

**`src/components/laudador/JanelaSheet.tsx` — Bottom sheet**
- Open: withTiming(0, duration 220, Easing.out(Easing.cubic))
- Close: withTiming(SHEET_MAX_HEIGHT, duration 180, Easing.in(Easing.cubic))
- Problema crítico: PanResponder atribuindo diretamente `translateY.value = gs.dy` sem interpolação — causa jumps na UI thread. Swipe interaction precisa ser refatorada com Gesture Handler + useAnimatedGestureHandler para rodar inteiramente na UI thread.

---

## 1. Biblioteca de Animações por Contexto

### 1.1 Entrada de Tela (home → laudador → resultado)

**Contexto:** Médico muda de contexto — precisa saber que está em outro lugar sem sentir que "viajou".

**Técnica:** Fade + translateY sutil, withTiming, sem spring (springs em transições de tela criam sensação de imprecisão).

```typescript
// Padrão para qualquer tela que entra
const opacity = useSharedValue(0);
const translateY = useSharedValue(8);

useEffect(() => {
  opacity.value = withTiming(1, {
    duration: 200,
    easing: Easing.out(Easing.quad),
  });
  translateY.value = withTiming(0, {
    duration: 200,
    easing: Easing.out(Easing.quad),
  });
}, []);
```

**Parâmetros:** duration 200ms, translateY deslocamento 8px (menor que os 12px da home — progressivamente mais sutil conforme aprofunda no fluxo), Easing.out(Easing.quad) em vez de cubic (quad é mais linear, menos "dramático").

**Justificativa:** O médico não precisa ser impressionado pela transição — precisa estar orientado. 200ms é o limiar onde o olho humano percebe movimento sem sentir lentidão. Easing.quad vs cubic: cubic tem uma aceleração inicial mais acentuada que pode parecer "snappy demais" em telas de trabalho.

---

### 1.2 Bottom Sheet — JanelaSheet Open/Close

**Contexto:** Sheet é o núcleo da interação — abre dezenas de vezes por protocolo.

**Problema atual:** PanResponder na JS thread causa jank. A solução correta usa `react-native-gesture-handler` com `useAnimatedGestureHandler` (ou a nova API `Gesture.Pan()`) para manter tudo na UI thread.

**Técnica:** withSpring para open (sensação de peso/gravidade), withTiming para close (intencional, determinístico).

```typescript
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
  runOnJS,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';

// Open — spring com overshoot mínimo (sensação de peso, não de bola)
translateY.value = withSpring(0, {
  damping: 28,
  stiffness: 400,
  mass: 0.8,
});

// Close intencional (botão/tap no backdrop)
translateY.value = withTiming(SHEET_MAX_HEIGHT, {
  duration: 200,
  easing: Easing.in(Easing.cubic),
}, () => runOnJS(onClose)());

// Gesture pan — UI thread inteira
const panGesture = Gesture.Pan()
  .onUpdate((e) => {
    if (e.translationY > 0) {
      // Resistência progressiva: drag lento cria sensação de "peso"
      translateY.value = e.translationY * 0.85;
    }
  })
  .onEnd((e) => {
    if (e.translationY > SWIPE_THRESHOLD || e.velocityY > 800) {
      translateY.value = withTiming(SHEET_MAX_HEIGHT, {
        duration: 200,
        easing: Easing.in(Easing.cubic),
      }, () => runOnJS(onClose)());
    } else {
      // Snap back com spring
      translateY.value = withSpring(0, { damping: 28, stiffness: 400 });
    }
  });

// Backdrop opacity animado — aparece/some junto com o sheet
const backdropStyle = useAnimatedStyle(() => ({
  opacity: interpolate(
    translateY.value,
    [0, SHEET_MAX_HEIGHT],
    [1, 0],
    Extrapolation.CLAMP
  ),
}));
```

**Parâmetros open:** damping 28, stiffness 400, mass 0.8. Esses valores produzem um movimento que "assenta" sem bouncing mas ainda tem sensação orgânica — não é um timing linear frio.

**Parâmetros close:** 200ms, Easing.in(Easing.cubic) — aceleração até o fim, simula gravidade.

**Justificativa do spring no open:** O sheet carrega informação clínica. Ele deve "assentar" como um documento físico sendo colocado sobre a mesa — com peso, não como um popup de app de consumo. O spring com damping alto (28) evita bouncing mas mantém a sensação de física real. O timing linear seria tecnicamente correto mas emocionalmente frio demais.

**Justificativa do timing no close:** Close é uma ação intencional. O médico decidiu fechar. Timing é mais previsível e rápido — respeita a intenção.

**Dependência necessária:** `react-native-gesture-handler` (provavelmente já instalada com Expo). Verificar com `npx expo install react-native-gesture-handler`.

---

### 1.3 Chip Selecionado (toggle on/off)

**Contexto:** Achados ultrassonográficos sendo marcados/desmarcados. Cada tap é uma decisão clínica.

**Técnica:** withSpring em scale para press feedback + withTiming para mudança de estado visual (cor/borda).

```typescript
const scale = useSharedValue(1);
const borderOpacity = useSharedValue(selected ? 1 : 0);

// No componente Chip
function handlePressIn() {
  scale.value = withSpring(0.94, { damping: 20, stiffness: 400 });
}

function handlePressOut() {
  scale.value = withSpring(1, { damping: 18, stiffness: 350 });
}

// Quando selected muda
useEffect(() => {
  borderOpacity.value = withTiming(selected ? 1 : 0, { duration: 120 });
}, [selected]);

const chipStyle = useAnimatedStyle(() => ({
  transform: [{ scale: scale.value }],
  // Transição de borda: de borderDefault para branco
  borderColor: interpolateColor(
    borderOpacity.value,
    [0, 1],
    [Colors.borderDefault, Colors.textPrimary]
  ),
  backgroundColor: interpolateColor(
    borderOpacity.value,
    [0, 1],
    [Colors.bgInput, '#1A1A1A']
  ),
}));
```

**Parâmetros:** scale 0.94 (mais pronunciado que o card 0.97 — chip é menor, o scale precisa ser mais visível), damping 20, stiffness 400. Transição de cor 120ms.

**Justificativa:** 0.94 em chip pequeno equivale perceptualmente a 0.97 em card grande. O médico precisa de confirmação clara que tocou no elemento certo — em ambiente de UTI com luvas ou tela úmida, feedback visual é crítico.

---

### 1.4 Botão GERAR — Press + Loading State

**Contexto:** A ação mais importante do app. Dispara geração de laudo.

**Técnica:** Press com spring + loading com withRepeat + pulso de opacidade.

```typescript
const scale = useSharedValue(1);
const loadingOpacity = useSharedValue(1);

// Press feedback
function handlePressIn() {
  scale.value = withSpring(0.96, { damping: 22, stiffness: 380 });
}

function handlePressOut() {
  scale.value = withSpring(1, { damping: 20, stiffness: 350 });
}

// Loading state — pulso lento, não spinner (mais sóbrio)
useEffect(() => {
  if (isLoading) {
    loadingOpacity.value = withRepeat(
      withTiming(0.35, { duration: 700, easing: Easing.inOut(Easing.sine) }),
      -1, // infinito
      true // reverso
    );
  } else {
    cancelAnimation(loadingOpacity);
    loadingOpacity.value = withTiming(1, { duration: 150 });
  }
}, [isLoading]);

const buttonStyle = useAnimatedStyle(() => ({
  transform: [{ scale: scale.value }],
  opacity: loadingOpacity.value,
}));
```

**Texto do botão durante loading:**
```typescript
// Não usar spinner — usar texto que pulsa junto com o botão
// "GERANDO..." com os três pontos animados separadamente (ver seção 4)
```

**Justificativa:** Spinner remete a app de consumo. Pulso de opacidade é mais clínico — lembra um monitor cardíaco em standby. O médico entende que o sistema está processando sem precisar de um ícone rotacionando. Easing.inOut(Easing.sine) cria um pulso suave, não abrupto.

---

### 1.5 Linha da Janela — JanelaRow Tap Feedback

**Contexto:** Linhas clicáveis na tela do laudador que abrem o sheet.

**Técnica:** Highlight de fundo com withTiming rápido + fade out.

```typescript
const bgOpacity = useSharedValue(0);

function handlePressIn() {
  bgOpacity.value = withTiming(1, { duration: 60 });
}

function handlePressOut() {
  bgOpacity.value = withTiming(0, { duration: 200, easing: Easing.out(Easing.quad) });
}

const rowStyle = useAnimatedStyle(() => ({
  backgroundColor: `rgba(255, 255, 255, ${bgOpacity.value * 0.04})`,
  // 4% de branco — barely visible mas perceptível
}));
```

**Justificativa:** Linhas em apps terminais têm feedback de highlight, não de scale. Scale distorce o layout. O highlight sutil de 4% branco sobre fundo preto é exatamente como terminais e IDEs sinalizam hover/press — familiar para quem usa ferramentas técnicas.

---

### 1.6 Dropdown Expand/Collapse — LimitacoesDropdown

**Técnica:** Height animation com withSpring + rotação de ícone chevron.

```typescript
const chevronRotation = useSharedValue(0);
const contentHeight = useSharedValue(0); // medido no onLayout
const measuredHeight = useRef(0);

function toggle() {
  const isOpen = chevronRotation.value === 1;
  chevronRotation.value = withSpring(isOpen ? 0 : 1, {
    damping: 20,
    stiffness: 300,
  });
  contentHeight.value = withSpring(
    isOpen ? 0 : measuredHeight.current,
    { damping: 25, stiffness: 320 }
  );
}

const chevronStyle = useAnimatedStyle(() => ({
  transform: [{
    rotate: `${interpolate(chevronRotation.value, [0, 1], [0, 180])}deg`
  }],
}));

const contentStyle = useAnimatedStyle(() => ({
  height: contentHeight.value,
  overflow: 'hidden',
  opacity: interpolate(contentHeight.value, [0, 30], [0, 1], Extrapolation.CLAMP),
}));
```

**Parâmetros:** damping 25, stiffness 320 para height (mais amortecido — conteúdo tem peso visual). Chevron: damping 20, stiffness 300 (levemente mais leve que o conteúdo — sensação de que o ícone "lidera" a abertura).

**Justificativa:** O chevron deve girar um frame antes do conteúdo expandir — cria hierarquia de movimento. A técnica de medir altura com `onLayout` e animar para esse valor fixo é mais confiável que animar `maxHeight` (que causa jank em Android).

---

### 1.7 Resultado Gerado — Tela de Laudo Aparecendo

**Contexto:** O momento mais importante do fluxo. O laudo apareceu.

**Técnica:** Palavra por palavra é muito lento em contexto clínico. Linha por linha é ideal — médico lê laudo por seções.

```typescript
// Dividir o laudo em linhas ao receber
const linhas = laudo.split('\n').filter(Boolean);

// Cada linha anima com stagger curto
function AnimatedLinha({ texto, index }: { texto: string; index: number }) {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(-8); // slide sutil da esquerda — como texto digitado

  useEffect(() => {
    const delay = index * 40; // 40ms por linha — rápido o suficiente
    opacity.value = withDelay(delay, withTiming(1, { duration: 180 }));
    translateX.value = withDelay(
      delay,
      withTiming(0, { duration: 180, easing: Easing.out(Easing.cubic) })
    );
  }, []);

  return (
    <Animated.Text style={[styles.laudoLinha, { opacity, transform: [{ translateX }] }]}>
      {texto}
    </Animated.Text>
  );
}
```

**Parâmetros:** 40ms por linha, 180ms por fade. Para um laudo de 15 linhas: primeira linha em 0ms, última em 560ms — laudo completo em ~740ms. Rápido, mas com presença.

**Justificativa:** Slide da esquerda (translateX -8→0) remete a texto sendo "impresso" da esquerda para a direita — reforça o look de terminal. Não é um efeito de typewriter completo (muito lento para uso clínico) mas preserva a estética técnica.

---

### 1.8 Erro / Alert — Shake ou Pulse

**Técnica:** withSequence com shakes horizontais (shake é universalmente reconhecido como "erro").

```typescript
const shakeX = useSharedValue(0);

function triggerError() {
  shakeX.value = withSequence(
    withTiming(-6, { duration: 60 }),
    withTiming(6, { duration: 60 }),
    withTiming(-4, { duration: 50 }),
    withTiming(4, { duration: 50 }),
    withTiming(-2, { duration: 40 }),
    withTiming(0, { duration: 40 }),
  );
}

// Para erros de rede não-críticos — pulse de borda em vez de shake
const borderPulse = useSharedValue(0);

function triggerNetworkError() {
  borderPulse.value = withSequence(
    withTiming(1, { duration: 200 }),
    withTiming(0, { duration: 200 }),
    withTiming(0.6, { duration: 150 }),
    withTiming(0, { duration: 200 }),
  );
}

const errorBorderStyle = useAnimatedStyle(() => ({
  borderColor: interpolateColor(
    borderPulse.value,
    [0, 1],
    [Colors.borderDefault, '#FF4444']
  ),
}));
```

**Justificativa:** Shake em eixo X é o padrão neurológico para "errado" — senso de rejeição de movimento lateral. Amplitude decrescente (6→4→2→0) cria amortecimento natural. Para erros de rede (não-críticos), a pulsação de borda é menos agressiva que shake e não distrai o médico de outros elementos.

---

## 2. Animações com Linhas (Line Animations)

O app é todo monospace, dark, técnico. Linhas animadas são a linguagem visual natural desse sistema.

### 2.1 Underline Progressivo

**Uso:** Confirmar seleção de chip, validar campo preenchido.
**Implementação:** Não requer SVG — View com scaleX animado funciona perfeitamente.

```typescript
const underlineScale = useSharedValue(0);

// Ativar ao selecionar
useEffect(() => {
  underlineScale.value = withTiming(selected ? 1 : 0, {
    duration: 200,
    easing: selected
      ? Easing.out(Easing.cubic)  // cresce rápido
      : Easing.in(Easing.cubic),  // some rápido
  });
}, [selected]);

const underlineStyle = useAnimatedStyle(() => ({
  transform: [{ scaleX: underlineScale.value }],
  transformOrigin: 'left', // cresce da esquerda para direita
}));

// JSX
<View style={styles.chipContainer}>
  <Text style={styles.chipLabel}>{label}</Text>
  <Animated.View
    style={[
      {
        height: 1,
        backgroundColor: Colors.textPrimary,
        width: '100%',
      },
      underlineStyle,
    ]}
  />
</View>
```

**Nota técnica:** `transformOrigin` não é suportado nativamente em React Native. Para crescer da esquerda, usar `marginLeft` ou posicionar com `alignSelf: 'flex-start'` e animar a width diretamente via `useAnimatedStyle` com um valor de largura medido via `onLayout`. Alternativa mais simples: animar `scaleX` com `translateX` de compensação.

```typescript
// Solução que funciona sem transformOrigin
const underlineStyle = useAnimatedStyle(() => ({
  transform: [
    { scaleX: underlineScale.value },
    { translateX: interpolate(underlineScale.value, [0, 1], [-50, 0]) },
    // -50 = metade da largura do elemento (assumindo 100px)
    // Medir a largura real com onLayout e usar metade
  ],
}));
```

---

### 2.2 Separator Line Reveal

**Uso:** Separadores entre seções ao navegar/rolar.
**Implementação:** scaleX 0→1 com transformOrigin centro (ou translateX trick).

```typescript
// Para separadores de seção na tela de laudador
function AnimatedSeparator({ delay = 0 }: { delay?: number }) {
  const scaleX = useSharedValue(0);

  useEffect(() => {
    scaleX.value = withDelay(
      delay,
      withTiming(1, { duration: 400, easing: Easing.out(Easing.expo) })
    );
  }, []);

  const lineStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: scaleX.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          height: 0.5,
          backgroundColor: Colors.borderSubtle,
          width: '100%',
        },
        lineStyle,
      ]}
    />
  );
}
```

**Easing.out(Easing.expo):** Começa rápido e desacelera — linha "rasga" o espaço e freia. Muito mais elegante que linear para linhas horizontais.

---

### 2.3 Border Trace

**Uso:** Card focado/ativo na tela do laudador.
**Implementação:** Requer react-native-svg para traçar o contorno. Alternativa sem SVG: usar animação em borderColor + borderWidth.

**Com SVG (efeito completo):**
```typescript
import Svg, { Rect } from 'react-native-svg';
import Animated, { useAnimatedProps } from 'react-native-reanimated';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

function BorderTrace({ width, height, active }: BorderTraceProps) {
  const progress = useSharedValue(0);
  const perimeter = (width + height) * 2;

  useEffect(() => {
    progress.value = withTiming(active ? 1 : 0, {
      duration: 500,
      easing: Easing.out(Easing.cubic),
    });
  }, [active]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: perimeter * (1 - progress.value),
  }));

  return (
    <Svg
      width={width}
      height={height}
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
    >
      <AnimatedRect
        x={1}
        y={1}
        width={width - 2}
        height={height - 2}
        rx={4}
        fill="none"
        stroke={Colors.textPrimary}
        strokeWidth={0.5}
        strokeDasharray={perimeter}
        animatedProps={animatedProps}
      />
    </Svg>
  );
}
```

**Dependência necessária:** `react-native-svg` — `npx expo install react-native-svg`

**Alternativa sem SVG (80% do efeito, 0% de dependência nova):**
```typescript
const borderOpacity = useSharedValue(0);

const borderStyle = useAnimatedStyle(() => ({
  borderColor: `rgba(255,255,255,${borderOpacity.value})`,
  borderWidth: withTiming(active ? 0.5 : 1, { duration: 200 }),
}));
```

---

### 2.4 Typing Cursor

**Uso:** Campos de observação/texto livre — cursor piscante IBM.
**Implementação:** View simples com withRepeat de opacidade.

```typescript
function TypingCursor({ visible }: { visible: boolean }) {
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (visible) {
      opacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 0 }),
          withTiming(1, { duration: 530 }), // aceso por 530ms
          withTiming(0, { duration: 0 }),
          withTiming(0, { duration: 470 }), // apagado por 470ms
        ),
        -1,
        false
      );
    } else {
      cancelAnimation(opacity);
      opacity.value = 0;
    }
  }, [visible]);

  const cursorStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width: 2,
          height: 16,
          backgroundColor: Colors.textPrimary,
          marginLeft: 2,
        },
        cursorStyle,
      ]}
    />
  );
}
```

**530ms aceso / 470ms apagado:** Baseado no cursor padrão de terminais Unix (600ms total, 530/470 split). Diferente do 500/500 simétrico que parece "digital demais" — a assimetria sutil torna o cursor vivo.

---

## 3. Transições de Tela

### Configuração no _layout.tsx

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade', // default para todas as telas
        animationDuration: 200,
        contentStyle: { backgroundColor: '#000000' },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          animation: 'fade',
          animationDuration: 200,
        }}
      />
      <Stack.Screen
        name="laudador/[id]"
        options={{
          // home → laudador: slide da direita com fade
          // 'slide_from_right' é padrão no iOS
          // No Android, 'fade_from_bottom' é mais natural
          animation: 'slide_from_right',
          animationDuration: 250,
        }}
      />
      <Stack.Screen
        name="resultado/[id]"
        options={{
          // laudador → resultado: fade simples
          // Resultado é "revelação" — fade é mais dramático que slide
          animation: 'fade',
          animationDuration: 300,
        }}
      />
    </Stack>
  );
}
```

### Lógica de escolha por transição

| Transição | Animação | Duração | Justificativa |
|-----------|----------|---------|---------------|
| home → laudador | `slide_from_right` | 250ms | Navegação forward — usuário avança no fluxo |
| laudador → resultado | `fade` | 300ms | Resultado é revelação, não navegação linear |
| resultado → home (back) | `slide_from_left` (padrão back) | 220ms | Retorno — convenção universal |
| qualquer → modal | `slide_from_bottom` | 200ms | Modais sempre vêm de baixo |

### Animação customizada para laudador→resultado (via Shared Element)

Se quiser efeito de shared element (o botão GERAR "se transforma" na tela de resultado), Expo Router não suporta nativamente. A solução é uma animação manual na tela de resultado:

```typescript
// app/resultado/[id].tsx
// Ao montar, simular que a tela "emerge" do centro (onde estava o botão)
const scale = useSharedValue(0.92);
const opacity = useSharedValue(0);

useEffect(() => {
  opacity.value = withTiming(1, { duration: 250 });
  scale.value = withSpring(1, { damping: 22, stiffness: 300 });
}, []);
```

---

## 4. Micro-Interações de Precisão Médica

### 4.1 Chip Confirmed

**Momento:** Após toggle ON de um achado — confirmação de que foi registrado.

```typescript
// Flash de brilho breve — 1 frame de opacity alta, depois normaliza
const confirmFlash = useSharedValue(0);

function onChipConfirmed() {
  confirmFlash.value = withSequence(
    withTiming(1, { duration: 0 }),       // instantâneo
    withTiming(1, { duration: 80 }),      // sustenta 80ms
    withTiming(0, { duration: 150 }),     // fade out
  );
}

const flashStyle = useAnimatedStyle(() => ({
  // Overlay branco translúcido sobre o chip
  backgroundColor: `rgba(255,255,255,${confirmFlash.value * 0.15})`,
}));
```

**80ms sustentado:** Abaixo desse tempo, o olho humano não registra o flash de forma consciente. Acima de 120ms começa a parecer um blink de erro. 80ms é o sweet spot para feedback positivo.

---

### 4.2 Sheet Dismissed + Tag Aparece na Linha

**Momento:** Após fechar o sheet, a linha do laudador deve mostrar os achados selecionados com micro-animação.

```typescript
// A tag nova (achado adicionado) deve "materializar" com scale 0→1
function AnimatedTag({ label, delay = 0 }: AnimatedTagProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(
      delay, // stagger se múltiplas tags
      withSpring(1, { damping: 18, stiffness: 350 })
    );
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: 120 })
    );
  }, []);

  return (
    <Animated.View style={[styles.tag, { transform: [{ scale }], opacity }]}>
      <Text style={styles.tagLabel}>{label}</Text>
    </Animated.View>
  );
}
```

**Por que spring no scale da tag:** A tag "nasce" — ela aparece no mundo como um elemento novo. Spring dá essa sensação de energia inicial, diferente de withTiming que pareceria uma transição CSS genérica.

---

### 4.3 Laudo Gerado — Materialização

Coberto em detalhe na seção 1.7. O complemento aqui é o header do resultado:

```typescript
// O título "LAUDO GERADO" deve ter um efeito de typewriter discreto
// Não para todo o laudo — apenas para o título/header
function TypewriterTitle({ text }: { text: string }) {
  const [displayedChars, setDisplayedChars] = React.useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDisplayedChars(prev => {
        if (prev >= text.length) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 35); // 35ms por caractere — velocidade de terminal profissional

    return () => clearInterval(timer);
  }, [text]);

  return (
    <Text style={styles.laudoTitle}>
      {text.slice(0, displayedChars)}
      {displayedChars < text.length && <TypingCursor visible />}
    </Text>
  );
}
```

**35ms por caractere:** Para um título de 15 caracteres ("LAUDO GERADO:"), o efeito completa em 525ms — presente mas não tedioso.

---

### 4.4 Erro de Rede — Sem Modal Agressivo

```typescript
// Toast de baixo — aparece por 3s e some
// Estética: barra fina no bottom, não modal
function NetworkErrorToast({ visible, message }: ToastProps) {
  const translateY = useSharedValue(60); // começa abaixo da tela
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, { damping: 20, stiffness: 300 });
      opacity.value = withTiming(1, { duration: 150 });

      const timer = setTimeout(() => {
        translateY.value = withTiming(60, { duration: 200 });
        opacity.value = withTiming(0, { duration: 200 });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  return (
    <Animated.View
      style={[
        styles.toast,
        { transform: [{ translateY }], opacity },
      ]}
    >
      {/* Linha vermelha fina no topo do toast */}
      <View style={styles.toastErrorLine} />
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
}

// Styles sugeridos
const toastStyles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: Colors.bgElevated,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    padding: 12,
    overflow: 'hidden',
  },
  toastErrorLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#FF4444',
  },
  toastText: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 12,
    color: Colors.textSecondary,
    letterSpacing: 0.5,
  },
});
```

**Por que não modal:** Modal interrompe o fluxo clínico. O médico pode estar no meio de avaliar um achado. Toast de 3s informa sem bloquear. A linha vermelha no topo é visualmente inequívoca (erro) sem ser agressiva.

---

## 5. Timing System — Grammar of Motion

### 5.1 Tokens de Duração

```typescript
// Adicionar em src/constants/theme.ts
export const Duration = {
  instant:  0,    // Mudanças de estado sem transição (selected state de dados)
  flash:    80,   // Confirmações de toque, flash de feedback
  fast:     150,  // Micro-interações: chips, botões, highlights
  normal:   220,  // Transições de componente: sheet open, card enter
  slow:     350,  // Transições de tela, reveals de conteúdo
  dramatic: 500,  // Resultados, materialização de laudo, erros importantes
} as const;
```

### 5.2 Easing por Tipo

```typescript
export const Easings = {
  // Entrada de elementos — começa rápido, freia suavemente
  enter: Easing.out(Easing.cubic),

  // Saída de elementos — começa devagar, acelera (elemento "parte com intenção")
  exit: Easing.in(Easing.cubic),

  // Transições internas — curva simétrica
  inOut: Easing.inOut(Easing.quad),

  // Linhas e reveals — começa muito rápido, freia exponencialmente
  reveal: Easing.out(Easing.expo),

  // Pulsos e loops — senoidal, completamente suave
  pulse: Easing.inOut(Easing.sine),
} as const;
```

### 5.3 Regra de Ouro — Spring vs Timing

| Use `withSpring` quando... | Use `withTiming` quando... |
|---------------------------|---------------------------|
| O elemento tem "peso físico" (sheets, cards) | A transição é determinística (abrir→fechar) |
| O usuário iniciou via gesto (pan, drag) | O tempo importa (feedback de erro, loading) |
| Queremos sensação orgânica (tags nascendo) | A animação é de saída (elemento saindo) |
| Press feedback (scale em botões e chips) | Loops e repetições (cursor, pulso) |
| Snapping de posição após drag | Transições de cor/opacidade |

**Regra resumida:** Se o elemento "existe no mundo físico" e tem massa, use spring. Se é uma mudança de estado de UI (ligado/desligado, visível/invisível), use timing.

### 5.4 Parâmetros de Spring Padrão

```typescript
export const Springs = {
  // Responsivo — para press feedback, sem bounce
  snappy: { damping: 22, stiffness: 400, mass: 1 },

  // Natural — para elementos com peso (sheets, overlays)
  natural: { damping: 28, stiffness: 350, mass: 0.8 },

  // Suave — para tags nascendo, reveals menores
  gentle: { damping: 18, stiffness: 280, mass: 1 },
} as const;
```

---

## 6. Implementação Prioritizada — Top 5

Ordenado por **impacto percebido / esforço de implementação**.

---

### Prioridade 1 — JanelaSheet com Gesture Handler

**Impacto:** CRÍTICO. É o componente mais usado no app. O PanResponder atual roda na JS thread e causa jank visível.
**Esforço:** Médio (1-2h). Requer refatoração do componente mas a lógica é clara.
**Arquivo:** `src/components/laudador/JanelaSheet.tsx`

```typescript
// Substituir PanResponder por react-native-gesture-handler
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

// Dentro do componente
const panGesture = Gesture.Pan()
  .onUpdate((e) => {
    if (e.translationY > 0) {
      translateY.value = e.translationY * 0.85;
    }
  })
  .onEnd((e) => {
    if (e.translationY > SWIPE_THRESHOLD || e.velocityY > 800) {
      translateY.value = withTiming(SHEET_MAX_HEIGHT, {
        duration: 200,
        easing: Easing.in(Easing.cubic),
      }, () => runOnJS(onClose)());
    } else {
      translateY.value = withSpring(0, { damping: 28, stiffness: 400, mass: 0.8 });
    }
  });

// Substituir o {...panResponder.panHandlers} na Animated.View por:
// <GestureDetector gesture={panGesture}>
//   <Animated.View style={[styles.sheet, sheetStyle]}>
//     ...
//   </Animated.View>
// </GestureDetector>

// E adicionar backdrop animado que segue o sheet:
const backdropStyle = useAnimatedStyle(() => ({
  opacity: interpolate(
    translateY.value,
    [0, SHEET_MAX_HEIGHT],
    [1, 0],
    Extrapolation.CLAMP
  ),
}));
```

---

### Prioridade 2 — Tokens de Duração e Easing no theme.ts

**Impacto:** ALTO. Sem isso, cada animação futura vai ter valores hardcoded inconsistentes.
**Esforço:** Baixo (15 min). Adicionar `Duration`, `Easings`, e `Springs` ao arquivo de tema.
**Arquivo:** `src/constants/theme.ts`

```typescript
// Adicionar ao final de theme.ts
export const Duration = {
  instant:  0,
  flash:    80,
  fast:     150,
  normal:   220,
  slow:     350,
  dramatic: 500,
} as const;

export const Springs = {
  snappy:  { damping: 22, stiffness: 400, mass: 1 },
  natural: { damping: 28, stiffness: 350, mass: 0.8 },
  gentle:  { damping: 18, stiffness: 280, mass: 1 },
} as const;
```

---

### Prioridade 3 — Chip com Transição de Cor + Underline

**Impacto:** ALTO. Chips são usados dezenas de vezes por protocolo. Transição de cor ao selecionar é feedback crítico de estado.
**Esforço:** Médio (1h). Requer ver o componente `Chip` atual e adicionar `interpolateColor`.
**Arquivo:** `src/components/ui/Chip.tsx` (componente a ser lido/atualizado)

```typescript
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';

// O Chip recebe `selected` como prop
const progress = useSharedValue(selected ? 1 : 0);

useEffect(() => {
  progress.value = withTiming(selected ? 1 : 0, { duration: 120 });
}, [selected]);

const chipStyle = useAnimatedStyle(() => ({
  borderColor: interpolateColor(
    progress.value,
    [0, 1],
    [Colors.borderDefault, Colors.textPrimary]
  ),
  backgroundColor: interpolateColor(
    progress.value,
    [0, 1],
    [Colors.bgInput, '#181818']
  ),
}));

// Press scale
const scale = useSharedValue(1);
function handlePressIn() {
  scale.value = withSpring(0.94, { damping: 20, stiffness: 400 });
}
function handlePressOut() {
  scale.value = withSpring(1, { damping: 18, stiffness: 350 });
}
```

---

### Prioridade 4 — Resultado Laudo com Stagger por Linha

**Impacto:** ALTO. O momento mais importante do fluxo precisa ter presença.
**Esforço:** Baixo-Médio (45 min). Adicionar componente `AnimatedLaudoContent`.
**Arquivo:** Tela de resultado (a identificar) ou novo componente em `src/components/resultado/`

```typescript
function AnimatedLaudoContent({ laudo }: { laudo: string }) {
  const linhas = laudo.split('\n').filter(Boolean);

  return (
    <View>
      {linhas.map((linha, index) => (
        <AnimatedLinha key={index} texto={linha} index={index} />
      ))}
    </View>
  );
}

function AnimatedLinha({ texto, index }: { texto: string; index: number }) {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(-8);

  useEffect(() => {
    const delay = index * 40;
    opacity.value = withDelay(delay, withTiming(1, { duration: 180 }));
    translateX.value = withDelay(
      delay,
      withTiming(0, { duration: 180, easing: Easing.out(Easing.cubic) })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.Text style={[styles.laudoLinha, animatedStyle]}>
      {texto}
    </Animated.Text>
  );
}
```

---

### Prioridade 5 — Botão GERAR com Loading Pulse

**Impacto:** MÉDIO-ALTO. Feedback de loading sem spinner melhora muito a percepção de qualidade.
**Esforço:** Baixo (30 min). O botão já existe, apenas adicionar o estado de loading.
**Arquivo:** Componente do botão GERAR (a identificar em `src/components/laudador/`)

```typescript
import { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';

function BotaoGerar({ onPress, isLoading }: BotaoGerarProps) {
  const scale = useSharedValue(1);
  const pulseOpacity = useSharedValue(1);

  useEffect(() => {
    if (isLoading) {
      pulseOpacity.value = withRepeat(
        withTiming(0.35, {
          duration: 700,
          easing: Easing.inOut(Easing.sine),
        }),
        -1,
        true
      );
    } else {
      cancelAnimation(pulseOpacity);
      pulseOpacity.value = withTiming(1, { duration: 150 });
    }
  }, [isLoading]);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: pulseOpacity.value,
  }));

  return (
    <Pressable
      onPressIn={() => {
        scale.value = withSpring(0.96, { damping: 22, stiffness: 380 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 20, stiffness: 350 });
      }}
      onPress={onPress}
      disabled={isLoading}
    >
      <Animated.View style={[styles.botao, buttonStyle]}>
        <Text style={styles.botaoLabel}>
          {isLoading ? 'GERANDO...' : 'GERAR LAUDO'}
        </Text>
      </Animated.View>
    </Pressable>
  );
}
```

---

## Dependências Necessárias

| Dependência | Necessária Para | Status |
|------------|----------------|--------|
| `react-native-gesture-handler` | JanelaSheet pan gesture (Prioridade 1) | Provavelmente já instalada com Expo |
| `react-native-svg` | Border trace completo (seção 2.3) | Opcional — alternativa sem SVG funciona |

Verificar instalação:
```bash
npx expo install react-native-gesture-handler react-native-svg
```

---

## Princípios de Design de Movimento para PlantaoUSG

1. **Clareza sobre estilo.** Animações confirmam ações, não decoram interfaces. Cada frame deve ter propósito clínico.

2. **Peso e gravidade.** Elementos com conteúdo (sheets, cards) têm massa. Usam spring. Elementos de estado (cor de chip, opacity) são digitais. Usam timing.

3. **Velocidade como respeito.** 200ms é o máximo para qualquer micro-interação. O médico não pode esperar. Transições lentas são um insulto ao contexto de urgência.

4. **Feedback inequívoco.** Em ambiente de UTI, touch pode falhar (luvas, tela molhada). Cada ação confirmada deve ter resposta visual óbvia — não sutil.

5. **Estética de terminal.** Slides horizontais, underlines progressivos, cursores piscantes, reveals por linha — não bounces exagerados, gradientes coloridos ou rotações. O sistema deve se mover como software de missão crítica, não como um app de lifestyle.
