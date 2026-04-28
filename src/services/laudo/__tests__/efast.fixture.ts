/**
 * Fixtures comparativos do adapter eFAST.
 *
 * Cada cenário define um `input` (InputBruto) e o `outputEsperado` que o
 * adapter L1 deve produzir. Estes fixtures servem como referência clínica
 * para revisão pelo Luiz Paulo antes de promover L1 a fonte canônica do
 * laudo eFAST em produção.
 *
 * Observação: o campo "objetivo" inclui a data corrente (formato pt-BR),
 * que muda a cada execução. As strings esperadas usam o placeholder
 * `<DATA>` no lugar para tornar a revisão estável.
 *
 * Invariante de roteamento (decisao.ts):
 *   Quando `observacoes.trim().length > 0`, o caso é desviado para L4 e o
 *   adapter L1 nunca é chamado. Por isso TODOS os fixtures abaixo usam
 *   `observacoes: ''` — validar L1 isoladamente.
 */

import type { InputBruto, LaudoGerado } from '../tipos';

export interface FixtureEfast {
  nome: string;
  descricao: string;
  input: InputBruto;
  /** Output esperado. `objetivo` usa "<DATA>" no lugar da data corrente. */
  outputEsperado: LaudoGerado;
}

const PROTOCOLO_NOME =
  'Extended Focused Assessment with Sonography in Trauma';
const TRANSDUTOR =
  'Convexo (abdominal) + Linear alta frequência (pleural)';

const TECNICA_PADRAO =
  'Exame realizado com transdutor convexo (abdominal) + linear alta frequência (pleural), direcionado a avaliação de líquido livre em cavidades torácica, abdominal e pélvica, com avaliação pleural e pericárdica focada.';

const REFERENCIAS_EFAST = [
  'Kirkpatrick AW, et al.. Point-of-Care Ultrasound in Critical Care: A Narrative Review. Can J Anaesth. 2023.',
  'Shokoohi H, et al.. Point-of-Care Ultrasound in Emergency Medicine: A Structured Review of Impact on Diagnosis. Ann Emerg Med. 2021.',
];

const DISCLAIMER =
  'Exame POCUS à beira-leito, caráter focado e complementar. Não substitui avaliação ultrassonográfica formal.';

// ─────────────────────────────────────────────────────────────────────────
// Cenário 1 — Todas as 6 janelas normais (testa P1: linha agregada única)
// ─────────────────────────────────────────────────────────────────────────
const FIXTURE_TODAS_NORMAIS: FixtureEfast = {
  nome: 'todas-normais',
  descricao:
    'Todas as 6 janelas eFAST marcadas como normais. Testa hierarquia P1 (todas 6 normais → 1 linha consolidada).',
  input: {
    protocolo: PROTOCOLO_NOME,
    sigla: 'eFAST',
    transdutor: TRANSDUTOR,
    janelas: [
      { nome: 'Quadrante Superior Direito (Morrison)', status: 'normal' },
      { nome: 'Quadrante Superior Esquerdo (Esplenorrenal)', status: 'normal' },
      { nome: 'Suprapúbica (Fundo de saco de Douglas)', status: 'normal' },
      { nome: 'Subxifoide (Pericárdio)', status: 'normal' },
      { nome: 'Hemitórax Direito (pleural)', status: 'normal' },
      { nome: 'Hemitórax Esquerdo (pleural)', status: 'normal' },
    ],
    observacoes: '',
    limitacoes: [],
  },
  outputEsperado: {
    extenso: [
      'TÉCNICA',
      TECNICA_PADRAO,
      '',
      'ACHADOS',
      'Exame eFAST sem evidência de líquido livre nas cavidades avaliadas, sem derrame pericárdico ou pneumotórax.',
      '',
      'IMPRESSÃO',
      `Exame sem alterações ecográficas significativas nas janelas avaliadas. ${DISCLAIMER}`,
      '',
      'REFERÊNCIAS',
      REFERENCIAS_EFAST[0],
      REFERENCIAS_EFAST[1],
    ].join('\n'),
    objetivo:
      'POCUS eFAST (<DATA>): Exame realizado com transdutor convexo (abdominal) + linear alta frequência (pleural), direcionado a avaliação de líquido livre em cavidades torácica, abdominal e pélvica, com avaliação pleural e pericárdica focada. Sem alterações ecográficas significativas nas janelas avaliadas.',
  },
};

