import type { Protocolo, GrupoAchados } from './tipos';
import { LIMITACOES_GLOBAIS } from '../limitacoes';

const GRUPOS_BLUE: GrupoAchados[] = [
  {
    categoria: 'normal',
    label: 'Aeração preservada',
    achados: [
      { id: 'bl_n1', label: 'Deslizamento pleural presente' },
      { id: 'bl_n2', label: 'Padrão de linhas A preservado' },
      { id: 'bl_n3', label: '"Sinal da praia" ("seashore sign") ao modo M' },
      { id: 'bl_n4', label: 'Linha pleural fina e regular' },
      { id: 'bl_n5', label: 'Sem linhas B' },
      { id: 'bl_n6', label: 'Sem consolidações' },
      { id: 'bl_n7', label: 'Sem derrame pleural' },
    ],
  },
  {
    categoria: 'intersticial',
    label: 'Síndrome intersticial',
    achados: [
      { id: 'bl_i1', label: 'Presença de 3 linhas B isoladas (limite superior do normal)' },
      { id: 'bl_i2', label: 'Mais de 3 linhas B focais (perda moderada de aeração)' },
      { id: 'bl_i3', label: 'Linhas B coalescentes/confluentes (perda grave de aeração)' },
      { id: 'bl_i4', label: 'Padrão de "pulmão branco" ("white lung") — linhas B confluentes ocupando todo o campo' },
      { id: 'bl_i5', label: 'Artefato em "feixe de ondas B" ("light beam"), que pode estar associado a síndrome intersticial focal em fase inicial' },
    ],
  },
  {
    categoria: 'pleural_linha',
    label: 'Alterações da linha pleural',
    achados: [
      { id: 'bl_pl1', label: 'Linha pleural espessada' },
      { id: 'bl_pl2', label: 'Linha pleural irregular / fragmentada' },
      { id: 'bl_pl3', label: 'Linha pleural com interrupções focais' },
    ],
  },
  {
    categoria: 'consolidacao',
    label: 'Consolidações',
    achados: [
      { id: 'bl_c1', label: 'Pequena consolidação subpleural (~1cm)' },
      { id: 'bl_c2', label: 'Consolidações subpleurais múltiplas' },
      { id: 'bl_c3', label: 'Consolidação translobar com aspecto de "hepatização" pulmonar' },
      { id: 'bl_c4', label: 'Consolidação com broncograma aéreo dinâmico' },
      { id: 'bl_c5', label: 'Consolidação com broncograma aéreo estático, sugestivo de atelectasia' },
    ],
  },
  {
    categoria: 'derrame',
    label: 'Derrame pleural',
    achados: [
      { id: 'bl_d1', label: 'Pequena quantidade de líquido pleural' },
      { id: 'bl_d2', label: 'Moderada quantidade de líquido pleural' },
      { id: 'bl_d3', label: 'Volumoso derrame pleural' },
      { id: 'bl_d4', label: 'Derrame pleural com debris/septações, sugestivo de conteúdo complicado ou hemático' },
      { id: 'bl_d5', label: 'Presença de pulmão atelectasiado flutuante no derrame ("jellyfish sign")' },
      { id: 'bl_d6', label: '"Sinal sinusoidal" ("sinusoid sign") ao modo M, característico de derrame pleural' },
    ],
  },
  {
    categoria: 'pneumotorax',
    label: 'Pneumotórax',
    achados: [
      { id: 'bl_pt1', label: 'Ausência de deslizamento pleural com "sinal do código de barras" ("stratosphere sign") ao modo M, sugestivo de pneumotórax' },
      { id: 'bl_pt2', label: 'Ausência de deslizamento pleural com identificação de "ponto pulmonar" ("lung point"), altamente sugestivo de pneumotórax' },
      { id: 'bl_pt3', label: 'Ausência de deslizamento pleural com "pulso pulmonar" ("lung pulse") preservado — sugere atelectasia ou intubação seletiva, não pneumotórax' },
    ],
  },
];

const ZONAS = [
  { id: 'R1', nome: 'Hemitórax Direito — Ântero-superior (R1)' },
  { id: 'R2', nome: 'Hemitórax Direito — Ântero-inferior / Lateral (R2)' },
  { id: 'R3', nome: 'Hemitórax Direito — Póstero-basal (R3)' },
  { id: 'L1', nome: 'Hemitórax Esquerdo — Ântero-superior (L1)' },
  { id: 'L2', nome: 'Hemitórax Esquerdo — Ântero-inferior / Lateral (L2)' },
  { id: 'L3', nome: 'Hemitórax Esquerdo — Póstero-basal (L3)' },
];

export const BLUE: Protocolo = {
  id: 'blue',
  nome: 'BLUE',
  nomeCompleto: 'POCUS Pulmonar (BLUE de Lichtenstein + avaliação estendida 12 campos)',
  indicacao: 'Dispneia aguda, IRpA, monitoramento de síndrome intersticial, pneumotórax/derrame',
  icone: 'Wind',
  categoria: 'PULMONAR',
  transdutor: 'Convexo (≥10cm) ou Linear alta frequência',
  janelas: ZONAS.map((zona) => ({
    id: zona.id,
    nome: zona.nome,
    grupos: GRUPOS_BLUE.map((g) => ({
      ...g,
      achados: g.achados.map((a) => ({
        ...a,
        id: `${zona.id}_${a.id}`,
      })),
    })),
  })),
  janelasOpcionais: [
    {
      id: 'ventilacao',
      chipAtivadorId: 'bl_intubado',
      nome: 'Avaliação de Ventilação (Paciente Intubado)',
      grupos: [
        {
          categoria: 'ventilacao',
          label: 'Ventilação',
          achados: [
            { id: 'bl_v1', label: 'Deslizamento pleural sincronizado com ventilação em ambos hemitórax — ventilação bilateral confirmada' },
            { id: 'bl_v2', label: 'Deslizamento pleural preservado à direita, "pulso pulmonar" ("lung pulse") à esquerda — sugestivo de intubação seletiva em brônquio principal direito' },
            { id: 'bl_v3', label: 'Deslizamento pleural preservado à esquerda, "pulso pulmonar" à direita — sugestivo de intubação seletiva em brônquio principal esquerdo (menos comum)' },
            { id: 'bl_v4', label: 'Ausência de deslizamento pleural bilateral com pulso pulmonar ausente — sugestivo de não ventilação pulmonar (posicionamento esofágico do tubo ou obstrução)' },
            { id: 'bl_v5', label: 'Ausência de deslizamento pleural bilateral com pulso pulmonar presente — sugestivo de apneia ou obstrução de via aérea alta' },
          ],
        },
      ],
    },
  ],
  limitacoesTecnicas: LIMITACOES_GLOBAIS,
};
