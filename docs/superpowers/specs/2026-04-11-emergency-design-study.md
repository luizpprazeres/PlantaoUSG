# Emergency Design Study — PlantaoUSG
**Data:** 2026-04-11
**Escopo:** Estética de medicina de emergência / UTI para app POCUS dark

---

## Contexto: Estado Atual

O app opera sobre uma base sólida de design terminal médico:
- **Fundo:** `#000000` (bgPrimary) / `#0A0A0A` (bgElevated)
- **Bordas:** `#1F1F1F` (subtle) / `#2E2E2E` (default) / `#2A2A2A` (card)
- **Texto:** `#FFFFFF` (primary) / `#A3A3A3` (secondary) / `#525252` (muted)
- **Accent:** `#FFFFFF` (branco puro — botão GERAR usa fundo branco com texto preto)
- **Tipografia:** IBM Plex Mono em 4 pesos (400, 500, 600, 700)
- **Reanimated:** v4 já em uso (shared values, animated styles, spring, timing, delay)

O app já tem linguagem de terminal técnico (letterSpacing elevado, casing em maiúsculas, micro-texto). A base está pronta para receber elementos visuais de emergência sem refatoração estrutural.

---

## Seção 1 — Elementos em Vermelho: Onde e Como Usar

### Tom recomendado: `#C62828` como primário

Análise dos candidatos:

| Cor | Resultado em fundo #000000 | Avaliação |
|-----|---------------------------|-----------|
| `#FF3333` | Alto brilho, satura a tela | Muito agressivo — remete a erro de sistema |
| `#DC2626` | Boa legibilidade, energia sem ansiedade | Candidato forte |
| `#CC2020` | Ligeiramente mais sóbrio | Funciona mas perde punch |
| `#B91C1C` | Vermelho escuro, baixa legibilidade | Perde contraste com bordas dark |
| `#C62828` | Ponto ótimo: intensidade sem saturação excessiva | **RECOMENDADO primário** |
| `#7F1D1D` | Vermelho muted / quase bordô | Uso como background sutil (ex: fundo de badge alterado) |

**Dois tokens de vermelho sugeridos:**

```typescript
// Em src/constants/theme.ts
emergencyRed: '#C62828',      // Elementos de ação crítica e identidade
alertRedSubtle: '#7F1D1D',    // Background de indicadores "alterado"
alertRedBorder: '#3D0000',    // Bordas de cards com achado alterado
```

### Onde USAR vermelho

**1. Botão GERAR (alto impacto, baixa interferência clínica)**
O botão atualmente usa `Colors.accent` (`#FFFFFF`) como background. Trocar para `#C62828` com texto branco transforma o elemento de call-to-action mais importante do app. O branco era neutro; o vermelho comunica: "este é o momento de agir".

```typescript
// app/laudador/[protocolo].tsx
gerarBtn: {
  backgroundColor: Colors.emergencyRed,  // era Colors.accent (#FFFFFF)
  // ... resto igual
},
gerarText: {
  color: '#FFFFFF',                       // era Colors.bgPrimary (#000000)
}
```

**2. Linha decorativa no header da HomeScreen**
Um traço fino vermelho (`height: 1, backgroundColor: '#C62828'`) abaixo do título "Plantão USG" em substituição ao `borderBottomColor: '#0F0F0F'` atual. Cria âncora visual sem poluir.

**3. Indicador de janela com achados selecionados (JanelaBlock)**
O estado `temSelecionados` já muda `color` do texto para `Colors.textPrimary`. Poderia ganhar também um indicador vermelho — um ponto `●` de 6px à esquerda do nome ou uma borda esquerda de 2px em `#C62828`. Comunica "achado ativo" sem gerar urgência excessiva.

```typescript
// Em JanelaBlock: adicionar à esquerda quando temSelecionados
<View style={[styles.activeIndicator, temSelecionados && styles.activeIndicatorOn]} />

activeIndicator: {
  width: 2,
  alignSelf: 'stretch',
  backgroundColor: 'transparent',
  marginRight: 8,
},
activeIndicatorOn: {
  backgroundColor: Colors.emergencyRed,
},
```

