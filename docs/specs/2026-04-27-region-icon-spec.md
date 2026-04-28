# Spec — Ícone Minimalista de Região Avaliada

> **Status:** PARKING LOT — não implementar até priorização explícita do Luiz Paulo.
> **Origem:** ideação durante validação clínica do L1 BLUE em 2026-04-27.
> **Owner:** Luiz Paulo

## Objetivo

Adicionar uma representação visual minimalista, no estilo Nostromo, da região anatômica avaliada em cada protocolo POCUS. As áreas com **achados patológicos** devem ficar destacadas de forma sutil. As áreas **normais** ficam apenas delineadas. Sem cores extras — preto/branco/cinza, mantendo identidade visual.

## Onde aparece

Hipóteses (a definir na implementação):
1. **Tela do Laudador (`app/laudador/[protocolo].tsx`)** — header acima da lista de janelas, refletindo em tempo real o estado do `laudadorStore`.
2. **Tela de Resultado (`app/resultado.tsx`)** — preview compacto acima do laudo, mostrando o "mapa" final dos achados.
3. **Histórico (`app/historico.tsx`)** — thumbnail por laudo, ajudando o médico a reconhecer visualmente o exame.

Recomendação: começar **só pelo Laudador**. Avaliar utilidade antes de propagar.

## Princípios visuais (Nostromo)

- **Apenas preto, branco e tons de cinza** — nada de vermelho/verde/amarelo. Diferenciação por preenchimento e peso.
- **SVG vetorial** via `react-native-svg`. **Não usar imagens raster.**
- **Estado normal:** delineado em `Colors.borderDefault` (`#2E2E2E`), preenchimento `Colors.bgElevated` (`#0A0A0A`).
- **Estado alterado:** preenchimento `Colors.textSecondary` (`#A3A3A3`) com borda `Colors.textPrimary` (`#FFFFFF`).
- **Estado em foco/avaliando:** borda mais grossa em `Colors.accent` (`#FFFFFF`).
- **Sem `Signal.danger`** (vermelho) — reservado para alerta crítico de UI, não para marcação anatômica.

## Mapa por protocolo

### BLUE / POCUS Pulmonar
SVG do tronco visto de frente, dividido em **6 zonas tocáveis**:
- R1 (D ântero-superior), R2 (D ântero-inferior/lateral), R3 (D póstero-basal)
- L1, L2, L3 (espelho à esquerda)

Cada zona é um `<Path>` clicável com props sincronizadas ao `laudadorStore`:
```ts
type ZonaIconState = 'vazia' | 'normal' | 'alterada' | 'avaliando';
```

### eFAST
SVG do tronco com **6 marcadores** sobrepostos:
- QSD (Morrison), QSE (esplenorrenal), Suprapúbico, Subxifoide, Pleural D, Pleural E

### Cardíaco
SVG estilizado de tórax + coração, **4 janelas** clássicas como pontos tocáveis:
- Paraesternal eixo longo, paraesternal eixo curto, apical 4C, subcostal

### RUSH (choque indiferenciado)
SVG composto: tórax (cardíaco + pulmonar) + abdome (aorta + VCI). **3 grupos**: Pump / Tank / Pipes.

### VExUS
SVG de tronco mostrando: VCI, veia hepática, veia porta, veia interlobar renal. **4 pontos**.

### Obstétrico
SVG de abdome gravídico com saco gestacional e marcadores de medições (CCN, DMSG, ILA por quadrantes).

## Arquitetura sugerida

```
src/components/ui/RegionIcon/
├── tipos.ts                    # ZonaIconState, RegionIconProps
├── RegionIcon.tsx              # componente principal: recebe protocoloId + estado, escolhe SVG
├── svgs/
│   ├── BlueSvg.tsx             # 6 zonas tocáveis
│   ├── EfastSvg.tsx            # 6 marcadores
│   ├── CardiacSvg.tsx          # 4 janelas
│   ├── RushSvg.tsx             # 3 grupos
│   ├── VexusSvg.tsx            # 4 pontos
│   └── ObstetricoSvg.tsx       # marcadores de medições
└── hooks/
    └── useRegionStateFromStore.ts  # mapeia laudadorStore → ZonaIconState[]
```

**Fonte de estado:** `useLaudadorStore` (já existente). O ícone só **lê** e **renderiza**; toggles de seleção continuam acontecendo nos chips/janelas existentes (não duplicar inputs).

## Interações

- **Tap em zona do ícone:** rola a página até a janela correspondente (`scrollTo`). **NÃO** abre/fecha janela direto — manter ícone como navegação visual, não como controle primário.
- **Long press em zona:** opcional, mostra tooltip com nome completo (ex: "Hemitórax Direito — Ântero-superior (R1)").
- **Sem haptic** no ícone (reservar haptic para chips e VoiceButton, que são as ações primárias).

## Acessibilidade

- `accessibilityRole="button"` em cada `<Path>` tocável.
- `accessibilityLabel` com nome completo da zona + estado atual ("R1, alterado, contém 2 achados").
- Tamanho mínimo da área tocável: **44×44pt** (Apple HIG). Para zonas pequenas, usar `hitSlop`.

## Risco / trade-off

- **Curva de produção:** 6 SVGs anatomicamente corretos exigem trabalho de ilustração. Estimativa: 4-6h por protocolo.
- **Manutenção:** se um protocolo ganhar nova janela (ex: BLUE → 8 zonas), o SVG precisa ser refeito.
- **Risco de "decoração":** se o ícone não acrescentar utilidade clínica real, vira ruído visual. **Validar com o Luiz Paulo** após o protótipo do BLUE — se ele não usar nos primeiros 5 laudos reais, abortar e remover de todos os protocolos.

## Ordem de implementação proposta

1. **BLUE primeiro** (protótipo de validação, ~6h).
2. Avaliação clínica em uso real por Luiz Paulo (≥10 laudos).
3. Decisão GO / NO-GO para os outros 5 protocolos.
4. Se GO: paralelizar via subagentes (1 protocolo por agente).

## Critérios de aceitação

- Sem novos pacotes npm além do já existente (`react-native-svg` já está em `package.json`).
- Zero impacto em performance (SVG estático + estado derivado de store; sem animação heavy).
- Todos os tokens de cor vêm de `Colors.*` em `theme.ts`. Sem literais.
- Acessibilidade verificada com VoiceOver no simulador.

## Decisão pendente

- Posição final do ícone na tela do Laudador (header sticky vs colapsável vs floating).
- Tamanho do ícone (estimativa: ~120×140pt — grande o suficiente para ser tocável, pequeno o suficiente para não dominar a tela).

---

## Não implementar até

- L1 ter cobertura completa dos 6 protocolos (eFAST, BLUE, Cardíaco, RUSH, VExUS, Obstétrico).
- Telemetria L1-L4 estabilizada.
- Luiz Paulo solicitar explicitamente o avanço desta spec.
