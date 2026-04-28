# Golden Database — Laudos POCUS validados

> **Repositório curado de laudos POCUS estruturados** para os 6 protocolos do Plantão USG. Funciona como fonte da verdade para o motor L1 (templating determinístico), referência de fine-tuning eventual do L4 (LLM), e material para validação institucional externa (CBR, ABRAMEDE, ultrassonografistas seniores).
>
> **Não substitui** literatura clínica — é uma camada de qualidade de **redação** sobre os achados, calibrada à cultura médica brasileira e à filosofia do app (focado, comedido, defensável).

---

## 1. Por que este repositório existe

A pesquisa em `docs/research/2026-04-28-pocus-documentacao-recomendacoes.md` mostrou que:

1. **Brasil não tem diretriz oficial de "estrutura de laudo POCUS"** — lacuna estrutural.
2. O **risco médico-legal documentado** em POCUS é falha de documentação (CMPA 2024: 100% dos casos perdidos pelo médico; Stolz 2022: nenhum processo por interpretação errada).
3. As sociedades convergem em **linguagem comedida, caráter focado declarado, disclaimer obrigatório** — mas nenhuma publica uma biblioteca extensa de exemplos calibrados.
4. O **produto final do Plantão USG é o laudo gerado** — vai ao prontuário do paciente. Qualidade dessa base é crítica.

O Golden Database preenche essa lacuna de exemplos calibrados.

---

## 2. Escopo da fase 1

| Protocolo | Pasta | Exemplos | Status |
|---|---|---|---|
| eFAST | `efast/` | 1 normal + 19 alterados = **20** | 🚧 piloto |
| BLUE | `blue/` | 1 normal + 19 alterados = **20** | ⏸ aguarda eFAST |
| RUSH | `rush/` | 1 normal + 19 alterados = **20** | ⏸ aguarda eFAST |
| FoCUS / Cardíaco | `focus/` | 1 normal + 19 alterados = **20** | ⏸ aguarda eFAST |
| VExUS | `vexus/` | 1 normal + 19 alterados = **20** | ⏸ aguarda eFAST |
| Obstétrico de emergência | `obstetrico/` | 1 normal + 19 alterados = **20** | ⏸ por último (sensibilidade médico-legal) |

**Total fase 1:** 6 × 20 = **120 laudos**.

### Por que começar pelo eFAST

1. Janelas finitas e bem definidas (6).
2. Maior volume de uso esperado (trauma).
3. Literatura mais consolidada (ACEP Sonoguide, CAEP Delphi 2021, Rozycki, ATLS).
4. Achado relativamente binário (líquido livre presente/ausente).
5. Boa proporção normal/alterado para validar linguagem em ambos os polos.

### Ordem sugerida de protocolos após eFAST

```
eFAST → BLUE → FoCUS → RUSH → VExUS → Obstétrico
```

Obstétrico por último: tem regras de seguimento mais rígidas e maior risco médico-legal — só entra quando os 5 anteriores estiverem validados externamente.

---

## 3. Estrutura de cada laudo

Cada arquivo `.md` em uma pasta de protocolo segue exatamente este template:

```markdown
# [PROTOCOLO ##] Título descritivo curto

> **Tipo:** NORMAL | ALTERADO
> **Cenário:** [breve label clínico]
> **Status:** rascunho | revisão interna | revisão externa | aprovado
> **Versão:** v1.0

## Cenário clínico
[Idade, gênero, contexto, sinais vitais relevantes — NUNCA dados reais de paciente]

## Inputs simulados
### Achados marcados (chips)
- chip_id_1
- chip_id_2

### Texto livre
"[Texto que o médico digitou no laudador]"

### Voz
"[Texto transcrito por voz, se aplicável; vazio em muitos casos]"

### Limitações marcadas
- limitacao_id_1

## LAUDO ESPERADO — versão extensa

### TÉCNICA
[Bloco gerado]

### ACHADOS
[Bloco gerado em prosa clínica natural por janela]

### IMPRESSÃO
[Bloco com linguagem comedida + disclaimer obrigatório]

### REFERÊNCIAS
1. [artigo 1]
2. [artigo 2]

## LAUDO ESPERADO — versão objetiva (prontuário)
POCUS [SIGLA] ([data]): [parágrafo único, máx. 6 linhas]

## Critérios atendidos (autovalidação)
[checklist dos 10 critérios universais — ver § 4]

## Validação
| Avaliador | Tipo | Data | Veredito | Notas |
|---|---|---|---|---|
| (pendente) | interno | — | — | — |
| (pendente) | externo USG | — | — | — |
| (pendente) | externo emergência | — | — | — |

## Notas técnicas
[Particularidades clínicas, armadilhas, racional de redação]
```

---

## 4. Critérios de aceitação universais (10)

Todo laudo do Golden Database **deve** satisfazer os 10 critérios abaixo antes de ser submetido a validação externa.

