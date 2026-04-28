# [eFAST 09] Janela LUQ subótima por gás intestinal — limitação técnica registrada

> **Tipo:** ALTERADO — caso limítrofe / armadilha
> **Cenário:** trauma fechado com janela acústica comprometida
> **Status:** rascunho
> **Versão:** v1.0
> **Camada de geração:** L4 (LLM — necessita texto livre para qualificar a limitação)

---

## Cenário clínico

Mulher, 64 anos, IMC 32, vítima de queda da própria altura com trauma em flanco esquerdo. PA 122/78, FC 90, Glasgow 15, dor leve em hipocôndrio esquerdo. eFAST realizado durante avaliação inicial; janela esplenorrenal teve qualidade subótima por interposição de gás intestinal.

## Inputs simulados

### Achados marcados (chips)
- Janela `morrison` → status: **normal**
- Janela `esplenorrenal` → status: **alterado** (sem achado específico — limitação técnica)
- Janela `suprapubica` → status: **normal**
- Janela `subxifoide` → status: **normal**
- Janela `pleural_direito` → status: **normal**
- Janela `pleural_esquerdo` → status: **normal**

### Texto livre
"Janela esplenorrenal com qualidade subótima por interposição de gás intestinal e biotipo da paciente. Não foi possível avaliar adequadamente o espaço esplenorrenal nem o recesso subfrênico esquerdo."

### Voz
(vazio)

### Limitações marcadas
- `janela_acustica_subotima_LUQ`

---

## LAUDO ESPERADO — versão extensa

```
TÉCNICA
Ultrassonografia point-of-care eFAST realizada à beira-leito com transdutor
convexo 3.5 MHz, abordagem focada para avaliação de líquido livre nas
cavidades torácica, abdominal e pélvica, com avaliação pleural e pericárdica
dirigida. Exame de caráter focado e dirigido a uma pergunta clínica
específica. Janela esplenorrenal com qualidade subótima por interposição de
gás intestinal e biotipo da paciente.

ACHADOS
Pleura bilateral sem alterações ecográficas significativas.
Espaço hepatorrenal sem evidência de líquido livre, recesso subfrênico
direito sem líquido livre e goteira parietocólica direita sem líquido livre.
Fundo de saco de Douglas sem evidência de líquido livre, sem líquido livre
perivesical e bexiga adequadamente repleta.
Saco pericárdico sem evidência de derrame e sem sinais ecográficos de
tamponamento.
Janela esplenorrenal com qualidade subótima — espaço esplenorrenal e
recesso subfrênico esquerdo não puderam ser adequadamente avaliados por
interposição de gás intestinal.

IMPRESSÃO
Sem evidência ecográfica de líquido livre nas janelas adequadamente
avaliadas. Avaliação do espaço esplenorrenal limitada por janela acústica
subótima — a ausência de líquido livre nesta região não pôde ser
estabelecida pelo exame focado. Recomenda-se reavaliação seriada e/ou
ultrassonografia formal/tomografia computadorizada caso persista a suspeita
clínica de lesão em quadrante superior esquerdo.
Ultrassonografia point-of-care (POCUS) realizada à beira-leito, em contexto
clínico específico, com finalidade focada e dirigida a uma pergunta clínica.
Não substitui ultrassonografia formal realizada por especialista em
radiologia/ultrassonografia.

REFERÊNCIAS
1. Rozycki GS, Ochsner MG, Schmidt JA, et al. A prospective study of
   surgeon-performed ultrasound as the primary adjuvant modality for injured
   patient assessment. J Trauma. 1995;39(3):492-498.
2. Stengel D, Leisterer J, Ferrada P, et al. Point-of-care ultrasonography
   for diagnostic accuracy of abdominal injuries in patients with blunt
   trauma. Cochrane Database Syst Rev. 2018;12:CD012669.
```

## LAUDO ESPERADO — versão objetiva (prontuário)

