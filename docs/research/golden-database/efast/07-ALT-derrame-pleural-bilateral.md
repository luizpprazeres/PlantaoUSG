# [eFAST 07] Derrame pleural bilateral

> **Tipo:** ALTERADO · **Camada:** L1 · **Status:** rascunho · **v1.0**

## Cenário clínico

Mulher, 58 anos, vítima de queda da própria altura há 3 dias com trauma torácico. Dor torácica progressiva, dispneia leve. Admitida estável (PA 130/80, FC 88, SpO₂ 95%). eFAST realizado para avaliação dirigida.

## Inputs simulados

- `morrison` → normal
- `esplenorrenal` → normal
- `suprapubica` → normal
- `subxifoide` → normal
- `pleural_direito` → achado **`derrame_pleural_dir`** ("Derrame pleural à direita, anecoico, em quantidade moderada")
- `pleural_esquerdo` → achado **`derrame_pleural_esq`** ("Derrame pleural à esquerda, anecoico, em quantidade pequena")
- Texto livre: (vazio) · Voz: (vazio) · Limitações: (nenhuma)

## LAUDO ESPERADO — extenso

```
TÉCNICA
Ultrassonografia point-of-care eFAST realizada à beira-leito com transdutor
convexo 3.5 MHz, abordagem focada para avaliação de líquido livre nas
cavidades torácica, abdominal e pélvica, com avaliação pleural e pericárdica
dirigida. Exame de caráter focado e dirigido a uma pergunta clínica
específica.

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
Hemitórax Direito (pleural): derrame pleural à direita, anecoico, em
quantidade moderada.
Hemitórax Esquerdo (pleural): derrame pleural à esquerda, anecoico, em
quantidade pequena.

IMPRESSÃO
Achados sugestivos de derrame pleural bilateral, a serem correlacionados ao
quadro clínico. Recomenda-se ultrassonografia torácica formal e/ou
tomografia computadorizada para caracterização e quantificação adequadas,
bem como definição de etiologia.
Ultrassonografia point-of-care (POCUS) realizada à beira-leito, em contexto
clínico específico, com finalidade focada e dirigida a uma pergunta clínica.
Não substitui ultrassonografia formal realizada por especialista em
radiologia/ultrassonografia.

REFERÊNCIAS
1. Volpicelli G et al. Intensive Care Med. 2012;38(4):577-591.
2. Lichtenstein DA, Mezière GA. Chest. 2008;134(1):117-125.
```

## LAUDO ESPERADO — objetivo

```
POCUS eFAST (28/04/2026): Achados sugestivos de derrame pleural bilateral
(moderado à direita, pequeno à esquerda), a serem correlacionados ao
quadro clínico.
```

## Critérios: 10/10 ✅

## Notas

Ambas janelas pleurais com achados → linhas individuais com prefixo. Nenhuma frase consolidada P2 (que só aparece se ambas normais). Quantificação descritiva ("pequena", "moderada") apropriada — POCUS não fornece volume preciso.
