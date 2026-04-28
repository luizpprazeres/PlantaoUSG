/**
 * Geração da seção TÉCNICA do laudo.
 *
 * Formato:
 *   "Exame realizado com transdutor {transdutor}, direcionado a {objetivo}.
 *    {limitações se houver}"
 *
 * Replicado da estrutura definida no system prompt de `api/gerar-laudo.ts`.
 */

import type { InputBruto } from './tipos';

export interface ObjetivoProtocolo {
  /** Frase curta descrevendo o objetivo do exame por protocolo. */
  objetivo: string;
}

const OBJETIVOS_POR_SIGLA: Record<string, string> = {
  BLUE:
    'avaliação pulmonar à beira-leito por POCUS, em busca de sinais de aeração, síndrome intersticial, consolidação, derrame pleural ou pneumotórax',
  EFAST:
    'pesquisa de líquido livre abdominal e pericárdico no contexto de trauma',
  RUSH:
    'avaliação hemodinâmica focada em paciente com choque indiferenciado',
  CARDIAC:
    'avaliação cardíaca focada à beira-leito',
  VEXUS:
    'avaliação de congestão venosa sistêmica',
  OBSTETRICO:
    'avaliação obstétrica focada à beira-leito',
};

function objetivoDoProtocolo(sigla: string): string {
  return OBJETIVOS_POR_SIGLA[sigla.toUpperCase()] ?? 'avaliação POCUS focada à beira-leito';
}

/**
 * Gera a seção TÉCNICA. Limitações são listadas em frase única separada
 * por ponto e vírgula, com prefixo "Limitações técnicas:".
 */
export function gerarTecnica(input: InputBruto): string {
  const partes: string[] = [];
  const objetivo = objetivoDoProtocolo(input.sigla);
  partes.push(
    `Exame realizado com transdutor ${input.transdutor.toLowerCase()}, direcionado a ${objetivo}.`
  );

  if (input.limitacoes.length > 0) {
    const lista = input.limitacoes
      .map((l) => l.trim())
      .filter((l) => l.length > 0)
      .join('; ');
    partes.push(`Limitações técnicas: ${lista}.`);
  }

  return partes.join(' ');
}
