import { EFAST } from './efast';
import { BLUE } from './blue';
import type { Protocolo } from './tipos';

export const PROTOCOLOS: Protocolo[] = [
  EFAST,
  BLUE,
];

export const PROTOCOLO_MAP: Record<string, Protocolo> = Object.fromEntries(
  PROTOCOLOS.map((p) => [p.id, p])
);

export type { Protocolo, Janela, GrupoAchados, Achado } from './tipos';
