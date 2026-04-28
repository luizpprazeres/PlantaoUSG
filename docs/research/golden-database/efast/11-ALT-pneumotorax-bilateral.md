# [eFAST 11] Pneumotórax bilateral — achado de gravidade extrema

> **Tipo:** ALTERADO · **Camada:** L1 · **Status:** rascunho · **v1.0**

## Cenário clínico

Homem, 36 anos, vítima de queda de altura (8m). Politrauma. PA 86/50, FC 138, FR 32, SpO₂ 86% em alto fluxo. Tórax com expansibilidade reduzida bilateral, hipofonese bilateral. eFAST realizado durante ressuscitação.

## Inputs simulados

- `morrison` → normal
- `esplenorrenal` → normal
- `suprapubica` → normal
- `subxifoide` → normal
- `pleural_direito` → achados:
  - **`ausencia_deslizamento_dir`** ("Ausência de deslizamento pleural à direita")
  - **`lung_point_dir`** ("Lung point identificado à direita")
- `pleural_esquerdo` → achados:
  - **`ausencia_deslizamento_esq`** ("Ausência de deslizamento pleural à esquerda")
  - **`codigo_barras_esq`** ("Sinal do código de barras ('barcode sign') à esquerda em modo M")
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
Hemitórax Direito (pleural): ausência de deslizamento pleural à direita,
com identificação de lung point à direita.
Hemitórax Esquerdo (pleural): ausência de deslizamento pleural à esquerda,
com sinal do código de barras ("barcode sign") à esquerda em modo M.

IMPRESSÃO
Achados sugestivos de pneumotórax bilateral, a serem correlacionados ao
quadro clínico. Achado de potencial gravidade clínica imediata em paciente
com instabilidade hemodinâmica e respiratória; recomenda-se avaliação
imediata de equipe especializada para conduta dirigida.
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
POCUS eFAST (28/04/2026): Achados sugestivos de pneumotórax bilateral, a
serem correlacionados ao quadro clínico em paciente com instabilidade
hemodinâmica e respiratória.
```

## Critérios: 10/10 ✅

## Notas

À direita: lung point (sinal mais específico). À esquerda: código de barras (modo M, ausência de seashore sign) — sinais complementares. Termos bilíngues entre aspas (`"barcode sign"`) seguem a convenção do design system.