// ─────────────────────────────────────────────────────────────────────────
// Cenário 2 — Morrison com líquido moderado + Subxifoide com tamponamento
//             + pleural bilateral normal + Esplenorrenal/Suprapúbica omitidas
// ─────────────────────────────────────────────────────────────────────────
//
// Testa: P2 (par pleural bilateral preservado), janelas únicas alteradas
// SEM prefixo (achados já contêm localização — hepatorrenal, pericárdico),
// IMPRESSÃO em ordem de severidade decrescente
// (tamponamento pericárdico → líquido livre intra-abdominal/pélvico).
const FIXTURE_TAMPONAMENTO_LIQUIDO: FixtureEfast = {
  nome: 'tamponamento-liquido-pleural-normal',
  descricao:
    'Morrison com líquido livre moderado + Subxifoide com tamponamento + pleural D/E normais. Esplenorrenal e Suprapúbica omitidas (não preenchidas). Testa P2 + janelas únicas alteradas (sem prefixo) + síntese severidade desc.',
  input: {
    protocolo: PROTOCOLO_NOME,
    sigla: 'eFAST',
    transdutor: TRANSDUTOR,
    janelas: [
      {
        nome: 'Quadrante Superior Direito (Morrison)',
        achados: ['Moderada quantidade de líquido livre no espaço hepatorrenal'],
      },
      {
        nome: 'Subxifoide (Pericárdio)',
        achados: [
          'Derrame pericárdico com sinais sugestivos de tamponamento (colabamento diastólico de câmaras direitas)',
        ],
      },
      { nome: 'Hemitórax Direito (pleural)', status: 'normal' },
      { nome: 'Hemitórax Esquerdo (pleural)', status: 'normal' },
    ],
    observacoes: '',
    limitacoes: [],
  },
  outputEsperado: {
    extenso: [
      'TÉCNICA',
      TECNICA_PADRAO,
      '',
      'ACHADOS',
      'Pleura bilateral sem alterações ecográficas significativas.',
      'Moderada quantidade de líquido livre no espaço hepatorrenal.',
      'Derrame pericárdico com sinais sugestivos de tamponamento (colabamento diastólico de câmaras direitas).',
      '',
      'IMPRESSÃO',
      `Achados sugestivos de tamponamento pericárdico e líquido livre intra-abdominal/pélvico, a serem correlacionados ao quadro clínico. ${DISCLAIMER}`,
      '',
      'REFERÊNCIAS',
      REFERENCIAS_EFAST[0],
      REFERENCIAS_EFAST[1],
    ].join('\n'),
    objetivo:
      'POCUS eFAST (<DATA>): Exame realizado com transdutor convexo (abdominal) + linear alta frequência (pleural), direcionado a avaliação de líquido livre em cavidades torácica, abdominal e pélvica, com avaliação pleural e pericárdica focada. Achados sugestivos de tamponamento pericárdico e líquido livre intra-abdominal/pélvico, a serem correlacionados ao quadro clínico.',
  },
};

