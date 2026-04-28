/**
 * Adapter BLUE — protótipo do motor L1.
 *
 * Recebe `InputBruto` do protocolo BLUE e produz `LaudoGerado`
 * (extenso + objetivo) totalmente no device, sem chamada de rede.
 *
 * Estrutura do extenso:
 *   TÉCNICA
 *   <linha em branco>
 *   ACHADOS
 *   <linha em branco>
 *   IMPRESSÃO
 *   <linha em branco>
 *   REFERÊNCIAS
 *
 * Regras críticas (espelhadas do system prompt em api/gerar-laudo.ts):
 *   - Janelas vazias OMITIDAS — nunca "não avaliada".
 *   - Janelas com prefixo no formato "Nome completo (sigla)".
 *   - Hierarquia de agrupamento de zonas normais (ver gerarAchadosSecao).
 *   - Linguagem comedida, sem afirmações absolutas — vem dos labels
 *     dos chips, mantemos como estão.
 *   - Termos bilíngues entre aspas mantidos como estão.
 *
 * Invariante de roteamento (ver decisao.ts):
 *   `inputBruto.observacoes.trim().length === 0` quando este adapter é
 *   chamado. Texto livre não-vazio é desviado para L4. Por isso o
 *   adapter NÃO concatena "Observações: ..." aos achados.
 */

import type { InputBruto, LaudoGerado, JanelaNormalizada } from '../tipos';
import { gerarTecnica } from '../tecnica';
import { gerarImpressao } from '../impressao';
import { gerarReferenciasTexto } from '../referencias';
import { juntarAchados } from '../prosa/conectores';
import { achadoContemLocalizacao } from '../prosa/desambiguar';

/** Normaliza o payload de janelas, descartando janelas sem dados. */
function normalizarJanelas(input: InputBruto): JanelaNormalizada[] {
  const normalizadas: JanelaNormalizada[] = [];
  for (const j of input.janelas) {
    if ('status' in j && j.status === 'normal') {
      normalizadas.push({ tipo: 'normal', nome: j.nome });
    } else if ('achados' in j && Array.isArray(j.achados) && j.achados.length > 0) {
      normalizadas.push({
        tipo: 'achados',
        nome: j.nome,
        achados: j.achados,
      });
    }
    // Janelas sem `status: 'normal'` e sem achados → omitidas.
  }
  return normalizadas;
}

/**
 * Heurística para síntese clínica BLUE em ordem de severidade decrescente:
 *   pneumotórax → derrame → consolidação → intersticial.
 *
 * - Caso múltiplos padrões: descreve combinação preservando essa ordem.
 * - Caso só normais: retorna undefined → cai no default "sem alterações...".
 */
function inferirSinteseBlue(janelas: readonly JanelaNormalizada[]): string | undefined {
  let temIntersticial = false;
  let temConsolidacao = false;
  let temDerrame = false;
  let temPneumotorax = false;

  for (const j of janelas) {
    if (j.tipo !== 'achados') continue;
    for (const ach of j.achados) {
      const lower = ach.toLowerCase();
      if (lower.includes('linhas b') || lower.includes('pulmão branco')) {
        temIntersticial = true;
      }
      if (lower.includes('consolida')) {
        temConsolidacao = true;
      }
      if (lower.includes('derrame') || lower.includes('líquido pleural')) {
        temDerrame = true;
      }
      if (lower.includes('pneumotórax') || lower.includes('código de barras') || lower.includes('lung point')) {
        temPneumotorax = true;
      }
    }
  }

  // Ordem severidade decrescente: pneumotórax → derrame → consolidação → intersticial.
  const conclusoes: string[] = [];
  if (temPneumotorax) conclusoes.push('pneumotórax');
  if (temDerrame) conclusoes.push('derrame pleural');
  if (temConsolidacao) conclusoes.push('consolidação pulmonar');
  if (temIntersticial) conclusoes.push('síndrome intersticial');

  if (conclusoes.length === 0) return undefined;
  if (conclusoes.length === 1) {
    return `Achados sugestivos de ${conclusoes[0]}, a serem correlacionados ao quadro clínico`;
  }
  const ultimo = conclusoes[conclusoes.length - 1];
  const inicio = conclusoes.slice(0, -1).join(', ');
  return `Achados sugestivos de ${inicio} e ${ultimo}, a serem correlacionados ao quadro clínico`;
}

