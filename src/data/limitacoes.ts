import type { LimitacaoTecnica } from './protocolos/tipos';

export const LIMITACOES_GLOBAIS: LimitacaoTecnica[] = [
  { id: 'lt_biotipo', label: 'Paciente com biotipo limitante (obesidade, musculatura hipertrofiada)' },
  { id: 'lt_leito', label: 'Paciente restrito ao leito, decúbito único' },
  { id: 'lt_nao_coop', label: 'Paciente não cooperativo' },
  { id: 'lt_vm', label: 'Paciente sob ventilação mecânica' },
  { id: 'lt_sedacao', label: 'Paciente sob sedação profunda' },
  { id: 'lt_curativos', label: 'Presença de curativos/dispositivos limitando janelas acústicas' },
  { id: 'lt_enfisema', label: 'Enfisema subcutâneo limitando avaliação pleural' },
  { id: 'lt_gas_int', label: 'Interposição gasosa intestinal significativa' },
  { id: 'lt_dor_abd', label: 'Dor abdominal limitando janelas' },
  { id: 'lt_emergencia', label: 'Exame realizado em ambiente de emergência, caráter focado' },
];
