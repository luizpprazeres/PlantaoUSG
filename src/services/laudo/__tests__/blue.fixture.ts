/**
 * Fixtures comparativos do adapter BLUE.
 *
 * Cada cenário define um `input` (InputBruto) e o `outputEsperado` que o
 * adapter L1 deve produzir. Estes fixtures servem como referência clínica
 * para revisão pelo Luiz Paulo antes de promover L1 a fonte canônica do
 * laudo BLUE em produção.
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

export interface FixtureBlue {
  nome: string;
  descricao: string;
  input: InputBruto;
  /** Output esperado. `objetivo` usa "<DATA>" no lugar da data corrente. */
  outputEsperado: LaudoGerado;
}

// ─────────────────────────────────────────────────────────────────────────
// Cenário 1 — todas as zonas normais (testa P1: linha agregada única)
// ─────────────────────────────────────────────────────────────────────────
const FIXTURE_NORMAL_BILATERAL: FixtureBlue = {
  nome: 'normal-bilateral',
  descricao:
    'Todas as 6 zonas BLUE marcadas como normais. Testa hierarquia P1 (todas 6 normais → 1 linha agregada).',
  input: {
    protocolo: 'POCUS Pulmonar (BLUE de Lichtenstein + avaliação estendida 12 campos)',
    sigla: 'BLUE',
    transdutor: 'Convexo',
    janelas: [
      { nome: 'Hemitórax Direito — Ântero-superior (R1)', status: 'normal' },
      { nome: 'Hemitórax Direito — Ântero-inferior / Lateral (R2)', status: 'normal' },
      { nome: 'Hemitórax Direito — Póstero-basal (R3)', status: 'normal' },
      { nome: 'Hemitórax Esquerdo — Ântero-superior (L1)', status: 'normal' },
      { nome: 'Hemitórax Esquerdo — Ântero-inferior / Lateral (L2)', status: 'normal' },
      { nome: 'Hemitórax Esquerdo — Póstero-basal (L3)', status: 'normal' },
    ],
    observacoes: '',
    limitacoes: [],
  },
  outputEsperado: {
    extenso: [
      'TÉCNICA',
      'Exame realizado com transdutor convexo, direcionado a avaliação pulmonar à beira-leito por POCUS, em busca de sinais de aeração, síndrome intersticial, consolidação, derrame pleural ou pneumotórax.',
      '',
      'ACHADOS',
      'Aeração pulmonar preservada bilateralmente em todas as zonas avaliadas.',
      '',
      'IMPRESSÃO',
      'Exame sem alterações ecográficas significativas nas janelas avaliadas. Exame POCUS à beira-leito, caráter focado e complementar. Não substitui avaliação ultrassonográfica formal.',
      '',
      'REFERÊNCIAS',
      'Volpicelli G, et al. — International Liaison Committee on Lung Ultrasound (ILC-LUS). International Evidence-Based Recommendations for Point-of-Care Lung Ultrasound. Intensive Care Med. 2012;38(4):577-591.',
      'Lichtenstein DA. Current Misconceptions in Lung Ultrasound: A Short Guide for Experts. Chest. 2019;156(1):21-25.',
    ].join('\n'),
    objetivo:
      'POCUS BLUE (<DATA>): Exame realizado com transdutor convexo, direcionado a avaliação pulmonar à beira-leito. Sem alterações ecográficas significativas nas janelas avaliadas.',
  },
};