**4. Chip selecionado no laudador (achados ativos)**
Atualmente o chip selecionado usa `Colors.accent` (`#FFFFFF`) como fundo — mesmo token do botão GERAR. Isso nivela hierarquia entre "selecionei um achado" e "gerei o laudo". Proposta:
- Chip selecionado: `backgroundColor: '#1A0000', borderColor: '#C62828'` — fundo quase preto com borda vermelha e texto branco. Leve, hierarquicamente distinto do botão.

**5. Estado "listening" do VoiceButton**
Quando em gravação, o botão de voz poderia usar `#C62828` no anel pulsante — diferenciando estado ativo de modo ainda mais claro.

### Onde NAO usar vermelho

| Local | Motivo |
|-------|--------|
| Mensagens de erro de sistema (Alert, toast) | Vermelho já é lido como "erro do app" — colisão semântica com "vermelho de emergência médica" |
| Texto de indicações nos ProtocoloCards | Texto corrido em vermelho reduz legibilidade, especialmente em tamanho 10px |
| Cards de protocolos "em breve" (disabled) | Estado de inatividade nunca deve usar cor de alta energia |
| Fundo de telas inteiras | Overflow de vermelho em área grande gera ansiedade real e fadiga visual |
| Subtítulos e labels secundários | Reservar para elementos interativos ou estados — não informação estática |
| Ícone de voltar (ArrowLeft) | Seta de navegação em vermelho pode ser lida como "perigo/cancelar" |

---

## Seção 2 — Animações Ambientais

Critério de avaliação: zero interferência com fluxo clínico, impacto mínimo de performance, compatível com Reanimated v4 já instalado.

### Opção A — ECG Flatline Decorativo (HomeScreen, header)

**Descrição visual:** Uma linha horizontal fina (1px, cor `#1A0000` / `#2A0000`) no header, com um único "spike" de ECG que percorre a largura da tela da esquerda para a direita em loop. A amplitude do spike é baixa (8-10px acima/abaixo da linha base) para ser legível sem distrair. Velocidade: uma varredura completa a cada 4-6 segundos.

**Onde fica:** Dentro do `<View style={styles.header}>` na HomeScreen, posicionado absolutamente na borda inferior do header, substituindo ou coexistindo com o `borderBottomColor`.

**Implementação com Reanimated v4:**
```typescript
// Componente EcgLine.tsx
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';

// O "cursor" — posição X do spike
const cursorX = useSharedValue(-20);

useEffect(() => {
  cursorX.value = withRepeat(
    withTiming(screenWidth + 20, { duration: 5000, easing: Easing.linear }),
    -1,  // infinito
    false
  );
}, []);

// Renderizar com SVG (react-native-svg) — um Path que desenha
// a forma de QRS simples: linha plana → pequeno spike triangular → linha plana
// O Path é estático; um clipping mask ou translateX animado move a "frente de onda"
```

**Alternativa mais simples sem SVG:**
Apenas uma `View` de 2px de altura que faz `opacity` pulsar de `0.15` a `0.4` e de volta, simulando o brilho de uma linha de monitor.

**Complexidade:** Média. Requer react-native-svg para fidelidade ao ECG. A alternativa pulsante é Baixa.

**Impacto de performance:** Baixo — `useNativeDriver` implícito no Reanimated v4. Um único `withRepeat` no thread UI.

---

### Opção B — Pulse Ring no Header (HomeScreen)

**Descrição visual:** Três anéis concêntricos que expandem e desvanecem a partir do centro do logotipo/título "Plantão USG", como o pulso de um sonar ou monitor de sinais vitais. Cor: `#C62828` com opacity máxima de 0.08-0.12 — quase invisível, sentido mais do que visto. Ciclo: um novo anel a cada 2 segundos, duração de expansão de 3 segundos.

**Onde fica:** Posicionado absolutamente atrás do texto de título, `zIndex: -1`. Radius do anel cresce de 20px a 80px conforme opacity vai a 0.

