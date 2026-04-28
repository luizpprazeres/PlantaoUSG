/**
 * Remoção de redundância de localização em achados.
 *
 * Regra do system prompt:
 *   "NUNCA repita a localização no achado quando ela já está no início da linha."
 *   "Quando o achado já contém naturalmente a localização, escreva sem prefixo de janela."
 *
 * Heurística: se o label do achado já contém referência clara a uma região
 * anatômica (ex: "Espaço hepatorrenal sem evidência de líquido livre",
 * "Derrame pleural direito"), NÃO prefixar com o nome da janela.
 *
 * Para achados genéricos (ex: "Deslizamento pleural presente"), prefixamos
 * com a janela enxuta (ex: "R1: ...").
 */

/**
 * Termos anatômicos que, se presentes no label do achado, indicam que
 * a localização já está embutida e não precisa de prefixo de janela.
 *
 * Mantido conservador deliberadamente: lista explícita evita falsos positivos.
 */
const TERMOS_LOCALIZACAO_EMBUTIDA: readonly string[] = [
  'hepatorrenal',
  'esplenorrenal',
  'recesso de morrison',
  'morrison',
  'recesso esplenorrenal',
  'espaço subdiafragmático',
  'subdiafragmático',
  'fundo de saco',
  'saco de douglas',
  'pelve',
  'pericárdio',
  'pericárdico',
  'subcostal',
  'paraesternal',
  'apical',
  'suprasternal',
  'átrio',
  'ventrículo',
  'aorta',
  'veia cava',
  'porta',
  'hepática',
  'renal',
  'bexiga',
  'útero',
  'anexial',
  'ovariano',
];

/**
 * Verdadeiro se o label do achado contém termo anatômico que
 * já localiza o achado (não precisa de prefixo de janela).
 */
export function achadoContemLocalizacao(label: string): boolean {
  const lower = label.toLowerCase();
  return TERMOS_LOCALIZACAO_EMBUTIDA.some((termo) => lower.includes(termo));
}

/**
 * Extrai sigla curta do nome de janela.
 * Ex: "Hemitórax Direito — Ântero-superior (R1)" → "R1"
 *     "Espaço hepatorrenal (Morrison)" → "Morrison"
 *
 * Estratégia: pega o conteúdo entre últimos parênteses se houver;
 * caso contrário, retorna o nome inteiro.
 */
export function extrairSiglaJanela(nomeJanela: string): string {
  const match = /\(([^)]+)\)\s*$/.exec(nomeJanela);
  if (match && match[1]) return match[1].trim();
  return nomeJanela.trim();
}

/**
 * Aplica o prefixo de janela a uma linha de achados, mas só se nenhum
 * dos achados já contém localização embutida.
 *
 * Se TODOS os achados são genéricos: prefixar `"{sigla}: "`.
 * Se PELO MENOS UM tem localização embutida: não prefixar (já é claro).
 */
export function prefixarJanelaSeNecessario(
  nomeJanela: string,
  achados: readonly string[],
  linhaJunta: string
): string {
  const algumLocalizado = achados.some(achadoContemLocalizacao);
  if (algumLocalizado) return linhaJunta;
  const sigla = extrairSiglaJanela(nomeJanela);
  // Linha já capitalizada — coloca sigla + ":" + lower-case da primeira letra.
  // Mas isso quebra termos próprios. Mais seguro: sigla: linha (com primeira letra minúscula só se for letra normal).
  if (linhaJunta.length === 0) return linhaJunta;
  const primeiro = linhaJunta[0];
  // Se começa com aspas ou caractere especial, mantém como está.
  if (!/[A-ZÀ-Ú]/.test(primeiro)) {
    return `${sigla}: ${linhaJunta}`;
  }
  const corpo = primeiro.toLowerCase() + linhaJunta.slice(1);
  return `${sigla}: ${corpo}`;
}
