import type { Protocolo } from './tipos';
import { LIMITACOES_GLOBAIS } from '../limitacoes';

export const RUSH: Protocolo = {
  id: 'rush',
  nome: 'RUSH',
  nomeCompleto: 'Rapid Ultrasound in Shock',
  indicacao: 'Avaliação etiológica do choque na emergência',
  icone: 'Activity',
  categoria: 'CHOQUE',
  transdutor: 'Convexo (abdominal) + Phased Array (cardíaco)',
  janelas: [
    {
      id: 'rush_pericardio',
      nome: 'Pericárdio / Coração',
      grupos: [
        {
          categoria: 'normal',
          label: 'Normal',
          achados: [
            { id: 'ru_pc1', label: 'Sem derrame pericárdico' },
            { id: 'ru_pc2', label: 'FEVE visualmente preservada' },
            { id: 'ru_pc3', label: 'Câmaras sem dilatação' },
          ],
        },
        {
          categoria: 'alterado',
          label: 'Alterado',
          achados: [
            { id: 'ru_pc4', label: 'Derrame pericárdico discreto' },
            { id: 'ru_pc5', label: 'Derrame pericárdico moderado' },
            { id: 'ru_pc6', label: 'Derrame pericárdico volumoso' },
            { id: 'ru_pc7', label: 'Sinais de tamponamento cardíaco' },
            { id: 'ru_pc8', label: 'VD dilatado' },
            { id: 'ru_pc9', label: 'VD colapsado — choque distributivo' },
            { id: 'ru_pc10', label: 'Hipocinesia global' },
            { id: 'ru_pc11', label: 'FEVE visualmente reduzida' },
          ],
        },
      ],
    },
    {
      id: 'rush_vci',
      nome: 'Veia Cava Inferior',
      grupos: [
        {
          categoria: 'normal',
          label: 'Normal',
          achados: [
            { id: 'ru_v1', label: 'VCI calibrosa com colapso inspiratório >50% — normovolemia' },
          ],
        },
        {
          categoria: 'alterado',
          label: 'Alterado',
          achados: [
            { id: 'ru_v2', label: 'VCI colapsada/plana — hipovolemia' },
            { id: 'ru_v3', label: 'VCI dilatada sem colapso — hipervolemia ou ICD' },
            { id: 'ru_v4', label: 'VCI dilatada com colapso <50%' },
          ],
        },
      ],
    },
    {
      id: 'rush_morrison',
      nome: 'Quadrante Superior Direito (Morrison)',
      grupos: [
        {
          categoria: 'normal',
          label: 'Normal',
          achados: [
            { id: 'ru_m1', label: 'Espaço hepatorrenal sem líquido livre' },
            { id: 'ru_m2', label: 'Recesso subfrênico direito sem líquido livre' },
          ],
        },
        {
          categoria: 'alterado',
          label: 'Alterado',
          achados: [
            { id: 'ru_m3', label: 'Lâmina fina de líquido livre em Morrison' },
            { id: 'ru_m4', label: 'Moderada quantidade de líquido livre em Morrison' },
            { id: 'ru_m5', label: 'Volumoso líquido livre em Morrison' },
            { id: 'ru_m6', label: 'Líquido ecogênico/hemático em Morrison' },
          ],
        },
      ],
    },
    {
      id: 'rush_esplenorrenal',
      nome: 'Quadrante Superior Esquerdo (Esplenorrenal)',
      grupos: [
        {
          categoria: 'normal',
          label: 'Normal',
          achados: [
            { id: 'ru_e1', label: 'Espaço esplenorrenal sem líquido livre' },
            { id: 'ru_e2', label: 'Recesso subfrênico esquerdo sem líquido livre' },
          ],
        },
        {
          categoria: 'alterado',
          label: 'Alterado',
          achados: [
            { id: 'ru_e3', label: 'Lâmina fina de líquido livre perisplênico' },
            { id: 'ru_e4', label: 'Moderada quantidade de líquido livre perisplênico' },
            { id: 'ru_e5', label: 'Volumoso líquido livre perisplênico' },
            { id: 'ru_e6', label: 'Líquido ecogênico/hemático perisplênico' },
          ],
        },
      ],
    },
    {
      id: 'rush_pleural_d',
      nome: 'Pleural Direito',
      grupos: [
        {
          categoria: 'normal',
          label: 'Normal',
          achados: [
            { id: 'ru_pd1', label: 'Sem derrame pleural direito' },
            { id: 'ru_pd2', label: 'Linha pleural regular, sinal do deslizamento presente' },
          ],
        },
        {
          categoria: 'alterado',
          label: 'Alterado',
          achados: [
            { id: 'ru_pd3', label: 'Derrame pleural direito discreto' },
            { id: 'ru_pd4', label: 'Derrame pleural direito moderado' },
            { id: 'ru_pd5', label: 'Derrame pleural direito volumoso' },
            { id: 'ru_pd6', label: 'Derrame pleural loculado' },
            { id: 'ru_pd7', label: 'Consolidação pulmonar direita' },
            { id: 'ru_pd8', label: 'Ausência de sinal do deslizamento pleural — suspeita de pneumotórax' },
          ],
        },
      ],
    },
    {
      id: 'rush_pleural_e',
      nome: 'Pleural Esquerdo',
      grupos: [
        {
          categoria: 'normal',
          label: 'Normal',
          achados: [
            { id: 'ru_pe1', label: 'Sem derrame pleural esquerdo' },
            { id: 'ru_pe2', label: 'Linha pleural regular, sinal do deslizamento presente' },
          ],
        },
        {
          categoria: 'alterado',
          label: 'Alterado',
          achados: [
            { id: 'ru_pe3', label: 'Derrame pleural esquerdo discreto' },
            { id: 'ru_pe4', label: 'Derrame pleural esquerdo moderado' },
            { id: 'ru_pe5', label: 'Derrame pleural esquerdo volumoso' },
            { id: 'ru_pe6', label: 'Derrame pleural loculado' },
            { id: 'ru_pe7', label: 'Consolidação pulmonar esquerda' },
            { id: 'ru_pe8', label: 'Ausência de sinal do deslizamento pleural — suspeita de pneumotórax' },
          ],
        },
      ],
    },
    {
      id: 'rush_aorta',
      nome: 'Aorta Abdominal',
      grupos: [
        {
          categoria: 'normal',
          label: 'Normal',
          achados: [
            { id: 'ru_ao1', label: 'Aorta abdominal com diâmetro normal (<3cm)' },
            { id: 'ru_ao2', label: 'Paredes aórticas regulares, sem dilatação' },
          ],
        },
        {
          categoria: 'alterado',
          label: 'Alterado',
          achados: [
            { id: 'ru_ao3', label: 'Aorta dilatada (3–4,9cm) — aneurisma pequeno' },
            { id: 'ru_ao4', label: 'Aneurisma de aorta abdominal ≥5cm — referência cirúrgica urgente' },
            { id: 'ru_ao5', label: 'Diâmetro aórtico >3cm com suspeita de dissecção' },
            { id: 'ru_ao6', label: 'Trombo intraluminal visível' },
          ],
        },
      ],
    },
  ],
  limitacoesTecnicas: LIMITACOES_GLOBAIS,
};