**Implementação com Reanimated v4:**
```typescript
// Componente PulseRing.tsx — um único anel (replicar x3 com delay)
const scale = useSharedValue(0.3);
const opacity = useSharedValue(0.12);

useEffect(() => {
  scale.value = withRepeat(withTiming(1, { duration: 3000 }), -1, false);
  opacity.value = withRepeat(withTiming(0, { duration: 3000 }), -1, false);
}, []);

const style = useAnimatedStyle(() => ({
  transform: [{ scale: scale.value }],
  opacity: opacity.value,
}));

// View com borderRadius = metade da largura = círculo
// position: 'absolute', centered
```

Para 3 anéis: 3 instâncias com `withDelay(index * 1000, ...)`.

**Complexidade:** Baixa-Média. Todo Reanimated puro, sem dependências externas.

**Impacto de performance:** Muito baixo. Três animated values em loop, sem JS thread.

---

### Opção C — Scan Line Sutil no LaudadorScreen

**Descrição visual:** Uma linha horizontal translúcida (altura 1px, largura 100%, cor `rgba(198, 40, 40, 0.06)`) que percorre verticalmente a tela de cima a baixo em loop lento (8-12 segundos por varredura), como o feixe de leitura de um scanner ou o rastro de linha de um osciloscópio. Quase imperceptível — reforça a sensação de "sistema ativo processando".

**Onde fica:** `position: 'absolute'` dentro do `<SafeAreaView>` do LaudadorScreen, cobrindo toda a área de scroll. `pointerEvents="none"` obrigatório.

**Implementação com Reanimated v4:**
```typescript
// Componente ScanLine.tsx
const translateY = useSharedValue(-2);

useEffect(() => {
  translateY.value = withRepeat(
    withTiming(screenHeight, { duration: 10000, easing: Easing.linear }),
    -1,
    false
  );
}, []);

const style = useAnimatedStyle(() => ({
  transform: [{ translateY: translateY.value }],
}));

// <Animated.View
//   style={[{ position: 'absolute', width: '100%', height: 1,
//              backgroundColor: 'rgba(198,40,40,0.05)' }, style]}
//   pointerEvents="none"
// />
```

**Complexidade:** Baixa. O mais simples dos três.

**Impacto de performance:** Mínimo. Uma única animated value, linear, infinita.

**Nota crítica:** A opacity deve ser testada em dispositivo físico. Em tela OLED (comum em Android) `rgba(198,40,40,0.05)` pode ser invisível — ajustar para `0.08`. Em LCD pode aparecer mais evidente — ajustar para `0.04`.

---

### Ranking de recomendação

| Opção | Impacto visual | Complexidade | Risco de distração | Recomendação |
|-------|---------------|--------------|-------------------|--------------|
| B — Pulse Ring | Médio, elegante | Baixa | Muito baixo | **Implementar primeiro** |
| C — Scan Line | Baixo, subliminar | Baixíssima | Nulo | **Implementar junto** |
| A — ECG Line | Alto, icônico | Média (SVG) | Baixo-Médio | Deixar para sprint seguinte |

---

## Seção 3 — Tipografia e Elementos Decorativos

IBM Plex Mono já entrega 80% da identidade de terminal técnico. As propostas abaixo exploram padrões que monitores reais de UTI (Philips IntelliVue, GE Carescape) usam em suas interfaces.

### 3.1 Separadores e delimitadores de seção

Monitores de UTI usam linhas com rótulos embutidos para separar canais de sinal. No app:

```
─── ACHADOS PLEURAIS ─────────────────
```

Implementação: o `divisor` atual em `ProtocoloCard` (20px, 0.5px, `#2A2A2A`) pode se tornar um separador com texto embutido nas seções do laudador:

```typescript
// SectionDivider.tsx — substituindo texto de label simples
<View style={styles.dividerRow}>
  <View style={styles.line} />
  <Text style={styles.label}>{title}</Text>
  <View style={styles.line} />
</View>
```

### 3.2 Indicadores de status estilo terminal

Padrão de monitores críticos — indicador de estado com símbolo Unicode:

| Símbolo | Uso proposto | Cor |
|---------|-------------|-----|
| `●` (U+25CF) | Janela com achados ativos | `#C62828` |
| `○` (U+25CB) | Janela sem achados | `#2E2E2E` |
| `▶` (U+25B6) | Protocolo disponível no card | `#525252` |
| `■` (U+25A0) | Estado "gravando" no VoiceButton | `#C62828` pulsante |
| `—` (U+2014) | Separador em labels | `#2E2E2E` |

Exemplo para o header do JanelaBlock:
```typescript
<Text style={styles.nome}>
  {temSelecionados ? '● ' : '○ '}{janela.nome}
</Text>
```

### 3.3 Prefixos de código médico

O app pode adotar notação de código para as categorias dos ProtocoloCards. Monitores de UTI usam abreviações de 2-3 letras para canais. Proposta para a propriedade `categoria`:

```
[eFAST]  →  "USG·eFAST"
CARDÍACO →  "USG·CARD"
CHOQUE   →  "USG·RUSH"
```

O `·` (U+00B7, middle dot) é visualmente mais limpo do que `/` e menos agressivo que `-`.

### 3.4 Footer de status decorativo

No rodapé da tela do laudador (acima do bottomBar), um micro-texto decorativo de status:

```
SYS:READY  |  PROTO:eFAST  |  JANELAS:6  |  ACHADOS:03
```

Fonte: IBMPlexMono_400Regular, 8px, cor `#1F1F1F` (quase invisível — decorativo puro). Não comunica informação crítica, apenas ambientação de terminal ativo. Pode usar um `useLaudadorStore` selector para os valores reais.

### 3.5 Horário de terminal no header

Monitores de UTI sempre exibem o horário. No header da HomeScreen, à direita do nav:

```typescript
// Relógio simples em tempo real
const [time, setTime] = useState('');
useEffect(() => {
  const tick = () => setTime(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  tick();
  const id = setInterval(tick, 1000);
  return () => clearInterval(id);
}, []);
```

Renderizado como micro-texto `#2E2E2E`, letra 9px, alinhado à direita no nav.

---

## Seção 4 — Paleta Estendida

### 4.1 Proposta completa de extensão do theme.ts

```typescript
export const Colors = {
  // --- BASE (mantidos) ---
  bgPrimary: '#000000',
  bgElevated: '#0A0A0A',
  bgInput: '#141414',
  borderSubtle: '#1F1F1F',
  borderDefault: '#2E2E2E',
  textPrimary: '#FFFFFF',
  textSecondary: '#A3A3A3',
  textMuted: '#525252',
  accent: '#FFFFFF',            // manter para outros usos futuros

  // --- EMERGENCY (novos) ---
  emergencyRed: '#C62828',      // Botão GERAR, indicadores ativos, pulse ring
  emergencyRedSubtle: '#7F1D1D', // Background de chips/badges com achado alterado
  emergencyRedBorder: '#3D0000', // Borda de card com achado ativo (sutil)
  emergencyRedDim: '#1A0000',   // Background de chip selecionado no laudador

  // --- STATUS (opcionais, para evolução futura) ---
  statusAmber: '#D97706',       // Limitação técnica selecionada, avisos leves
  statusAmberDim: '#1C1200',    // Background de limitação ativa
  statusGreen: '#16A34A',       // Laudo gerado com sucesso (tela de resultado)
  statusGreenDim: '#002010',    // Background de resultado positivo
} as const;
```

### 4.2 Justificativa das escolhas de status

**Por que `#D97706` (amber) para limitações técnicas?**
Limitações técnicas (ex: "janela acústica prejudicada") são avisos que impactam a confiança do laudo — não são erros nem urgências. Amber é a linguagem universal de "atenção, mas não crítico" em monitores de UTI (alarmes de nível 2 são amarelos; alarmes de nível 1 são vermelhos).

**Por que `#16A34A` (verde) apenas na tela de resultado?**
Verde deve aparecer uma única vez: quando o laudo foi gerado com sucesso. É a recompensa visual do fluxo. Usá-lo em outros pontos dilui o significado e adiciona cor que compete com o vermelho de emergência.

