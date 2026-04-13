import type { Modulo } from '../tipos';

export const MODULO_BLUE: Modulo = {
  id: 'modulo_blue',
  protocolo: 'blue',
  titulo: 'Protocolo BLUE',
  subtitulo: 'Sinais do Mar — POCUS Pulmonar na Emergência',
  descricao:
    'Meia-noite numa UTI litorânea. O vento bate nas janelas. Seu paciente não respira bem, e o diagnóstico não é óbvio. O ultrassom está na sua mão — aprenda a ler o mar nos pulmões.',
  icone: '🌊',
  nivel: 'intermediario',
  pontosTotal: 90,
  aulas: [
    // ── AULA 1 ─────────────────────────────────────────────────────────────
    {
      id: 'blue_a1',
      titulo: 'A interface sólido-ar — fundamentos do POCUS pulmonar',
      duracaoMin: 10,
      esquemaHtml: `<div>
<h3>Linhas A vs Linhas B — Visão Esquemática</h3>
<table>
<tr>
  <th>Artefato</th>
  <th>Origem</th>
  <th>Direção</th>
  <th>Significado</th>
</tr>
<tr>
  <td><strong>Linha A</strong></td>
  <td>Pleura → reverberação</td>
  <td>Horizontal, paralela</td>
  <td>Ar alveolar normal (ou pneumotórax)</td>
</tr>
<tr>
  <td><strong>Linha B</strong></td>
  <td>Septo interlobular espessado</td>
  <td>Vertical, até o fundo</td>
  <td>Água intersticial (≥3 por campo = patológico)</td>
</tr>
</table>
<h3>Orientação do Transdutor</h3>
<table>
<tr>
  <th>Posição</th>
  <th>Vista</th>
</tr>
<tr><td>Anterior superior</td><td>Linha mamilar, 2º–3º EIC</td></tr>
<tr><td>Anterior inferior</td><td>Linha mamilar, 4º–5º EIC</td></tr>
<tr><td>Lateral</td><td>Linha axilar, 5º–6º EIC</td></tr>
</table>
</div>`,
      conteudo: `## Por que o pulmão resiste ao ultrassom

Era tarde. A tempestade lá fora jogava água contra o vidro da UTI. Seu paciente — 68 anos, dispneico, PA caindo — te olhava com os olhos que pediam respostas. O raio-X demoraria. A tomografia, mais ainda.

Você pegou o transdutor.

O pulmão é, por essência, hostil ao ultrassom. O ar nega a passagem do feixe sonoro — tudo que não é ar ou fluido aparece como artefato. Mas é exatamente nesses artefatos que mora o diagnóstico.

**O pulmão normal não é visível ao ultrassom. O que você vê são os seus reflexos.**

---

## A pleura: linha do horizonte

Posicione o transdutor perpendicularmente ao espaço intercostal. Você verá:

1. **Tecido subcutâneo** — camada ecogênica superficial
2. **Costelas** — estruturas hiperecogênicas com sombra acústica posterior
3. **Linha pleural** — linha branca, brilhante, entre as costelas (o "bat sign")

A linha pleural é sua linha do horizonte. Tudo o que acontece abaixo dela é artefato — mas artefato com significado clínico preciso.

Em pulmão normal, essa linha **desliza** durante a respiração. É o sinal do deslizamento pleural — a pleura visceral raspando sobre a parietal a cada ciclo.

---

## Sinal A — o mar em calmaria

Linhas A são **reverberações horizontais** da linha pleural. Surgem porque o feixe ultrassonográfico ressalta repetidamente entre a sonda e a interface ar-pleura.

- São **paralelas** à linha pleural
- São **equidistantes** entre si (mesma distância que a sonda-pleura)
- Aparecem em pulmão **normal** quando há deslizamento presente
- Também aparecem no **pneumotórax** — mas sem deslizamento

**Linhas A + deslizamento = pulmão aerado normal.**
**Linhas A + sem deslizamento = pneumotórax até prova contrária.**

---

## Sinal B — a tempestade que vem de dentro

Linhas B (ou "comet-tail artifacts") são artefatos **verticais** que surgem da linha pleural e se estendem até o fundo da tela sem se apagar.

Para ser uma linha B válida:
- Nasce na linha **pleural** (não em outro ponto)
- É **vertical**, sem desvio lateral
- Alcança o fundo da tela **sem atenuação**
- **Apaga** as linhas A ao cruzá-las
- **Move-se** com a respiração (junto com a pleura)

Linhas B representam septos interlobulares espessados por água — edema intersticial. São o equivalente ultrassonográfico das linhas B de Kerley no raio-X.

**Até 2 linhas B por espaço intercostal: normal (especialmente nas bases).**
**3 ou mais linhas B por campo: síndrome intersticial — água no pulmão.**
**Linhas B confluentes, cobrindo todo o campo: edema pulmonar.**

---

*Era a tempestade no pulmão do seu paciente. As linhas B inundavam os campos anteriores, bilateralmente. Você sabia o que fazer.*`,
      questoes: [
        {
          id: 'blue_a1_q1',
          enunciado: 'O "bat sign" (sinal do morcego) é formado por qual estrutura?',
          opcoes: [
            'A linha pleural hiperecogênica entre as sombras das costelas',
            'O diafragma e o fígado na janela subcostal',
            'A linha M entre pericárdio e pleura parietal',
            'O espaço intercostal com gordura subcutânea',
          ],
          correta: 0,
          explicacao:
            'O bat sign é identificado quando o transdutor é posicionado sobre um espaço intercostal: as sombras acústicas das duas costelas formam as "asas" e a linha pleural hiperecogênica entre elas forma o "corpo" do morcego. É o ponto de partida para toda avaliação pulmonar POCUS.',
        },
        {
          id: 'blue_a1_q2',
          enunciado: 'Uma linha B válida deve obrigatoriamente:',
          opcoes: [
            'Ser horizontal e paralela à linha pleural',
            'Partir da linha pleural, ser vertical, alcançar o fundo sem atenuação e mover-se com a respiração',
            'Aparecer apenas em modo M com o sinal da praia',
            'Ser visível somente nas bases pulmonares posteriores',
          ],
          correta: 1,
          explicacao:
            'Os 5 critérios de uma linha B válida (Volpicelli et al., 2012): (1) nasce na linha pleural, (2) é vertical, (3) alcança o fundo da tela sem atenuação, (4) apaga as linhas A ao cruzá-las, (5) move-se com a respiração. Linhas horizontais são linhas A — reverberações normais.',
        },
        {
          id: 'blue_a1_q3',
          enunciado: 'Padrão A bilateral com deslizamento pleural presente bilateralmente indica:',
          opcoes: [
            'Edema pulmonar cardiogênico',
            'Pneumotórax bilateral',
            'Pulmão aerado normal — ou TEP como diagnóstico diferencial',
            'Pneumonia bilateral extensa',
          ],
          correta: 2,
          explicacao:
            'Linhas A bilaterais com deslizamento presente = pulmão normal. No protocolo BLUE de Lichtenstein, o perfil A-A bilateral (sem consolidações posteriores) orienta para TEP como causa de dispneia — especialmente quando sem linhas B e sem consolidações. DPOC e asma também geram perfil A.',
        },
      ],
    },

    // ── AULA 2 ─────────────────────────────────────────────────────────────
    {
      id: 'blue_a2',
      titulo: 'Consolidações, derrames e o protocolo BLUE',
      duracaoMin: 12,
      esquemaHtml: `<div>
<h3>Perfis do Protocolo BLUE (Lichtenstein, 2008)</h3>
<table>
<tr>
  <th>Perfil</th>
  <th>Achado Anterior</th>
  <th>Achado Posterior</th>
  <th>Diagnóstico Mais Provável</th>
</tr>
<tr>
  <td><strong>A-profile</strong></td>
  <td>Linhas A bilaterais</td>
  <td>Sem consolidação</td>
  <td>TEP · DPOC · Asma</td>
</tr>
<tr>
  <td><strong>B-profile</strong></td>
  <td>Linhas B bilaterais (&gt;3/campo)</td>
  <td>—</td>
  <td>Edema pulmonar cardiogênico</td>
</tr>
<tr>
  <td><strong>A/B-profile</strong></td>
  <td>A de um lado / B do outro</td>
  <td>—</td>
  <td>Pneumonia</td>
</tr>
<tr>
  <td><strong>C-profile</strong></td>
  <td>Consolidação anterior</td>
  <td>—</td>
  <td>Pneumonia lobar</td>
</tr>
<tr>
  <td><strong>A + PLAPS</strong></td>
  <td>Linhas A bilaterais</td>
  <td>Consolidação/derrame póstero-lateral</td>
  <td>Pneumonia · Derrame</td>
</tr>
</table>
<h3>Sinais do Derrame Pleural</h3>
<table>
<tr><th>Sinal</th><th>Descrição</th></tr>
<tr><td>Quad sign</td><td>Espaço anecoico delimitado por pleuras e diafragma</td></tr>
<tr><td>Sinusoide sign</td><td>Pulmão se move para dentro e fora do líquido em modo M</td></tr>
<tr><td>Spine sign</td><td>Coluna visível acima do diafragma (normalmente obscurecida pelo ar)</td></tr>
</table>
</div>`,
      conteudo: `## O protocolo que organiza o caos

Daniel Lichtenstein publicou o protocolo BLUE em 2008 no jornal Chest. A pergunta era simples: em pacientes com dispneia aguda não diagnosticada, o POCUS pulmonar pode direcionar o diagnóstico?

A resposta foi sim — com acurácia de 90,5%.

O segredo era olhar para o lugar certo: pontos anteriores superiores, anteriores inferiores e o PLAPS-point (póstero-lateral alveolar e/ou pleural).

---

## Perfil B — a tempestade bilateral

Quando você encontra **três ou mais linhas B por espaço intercostal** nos campos anteriores **bilateralmente**, o diagnóstico mais provável é **edema pulmonar cardiogênico**.

A sensibilidade para EAP no perfil B é de 97% no estudo original. Não é patognomônico — pneumonite intersticial viral (incluindo COVID-19) também gera B bilateral — mas no contexto clínico certo, é suficiente para agir.

---

## Consolidação — o pulmão que virou fígado

Quando o ar alveolar é substituído por líquido ou tecido, o pulmão passa a conduzir o ultrassom como o fígado — chama-se **hepatização pulmonar**.

Na consolidação você verá:
- Área de **ecogenicidade semelhante ao parênquima hepático**
- **Broncograma aéreo:** pontos hiperecogênicos dentro da consolidação
  - **Dinâmico** (move com a respiração) = pneumonia ativa
  - **Estático** = atelectasia absortiva

---

## Derrame pleural — o mar entre as folhuras

O líquido pleural aparece como área **anecoica** (escura) entre as folhuras pleurais. Três sinais clássicos:

**Quad sign:** espaço quadrangular anecoico delimitado pelas duas pleuras, a costela e o diafragma.

**Spine sign:** em derrame volumoso, a coluna vertebral torna-se visível acima do diafragma — normalmente obscurecida pelo ar pulmonar.

**Sinusoide sign (modo M):** o pulmão comprimido se aproxima e se afasta da pleura parietal a cada respiração — movimento sinusoidal.

**Ecogenicidade do líquido:**
- **Anecoico homogêneo:** transudato provável (ICC, hipoalbuminemia)
- **Ecos internos, septações, debris:** exsudato, hemotórax, empiema — indicação de toracocentese

---

## PLAPS-point — o ponto que não pode ser esquecido

Muitas pneumonias e derrames são perdidos porque o médico examina apenas a face anterior. O PLAPS-point (axila posterior, entre 5º EIC e o diafragma) é onde a maioria das consolidações e derrames se acumula em decúbito dorsal.

No protocolo BLUE: perfil A anterior + consolidação no PLAPS = **pneumonia** até prova contrária.`,
      questoes: [
        {
          id: 'blue_a2_q1',
          enunciado:
            'Paciente com dispneia aguda. Linhas B confluentes bilaterais nos campos anteriores. Contexto: 70 anos, ICC conhecida. Qual o próximo passo mais correto?',
          opcoes: [
            'TC de tórax para confirmar o diagnóstico antes de tratar',
            'Tratar como EAP (diurético, vasodilatador) — perfil B bilateral + contexto = alta probabilidade',
            'Aguardar resultado do BNP para decisão terapêutica',
            'Antibiótico empírico para pneumonia bilateral',
          ],
          correta: 1,
          explicacao:
            'No protocolo BLUE, B-profile bilateral em paciente com ICC descompensada tem sensibilidade de 97% para EAP. O POCUS permite decisão terapêutica imediata, sem aguardar exames laboratoriais. Em emergência, o perfil B bilateral + contexto clínico compatível justifica tratamento imediato para EAP.',
        },
        {
          id: 'blue_a2_q2',
          enunciado: 'Broncograma aéreo DINÂMICO dentro de uma consolidação indica:',
          opcoes: [
            'Atelectasia absortiva — pulmão colapsado por obstrução brônquica',
            'Pneumonia ativa — ar ainda circula nos brônquios dentro da consolidação',
            'Derrame pleural complicado com septações',
            'Contusão pulmonar pós-traumática',
          ],
          correta: 1,
          explicacao:
            'Broncograma dinâmico = ar em movimento dentro de brônquios intra-consolidação, visível como pontos ou linhas hiperecogênicas que se movem com a respiração. É o sinal ultrassonográfico de pneumonia ativa. No colapso/atelectasia, os brônquios estão ocluídos — broncograma estático ou ausente. Especificidade para pneumonia ≈ 94%.',
        },
        {
          id: 'blue_a2_q3',
          enunciado: 'O "spine sign" em derrame pleural significa:',
          opcoes: [
            'Dor à palpação paravertebral — sinal clínico, não ultrassonográfico',
            'A coluna vertebral torna-se visível acima do diafragma, normalmente obscurecida pelo ar pulmonar',
            'Artefato de reverberação linear acima da linha pleural',
            'Sinal de pneumotórax bilateral',
          ],
          correta: 1,
          explicacao:
            'Em condições normais, o ar pulmonar impede a visualização da coluna acima do diafragma. Em derrame pleural volumoso, o líquido transmite o feixe ultrassonográfico e torna a coluna visível acima do diafragma — "spine sign". É sinal clássico de derrame, assim como o quad sign e o sinusoide sign.',
        },
      ],
    },

    // ── AULA 3 ─────────────────────────────────────────────────────────────
    {
      id: 'blue_a3',
      titulo: 'Pneumotórax: quando o mar some',
      duracaoMin: 9,
      esquemaHtml: `<div>
<h3>Modo M — Seashore Sign vs Stratosphere Sign</h3>
<table>
<tr>
  <th>Sinal</th>
  <th>Padrão Modo M</th>
  <th>Significado</th>
</tr>
<tr>
  <td><strong>Seashore sign</strong></td>
  <td>Granular acima (ondas) + granular dinâmico abaixo (areia)</td>
  <td>Pulmão NORMAL — deslizamento presente</td>
</tr>
<tr>
  <td><strong>Stratosphere sign (barcode)</strong></td>
  <td>Linhas horizontais acima e ABAIXO da pleura</td>
  <td>PNEUMOTÓRAX — sem deslizamento</td>
</tr>
</table>
<h3>Diagnóstico de Pneumotórax — Algoritmo</h3>
<table>
<tr>
  <th>Passo</th>
  <th>Achado</th>
  <th>Interpretação</th>
</tr>
<tr><td>1</td><td>Deslizamento ausente + A-lines</td><td>Suspeita de pneumotórax</td></tr>
<tr><td>2</td><td>Barcode sign no modo M</td><td>Reforça suspeita</td></tr>
<tr><td>3</td><td>Lung point encontrado</td><td>Pneumotórax CONFIRMADO (Sp 100%)</td></tr>
<tr><td>4</td><td>Ausência de lung point</td><td>Pneumotórax total ou diagnóstico alternativo</td></tr>
</table>
</div>`,
      conteudo: `## Quando o mar some

Havia algo diferente naquele paciente intubado. A saturação caía. O ventilador alarmeava pressões crescentes. Você colocou o transdutor na face anterior esquerda — e o pulmão havia sumido.

Não havia deslizamento. Não havia linhas B. Só linhas A estáticas, um código de barras congelado no tempo.

Era pneumotórax.

---

## O sinal do deslizamento — presente ou ausente

Em pulmão normal, a pleura visceral desliza sobre a parietal a cada ciclo respiratório. Em tempo real, você verá um movimento sutil — "formigueiro" ou "brilho deslizante" — na linha pleural.

**Ausência de deslizamento + linhas A = pneumotórax até prova contrária.**

Mas atenção: a ausência de deslizamento não é exclusiva do pneumotórax. Também ocorre em:
- Intubação seletiva (pulmão não ventilado)
- Aderências pleurais extensas (pós-pleurodese, TB)
- Atelectasia maciça
- Bulas enfisematosas volumosas

É por isso que o **lung point** é o sinal confirmatório.

---

## Lung point — o sinal patognomônico

O lung point é o ponto na parede torácica onde o pulmão colapsado encontra a parede pleural — a fronteira entre o pneumotórax e o pulmão expandido.

**Como identificar:** deslize o transdutor lateralmente a partir da região de ausência de deslizamento. Em algum ponto, você verá a transição: metade do ciclo respiratório com deslizamento (pulmão) e metade sem (ar livre).

**Especificidade do lung point: 100%.** Nenhum outro diagnóstico gera esse sinal.

Limitação: pneumotórax total não tem lung point — o pulmão está completamente colapsado.

---

## Modo M — lendo as ondas

O modo M registra o movimento ao longo do tempo sobre uma linha. Coloque o cursor perpendicular à linha pleural.

**Seashore sign (sinal da praia):**
- Acima da pleura: padrão **granular estático** (parece ondas do mar)
- Abaixo da pleura: padrão **granular dinâmico** (parece areia da praia)
- Significa: pulmão normal, deslizamento presente

**Stratosphere sign (sinal do código de barras / barcode sign):**
- Acima e abaixo da pleura: apenas **linhas horizontais paralelas**
- Significa: ausência de deslizamento = pneumotórax

---

## Armadilhas clínicas

**Bula enfisematosa:** pode abolir o deslizamento localmente. Não tem lung point. Busque a transição bula → pulmão normal adjacente.

**Intubação seletiva:** pulmão contralateral sem ventilação = sem deslizamento. Confirme com ausculta e capnografia antes de drenar.

**Pneumotórax bilateral pós-trauma:** cada lado deve ser avaliado independentemente. Assimetria clínica + ausência de deslizamento unilateral = drenagem imediata.

---

*Você encontrou o lung point no 4º espaço intercostal anterior. A agulha foi posicionada. O ar saiu, o ventilador aliviou, e a saturação subiu. O mar havia voltado.*`,
      questoes: [
        {
          id: 'blue_a3_q1',
          enunciado: 'O lung point é patognomônico de pneumotórax porque:',
          opcoes: [
            'Aparece apenas em pneumotórax espontâneo, não traumático',
            'Representa a fronteira entre pulmão colapsado e parede torácica — transição deslizamento presente/ausente no mesmo ciclo respiratório',
            'É o único sinal visível no modo M durante o barcode sign',
            'Corresponde ao ponto de menor pressão no espaço pleural',
          ],
          correta: 1,
          explicacao:
            'O lung point representa a borda do pneumotórax: no mesmo ponto, você alterna entre deslizamento (pulmão presente) e ausência de deslizamento (ar livre) ao longo do ciclo respiratório. Nenhuma outra condição gera essa transição dinâmica — por isso a especificidade é de 100%. Pneumotórax total não tem lung point porque o pulmão está completamente colapsado.',
        },
        {
          id: 'blue_a3_q2',
          enunciado: 'O stratosphere sign (barcode sign) no modo M indica:',
          opcoes: [
            'Pulmão normal com deslizamento presente',
            'Derrame pleural volumoso com septações',
            'Ausência de deslizamento pleural — compatível com pneumotórax',
            'Broncograma estático em consolidação',
          ],
          correta: 2,
          explicacao:
            'O barcode sign mostra linhas horizontais paralelas acima E abaixo da linha pleural — sem o padrão granular dinâmico abaixo que caracteriza o seashore sign normal. Representa ausência de deslizamento pleural. Embora sugestivo de pneumotórax, também pode ocorrer em aderências pleurais e atelectasia. O lung point confirma o diagnóstico.',
        },
        {
          id: 'blue_a3_q3',
          enunciado: 'Paciente intubado, saturação caindo, pressão de platô elevada. USG: ausência de deslizamento à esquerda, A-lines, sem lung point. A conduta mais correta é:',
          opcoes: [
            'Confirmar pneumotórax por TC antes de qualquer intervenção',
            'Drenagem torácica imediata à esquerda sem necessidade de mais confirmação',
            'Verificar posicionamento do tubo (intubação seletiva) antes de drenar — ausência de lung point pode indicar pneumotórax total ou causa alternativa',
            'Apenas ajustar parâmetros do ventilador e aguardar estabilização',
          ],
          correta: 2,
          explicacao:
            'A ausência de lung point pode significar: (a) pneumotórax total — pulmão completamente colapsado, sem fronteira visível; ou (b) intubação seletiva — pulmão contralateral sem ventilação. Antes de drenar, confirme posição do tubo (ausculta, capnografia). Em pneumotórax total com instabilidade hemodinâmica, a drenagem deve ser imediata — não aguardar TC.',
        },
      ],
    },
  ],
};