| # | Critério | Verificação |
|---|---|---|
| 1 | Disclaimer obrigatório presente | Texto literal aparece na seção IMPRESSÃO |
| 2 | Caráter focado/limitado declarado | Termos "focado", "dirigido", "POCUS" ou equivalentes na TÉCNICA |
| 3 | Linguagem comedida | Sem "exclui", "diagnóstico de", "confirma", "completo", "normal" isolado |
| 4 | Janelas vazias omitidas | Sem "não avaliada" nem "normal por omissão" |
| 5 | Limitações técnicas registradas (se houver) | Janela subótima/inadequada nominada |
| 6 | Identificação possível | Placeholders explícitos para CRM, data, hora |
| 7 | Recomendação explícita em achado inconclusivo | Frase "recomenda-se [USG formal/TC/observação/reavaliação]" |
| 8 | Sem palavras proibidas | Lista negra: "diagnóstico de", "confirma", "exclui", "completo", "normal" sem qualificador |
| 9 | Linguagem de seguimento clara | Conduta pós-laudo objetiva |
| 10 | Coerência entre chips marcados e prosa final | Não inventar achado, não omitir achado marcado |

### Lista negra de termos (quick reference)

```
❌ "diagnóstico de [X]"
❌ "exclui [X]"
❌ "confirma [X]"
❌ "exame completo"
❌ "exame normal" (use "sem alterações detectáveis nas janelas avaliadas")
❌ "ausência de [X]" sem qualificador (use "sem evidência de [X] nesta avaliação focada")
❌ "garante [X]"
❌ "definitivo"
❌ "categoricamente"
```

### Lista verde de termos preferidos

```
✅ "sugestivo de [X]"
✅ "compatível com [X]"
✅ "consistente com [X]"
✅ "achados consistentes com [X]"
✅ "sem evidência de [X] no momento desta avaliação focada"
✅ "ausência de [X] na janela [Y] não exclui a presença em [Z]"
✅ "exame focado/dirigido/limitado a [pergunta]"
✅ "POCUS [SIGLA] à beira-leito"
✅ "Não substitui ultrassonografia formal"
✅ "Recomenda-se [seguimento]"
```

---

## 5. Disclaimer canônico v2 (PT-BR)

Texto exato a ser usado em todos os laudos:

### Versão base (todos os laudos)

```
Ultrassonografia point-of-care (POCUS) realizada à beira-leito,
em contexto clínico específico, com finalidade focada e dirigida
a uma pergunta clínica. Não substitui ultrassonografia formal
realizada por especialista em radiologia/ultrassonografia. Achados
devem ser interpretados em conjunto com o quadro clínico e exames
complementares. Limitações inerentes à janela acústica, ao biotipo
do paciente e ao caráter focado do exame.
```

### Versão expandida (quando achado é negativo/inconclusivo)

```
[disclaimer base] A ausência de [achado-alvo] no momento desta
avaliação focada não exclui a presença em momento posterior nem
em janelas não examinadas. Recomenda-se ultrassonografia formal
ou imagem complementar caso persista a suspeita clínica.
```

### Disclaimer obstétrico reforçado (gatilho automático)

```
[disclaimer base] POCUS obstétrico de emergência realizado para
avaliação focada de [pergunta]. NÃO exclui gravidez ectópica.
Em paciente com βHCG positivo e gestação intrauterina não
confirmada, ultrassonografia transvaginal formal é mandatória.
```

---

## 6. Convenções de redação

Aplicáveis a todos os laudos do Golden Database.

### Prosa clínica natural

- ❌ "Pleural direito: derrame pleural direito" (redundante)
- ✅ "Derrame pleural à direita, anecoico, em quantidade pequena."

### Termos bilíngues entre aspas

```
"sinal da praia" ("seashore sign")
"sinal do código de barras" ("barcode sign")
"perfil B" ("B-profile")
"linhas A" ("A-lines")
"linhas B" ("B-lines")
"lung point"
"sinal do mar" ("seashore sign")
```

### Janelas vazias

**Sempre omitir.** Nunca escrever "não avaliada" nem "normal por omissão".

### Numeração de janelas

Sempre por nome anatômico, não por número de janela do app:
- ✅ "janela hepatorrenal"
- ❌ "janela 1"

### Volume / quantificação

Quando POCUS, evitar quantificação numérica precisa. Usar:
- "pequena quantidade"
- "moderada quantidade"
- "volume considerável"

Quantificação numérica precisa fica reservada para ECO formal.

### Disclaimer médico-legal sobre operador

Quando aplicável (ex.: caso indeterminado por inexperiência ou janela ruim):

> "Estudo limitado por [janela acústica ruim / biotipo / agitação do paciente]; recomenda-se reavaliação ou ultrassonografia formal."

---

## 7. Fluxo de validação