// ─────────────────────────────────────────────────────────────────────────
// Hierarquia de agrupamento BLUE (6 prioridades)
// ─────────────────────────────────────────────────────────────────────────

/**
 * As 6 zonas BLUE com sigla, hemitórax e descritor anatômico.
 * Ordem deliberada: R1 antes de L1, etc., para manter R-then-L na saída.
 */
type Hemitorax = 'R' | 'L';
type Posicao = 'antero-superior' | 'antero-inferior' | 'postero-basal';

interface ZonaBlue {
  sigla: 'R1' | 'R2' | 'R3' | 'L1' | 'L2' | 'L3';
  hemitorax: Hemitorax;
  posicao: Posicao;
}

const ZONAS_BLUE: readonly ZonaBlue[] = [
  { sigla: 'R1', hemitorax: 'R', posicao: 'antero-superior' },
  { sigla: 'R2', hemitorax: 'R', posicao: 'antero-inferior' },
  { sigla: 'R3', hemitorax: 'R', posicao: 'postero-basal' },
  { sigla: 'L1', hemitorax: 'L', posicao: 'antero-superior' },
  { sigla: 'L2', hemitorax: 'L', posicao: 'antero-inferior' },
  { sigla: 'L3', hemitorax: 'L', posicao: 'postero-basal' },
];

const NOME_HEMITORAX: Record<Hemitorax, string> = {
  R: 'direito',
  L: 'esquerdo',
};

/** Extrai a sigla entre parênteses no final do nome da janela. */
function siglaDe(nome: string): string {
  const match = /\(([^)]+)\)\s*$/.exec(nome);
  return match && match[1] ? match[1].trim() : nome.trim();
}

/**
 * Devolve a janela cuja sigla corresponde, ou undefined.
 */
function janelaPorSigla(
  janelas: readonly JanelaNormalizada[],
  sigla: string
): JanelaNormalizada | undefined {
  return janelas.find((j) => siglaDe(j.nome) === sigla);
}

/**
 * Algoritmo de hierarquia (P1 → P6) para agrupar zonas normais.
 *
 * Ordem de prioridade FINAL (mutuamente exclusiva — uma zona só é "consumida"
 * uma vez):
 *   P1 — Todas 6 zonas normais (e nenhuma com achados): 1 linha agregada.
 *   P2 — Pares bilaterais (R1+L1), (R2+L2), (R3+L3) ambos normais:
 *        1 linha por par. Marca essas zonas como consumidas.
 *   P3 — Hemitórax inteiro (3 zonas) restantes e todas normais:
 *        "Hemitórax {direito|esquerdo} sem alterações ecográficas significativas."
 *   P4 — Anterior do hemitórax (zonas 1 e 2) restantes normais e zona 3 alterada:
 *        "Hemitórax {direito|esquerdo} anterior sem alterações..."
 *   P5 — Póstero-basal (zona 3) restante normal e zonas 1+2 ambas com achados:
 *        "Hemitórax {direito|esquerdo} posterior sem alterações..."
 *   P6 — Zona isolada normal (não cabe em P3/P4/P5):
 *        "{Nome completo} ({sigla}) sem alterações ecográficas significativas."
 *
 * Após emitir todas as linhas de "normal", emitir linhas de janelas com
 * achados, cada uma com prefixo "Nome completo (sigla):".
 */
