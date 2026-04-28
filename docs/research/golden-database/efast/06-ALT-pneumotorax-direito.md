# [eFAST 06] Pneumotórax à direita — perfil B' com lung point

> **Tipo:** ALTERADO · **Camada:** L1 · **Status:** rascunho · **v1.0**

## Cenário clínico

Homem, 24 anos, vítima de ferimento por arma branca em hemitórax direito anterior. PA 110/68, FC 110, FR 24, SpO₂ 92% em ar ambiente, dispneia, hipofonese à direita. eFAST realizado durante ressuscitação inicial.

## Inputs simulados

- `morrison` → normal
- `esplenorrenal` → normal
- `suprapubica` → normal
- `subxifoide` → normal
- `pleural_direito` → achados:
  - **`ausencia_deslizamento_dir`** ("Ausência de deslizamento pleural à direita")
  - **`lung_point_dir`** ("Lung point identificado à direita")
- `pleural_esquerdo` → normal
- Texto livre: (vazio) · Voz: (vazio) · Limitações: (nenhuma)

## LAUDO ESPERADO — extenso

```
TÉCNICA
Ultrassonografia point-of-care eFAST realizada à beira-leito com transdutor
convexo 3.5 MHz e linear de alta frequência (avaliação pleural), abordagem
focada para avaliação de líquido livre nas cavidades torácica, abdominal e
pélvica, com avaliação pleural e pericárdica dirigida. Exame de caráter
focado e dirigido a uma pergunta clínica específica.

ACHADOS
Espaço hepatorrenal sem evidência de líquido livre, recesso subfrênico
direito sem líquido livre e goteira parietocólica direita sem líquido livre.
Espaço esplenorrenal sem evidência de líquido livre, recesso subfrênico
esquerdo sem líquido livre e goteira parietocólica esquerda sem líquido
livre.
Fundo de saco de Douglas sem evidência de líquido livre, sem líquido livre
perivesical e bexiga adequadamente repleta.
Saco pericárdico sem evidência de derrame e sem sinais ecográficos de
tamponamento.
Hemitórax Esquerdo (pleural) sem alterações ecográficas significativas.
Hemitórax Direito (pleural): ausência de deslizamento pleural à direita,
com identificação de lung point à direita.

IMPRESSÃO
Achados sugestivos de pneumotórax à direita, a serem correlacionados ao
quadro clínico. Achado de potencial gravidade clínica imediata em paciente
com instabilidade respiratória; recomenda-se avaliação imediata de equipe
especializada para conduta dirigida.
Ultrassonografia point-of-care (POCUS) realizada à beira-leito, em contexto
clínico específico, com finalidade focada e dirigida a uma pergunta clínica.
Não substitui ultrassonografia formal realizada por especialista em
radiologia/ultrassonografia.

REFERÊNCIAS
1. Volpicelli G et al. Intensive Care Med. 2012;38(4):577-591.
2. Rozycki GS et al. J Trauma. 1995;39(3):492-498.
```

## LAUDO ESPERADO — objetivo

```
POCUS eFAST (28/04/2026): Achados sugestivos de pneumotórax à direita
(ausência de deslizamento pleural com identificação de lung point), a
serem correlacionados ao quadro clínico.
```

## Critérios: 10/10 ✅

## Notas

**Lung point** é o sinal mais específico de pneumotórax (especificidade próxima de 100%) e justifica linguagem mais firme. Mesmo assim, mantemos "sugestivos de" — POCUS pode falhar em pneumotórax loculado ou em paciente com bolha enfisematosa prévia. A janela pleural usa **prefixo "Hemitórax Direito (pleural):"** porque os achados não trazem localização embutida (regra de desambiguação do adapter).