```
┌─────────────────────────────────────────────────────────┐
│ ETAPA 1 — Geração interna                                │
│   Plantão USG gera os 20 laudos via L1 + revisão LLM     │
│   Auto-validação contra os 10 critérios (script)         │
│   Status: rascunho → revisão interna                     │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ ETAPA 2 — Revisão técnica interna                        │
│   Médico ultrassonografista sênior revisa terminologia   │
│   Médico emergencista/intensivista revisa adequação      │
│   Status: revisão interna → revisão externa              │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ ETAPA 3 — Validação institucional                        │
│   Submissão informal a contatos no CBR                   │
│   Submissão informal a contatos na ABRAMEDE/AMIB         │
│   Submissão a 2-3 ultrassonografistas formadores         │
│   Status: revisão externa → aprovado | revisar           │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ ETAPA 4 — Consolidação                                   │
│   Aplicar correções em batch ao motor L1 (templates)     │
│   Aplicar correções ao prompt do L4 (LLM)                │
│   Versão 1.0 do protocolo publicada                      │
│   Status: aprovado                                       │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ ETAPA 5 — Manutenção contínua                            │
│   Trimestralmente: revisão de telemetria L1/L2/L3/L4     │
│   Ajuste de linguagem baseado em hit-rate e feedback     │
│   Versionamento incremental                              │
└─────────────────────────────────────────────────────────┘
```

---

## 8. Convenção de nomenclatura de arquivos

```
[NN]-[TIPO]-[label-curto].md

NN     = número de 00 a 19, zero-padded
TIPO   = NORMAL | ALT  (alterado)
label  = kebab-case, descritivo, máx. 5 palavras
```

Exemplos:

```
00-NORMAL-padrao.md
01-ALT-liquido-RUQ.md
02-ALT-liquido-LUQ.md
03-ALT-liquido-pelvico.md
04-ALT-derrame-pericardico-pequeno.md
05-ALT-derrame-pericardico-tamponamento.md
06-ALT-pneumotorax-direito.md
07-ALT-derrame-pleural-bilateral.md
08-ALT-multiplas-janelas-positivas.md
09-ALT-LUQ-suboptima-gas.md
10-ALT-RUQ-inconclusiva-biotipo.md
11-ALT-pneumotorax-bilateral.md
12-ALT-liquido-pequeno-volume.md
13-ALT-foco-trauma-fechado.md
14-ALT-foco-trauma-penetrante.md
15-ALT-paciente-instavel.md
16-ALT-paciente-estavel.md
17-ALT-pos-trauma-tardio.md
18-ALT-gravida-trauma.md
19-ALT-pediatrico-trauma.md
```

> Ordem: NORMAL primeiro (00), depois alterações em ordem de **frequência clínica** (mais comum → mais raro), e por fim **casos limítrofes / armadilhas** (qualidade subótima, populações especiais).

---

## 9. Auto-validação automatizável (futuro)

Cada laudo pode ser validado por script (a implementar):

```bash
# pseudocódigo
node scripts/validate-golden-laudo.js efast/03-ALT-liquido-pelvico.md

# saída esperada:
# ✓ 1. Disclaimer presente
# ✓ 2. Caráter focado declarado
# ✓ 3. Linguagem comedida (sem termos da lista negra)
# ✓ 4. Sem "não avaliada"
# ✓ 5. Limitações registradas
# ✓ 6. Placeholders [CRM] [data] [hora] presentes
# ✓ 7. Recomendação explícita em achado inconclusivo
# ✓ 8. Lista negra: 0 ocorrências
# ✓ 9. Conduta pós-laudo objetiva
# ✓ 10. Coerência chips ↔ prosa
#
# RESULTADO: 10/10 — pronto para validação externa
```

Esse script pode rodar em CI/CD e bloquear PRs que tentem incluir laudos não-conformes.

---

## 10. Como contribuir

1. Cria-se um arquivo seguindo a nomenclatura da §8.
2. Preenche-se o template da §3.
3. Roda-se a auto-validação (quando disponível) ou checa-se manualmente os 10 critérios.
4. Marca-se status como `rascunho`.
5. Submete-se para revisão interna (Luiz + 1 revisor médico).
6. Após aprovação interna → status `revisão externa`.
7. Após validação externa → status `aprovado`.
8. Apenas laudos `aprovado` entram no motor L1 ou no prompt L4 do app.

---

## 11. Versionamento

| Versão | Data | Mudança |
|---|---|---|
| 0.1 | 2026-04-28 | Estrutura inicial criada. Convenções definidas. eFAST como piloto. |

---

## 12. Referências cruzadas

- Pesquisa-base: [`../2026-04-28-pocus-documentacao-recomendacoes.md`](../2026-04-28-pocus-documentacao-recomendacoes.md)
- Arquitetura geral: [`../../architecture.md`](../../architecture.md)
- Plano L1-L4: [`../../plans/2026-04-27-llm-architecture-l1-l4.md`](../../plans/2026-04-27-llm-architecture-l1-l4.md)

---

**Status:** estrutura inicial criada. Aguarda autorização para gerar os 20 primeiros laudos do eFAST.