function gerarLinhasBlueHierarquico(
  janelas: readonly JanelaNormalizada[]
): string[] {
  const linhas: string[] = [];

  // Mapeia sigla → janela normalizada (se presente).
  const janelaDe = (sigla: string) => janelaPorSigla(janelas, sigla);

  const eNormal = (sigla: string): boolean => {
    const j = janelaDe(sigla);
    return j !== undefined && j.tipo === 'normal';
  };

  const temAchado = (sigla: string): boolean => {
    const j = janelaDe(sigla);
    return j !== undefined && j.tipo === 'achados';
  };

  // Conjunto de zonas já "consumidas" por agrupamento de nível superior.
  const consumidas = new Set<string>();

  // ── P1 ── Todas as 6 normais e nenhuma com achados.
  const todas6Normais = ZONAS_BLUE.every((z) => eNormal(z.sigla));
  const algumaComAchado = ZONAS_BLUE.some((z) => temAchado(z.sigla));
  if (todas6Normais && !algumaComAchado) {
    linhas.push('Aeração pulmonar preservada bilateralmente em todas as zonas avaliadas.');
    ZONAS_BLUE.forEach((z) => consumidas.add(z.sigla));
    // Após P1, não há outras zonas normais a tratar.
    // Continua para emitir linhas de achados (que serão zero neste caso).
    emitirLinhasDeAchados(janelas, consumidas, linhas);
    return linhas;
  }

  // ── P2 ── Pares bilaterais (R1+L1), (R2+L2), (R3+L3) ambos normais.
  // P2 toma precedência sobre P3/P4/P5 quando aplicável, porque P2 já
  // expressa lateralidade sem perder informação.
  const PARES: Array<{ direita: ZonaBlue['sigla']; esquerda: ZonaBlue['sigla']; descricao: string }> = [
    { direita: 'R1', esquerda: 'L1', descricao: 'ântero-superiores' },
    { direita: 'R2', esquerda: 'L2', descricao: 'ântero-inferiores/laterais' },
    { direita: 'R3', esquerda: 'L3', descricao: 'póstero-basais' },
  ];
  for (const par of PARES) {
    if (eNormal(par.direita) && eNormal(par.esquerda)) {
      linhas.push(`Aeração preservada bilateralmente em zonas ${par.descricao}.`);
      consumidas.add(par.direita);
      consumidas.add(par.esquerda);
    }
  }

  // ── P3/P4/P5/P6 ── Para cada hemitórax, sobre as zonas RESTANTES (não consumidas).
  for (const hemi of ['R', 'L'] as const) {
    const zonasHemi = ZONAS_BLUE.filter((z) => z.hemitorax === hemi);
    const restantes = zonasHemi.filter((z) => !consumidas.has(z.sigla));
    if (restantes.length === 0) continue;

    const restantesNormais = restantes.filter((z) => eNormal(z.sigla));
    const restantesComAchado = restantes.filter((z) => temAchado(z.sigla));

    // P3 — Todas as 3 zonas do hemitórax restantes E todas normais.
    if (
      restantes.length === 3 &&
      restantesNormais.length === 3 &&
      restantesComAchado.length === 0
    ) {
      linhas.push(
        `Hemitórax ${NOME_HEMITORAX[hemi]} sem alterações ecográficas significativas.`
      );
      restantes.forEach((z) => consumidas.add(z.sigla));
      continue;
    }

    // P4 — Zonas anteriores (sigla 1 e 2) restantes normais E zona 3 alterada.
    const sigla1 = (`${hemi}1`) as ZonaBlue['sigla'];
    const sigla2 = (`${hemi}2`) as ZonaBlue['sigla'];
    const sigla3 = (`${hemi}3`) as ZonaBlue['sigla'];
    const sigla1Restante = !consumidas.has(sigla1);
    const sigla2Restante = !consumidas.has(sigla2);
    const sigla3Restante = !consumidas.has(sigla3);

    if (
      sigla1Restante && sigla2Restante &&
      eNormal(sigla1) && eNormal(sigla2) &&
      temAchado(sigla3)
    ) {
      linhas.push(
        `Hemitórax ${NOME_HEMITORAX[hemi]} anterior sem alterações ecográficas significativas.`
      );
      consumidas.add(sigla1);
      consumidas.add(sigla2);
      continue;
    }

    // P5 — Póstero-basal (zona 3) restante normal E zonas 1+2 ambas com achados.
    if (
      sigla3Restante && eNormal(sigla3) &&
      temAchado(sigla1) && temAchado(sigla2)
    ) {
      linhas.push(
        `Hemitórax ${NOME_HEMITORAX[hemi]} posterior sem alterações ecográficas significativas.`
      );
      consumidas.add(sigla3);
      continue;
    }

    // P6 — Zonas isoladas normais restantes.
    for (const z of restantes) {
      if (consumidas.has(z.sigla)) continue;
      const j = janelaDe(z.sigla);
      if (!j || j.tipo !== 'normal') continue;
      linhas.push(`${j.nome} sem alterações ecográficas significativas.`);
      consumidas.add(z.sigla);
    }
  }

  // ── Emitir linhas de janelas com achados (todas, com prefixo nome+sigla).
  emitirLinhasDeAchados(janelas, consumidas, linhas);

  return linhas;
}