// ─────────────────────────────────────────────────────────────────────────
// Cenário 3 — Pneumotórax direito + Suprapúbica com líquido livre pélvico
//             + outras 4 janelas normais + 1 limitação técnica
// ─────────────────────────────────────────────────────────────────────────
//
// Testa: P3 (janelas únicas normais — Morrison, Esplenorrenal, Subxifoide
// emitem frase concatenando achados normais sem prefixo de janela),
// P4 (Hemitórax Esquerdo pleural normal isolado emite linha individual),
// prefixo pleural quando há achados pleurais (PD com pneumotórax),
// IMPRESSÃO severidade desc (pneumotórax → líquido livre).
const FIXTURE_PNEUMOTORAX_LIQUIDO_LIMITACAO: FixtureEfast = {
  nome: 'pneumotorax-suprapubica-limitacao',
  descricao:
    'Pneumotórax R (PD com lung point) + Suprapúbica com líquido livre em pelve + Morrison/Esplenorrenal/Subxifoide normais + Pleural E normal isolado. Limitação: VM. Testa P3 (janelas únicas normais com achados concatenados) + P4 (pleural isolado) + prefixo pleural alterado + síntese severidade desc.',
  input: {
    protocolo: PROTOCOLO_NOME,
    sigla: 'eFAST',
    transdutor: TRANSDUTOR,
    janelas: [
      { nome: 'Quadrante Superior Direito (Morrison)', status: 'normal' },
      { nome: 'Quadrante Superior Esquerdo (Esplenorrenal)', status: 'normal' },
      {
        nome: 'Suprapúbica (Fundo de saco de Douglas)',
        achados: ['Moderada quantidade de líquido livre em pelve'],
      },
      { nome: 'Subxifoide (Pericárdio)', status: 'normal' },
      {
        nome: 'Hemitórax Direito (pleural)',
        achados: [
          'Ausência de deslizamento pleural com identificação de "ponto pulmonar" ("lung point"), altamente sugestivo de pneumotórax',
        ],
      },
      { nome: 'Hemitórax Esquerdo (pleural)', status: 'normal' },
    ],
    observacoes: '',
    limitacoes: ['Paciente sob ventilação mecânica'],
  },
  outputEsperado: {
    extenso: [
      'TÉCNICA',
      `${TECNICA_PADRAO} Limitações técnicas: Paciente sob ventilação mecânica.`,
      '',
      'ACHADOS',
      'Espaço hepatorrenal sem evidência de líquido livre. Recesso subfrênico direito sem líquido livre. Goteira parietocólica direita sem líquido livre.',
      'Espaço esplenorrenal sem evidência de líquido livre. Recesso subfrênico esquerdo sem líquido livre. Goteira parietocólica esquerda sem líquido livre.',
      'Saco pericárdico sem evidência de derrame. Sem sinais ecográficos de tamponamento.',
      'Hemitórax Esquerdo (pleural) sem alterações ecográficas significativas.',
      'Moderada quantidade de líquido livre em pelve.',
      'Hemitórax Direito (pleural): ausência de deslizamento pleural com identificação de "ponto pulmonar" ("lung point"), altamente sugestivo de pneumotórax.',
      '',
      'IMPRESSÃO',
      `Achados sugestivos de pneumotórax e líquido livre intra-abdominal/pélvico, a serem correlacionados ao quadro clínico. ${DISCLAIMER}`,
      '',
      'REFERÊNCIAS',
      REFERENCIAS_EFAST[0],
      REFERENCIAS_EFAST[1],
    ].join('\n'),
    objetivo:
      'POCUS eFAST (<DATA>): Exame realizado com transdutor convexo (abdominal) + linear alta frequência (pleural), direcionado a avaliação de líquido livre em cavidades torácica, abdominal e pélvica, com avaliação pleural e pericárdica focada. Achados sugestivos de pneumotórax e líquido livre intra-abdominal/pélvico, a serem correlacionados ao quadro clínico.',
  },
};

export const FIXTURES_EFAST: readonly FixtureEfast[] = [
  FIXTURE_TODAS_NORMAIS,
  FIXTURE_TAMPONAMENTO_LIQUIDO,
  FIXTURE_PNEUMOTORAX_LIQUIDO_LIMITACAO,
];
