# [eFAST 05] Derrame pericárdico pequeno sem sinais de tamponamento

> **Tipo:** ALTERADO · **Camada:** L1 · **Status:** rascunho · **v1.0**

## Cenário clínico

Homem, 45 anos, vítima de queda de 2m com trauma torácico anterior. Dor torácica leve, PA 124/78, FC 92, sem sinais de instabilidade. eFAST realizado para avaliação dirigida.

## Inputs simulados

- `morrison` → normal
- `esplenorrenal` → normal
- `suprapubica` → normal
- `subxifoide` → achado **`derrame_pericardico_pequeno`** ("Derrame pericárdico pequeno, anecoico, sem repercussão ecográfica em câmaras cardíacas")
- `pleural_direito` → normal
- `pleural_esquerdo` → normal
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
Pleura bilateral sem alterações ecográficas significativas.
Espaço hepatorrenal sem evidência de líquido livre, recesso subfrênico
direito sem líquido livre e goteira parietocólica direita sem líquido livre.
Espaço esplenorrenal sem evidência de líquido livre, recesso subfrênico
esquerdo sem líquido livre e goteira parietocólica esquerda sem líquido
livre.
Fundo de saco de Douglas sem evidência de líquido livre, sem líquido livre
perivesical e bexiga adequadamente repleta.
Derrame pericárdico pequeno, anecoico, sem repercussão ecográfica em
câmaras cardíacas.

IMPRESSÃO
Achados sugestivos de derrame pericárdico, a serem correlacionados ao
quadro clínico. Recomenda-se ecocardiograma transtorácico formal para
caracterização do derrame e avaliação de etiologia, bem como
acompanhamento clínico seriado.
Ultrassonografia point-of-care (POCUS) realizada à beira-leito, em contexto
clínico específico, com finalidade focada e dirigida a uma pergunta clínica.
Não substitui ultrassonografia formal realizada por especialista em
radiologia/ultrassonografia.

REFERÊNCIAS
1. Labovitz AJ et al. J Am Soc Echocardiogr. 2010;23(12):1225-1230.
2. Rozycki GS et al. J Trauma. 1995;39(3):492-498.
```

## LAUDO ESPERADO — objetivo

```
POCUS eFAST (28/04/2026): Achados sugestivos de derrame pericárdico
pequeno, sem repercussão ecográfica em câmaras cardíacas, a serem
correlacionados ao quadro clínico. Sugerido ecocardiograma formal.
```

## Critérios: 10/10 ✅

## Notas

Diferenciar derrame pequeno **sem tamponamento** de tamponamento (caso 04). A linguagem "sem repercussão ecográfica em câmaras cardíacas" deixa claro o que foi avaliado e descarta a categoria mais grave sem usar "exclui". Recomenda ECO formal — etiologia (hemorrágico/inflamatório) não é caracterizável por POCUS.