// ─────────────────────────────────────────────────────────────────────────
// Cenário 2 — padrão intersticial difuso + consolidação posterior
// ─────────────────────────────────────────────────────────────────────────
const FIXTURE_INTERSTICIAL: FixtureBlue = {
  nome: 'intersticial-difuso',
  descricao:
    'Linhas B coalescentes em zonas ântero-inferiores bilaterais; ântero-superiores normais; póstero-basais com pequena consolidação. Testa: P2 (par bilateral R1+L1) + linhas com prefixo nome completo + síntese severidade desc.',
  input: {
    protocolo: 'POCUS Pulmonar (BLUE de Lichtenstein + avaliação estendida 12 campos)',
    sigla: 'BLUE',
    transdutor: 'Convexo',
    janelas: [
      { nome: 'Hemitórax Direito — Ântero-superior (R1)', status: 'normal' },
      {
        nome: 'Hemitórax Direito — Ântero-inferior / Lateral (R2)',
        achados: [
          'Linhas B coalescentes/confluentes (perda grave de aeração)',
          'Linha pleural espessada',
        ],
      },
      {
        nome: 'Hemitórax Direito — Póstero-basal (R3)',
        achados: ['Pequena consolidação subpleural (~1cm)'],
      },
      { nome: 'Hemitórax Esquerdo — Ântero-superior (L1)', status: 'normal' },
      {
        nome: 'Hemitórax Esquerdo — Ântero-inferior / Lateral (L2)',
        achados: [
          'Linhas B coalescentes/confluentes (perda grave de aeração)',
          'Linha pleural espessada',
        ],
      },
      {
        nome: 'Hemitórax Esquerdo — Póstero-basal (L3)',
        achados: ['Pequena consolidação subpleural (~1cm)'],
      },
    ],
    observacoes: '',
    limitacoes: [],
  },
  outputEsperado: {
    extenso: [
      'TÉCNICA',
      'Exame realizado com transdutor convexo, direcionado a avaliação pulmonar à beira-leito por POCUS, em busca de sinais de aeração, síndrome intersticial, consolidação, derrame pleural ou pneumotórax.',
      '',
      'ACHADOS',
      'Aeração preservada bilateralmente em zonas ântero-superiores.',
      'Hemitórax Direito — Ântero-inferior / Lateral (R2): linhas B coalescentes/confluentes (perda grave de aeração). Linha pleural espessada.',
      'Hemitórax Direito — Póstero-basal (R3): pequena consolidação subpleural (~1cm).',
      'Hemitórax Esquerdo — Ântero-inferior / Lateral (L2): linhas B coalescentes/confluentes (perda grave de aeração). Linha pleural espessada.',
      'Hemitórax Esquerdo — Póstero-basal (L3): pequena consolidação subpleural (~1cm).',
      '',
      'IMPRESSÃO',
      'Achados sugestivos de consolidação pulmonar e síndrome intersticial, a serem correlacionados ao quadro clínico. Exame POCUS à beira-leito, caráter focado e complementar. Não substitui avaliação ultrassonográfica formal.',
      '',
      'REFERÊNCIAS',
      'Volpicelli G, et al. — International Liaison Committee on Lung Ultrasound (ILC-LUS). International Evidence-Based Recommendations for Point-of-Care Lung Ultrasound. Intensive Care Med. 2012;38(4):577-591.',
      'Lichtenstein DA. Current Misconceptions in Lung Ultrasound: A Short Guide for Experts. Chest. 2019;156(1):21-25.',
    ].join('\n'),
    objetivo:
      'POCUS BLUE (<DATA>): Exame realizado com transdutor convexo, direcionado a avaliação pulmonar à beira-leito. Achados sugestivos de consolidação pulmonar e síndrome intersticial, a serem correlacionados ao quadro clínico.',
  },
};

