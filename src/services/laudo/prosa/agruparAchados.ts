/**
 * Agrupamento de achados normais bilaterais em uma única linha.
 *
 * Regra do system prompt:
 *   "Achados normais agrupados quando bilateral: se R1 e L1 (mesmas zonas)
 *   ambos têm grupo 'normal' idêntico, gerar uma única linha tipo
 *   'Aeração preservada bilateralmente em zonas ântero-superiores'."
 *
 * Para o protocolo BLUE, o agrupamento bilateral é por par de zonas:
 *   R1 ↔ L1 (ântero-superior)
 *   R2 ↔ L2 (ântero-inferior/lateral)
 *   R3 ↔ L3 (póstero-basal)
 *
 * Esta camada é genérica: recebe lista de janelas normalizadas e regras
 * de pareamento, e devolve a lista compactada com as agrupadas mescladas.
 */

import type { JanelaNormalizada } from '../tipos';

export interface ParBilateral {
  /** sigla/key da janela direita, ex: "R1" */
  direita: string;
  /** sigla/key da janela esquerda, ex: "L1" */
  esquerda: string;
  /** descrição bilateral a usar quando ambos lados normais, ex: "ântero-superiores" */
  descricaoBilateral: string;
}

/**
 * Pares bilaterais do protocolo BLUE.
 * O matching é feito buscando a sigla entre parênteses no nome da janela.
 */
export const PARES_BLUE: readonly ParBilateral[] = [
  { direita: 'R1', esquerda: 'L1', descricaoBilateral: 'ântero-superiores' },
  { direita: 'R2', esquerda: 'L2', descricaoBilateral: 'ântero-inferiores/laterais' },
  { direita: 'R3', esquerda: 'L3', descricaoBilateral: 'póstero-basais' },
];

function siglaDe(nome: string): string {
  const match = /\(([^)]+)\)\s*$/.exec(nome);
  return match && match[1] ? match[1].trim() : nome.trim();
}

/**
 * Resultado do agrupamento: linhas adicionais bilaterais + janelas que
 * não foram agrupadas (e devem ser processadas individualmente).
 */
export interface ResultadoAgrupamento {
  linhasBilaterais: string[];
  janelasRestantes: JanelaNormalizada[];
}

/**
 * Aplica agrupamento bilateral. Para cada par, se AMBAS as janelas estão
 * com `tipo === 'normal'`, gera uma linha tipo
 * `"Aeração preservada bilateralmente em zonas <descrição>."` e remove
 * ambas das janelas restantes.
 *
 * Janelas com achados (ou apenas um lado normal) seguem para processamento
 * individual.
 */
export function agruparNormaisBilaterais(
  janelas: readonly JanelaNormalizada[],
  pares: readonly ParBilateral[]
): ResultadoAgrupamento {
  const restantes = [...janelas];
  const linhas: string[] = [];

  for (const par of pares) {
    const idxDir = restantes.findIndex(
      (j) => siglaDe(j.nome) === par.direita && j.tipo === 'normal'
    );
    if (idxDir === -1) continue;
    const idxEsq = restantes.findIndex(
      (j) => siglaDe(j.nome) === par.esquerda && j.tipo === 'normal'
    );
    if (idxEsq === -1) continue;

    linhas.push(
      `Aeração preservada bilateralmente em zonas ${par.descricaoBilateral}.`
    );

    // Remove ambos (cuidado com índices).
    const indicesParaRemover = [idxDir, idxEsq].sort((a, b) => b - a);
    for (const idx of indicesParaRemover) {
      restantes.splice(idx, 1);
    }
  }

  return { linhasBilaterais: linhas, janelasRestantes: restantes };
}