**Por que não usar gradientes red-to-black no fundo?**
Fundos com gradiente vermelho simulam estados de alarme global nos monitores de UTI. O médico em plantão está condicionado a associar fundo vermelho com situação crítica do paciente, não com interface de app. Risco de resposta autonômica desnecessária.

### 4.3 Mapa de uso por tela

| Tela | Uso dos novos tokens |
|------|---------------------|
| HomeScreen | `emergencyRed` na borda inferior do header, pulse ring decorativo |
| LaudadorScreen/header | Sem vermelho (contexto de coleta de dados — neutro) |
| LaudadorScreen/JanelaBlock | `emergencyRed` no indicador `●` quando tem achados |
| LaudadorScreen/Chip (selecionado) | `emergencyRedDim` bg + `emergencyRedBorder` borda |
| LaudadorScreen/bottomBar | `emergencyRed` no botão GERAR |
| LaudadorScreen/VoiceButton (listening) | `emergencyRed` no anel pulsante |
| ResultadoScreen | `statusGreen` para indicador de laudo gerado |
| Histórico | `statusAmber` opcional para laudos com limitações registradas |

---

## Seção 5 — Recomendação Final

### 5.1 Implementar primeiro (alto impacto, baixa complexidade)

**A. Trocar o botão GERAR para vermelho**
- Arquivo: `app/laudador/[protocolo].tsx`
- Mudança: `backgroundColor: Colors.emergencyRed`, `color: '#FFFFFF'`
- Impacto: Transforma o CTA principal. Hierarquia visual imediata.
- Risco: Zero. Nenhuma lógica alterada.
- Tempo estimado: 5 minutos.

**B. Adicionar `emergencyRed` e tokens de status ao theme.ts**
- Arquivo: `src/constants/theme.ts`
- Mudança: Extensão do objeto Colors com os novos tokens.
- Impacto: Habilita todo o resto sem duplicar hex codes.
- Risco: Zero.
- Tempo estimado: 10 minutos.

**C. Borda inferior vermelha no header da HomeScreen**
- Arquivo: `app/index.tsx`
- Mudança: `borderBottomColor: Colors.emergencyRed` (ou `Colors.emergencyRedBorder`) no `styles.header`.
- Impacto: Âncora visual na identidade da tela principal.
- Risco: Baixo — testar se não parece erro de UI.
- Tempo estimado: 5 minutos.

**D. Indicador `●` no JanelaBlock quando há achados**
- Arquivo: `src/components/laudador/JanelaBlock.tsx`
- Mudança: Prefixar o nome com `'● '` quando `temSelecionados`, em `Colors.emergencyRed`.
- Impacto: Legibilidade de estado melhorada sem nova estrutura.
- Risco: Muito baixo.
- Tempo estimado: 10 minutos.

**E. Chip selecionado com fundo escuro + borda vermelha**
- Arquivo: `src/components/ui/Chip.tsx`
- Mudança: `chipSelected: { backgroundColor: Colors.emergencyRedDim, borderWidth: 1, borderColor: Colors.emergencyRed }`, texto branco mantido.
- Impacto: Diferencia hierarquia entre "achado selecionado" e "botão GERAR".
- Risco: Baixo — verificar contraste em ambientes de UTI (luz intensa).
- Tempo estimado: 10 minutos.

**F. Animação Pulse Ring + Scan Line**
- Novos componentes: `src/components/ui/PulseRing.tsx` e `src/components/ui/ScanLine.tsx`
- Inserir `<PulseRing />` absolutamente no header da HomeScreen, `<ScanLine />` no LaudadorScreen.
- Impacto: Ambientação de monitor ativo sem custo de performance.
- Risco: Baixo — `pointerEvents="none"` obrigatório no ScanLine.
- Tempo estimado: 45-60 minutos (ambos).

---

### 5.2 Deixar para depois (interessante mas requer mais atenção)

**ECG Line animado no header**
Requer react-native-svg, cálculo de path de QRS, sincronização de clipping mask com cursor animado. Visual impactante, mas a complexidade é 3-4x maior que as outras animações. Vale um spike dedicado quando a identidade visual dos elementos simples já estiver validada com usuários.

