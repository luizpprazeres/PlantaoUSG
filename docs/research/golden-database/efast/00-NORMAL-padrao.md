# [eFAST 00] Padrão NORMAL — todas as 6 janelas avaliadas sem alterações

> **Tipo:** NORMAL
> **Cenário:** trauma fechado, paciente estável, exame de triagem
> **Status:** rascunho
> **Versão:** v1.0
> **Camada de geração:** L1 (determinístico — só-chips)

---

## Cenário clínico

Homem, 38 anos, vítima de colisão automobilística frontal, condutor com cinto de segurança, airbag deflagrado. Admitido na sala vermelha consciente, orientado. Glasgow 15, PA 128/76, FC 84 bpm, SpO₂ 98% em ar ambiente, FR 16 irpm. Exame primário sem alterações grosseiras. eFAST realizado como triagem de líquido livre.

## Inputs simulados

### Achados marcados (chips)
- Janela `morrison` → status: **normal**
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
Exame eFAST sem evidência de líquido livre nas cavidades avaliadas, sem
derrame pericárdico ou pneumotórax.

IMPRESSÃO
Sem evidência ecográfica de líquido livre, derrame pericárdico ou
pneumotórax nas janelas avaliadas. Achados a serem correlacionados ao
quadro clínico e à evolução. Ultrassonografia point-of-care (POCUS)
realizada à beira-leito, em contexto clínico específico, com finalidade
focada e dirigida a uma pergunta clínica. Não substitui ultrassonografia
formal realizada por especialista em radiologia/ultrassonografia.

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
avaliação pleural e pericárdica focada. Sem alterações ecográficas
significativas nas janelas avaliadas.
```

---

## Critérios atendidos (autovalidação)

| # | Critério | Status |
|---|---|---|
| 1 | Disclaimer obrigatório presente | ✅ "Não substitui ultrassonografia formal..." |
| 2 | Caráter focado/limitado declarado | ✅ "exame de caráter focado e dirigido" |
| 3 | Linguagem comedida (sem termos da lista negra) | ✅ "Sem evidência de" + "a serem correlacionados" |
| 4 | Janelas vazias omitidas | ✅ N/A — todas avaliadas |
| 5 | Limitações registradas | ✅ N/A — qualidade adequada |
| 6 | Identificação possível | ✅ Placeholders [médico/CRM/data] no app |
| 7 | Recomendação em achado inconclusivo | ✅ N/A — achado é negativo claro |
| 8 | Sem palavras proibidas | ✅ Sem "exclui", "diagnóstico de", "completo" |
| 9 | Linguagem de seguimento clara | ✅ "correlacionados ao quadro clínico e à evolução" |
| 10 | Coerência chips ↔ prosa | ✅ Todas 6 janelas marcadas refletem na prosa P1 |

**RESULTADO:** 10/10 — pronto para validação externa.

---

## Validação

| Avaliador | Tipo | Data | Veredito | Notas |
|---|---|---|---|---|
| (pendente) | interno | — | — | — |
| (pendente) | externo USG | — | — | — |
| (pendente) | externo emergência | — | — | — |

---

## Notas técnicas

**Por que esse exemplo é o padrão NORMAL canônico:**

1. **Aciona a prioridade P1 do adapter** (`adapters/efast.ts` linha ~309) — todas 6 janelas normais → frase única consolidada `FRASE_P1`.
2. **Caso mais comum** no fluxo de triagem de trauma estável.
3. **Mostra como NÃO documentar uma janela como "normal por omissão"** — todas precisam ter sido ativamente marcadas como normais.
4. **Não usa "exclui"** — a impressão fala em "sem evidência ecográfica", deixando claro que o exame foi focado.

**Armadilha evitada:**
- ❌ "eFAST normal." (vago demais, sem qualificação anatômica)
- ❌ "Ausência de líquido livre, derrame pericárdico e pneumotórax." (sem disclaimer)
- ✅ Versão atual: linguagem objetiva por janela + disclaimer + correlação clínica.

**Sensibilidade clínica:**
- POCUS eFAST tem sensibilidade reduzida para volumes < 200 mL de líquido livre.
- Falsos negativos em obesos, gestantes (1º trim sem volume vesical), pneumoperitônio.
- Em pacientes instáveis com eFAST negativo, **não exclui** lesão — manter avaliação seriada.
- Esses pontos não entram no laudo NORMAL deste cenário (paciente estável), mas devem entrar no laudo de **paciente instável com eFAST negativo** (caso 15 no plano).
