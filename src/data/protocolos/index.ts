import { EFAST } from './efast';
import { BLUE } from './blue';
import { RUSH } from './rush';
import { CARDIAC } from './cardiac';
import { VEXUS } from './vexus';
import { OBSTETRICO } from './obstetrico';
import type { Protocolo } from './tipos';

export const PROTOCOLOS: Protocolo[] = [
  EFAST,
  BLUE,
  RUSH,
  CARDIAC,
  VEXUS,
  OBSTETRICO,
];

export const PROTOCOLO_MAP: Record<string, Protocolo> = Object.fromEntries(
  PROTOCOLOS.map((p) => [p.id, p])
);

export type { Protocolo, Janela, GrupoAchados, Achado } from './tipos';
