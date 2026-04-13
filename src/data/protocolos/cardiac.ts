import type { Protocolo } from './tipos';
import { LIMITACOES_GLOBAIS } from '../limitacoes';

export const CARDIAC: Protocolo = {
  id: 'cardiac',
  nome: 'POCUS Cardíaco',
  nomeCompleto: 'Avaliação Cardíaca POCUS Básica',
  indicacao: 'Avaliação funcional e estrutural cardíaca básica à beira-leito',
  icone: 'Heart',
  categoria: 'CARDÍACO',
  transdutor: 'Phased Array (cardíaco) ou Convexo',
  janelas: [
    {
      id: 'card_plax',
      nome: 'Paraesternal Longo Eixo (PLAX)',
      grupos: [
        {
          categoria: 'normal',
          label: 'Normal',
          achados: [
            { id: 'ca_pl1', label: 'Câmaras com dimensões normais' },
            { id: 'ca_pl2', label: 'Valva mitral de abertura normal' },
            { id: 'ca_pl3', label: 'Valva aórtica de abertura normal' },
            { id: 'ca_pl4', label: 'Sem derrame pericárdico' },
          ],
        },
        {
          categoria: 'alterado',
          label: 'Alterado',
          achados: [
            { id: 'ca_pl5', label: 'Derrame pericárdico' },
            { id: 'ca_pl6', label: 'VE dilatado' },
            { id: 'ca_pl7', label: 'Septo interventricular espessado' },
            { id: 'ca_pl8', label: 'Hipocinesia de parede posterior' },
            { id: 'ca_pl9', label: 'Disfunção de valva mitral' },
            { id: 'ca_pl10', label: 'Disfunção de valva aórtica' },
            { id: 'ca_pl11', label: 'Derrame pleural esquerdo associado' },
          ],
        },
      ],
    },
    {
      id: 'card_psax',
      nome: 'Paraesternal Curto Eixo — Nível Papilares (PSAX)',
      grupos: [
        {
          categoria: 'normal',
          label: 'Normal',
          achados: [
            { id: 'ca_ps1', label: 'Contratilidade simétrica do VE' },
            { id: 'ca_ps2', label: 'Sem alterações segmentares de contratilidade' },
          ],
        },
        {
          categoria: 'alterado',
          label: 'Alterado',
          achados: [
            { id: 'ca_ps3', label: 'Hipocinesia de parede anterior' },
            { id: 'ca_ps4', label: 'Hipocinesia de parede inferior' },
            { id: 'ca_ps5', label: 'Hipocinesia de parede lateral' },
            { id: 'ca_ps6', label: 'Hipocinesia septal' },
            { id: 'ca_ps7', label: 'Padrão "D" do septo — sobrecarga de pressão do VD' },
            { id: 'ca_ps8', label: 'VE pequeno e hiperdinâmico — hipovolemia ou choque distributivo' },
          ],
        },
      ],
    },
    {
      id: 'card_a4c',
      nome: 'Apical 4 Câmaras (A4C)',
      grupos: [
        {
          categoria: 'normal',
          label: 'Normal',
          achados: [
            { id: 'ca_a1', label: 'Proporção VE/VD preservada (VE maior)' },
            { id: 'ca_a2', label: 'Função sistólica visualmente preservada' },
            { id: 'ca_a3', label: 'Septo interatrial íntegro' },
          ],
        },
        {
          categoria: 'alterado',
          label: 'Alterado',
          achados: [
            { id: 'ca_a4', label: 'VD dilatado — VD maior ou igual ao VE' },
            { id: 'ca_a5', label: 'Movimento paradoxal do septo interventricular' },
            { id: 'ca_a6', label: 'TAPSE visualmente reduzido — disfunção de VD' },
            { id: 'ca_a7', label: 'Derrame pericárdico' },
            { id: 'ca_a8', label: 'Trombo intracavitário suspeito' },
          ],
        },
      ],
    },
    {
      id: 'card_subcostal',
      nome: 'Subcostal (janela de emergência)',
      grupos: [
        {
          categoria: 'normal',
          label: 'Normal',
          achados: [
            { id: 'ca_sc1', label: 'Visualização adequada das câmaras' },
            { id: 'ca_sc2', label: 'Pericárdio sem derrame' },
          ],
        },
        {
          categoria: 'alterado',
          label: 'Alterado',
          achados: [
            { id: 'ca_sc3', label: 'Derrame pericárdico' },
            { id: 'ca_sc4', label: 'Sinais de tamponamento — colapso diastólico do AD/VD' },
            { id: 'ca_sc5', label: 'Janela subcostal limitada — abdome tenso ou obesidade' },
          ],
        },
      ],
    },
    {
      id: 'card_vci',
      nome: 'Veia Cava Inferior (via subcostal)',
      grupos: [
        {
          categoria: 'normal',
          label: 'Normal',
          achados: [
            { id: 'ca_vc1', label: 'VCI calibrosa com colapso inspiratório >50% — normovolemia' },
          ],
        },
        {
          categoria: 'alterado',
          label: 'Alterado',
          achados: [
            { id: 'ca_vc2', label: 'VCI colapsada — hipovolemia' },
            { id: 'ca_vc3', label: 'VCI dilatada sem colapso — hipervolemia ou ICD' },
            { id: 'ca_vc4', label: 'VCI dilatada com colapso parcial (<50%)' },
          ],
        },
      ],
    },
  ],
  limitacoesTecnicas: LIMITACOES_GLOBAIS,
};
