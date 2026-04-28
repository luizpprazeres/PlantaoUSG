# [eFAST 01] Líquido livre em espaço hepatorrenal (Morrison)

> **Tipo:** ALTERADO
> **Cenário:** trauma fechado abdominal com FAST positivo em janela única
> **Status:** rascunho
> **Versão:** v1.0
> **Camada de geração:** L1 (determinístico — só-chips)

---

## Cenário clínico

Mulher, 26 anos, vítima de queda de cavalo com trauma direto em flanco direito. Admitida com dor em hipocôndrio direito, PA 102/64, FC 108 bpm, SpO₂ 99%, Glasgow 15. eFAST realizado pela equipe de emergência como parte da avaliação inicial.

## Inputs simulados

### Achados marcados (chips)
- Janela `morrison` → achado: **`liquido_hepatorrenal`** ("Líquido livre em espaço hepatorrenal, anecoico")
- Janela `esplenorrenal` → status: **normal**
- Janela `suprapubica` → status: **normal**
- Janela `subxifoide` → status: **normal**
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
Espaço esplenorrenal sem evidência de líquido livre, recesso subfrênico
esquerdo sem líquido livre e goteira parietocólica esquerda sem líquido
livre.
Fundo de saco de Douglas sem evidência de líquido livre, sem líquido livre
perivesical e bexiga adequadamente repleta.
Saco pericárdico sem evidência de derrame e sem sinais ecográficos de
tamponamento.
Líquido livre em espaço hepatorrenal, anecoico.

IMPRESSÃO
Achados sugestivos de líquido livre intra-abdominal/pélvico, a serem
correlacionados ao quadro clínico. Recomenda-se manter avaliação clínica
seriada e considerar tomografia computadorizada de abdome conforme
estabilidade hemodinâmica e julgamento da equipe assistente.
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
avaliação pleural e pericárdica focada. Achados sugestivos de líquido livre
intra-abdominal/pélvico, a serem correlacionados ao quadro clínico.
```

---

## Critérios atendidos (autovalidação)

| # | Critério | Status |
|---|---|---|
| 1 | Disclaimer obrigatório presente | ✅ |
| 2 | Caráter focado/limitado declarado | ✅ |
| 3 | Linguagem comedida | ✅ "sugestivo de" + "anecoico" sem categorizar como sangue |
| 4 | Janelas vazias omitidas | ✅ N/A — todas avaliadas |
| 5 | Limitações registradas | ✅ N/A |
| 6 | Identificação possível | ✅ |
| 7 | Recomendação explícita | ✅ "Recomenda-se manter avaliação clínica seriada e considerar TC..." |
| 8 | Sem palavras proibidas | ✅ |
| 9 | Linguagem de seguimento clara | ✅ |
| 10 | Coerência chips ↔ prosa | ✅ Apenas Morrison com achado, demais P2/P3 corretas |

**RESULTADO:** 10/10.

---

## Validação

| Avaliador | Tipo | Data | Veredito | Notas |
|---|---|---|---|---|
| (pendente) | interno | — | — | — |
| (pendente) | externo USG | — | — | — |
| (pendente) | externo emergência | — | — | — |

---

## Notas técnicas

**Engenharia (alinhada com `adapters/efast.ts`):**

- Aciona **P2** (par pleural normal → 1 linha consolidada).
- Aciona **P3** três vezes (Esplenorrenal, Suprapúbica, Subxifoide normais).
- Janela Morrison entra no bucket "achados únicas" — sem prefixo de janela porque o achado já contém localização ("hepatorrenal") — coerente com `achadoContemLocalizacao`.
- IMPRESSÃO classifica como `líquido livre intra-abdominal/pélvico` (categoria menos severa, única detectada).

**Ponto clínico crítico:**

> Em mulher jovem em idade fértil com líquido livre em Morrison, **descartar gravidez ectópica** é parte da avaliação. POCUS pélvico para confirmar IUP + βHCG são mandatórios em paralelo. Esse ponto não vai no laudo eFAST, mas a equipe assistente deve providenciar — o app pode sugerir isso futuramente como "fluxo cruzado" entre protocolos.

**Linguagem deliberadamente conservadora:**

- "**Anecoico**" em vez de "hemático" — POCUS não diferencia sangue de outros líquidos com confiabilidade. Categorizar como hemático induz à conclusão de "hemoperitônio" sem suporte.
- "Sugestivo de líquido livre intra-abdominal" em vez de "hemoperitônio".
- Decisão clínica de TC ou laparotomia depende da equipe — laudo NÃO prescreve conduta cirúrgica.