**Horário em tempo real no nav**
`setInterval` a cada segundo no componente de navegação principal é um custo de re-render permanente. Implementar apenas se houver demand real de usuários (médicos gostam do relógio de monitor, mas no mobile o horário do sistema já está visível na status bar).

**Footer de status decorativo no laudador**
O micro-texto `SYS:READY | PROTO:eFAST | JANELAS:6 | ACHADOS:03` é elegante, mas requer um selector do store e pode parecer "noise" dependendo do feedback dos médicos. Testar em protótipo de alta fidelidade antes de implementar.

**Separador com texto embutido (SectionDivider)**
Substitui o pattern atual de label simples. Vale implementar, mas requer criar um componente novo e substituir os usos de `sectionLabel` estilo no laudador e histórico. Médio impacto, média complexidade.

---

### 5.3 NAO fazer (risco para usabilidade clínica)

**Gradiente vermelho em fundo de tela inteira**
Risco: Associação condicionada com alarme global. Em UTI, fundo vermelho = código aberto. Médicos podem ter resposta autonômica de urgência ao abrir o app.

**Vermelho em mensagens de erro de sistema (Alert)**
Risco: Colisão semântica entre "vermelho de emergência médica" (positivo — estou no modo plantão) e "vermelho de erro de app" (negativo — algo falhou). Manter erros em neutro (branco ou `textPrimary`).

**Animações em looping rápido (< 2 segundos) ou com movimento brusco**
Risco: Em ambiente de UTI, qualquer movimento rápido na periferia do campo visual pode ativar reflexo de atenção do médico, desviando o foco de procedimentos em curso. Todas as animações ambientais devem ter duração >= 3 segundos por ciclo.

**Vermelho em texto de achados ou indicações clínicas**
Risco: Texto vermelho em contexto médico já tem significado estabelecido (valor crítico, alerta laboratorial). Usar vermelho decorativo em texto informativo cria ambiguidade clínica — o médico pode ler como "este achado é crítico" mesmo que não seja.

**Substituir IBM Plex Mono por fonte diferente para elementos decorativos**
O app tem identidade tipográfica coesa e a fonte já carrega o peso semântico de "terminal técnico". Introduzir uma segunda família (mesmo que médica/clínica) fragmenta a coerência visual. Se houver necessidade de diferenciar hierarquia, usar pesos e letter-spacing, não fontes diferentes.

**Ícones de monitor de ECG/desfibrilador como decoração**
Risco: Ícones de equipamentos médicos reconhecíveis (forma de onda de ECG estilizada, símbolo de desfibrilador) têm significado operacional para intensivistas. Usá-los como decoração interface pode criar confusion sobre a função do elemento.

---

## Apêndice: Referências Visuais de Contexto

Para alinhamento com a equipe de design, as seguintes referências documentam a estética de monitores de UTI:

- **Philips IntelliVue MX800:** Interface dark com curvas de sinal em verde/amarelo/ciano sobre fundo quase preto; labels em branco com letra monospace; separadores horizontais finos; hierarquia por tamanho de texto, não por cor.
- **GE Carescape B650:** Fundo preto total; cada canal de sinal tem cor própria (verde=SpO2, amarelo=ECG, azul=pressão); texto numérico grande para valores vitais; micro-labels em cinza.
- **Padrão comum:** Nenhum monitor de UTI comercial usa vermelho como cor de interface padrão — vermelho é reservado para alarmes ativos. Esta é a razão pela qual o uso de vermelho deve ser cirúrgico: apenas em elementos de ação (GERAR) e indicadores de estado ativo, nunca como cor de fundo ou texto informativo contínuo.

O PlantaoUSG pode se apropriar da estética destes monitores (fundo escuro, tipografia monospace, micro-textos técnicos, linhas finas de separação) sem replicar sua paleta funcional de cores de alarme — criando uma identidade de "terminal médico de nova geração" ao invés de uma simulação de monitor de UTI.