// ─────────────────────────────────────────────────────────────────────────
// Cenário 3 — pneumotórax R1 + derrame L3 + 4 zonas normais + limitações
// ─────────────────────────────────────────────────────────────────────────
//
// observacoes: '' (a Regra A força L4 quando observacoes não-vazia; aqui
// permanece em L1 para validar o adapter — limitações continuam em L1).
const FIXTURE_PTX_DERRAME_LIMITACOES: FixtureBlue = {
  nome: 'ptx-derrame-limitacoes',
  descricao:
    'Pneumotórax direito (R1 com lung point) + derrame pleural esquerdo (L3 moderada) + R2/R3/L1/L2 normais. Limitações: VM, biotipo. Testa: P2 par (R2,L2), P6 zonas isoladas (R3, L1), prefixo nome completo, síntese severidade desc (pneumotórax → derrame).',
  input: {
    protocolo: 'POCUS Pulmonar (BLUE de Lichtenstein + avaliação estendida 12 campos)',
    sigla: 'BLUE',
    transdutor: 'Linear alta frequência',
    janelas: [
      {
        nome: 'Hemitórax Direito — Ântero-superior (R1)',
        achados: [
          'Ausência de deslizamento pleural com identificação de "ponto pulmonar" ("lung point"), altamente sugestivo de pneumotórax',
        ],
      },
      { nome: 'Hemitórax Direito — Ântero-inferior / Lateral (R2)', status: 'normal' },
      { nome: 'Hemitórax Direito — Póstero-basal (R3)', status: 'normal' },
      { nome: 'Hemitórax Esquerdo — Ântero-superior (L1)', status: 'normal' },
      { nome: 'Hemitórax Esquerdo — Ântero-inferior / Lateral (L2)', status: 'normal' },
      {
        nome: 'Hemitórax Esquerdo — Póstero-basal (L3)',
        achados: ['Moderada quantidade de líquido pleural'],
      },
    ],
    observacoes: '',
    limitacoes: [
      'Paciente sob ventilação mecânica',
      'Paciente com biotipo limitante (obesidade, musculatura hipertrofiada)',
    ],
  },
  outputEsperado: {
    extenso: [
      'TÉCNICA',
      'Exame realizado com transdutor linear alta frequência, direcionado a avaliação pulmonar à beira-leito por POCUS, em busca de sinais de aeração, síndrome intersticial, consolidação, derrame pleural ou pneumotórax. Limitações técnicas: Paciente sob ventilação mecânica; Paciente com biotipo limitante (obesidade, musculatura hipertrofiada).',
      '',
      'ACHADOS',
      'Aeração preservada bilateralmente em zonas ântero-inferiores/laterais.',
      'Hemitórax Direito — Póstero-basal (R3) sem alterações ecográficas significativas.',
      'Hemitórax Esquerdo — Ântero-superior (L1) sem alterações ecográficas significativas.',
      'Hemitórax Direito — Ântero-superior (R1): ausência de deslizamento pleural com identificação de "ponto pulmonar" ("lung point"), altamente sugestivo de pneumotórax.',
      'Hemitórax Esquerdo — Póstero-basal (L3): moderada quantidade de líquido pleural.',
      '',
      'IMPRESSÃO',
      'Achados sugestivos de pneumotórax e derrame pleural, a serem correlacionados ao quadro clínico. Exame POCUS à beira-leito, caráter focado e complementar. Não substitui avaliação ultrassonográfica formal.',
      '',
      'REFERÊNCIAS',
      'Volpicelli G, et al. — International Liaison Committee on Lung Ultrasound (ILC-LUS). International Evidence-Based Recommendations for Point-of-Care Lung Ultrasound. Intensive Care Med. 2012;38(4):577-591.',
      'Lichtenstein DA. Current Misconceptions in Lung Ultrasound: A Short Guide for Experts. Chest. 2019;156(1):21-25.',
    ].join('\n'),
    objetivo:
      'POCUS BLUE (<DATA>): Exame realizado com transdutor linear alta frequência, direcionado a avaliação pulmonar à beira-leito. Achados sugestivos de pneumotórax e derrame pleural, a serem correlacionados ao quadro clínico.',
  },
};

export const FIXTURES_BLUE: readonly FixtureBlue[] = [
  FIXTURE_NORMAL_BILATERAL,
  FIXTURE_INTERSTICIAL,
  FIXTURE_PTX_DERRAME_LIMITACOES,
];
