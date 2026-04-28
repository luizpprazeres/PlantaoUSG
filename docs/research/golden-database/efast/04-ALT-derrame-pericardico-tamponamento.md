# [eFAST 04] Derrame pericárdico com sinais de tamponamento

> **Tipo:** ALTERADO — categoria de severidade máxima
> **Cenário:** trauma torácico contuso com instabilidade hemodinâmica
> **Status:** rascunho
> **Versão:** v1.0
> **Camada de geração:** L1 (determinístico — só-chips)

---

## Cenário clínico

Homem, 52 anos, vítima de colisão automobilística com impacto no volante (trauma torácico fechado). Admitido com dispneia, turgência jugular, hipotensão (PA 78/52), taquicardia (FC 132), bulhas cardíacas hipofonéticas. Suspeita clínica de tamponamento pericárdico. eFAST realizado de imediato.

## Inputs simulados

### Achados marcados (chips)
- Janela `morrison` → status: **normal**
- Janela `esplenorrenal` → status: **normal**
- Janela `suprapubica` → status: **normal**
- Janela `subxifoide` → achados:
  - **`derrame_pericardico_moderado`** ("Derrame pericárdico moderado")
  - **`tamponamento`** ("Sinais ecográficos compatíveis com tamponamento pericárdico — colapso diastólico de câmaras direitas e VCI plethorica")
- Janela `pleural_direito` → status: **normal**
- Janela `pleural_esquerdo` → status: **normal**

### Texto livre
(vazio)

### Voz
(vazio)

### Limitações marcadas
(nenhuma)

---

## LAUDO ESPERADO — versão extensa

```
TÉCNICA
Ultrassonografia point-of-care eFAST realizada à beira-leito com transdutor
convexo 3.5 MHz, abordagem focada para avaliação de líquido livre nas
cavidades torácica, abdominal e pélvica, com avaliação pleural e pericárdica
dirigida. Exame de caráter focado e dirigido a uma pergunta clínica
específica.

ACHADOS
Pleura bilateral sem alterações ecográficas significativas.
Espaço hepatorrenal sem evidência de líquido livre, recesso subfrênico
direito sem líquido livre e goteira parietocólica direita sem líquido livre.
Espaço esplenorrenal sem evidência de líquido livre, recesso subfrênico
esquerdo sem líquido livre e goteira parietocólica esquerda sem líquido
livre.
Fundo de saco de Douglas sem evidência de líquido livre, sem líquido livre
perivesical e bexiga adequadamente repleta.
Derrame pericárdico moderado e sinais ecográficos compatíveis com
tamponamento pericárdico — colapso diastólico de câmaras direitas e VCI
plethorica.

IMPRESSÃO
Achados sugestivos de tamponamento pericárdico, a serem correlacionados ao
quadro clínico. Achado de potencial gravidade clínica imediata; recomenda-se
avaliação imediata de equipe especializada para conduta dirigida.
Ultrassonografia point-of-care (POCUS) realizada à beira-leito, em contexto
clínico específico, com finalidade focada e dirigida a uma pergunta clínica.
Não substitui ultrassonografia formal realizada por especialista em
radiologia/ultrassonografia.

REFERÊNCIAS
1. Rozycki GS, Ochsner MG, Schmidt JA, et al. A prospective study of
   surgeon-performed ultrasound as the primary adjuvant modality for injured
   patient assessment. J Trauma. 1995;39(3):492-498.
2. Labovitz AJ, Noble VE, Bierig M, et al. Focused cardiac ultrasound in the
   emergent setting: a consensus statement of the American Society of
   Echocardiography and American College of Emergency Physicians.
   J Am Soc Echocardiogr. 2010;23(12):1225-1230.
```

## LAUDO ESPERADO — versão objetiva (prontuário)

```
POCUS eFAST (28/04/2026): Exame realizado com transdutor convexo, direcionado
a avaliação de líquido livre em cavidades torácica, abdominal e pélvica, com
avaliação pleural e pericárdica focada. Achados sugestivos de tamponamento
pericárdico, a serem correlacionados ao quadro clínico.
```

---

## Critérios atendidos (autovalidação)

| # | Critério | Status |
|---|---|---|
| 1 | Disclaimer obrigatório presente | ✅ |
| 2 | Caráter focado/limitado declarado | ✅ |
| 3 | Linguagem comedida | ✅ "compatível com tamponamento" + "sugestivos de" |
| 4 | Janelas vazias omitidas | ✅ N/A |
| 5 | Limitações registradas | ✅ N/A |
| 6 | Identificação possível | ✅ |
| 7 | Recomendação em achado de gravidade | ✅ "avaliação imediata de equipe especializada" |
| 8 | Sem palavras proibidas | ✅ |
| 9 | Linguagem de seguimento clara | ✅ |
| 10 | Coerência chips ↔ prosa | ✅ Subxifoide com 2 achados; impressão usa categoria mais severa |

**RESULTADO:** 10/10.

---

## Validação

| Avaliador | Tipo | Data | Veredito | Notas |
|---|---|---|---|---|
| (pendente) | interno | — | — | — |
| (pendente) | externo cardio | — | — | — |
| (pendente) | externo emergência | — | — | — |

---

## Notas técnicas

**Engenharia (alinhada com `adapters/efast.ts`):**

- Aciona **P2** (par pleural normal).
- Aciona **P3** três vezes (Morrison, Esplenorrenal, Suprapúbica normais).
- Subxifoide com 2 achados → linha sem prefixo (achado contém "pericárdico").
- IMPRESSÃO classifica `tamponamento pericárdico` como categoria mais severa entre `presentes` (linha 146 do adapter), descartando o `derrame pericárdico` simples (regra anti-dupla-contagem em `classificarAchado`).

**Linguagem clínica:**

- "Sinais **compatíveis com** tamponamento" — preserva a margem epistêmica. POCUS sugere o diagnóstico mas a confirmação é ECO formal/clínica.
- "Achado de potencial gravidade clínica imediata" — dispara senso de urgência sem categorizar como diagnóstico definitivo.
- "Recomenda-se avaliação imediata de equipe especializada" — orienta sem prescrever pericardiocentese.

**Ponto crítico (médico-legal):**

> Em cenário de tamponamento, atraso é a maior fonte de morbimortalidade. O laudo deve ser **disponibilizado imediatamente** (impresso/digital + comunicação verbal). A documentação não substitui a comunicação ativa — esse ponto vale ser reforçado em material institucional do app, não no laudo em si.

**Sinais ecográficos descritos:**

- Colapso diastólico de câmaras direitas
- VCI plethorica (sem variação respiratória)
- Variação respiratória do fluxo transvalvar (não detectável em POCUS sem Doppler)

O laudo deliberadamente menciona apenas os 2 primeiros — são acessíveis ao POCUS modo B sem Doppler. Manter precisão sobre o que o exame realmente avaliou.