/**
 * Para cada janela com achados, emite uma linha "Nome completo (sigla): ...".
 *
 * - Mantém a regra de desambiguação: se algum achado já contém localização
 *   anatômica embutida (ex: "Espaço hepatorrenal..."), não prefixa.
 * - Caso contrário, prefixa com o NOME COMPLETO da janela (ex:
 *   "Hemitórax Direito — Ântero-superior (R1):"), seguindo a regra C1.
 *
 * Para BLUE, os labels não contêm termos hepatorrenais/cardíacos da lista
 * de desambiguação, então o caminho prático é sempre prefixar.
 */
function emitirLinhasDeAchados(
  janelas: readonly JanelaNormalizada[],
  consumidas: Set<string>,
  linhasOut: string[]
): void {
  // Preserva a ordem do input para janelas com achados.
  for (const j of janelas) {
    if (j.tipo !== 'achados') continue;
    if (consumidas.has(siglaDe(j.nome))) continue;
    const linhaJunta = juntarAchados(j.achados);
    const linhaFinal = prefixarComNomeCompleto(j.nome, j.achados, linhaJunta);
    linhasOut.push(linhaFinal);
  }
}

/**
 * Prefixa a linha de achados com o NOME COMPLETO da janela (formato C1):
 *   "Hemitórax Direito — Ântero-superior (R1): linhas b coalescentes..."
 *
 * Mantém a heurística de desambiguação: se algum achado já contém termo
 * anatômico embutido (hepatorrenal, etc.), retorna a linha sem prefixo.
 */
function prefixarComNomeCompleto(
  nomeJanela: string,
  achados: readonly string[],
  linhaJunta: string
): string {
  if (linhaJunta.length === 0) return linhaJunta;
  if (achados.some(achadoContemLocalizacao)) {
    return linhaJunta;
  }
  // Coloca a primeira letra em minúscula (a linha é uma continuação após ":").
  const primeiro = linhaJunta[0];
  let corpo = linhaJunta;
  if (/[A-ZÀ-Ú]/.test(primeiro)) {
    corpo = primeiro.toLowerCase() + linhaJunta.slice(1);
  }
  return `${nomeJanela}: ${corpo}`;
}

/**
 * Gera a seção ACHADOS em prosa clínica usando a hierarquia de 6 prioridades.
 */
function gerarAchadosSecao(janelas: readonly JanelaNormalizada[]): string {
  const linhas = gerarLinhasBlueHierarquico(janelas);
  return linhas.join('\n');
}

/**
 * Gera o objetivo (parágrafo único).
 * Formato: "POCUS BLUE (DD/MM/YYYY): …"
 */
function gerarObjetivo(
  input: InputBruto,
  janelas: readonly JanelaNormalizada[],
  sintese: string | undefined,
  dataExame: string
): string {
  const partes: string[] = [`POCUS ${input.sigla} (${dataExame}):`];
  partes.push(
    `Exame realizado com transdutor ${input.transdutor.toLowerCase()}, direcionado a avaliação pulmonar à beira-leito.`
  );

  const todasNormais =
    janelas.length > 0 && janelas.every((j) => j.tipo === 'normal');

  if (todasNormais) {
    partes.push('Sem alterações ecográficas significativas nas janelas avaliadas.');
  } else if (janelas.length === 0) {
    partes.push('Janelas avaliáveis insuficientes para conclusão diagnóstica.');
  } else if (sintese) {
    partes.push(`${sintese}.`);
  } else {
    partes.push('Achados ecográficos descritos no laudo extenso, a serem correlacionados clinicamente.');
  }

  return partes.join(' ');
}

/**
 * Adapter público do protocolo BLUE.
 */
export function adaptarBlue(input: InputBruto): LaudoGerado | null {
  // invariant: input.observacoes.trim().length === 0 here (decisao.ts ensures it).
  const janelas = normalizarJanelas(input);

  const tecnica = gerarTecnica(input);
  const achados = gerarAchadosSecao(janelas);
  const sintese = inferirSinteseBlue(janelas);
  const impressao = gerarImpressao({
    sigla: input.sigla,
    janelas,
    sintesePersonalizada: sintese,
  });
  const referencias = gerarReferenciasTexto(input.sigla);

  const extenso = [
    'TÉCNICA',
    tecnica,
    '',
    'ACHADOS',
    achados,
    '',
    'IMPRESSÃO',
    impressao,
    '',
    'REFERÊNCIAS',
    referencias,
  ].join('\n');

  const dataExame = new Date().toLocaleDateString('pt-BR');
  const objetivo = gerarObjetivo(input, janelas, sintese, dataExame);

  return { extenso, objetivo };
}
