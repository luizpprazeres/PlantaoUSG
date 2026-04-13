import type { Protocolo } from './tipos';
import { LIMITACOES_GLOBAIS } from '../limitacoes';

export const VEXUS: Protocolo = {
  id: 'vexus',
  nome: 'VExUS',
  nomeCompleto: 'Venous Excess Ultrasound',
  indicacao: 'Avaliação de congestão venosa sistêmica — guia de diurese em UTI',
  icone: 'Waves',
  categoria: 'CONGESTÃO',
  transdutor: 'Convexo (abdominal) + Phased Array',
  janelas: [
    {
      id: 'vex_vci',
      nome: 'VCI — Diâmetro e Colapso',
      grupos: [
        {
          categoria: 'normal',
          label: 'Normal',
          achados: [
            { id: 'vx_v1', label: 'VCI <2cm com colapso normal — VExUS grau 0 (sem congestão)' },
          ],
        },
        {
          categoria: 'alterado',
          label: 'Alterado',
          achados: [
            { id: 'vx_v2', label: 'VCI ≥2cm sem colapso — pré-requisito para VExUS graus 1–3' },
            { id: 'vx_v3', label: 'VCI colapsada — hipovolemia, VExUS não aplicável' },
          ],
        },
      ],
    },
    {
      id: 'vex_hepatica',
      nome: 'Veia Hepática (Doppler)',
      grupos: [
        {
          categoria: 'normal',
          label: 'Normal',
          achados: [
            { id: 'vx_h1', label: 'Padrão S>D sem reversão — congestão hepática ausente' },
          ],
        },
        {
          categoria: 'alterado',
          label: 'Alterado',
          achados: [
            { id: 'vx_h2', label: 'Padrão S<D — congestão leve a moderada (grau 1)' },
            { id: 'vx_h3', label: 'Padrão monofásico — congestão moderada (grau 2)' },
            { id: 'vx_h4', label: 'Onda S reversa — congestão grave (grau 3)' },
          ],
        },
      ],
    },
    {
      id: 'vex_porta',
      nome: 'Veia Porta (Doppler)',
      grupos: [
        {
          categoria: 'normal',
          label: 'Normal',
          achados: [
            { id: 'vx_p1', label: 'Fluxo portal contínuo — pulsatilidade <30% (normal)' },
          ],
        },
        {
          categoria: 'alterado',
          label: 'Alterado',
          achados: [
            { id: 'vx_p2', label: 'Fluxo portal pulsátil 30–50% — congestão moderada (grau 2)' },
            { id: 'vx_p3', label: 'Fluxo portal pulsátil >50% — congestão grave (grau 3)' },
            { id: 'vx_p4', label: 'Fluxo portal reverso — congestão grave (grau 3)' },
          ],
        },
      ],
    },
    {
      id: 'vex_renal',
      nome: 'Veia Renal Interlobar (Doppler)',
      grupos: [
        {
          categoria: 'normal',
          label: 'Normal',
          achados: [
            { id: 'vx_r1', label: 'Padrão contínuo — sem congestão renal venosa' },
          ],
        },
        {
          categoria: 'alterado',
          label: 'Alterado',
          achados: [
            { id: 'vx_r2', label: 'Padrão bifásico — congestão renal leve a moderada (grau 1–2)' },
            { id: 'vx_r3', label: 'Padrão monofásico ou descontínuo — congestão renal (grau 3)' },
            { id: 'vx_r4', label: 'Ausência de fluxo diastólico — congestão renal grave (grau 3)' },
          ],
        },
      ],
    },
    {
      id: 'vex_sintese',
      nome: 'Síntese VExUS',
      grupos: [
        {
          categoria: 'normal',
          label: 'Sem congestão significativa',
          achados: [
            { id: 'vx_s1', label: 'VExUS grau 0 — VCI <2cm, sem congestão venosa sistêmica' },
          ],
        },
        {
          categoria: 'alterado',
          label: 'Congestão presente',
          achados: [
            { id: 'vx_s2', label: 'VExUS grau 1 — VCI dilatada + 1 padrão anormal leve' },
            { id: 'vx_s3', label: 'VExUS grau 2 — VCI dilatada + 1 padrão anormal grave ou 2 leves' },
            { id: 'vx_s4', label: 'VExUS grau 3 — VCI dilatada + 2 ou mais padrões graves' },
          ],
        },
      ],
    },
  ],
  limitacoesTecnicas: LIMITACOES_GLOBAIS,
};
