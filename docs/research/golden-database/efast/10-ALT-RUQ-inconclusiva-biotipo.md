# [eFAST 10] Janela RUQ inconclusiva por biotipo do paciente

> **Tipo:** ALTERADO — caso limítrofe · **Camada:** L4 (texto livre) · **Status:** rascunho · **v1.0**

## Cenário clínico

Homem, 47 anos, IMC 41, vítima de queda de motocicleta com trauma abdominal direito. PA 130/82, FC 92, dor em hipocôndrio direito. eFAST realizado; janela hepatorrenal teve qualidade subótima por biotipo.

## Inputs simulados

- `morrison` → alterado (sem achado específico — limitação técnica)
- `esplenorrenal` → normal
- `suprapubica` → normal
- `subxifoide` → normal
- `pleural_direito` → normal
- `pleural_esquerdo` → normal
- Texto livre: "Janela hepatorrenal com qualidade subótima por biotipo do paciente. Penetração ultrassonográfica limitada; espaço hepatorrenal e recesso subfrênico direito não puderam ser avaliados de forma adequada."
- Voz: (vazio) · Limitações: `janela_acustica_subotima_RUQ`

## LAUDO ESPERADO — extenso

```
TÉCNICA
Ultrassonografia point-of-care eFAST realizada à beira-leito com transdutor
convexo 3.5 MHz, abordagem focada para avaliação de líquido livre nas
cavidades torácica, abdominal e pélvica, com avaliação pleural e pericárdica
dirigida. Exame de caráter focado e dirigido a uma pergunta clínica
específica. Janela hepatorrenal com qualidade subótima por biotipo do
paciente, com penetração ultrassonográfica limitada.

ACHADOS
Pleura bilateral sem alterações ecográficas significativas.
Espaço esplenorrenal sem evidência de líquido livre, recesso subfrênico
esquerdo sem líquido livre e goteira parietocólica esquerda sem líquido
livre.
Fundo de saco de Douglas sem evidência de líquido livre, sem líquido livre
perivesical e bexiga adequadamente repleta.
Saco pericárdico sem evidência de derrame e sem sinais ecográficos de
tamponamento.
Janela hepatorrenal com qualidade subótima — espaço hepatorrenal e
recesso subfrênico direito não puderam ser adequadamente avaliados.

IMPRESSÃO
Sem evidência ecográfica de líquido livre nas janelas adequadamente
avaliadas. Avaliação do espaço hepatorrenal limitada por janela acústica
subótima — a ausência de líquido livre nesta região não pôde ser
estabelecida pelo exame focado. Recomenda-se reavaliação seriada e/ou
ultrassonografia formal/tomografia computadorizada caso persista a suspeita
clínica de lesão em quadrante superior direito.
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
POCUS eFAST (28/04/2026): Sem evidência de líquido livre nas janelas
adequadamente avaliadas. Janela hepatorrenal limitada por biotipo —
recomenda-se reavaliação ou exame complementar caso persista suspeita
clínica.
```

## Critérios: 10/10 ✅

## Notas

Espelho do caso 09 (LUQ por gás) com causa diferente (biotipo). Mesma estrutura de redação defensável. Útil para o motor aprender que a **causa específica** da limitação muda mas o padrão de documentação é constante.
