# [eFAST 14] Trauma penetrante — ferimento por arma de fogo abdominal

> **Tipo:** ALTERADO · **Camada:** L4 (texto livre — contexto clínico cirúrgico) · **Status:** rascunho · **v1.0**

## Cenário clínico

Homem, 29 anos, vítima de ferimento por arma de fogo (FAF) em hipocôndrio esquerdo com orifício único, sem orifício de saída identificado. PA 92/56, FC 130, palidez. Em ressuscitação. eFAST realizado durante avaliação inicial enquanto aguarda preparo de centro cirúrgico.

## Inputs simulados

- `morrison` → achado **`liquido_hepatorrenal`** ("Líquido livre em espaço hepatorrenal, anecoico")
- `esplenorrenal` → achado **`liquido_esplenorrenal_volumoso`** ("Líquido livre em espaço esplenorrenal, anecoico, em quantidade considerável")
- `suprapubica` → achado **`liquido_douglas`** ("Líquido livre em fundo de saco de Douglas, anecoico")
- `subxifoide` → normal
- `pleural_direito` → normal
- `pleural_esquerdo` → normal
- Texto livre: "FAST positivo amplo em paciente com trauma penetrante e instabilidade hemodinâmica. Avaliação realizada durante preparo para laparotomia exploradora."
- Voz: (vazio) · Limitações: (nenhuma)

## LAUDO ESPERADO — extenso

```
TÉCNICA
Ultrassonografia point-of-care eFAST realizada à beira-leito com transdutor
convexo 3.5 MHz, abordagem focada para avaliação de líquido livre nas
cavidades torácica, abdominal e pélvica, com avaliação pleural e pericárdica
dirigida. Exame de caráter focado e dirigido a uma pergunta clínica
específica, em paciente com trauma penetrante abdominal e instabilidade
hemodinâmica.

ACHADOS
Pleura bilateral sem alterações ecográficas significativas.
Saco pericárdico sem evidência de derrame e sem sinais ecográficos de
tamponamento.
Líquido livre em espaço hepatorrenal, anecoico.
Líquido livre em espaço esplenorrenal, anecoico, em quantidade considerável.
Líquido livre em fundo de saco de Douglas, anecoico.

IMPRESSÃO
Achados sugestivos de líquido livre intra-abdominal/pélvico em múltiplas
janelas, a serem correlacionados ao quadro clínico. Em paciente com trauma
penetrante abdominal e instabilidade hemodinâmica, achado de potencial
gravidade clínica imediata; recomenda-se avaliação imediata de equipe
especializada para conduta dirigida.
Ultrassonografia point-of-care (POCUS) realizada à beira-leito, em contexto
clínico específico, com finalidade focada e dirigida a uma pergunta clínica.
Não substitui ultrassonografia formal realizada por especialista em
radiologia/ultrassonografia.

REFERÊNCIAS
1. Rozycki GS et al. J Trauma. 1995;39(3):492-498.
2. Stengel D et al. Cochrane Database Syst Rev. 2018;12:CD012669.
```

## LAUDO ESPERADO — objetivo

```
POCUS eFAST (28/04/2026): Achados sugestivos de líquido livre
intra-abdominal/pélvico em múltiplas janelas (hepatorrenal, esplenorrenal e
Douglas) em paciente com trauma penetrante e instabilidade hemodinâmica.
Achado de potencial gravidade clínica imediata.
```

## Critérios: 10/10 ✅

## Notas

Em trauma penetrante com instabilidade, eFAST positivo **acelera** a indicação cirúrgica — paciente vai para sala de operação. O laudo registra a urgência sem prescrever a laparotomia (que é decisão do cirurgião).
