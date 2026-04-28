/**
 * Geração da seção IMPRESSÃO do laudo.
 *
 * Estrutura:
 *   - 1 linha de síntese clínica comedida (heurística por presença de
 *     achados anormais ou normais).
 *   - Disclaimer obrigatório ao final (`disclaimer.ts`).
 *
 * O motor L1 trabalha apenas com dados estruturados (chips); a impressão
 * agregada é deliberadamente conservadora — quando há ambiguidade, a
 * decisão de roteamento (`decisao.ts`) já terá enviado o caso ao L4.
 */

import type { JanelaNormalizada } from './tipos';
import { DISCLAIMER_LAUDO } from './disclaimer';

export interface ImpressaoOptions {
  /** Sigla do protocolo (BLUE, eFAST, etc.) usada na frase de síntese. */
  sigla: string;
  /** Janelas normalizadas — detecta padrões "todas normais" vs. "alterações presentes". */
  janelas: readonly JanelaNormalizada[];
  /**
   * Frase de impressão clínica adicional fornecida pelo adapter, quando
   * conseguir inferir um padrão (ex: "Achados sugestivos de síndrome intersticial difusa").
   */
  sintesePersonalizada?: string;
}

export function gerarImpressao(options: ImpressaoOptions): string {
  const { janelas, sintesePersonalizada } = options;

  const todasNormais =
    janelas.length > 0 && janelas.every((j) => j.tipo === 'normal');

  let sintese: string;
  if (sintesePersonalizada && sintesePersonalizada.trim().length > 0) {
    sintese = sintesePersonalizada.trim();
    if (!sintese.endsWith('.')) sintese += '.';
  } else if (todasNormais) {
    sintese = 'Exame sem alterações ecográficas significativas nas janelas avaliadas.';
  } else if (janelas.length === 0) {
    sintese = 'Exame com janelas avaliáveis insuficientes para conclusão diagnóstica.';
  } else {
    sintese =
      'Achados ecográficos descritos acima, a serem correlacionados ao quadro clínico.';
  }

  return `${sintese} ${DISCLAIMER_LAUDO}`;
}
