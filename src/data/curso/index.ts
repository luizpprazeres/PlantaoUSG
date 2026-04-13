import { MODULO_BLUE } from './modulos/blue';
import type { Modulo } from './tipos';

export const MODULOS: Modulo[] = [
  MODULO_BLUE,
  // Futuros módulos:
  // MODULO_EFAST,
  // MODULO_RUSH,
  // MODULO_CARDIAC,
  // MODULO_VEXUS,
  // MODULO_OBSTETRICO,
];

export const MODULO_MAP: Record<string, Modulo> = Object.fromEntries(
  MODULOS.map((m) => [m.id, m])
);

export type { Modulo, Aula, QuestaoAula, ProgressoModulo, ProgressoAula, NivelCurso, StatusModulo } from './tipos';