```
POCUS eFAST (28/04/2026): Exame realizado com transdutor convexo, direcionado
a avaliação de líquido livre em cavidades torácica, abdominal e pélvica, com
avaliação pleural e pericárdica focada. Sem evidência de líquido livre nas
janelas adequadamente avaliadas. Janela esplenorrenal limitada por gás
intestinal — recomenda-se reavaliação ou exame complementar caso persista
suspeita clínica.
```

---

## Critérios atendidos (autovalidação)

| # | Critério | Status |
|---|---|---|
| 1 | Disclaimer obrigatório presente | ✅ |
| 2 | Caráter focado/limitado declarado | ✅ |
| 3 | Linguagem comedida | ✅ "não pôde ser estabelecida" — não afirma ausência |
| 4 | Janelas vazias omitidas | ✅ N/A — todas mencionadas |
| 5 | Limitações registradas | ✅✅ Limitação central do caso, registrada em TÉCNICA + ACHADOS + IMPRESSÃO |
| 6 | Identificação possível | ✅ |
| 7 | Recomendação em achado inconclusivo | ✅ "Recomenda-se reavaliação seriada e/ou USG formal/TC" |
| 8 | Sem palavras proibidas | ✅ "não pôde ser adequadamente avaliada" — não usa "exclui" |
| 9 | Linguagem de seguimento clara | ✅ |
| 10 | Coerência chips ↔ prosa | ✅ Chip esplenorrenal alterado + texto livre → ACHADOS reflete a limitação |

**RESULTADO:** 10/10 — caso emblemático de "documentação defensável de exame parcialmente inconclusivo".

---

## Validação

| Avaliador | Tipo | Data | Veredito | Notas |
|---|---|---|---|---|
| (pendente) | interno | — | — | — |
| (pendente) | externo USG | — | — | — |
| (pendente) | externo emergência | — | — | — |

---

## Notas técnicas

**Por que este caso é estratégico:**

A literatura médico-legal (Prager 2024, Stolz 2022) mostra que **documentação inadequada** é causa recorrente de processos. Um exame parcialmente inconclusivo, **se documentado corretamente**, é defensável. Se documentado como "eFAST negativo" sem qualificar a limitação, é vulnerável.

Esse laudo serve de exemplo-padrão para a IA do app aprender a tratar limitações técnicas — não esconder, não minimizar, e sempre amarrar à recomendação de seguimento.

**Roteamento L1 vs L4:**

Esse cenário exige **L4 (LLM)** porque:
- A limitação técnica precisa ser **traduzida em prosa** integrada ao laudo (tanto na TÉCNICA quanto nos ACHADOS quanto na IMPRESSÃO).
- O adapter L1 atual não tem semântica para "janela alterada sem achado específico" — só normal ou achado nominado.
- Texto livre não-vazio é o gatilho de roteamento para L4 (`decisao.ts`).

**Convenção linguística:**

- ❌ "Esplenorrenal não avaliada" (frio, vago)
- ❌ "Esplenorrenal normal apesar da janela ruim" (afirma o que não pode afirmar)
- ✅ "Espaço esplenorrenal e recesso subfrênico esquerdo não puderam ser adequadamente avaliados por interposição de gás intestinal" (precisão técnica + clínica)

**Implicação clínica:**

Em paciente com trauma em flanco esquerdo e janela LUQ subótima, há risco real de lesão esplênica oculta. A recomendação no laudo é **defensável e clinicamente correta** — não é "cobertura jurídica" gratuita, é boa medicina.

**Texto-padrão sugerido para o motor (L1 ou L4):**

Quando uma janela é marcada como "limitada" + texto livre menciona razão da limitação, gerar:

```
[Nome da janela] com qualidade subótima — [estruturas-alvo] não puderam ser
adequadamente avaliadas por [razão da limitação].
```

E na IMPRESSÃO:

```
Avaliação de [região] limitada por [razão] — a [achado-alvo] nesta região
não pôde ser estabelecida pelo exame focado. Recomenda-se [seguimento
proporcional ao risco].
```

Esse padrão pode virar um template L1 ou um trecho fixo do prompt L4.
