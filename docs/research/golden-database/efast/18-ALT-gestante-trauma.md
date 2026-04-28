# [eFAST 18] Gestante com trauma — cuidados específicos

> **Tipo:** ALTERADO — população especial · **Camada:** L4 (texto livre — contexto obstétrico) · **Status:** rascunho · **v1.0**

## Cenário clínico

Mulher, 27 anos, gestação de 26 semanas, vítima de colisão automobilística com cinto de segurança. PA 118/72, FC 96, dor em hipogástrio. eFAST realizado. Avaliação obstétrica focada complementar.

## Inputs simulados

- `morrison` → normal
- `esplenorrenal` → normal
- `suprapubica` → achado **`liquido_perivesical`** ("Lâmina de líquido livre perivesical, anecoica, em pequena quantidade — interpretação limitada pelo útero gravídico")
- `subxifoide` → normal
- `pleural_direito` → normal
- `pleural_esquerdo` → normal
- Texto livre: "Gestante de 26 semanas com trauma. Útero gravídico ocupa grande parte da pelve, dificultando a avaliação do fundo de saco de Douglas pela técnica habitual. Lâmina perivesical observada de difícil interpretação isolada — pode corresponder a achado fisiológico ou início de coleção patológica."
- Voz: (vazio) · Limitações: `gestacao_avancada`

## LAUDO ESPERADO — extenso

```
TÉCNICA
Ultrassonografia point-of-care eFAST realizada à beira-leito com transdutor
convexo 3.5 MHz, abordagem focada para avaliação de líquido livre nas
cavidades torácica, abdominal e pélvica, com avaliação pleural e pericárdica
dirigida. Exame de caráter focado e dirigido a uma pergunta clínica
específica, em paciente gestante de 26 semanas. Avaliação pélvica com
limitações inerentes ao útero gravídico, que ocupa grande parte da cavidade
pélvica.

ACHADOS
Pleura bilateral sem alterações ecográficas significativas.
Espaço hepatorrenal sem evidência de líquido livre, recesso subfrênico
direito sem líquido livre e goteira parietocólica direita sem líquido livre.
Espaço esplenorrenal sem evidência de líquido livre, recesso subfrênico
esquerdo sem líquido livre e goteira parietocólica esquerda sem líquido
livre.
Saco pericárdico sem evidência de derrame e sem sinais ecográficos de
tamponamento.
Lâmina de líquido livre perivesical, anecoica, em pequena quantidade — de
interpretação limitada pelo útero gravídico que ocupa grande parte da
cavidade pélvica.

IMPRESSÃO
Achado de lâmina de líquido perivesical em paciente gestante, de
significado clínico indeterminado pelo exame focado, a ser correlacionado
ao quadro clínico. Em contexto de gestação avançada, achado pode
corresponder a alteração fisiológica ou início de coleção patológica.
Recomenda-se avaliação obstétrica formal, ultrassonografia obstétrica para
avaliação de bem-estar fetal e descolamento prematuro de placenta, e
manter avaliação clínica seriada.
Ultrassonografia point-of-care (POCUS) realizada à beira-leito, em contexto
clínico específico, com finalidade focada e dirigida a uma pergunta clínica.
Não substitui ultrassonografia formal realizada por especialista em
radiologia/ultrassonografia.

REFERÊNCIAS
1. Rozycki GS et al. J Trauma. 1995;39(3):492-498.
2. Mendez-Figueroa H et al. Am J Obstet Gynecol. 2013;209(1):1-10.
```

## LAUDO ESPERADO — objetivo

```
POCUS eFAST (28/04/2026) em gestante de 26 semanas: Lâmina de líquido
perivesical de significado indeterminado, com avaliação pélvica limitada
pelo útero gravídico. Recomendada avaliação obstétrica formal e
ultrassonografia obstétrica.
```

## Critérios: 10/10 ✅

## Notas

População especial. eFAST em gestante tem **2 limitações**: (1) útero gravídico distorce a anatomia pélvica; (2) avaliação obstétrica concomitante (BCF, descolamento prematuro de placenta) é mandatória. O laudo nomeia ambas. Não compete a este laudo discutir bem-estar fetal — encaminha para USG obstétrica formal.
