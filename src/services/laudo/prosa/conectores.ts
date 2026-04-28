/**
 * Vocabulário clínico para conectar achados em prosa fluente.
 *
 * Mantemos um conjunto enxuto de conectores para evitar prosa robotizada.
 * O joiner padrão é `". "` (ponto + espaço), conforme regra do system prompt:
 * "Cada achado em linha própria. [...] Mesclar chips + texto + voz."
 */

export const JOINER_ACHADOS = '. ';

/**
 * Garante que cada período começa com letra maiúscula e termina em ponto.
 * Não altera trechos entre aspas no início (ex: "sinal da praia" mantém aspas).
 */
export function capitalizarPeriodo(periodo: string): string {
  const trimmed = periodo.trim();
  if (trimmed.length === 0) return '';

  // Capitaliza primeira letra alfabética encontrada, ignorando aspas/parênteses.
  let resultado = trimmed;
  for (let i = 0; i < resultado.length; i++) {
    const ch = resultado[i];
    if (/[a-zà-ú]/i.test(ch)) {
      if (ch !== ch.toUpperCase()) {
        resultado = resultado.slice(0, i) + ch.toUpperCase() + resultado.slice(i + 1);
      }
      break;
    }
  }

  // Garante terminação com ponto (mas não duplica se já houver pontuação).
  const ultimo = resultado[resultado.length - 1];
  if (ultimo !== '.' && ultimo !== '!' && ultimo !== '?') {
    resultado += '.';
  }
  return resultado;
}

/**
 * Junta achados em uma única linha de prosa.
 * Cada achado vira uma sentença capitalizada terminada em ponto.
 */
export function juntarAchados(achados: readonly string[]): string {
  return achados
    .map((a) => capitalizarPeriodo(a))
    .filter((a) => a.length > 0)
    .join(' ');
}
