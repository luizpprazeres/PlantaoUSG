# [eFAST 19] Pediátrico com trauma — linguagem ajustada

> **Tipo:** ALTERADO — população especial · **Camada:** L4 (texto livre — contexto pediátrico) · **Status:** rascunho · **v1.0**

## Cenário clínico

Menino, 8 anos, vítima de queda de bicicleta com trauma direto em flanco esquerdo. PA 102/64, FC 110 (basal pediátrica), Glasgow 15, dor em hipocôndrio esquerdo. eFAST realizado por equipe de emergência pediátrica.

## Inputs simulados

- `morrison` → normal
- `esplenorrenal` → achado **`liquido_esplenorrenal_pequeno`** ("Líquido livre em espaço esplenorrenal, anecoico, em pequena quantidade")
- `suprapubica` → normal
- `subxifoide` → normal
- `pleural_direito` → normal
- `pleural_esquerdo` → normal
- Texto livre: "Paciente pediátrico (8 anos) com trauma fechado em flanco esquerdo. Ausculta pulmonar simétrica, abdome doloroso à palpação no hipocôndrio esquerdo. Realizado eFAST com transdutor pediátrico (linear de alta frequência para avaliação pleural)."
- Voz: (vazio) · Limitações: (nenhuma)

## LAUDO ESPERADO — extenso

```
TÉCNICA
Ultrassonografia point-of-care eFAST realizada à beira-leito em paciente
pediátrico (8 anos) com transdutor adequado à faixa etária (convexo de
menor frequência e linear de alta frequência para avaliação pleural).
Abordagem focada para avaliação de líquido livre nas cavidades torácica,
abdominal e pélvica, com avaliação pleural e pericárdica dirigida. Exame de
caráter focado e dirigido a uma pergunta clínica específica.

ACHADOS
Pleura bilateral sem alterações ecográficas significativas.
Espaço hepatorrenal sem evidência de líquido livre, recesso subfrênico
direito sem líquido livre e goteira parietocólica direita sem líquido livre.
Fundo de saco de Douglas sem evidência de líquido livre, sem líquido livre
perivesical e bexiga adequadamente repleta.
Saco pericárdico sem evidência de derrame e sem sinais ecográficos de
tamponamento.
Líquido livre em espaço esplenorrenal, anecoico, em pequena quantidade.

IMPRESSÃO
Achados sugestivos de líquido livre intra-abdominal/pélvico em pequena
quantidade em paciente pediátrico com trauma fechado em flanco esquerdo, a
serem correlacionados ao quadro clínico. Em pediatria, a sensibilidade do
eFAST é menor que em adultos para detecção de lesão de víscera sólida sem
hemoperitônio significativo. Recomenda-se avaliação por equipe pediátrica
especializada e considerar tomografia computadorizada de abdome com
contraste para caracterização de eventual lesão de víscera sólida
(especialmente baço), bem como manter avaliação clínica seriada.
Ultrassonografia point-of-care (POCUS) realizada à beira-leito, em contexto
clínico específico, com finalidade focada e dirigida a uma pergunta clínica.
Não substitui ultrassonografia formal realizada por especialista em
radiologia/ultrassonografia.

REFERÊNCIAS
1. Holmes JF et al. Ann Emerg Med. 2013;62(2):107-116.
2. Rozycki GS et al. J Trauma. 1995;39(3):492-498.
```

## LAUDO ESPERADO — objetivo

```
POCUS eFAST (28/04/2026) em paciente pediátrico (8 anos): Achados sugestivos
de líquido livre em pequena quantidade em espaço esplenorrenal, a serem
correlacionados ao quadro clínico. Sensibilidade reduzida do eFAST em
pediatria. Recomendada TC de abdome e avaliação pediátrica especializada.
```

## Critérios: 10/10 ✅

## Notas

Pediatria tem **3 ajustes**:
1. Transdutor (linear ou convexo de menor frequência).
2. **Sensibilidade reduzida** do eFAST para lesão de víscera sólida sem hemoperitônio (Holmes 2013) — declarado explicitamente na impressão.
3. Encaminhamento para **equipe pediátrica especializada** + TC tem peso maior do que em adulto estável.

Linguagem da impressão evita "diagnóstico de lesão esplênica" — POCUS detecta líquido, não a lesão em si.
