/**
 * Adapter eFAST — geração local determinística do laudo eFAST.
 *
 * Estrutura do extenso:
 *   TÉCNICA / ACHADOS / IMPRESSÃO / REFERÊNCIAS (4 seções, igual ao BLUE).
 *
 * Particularidades clínicas do eFAST (vs. BLUE):
 *   - 6 janelas heterogêneas: 4 únicas (Morrison, Esplenorrenal, Suprapúbica,
 *     Subxifoide) + 2 pleurais bilaterais (Hemitórax Direito/Esquerdo).
 *   - Achados das 4 janelas únicas já contêm localização anatômica embutida
 *     (hepatorrenal, esplenorrenal, Douglas/pelve, pericárdico) — não devem
 *     ser prefixados com nome de janela (regra de desambiguação).
 *   - Achados pleurais NÃO contêm localização do hemitórax — precisam do
 *     prefixo "Hemitórax Direito/Esquerdo (pleural):" para evitar
 *     ambiguidade entre os dois lados.
 *
 * Hierarquia de agrupamento de "normais" (4 prioridades):
 *   P1 — Todas 6 janelas normais (1 linha consolidada, igual aos casos
 *        triviais de exclusão de líquido livre).
 *   P2 — Par pleural bilateral preservado (D + E ambos normais): 1 linha.
 *   P3 — Janela única normal (Morrison/Esplenorrenal/Suprapúbica/Subxifoide):
 *        emite frase concatenando os achados normais canônicos da janela
 *        SEM prefixo (cada achado já carrega sua localização anatômica).
 *   P4 — Hemitórax pleural isolado normal: emite linha individual com nome
 *        completo da janela.
 *
 * Ordem final das linhas no ACHADOS:
 *   1) Linhas "normais" (P1 OU P2 + P3 + P4)
 *   2) Linhas com achados de janelas únicas (sem prefixo, achados já localizam)
 *   3) Linhas com achados de janelas pleurais (com prefixo do hemitórax)
 *
 * IMPRESSÃO — heurística de severidade decrescente (vide `inferirSinteseEfast`).
 *
 * Invariante de roteamento (decisao.ts):
 *   `inputBruto.observacoes.trim().length === 0` quando este adapter é
 *   chamado. Texto livre não-vazio é desviado para L4.
 */

import type { InputBruto, JanelaNormalizada, LaudoGerado } from '../tipos';
import { gerarTecnica } from '../tecnica';
import { gerarImpressao } from '../impressao';
import { gerarReferenciasTexto } from '../referencias';
import { juntarAchados } from '../prosa/conectores';
import { achadoContemLocalizacao } from '../prosa/desambiguar';

// ─────────────────────────────────────────────────────────────────────────
// Identificação canônica das 6 janelas eFAST.
// ─────────────────────────────────────────────────────────────────────────

const NOME_MORRISON = 'Quadrante Superior Direito (Morrison)';
const NOME_ESPLENORRENAL = 'Quadrante Superior Esquerdo (Esplenorrenal)';
const NOME_SUPRAPUBICA = 'Suprapúbica (Fundo de saco de Douglas)';
const NOME_SUBXIFOIDE = 'Subxifoide (Pericárdio)';
const NOME_PLEURAL_D = 'Hemitórax Direito (pleural)';
const NOME_PLEURAL_E = 'Hemitórax Esquerdo (pleural)';

const TODAS_JANELAS: readonly string[] = [
  NOME_MORRISON,
  NOME_ESPLENORRENAL,
  NOME_SUPRAPUBICA,
  NOME_SUBXIFOIDE,
  NOME_PLEURAL_D,
  NOME_PLEURAL_E,
];

const JANELAS_UNICAS: readonly string[] = [
  NOME_MORRISON,
  NOME_ESPLENORRENAL,
  NOME_SUPRAPUBICA,
  NOME_SUBXIFOIDE,
];

const JANELAS_PLEURAIS: readonly string[] = [NOME_PLEURAL_D, NOME_PLEURAL_E];

/**
 * Achados normais canônicos por janela única, espelhando
 * `src/data/protocolos/efast.ts` (grupo categoria='normal').
 *
 * Como a payload de janela normal traz apenas `{ status: 'normal' }` (sem a
 * lista de achados), o adapter precisa conhecer as frases canônicas para
 * emitir P3. Manter sincronizado com o catálogo do protocolo.
 */
const ACHADOS_NORMAIS_POR_JANELA: Record<string, readonly string[]> = {
  [NOME_MORRISON]: [
    'Espaço hepatorrenal sem evidência de líquido livre',
    'Recesso subfrênico direito sem líquido livre',
    'Goteira parietocólica direita sem líquido livre',
  ],
  [NOME_ESPLENORRENAL]: [
    'Espaço esplenorrenal sem evidência de líquido livre',
    'Recesso subfrênico esquerdo sem líquido livre',
    'Goteira parietocólica esquerda sem líquido livre',
  ],
  [NOME_SUPRAPUBICA]: [
    'Fundo de saco de Douglas sem evidência de líquido livre',
    'Sem líquido livre perivesical',
    'Bexiga adequadamente repleta',
  ],
  [NOME_SUBXIFOIDE]: [
    'Saco pericárdico sem evidência de derrame',
    'Sem sinais ecográficos de tamponamento',
  ],
};

// ─────────────────────────────────────────────────────────────────────────
// Normalização e helpers de janela.
// ─────────────────────────────────────────────────────────────────────────

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
    // Janelas sem status:'normal' e sem achados são omitidas.
  }
  return normalizadas;
}

function janelaPorNome(
  janelas: readonly JanelaNormalizada[],
  nome: string
): JanelaNormalizada | undefined {
  return janelas.find((j) => j.nome === nome);
}

// ─────────────────────────────────────────────────────────────────────────
// Heurística de IMPRESSÃO — categorização de padrões e severidade desc.
// ─────────────────────────────────────────────────────────────────────────

type CategoriaPadrao =
  | 'tamponamento pericárdico'
  | 'pneumotórax'
  | 'hemoperitônio'
  | 'hemotórax'
  | 'derrame pericárdico'
  | 'derrame pleural'
  | 'líquido livre intra-abdominal/pélvico';

const ORDEM_SEVERIDADE: readonly CategoriaPadrao[] = [
  'tamponamento pericárdico',
  'pneumotórax',
  'hemoperitônio',
  'hemotórax',
  'derrame pericárdico',
  'derrame pleural',
  'líquido livre intra-abdominal/pélvico',
];

function ehJanelaPleural(nome: string): boolean {
  return nome === NOME_PLEURAL_D || nome === NOME_PLEURAL_E;
}

function ehJanelaSubxifoide(nome: string): boolean {
  return nome === NOME_SUBXIFOIDE;
}

/**
 * Classifica um achado dentro do contexto da sua janela. Retorna a categoria
 * de maior severidade que o achado dispara, ou `null` se o achado não casa
 * com nenhum padrão clínico relevante.
 *
 * Regra de evitar dupla contagem: cada achado entra em UMA categoria
 * (a primeira matching na ordem else-if abaixo).
 *
 * Notas clínicas embutidas (ver "Pontos para revisão clínica" no PR):
 *   - Achado pericárdico ecogênico/hemático SEM tamponamento: classificado
 *     como 'derrame pericárdico' (não 'hemoperitônio') — preserva
 *     especificidade anatômica.
 *   - Achado hemático em janela pleural → 'hemotórax'.
 *   - Achado hemático em janela abdominal/pélvica → 'hemoperitônio'.
 *   - 'pneumotórax' só é detectado em janela pleural (D/E).
 */
function classificarAchado(
  nomeJanela: string,
  achado: string
): CategoriaPadrao | null {
  const lower = achado.toLowerCase();

  if (lower.includes('tamponamento')) return 'tamponamento pericárdico';

  if (
    ehJanelaPleural(nomeJanela) &&
    (lower.includes('pneumotórax') ||
      lower.includes('lung point') ||
      lower.includes('código de barras'))
  ) {
    return 'pneumotórax';
  }

  // Subxifoide: derrame pericárdico tem precedência sobre 'hemático'
  // (manter o achado dentro da semântica pericárdica).
  if (ehJanelaSubxifoide(nomeJanela) && lower.includes('derrame pericárdico')) {
    return 'derrame pericárdico';
  }

  if (lower.includes('hemático')) {
    if (ehJanelaPleural(nomeJanela)) return 'hemotórax';
    if (ehJanelaSubxifoide(nomeJanela)) return 'derrame pericárdico';
    return 'hemoperitônio';
  }

  if (
    ehJanelaPleural(nomeJanela) &&
    (lower.includes('líquido pleural') || lower.includes('derrame pleural'))
  ) {
    return 'derrame pleural';
  }

  if (!ehJanelaPleural(nomeJanela) && lower.includes('líquido livre')) {
    return 'líquido livre intra-abdominal/pélvico';
  }

  return null;
}

function inferirSinteseEfast(
  janelas: readonly JanelaNormalizada[]
): string | undefined {
  const presentes = new Set<CategoriaPadrao>();

  for (const j of janelas) {
    if (j.tipo !== 'achados') continue;
    for (const ach of j.achados) {
      const cat = classificarAchado(j.nome, ach);
      if (cat !== null) presentes.add(cat);
    }
  }

  const conclusoes = ORDEM_SEVERIDADE.filter((c) => presentes.has(c));
  if (conclusoes.length === 0) return undefined;

  if (conclusoes.length === 1) {
    return `Achados sugestivos de ${conclusoes[0]}, a serem correlacionados ao quadro clínico`;
  }
  const ultimo = conclusoes[conclusoes.length - 1];
  const inicio = conclusoes.slice(0, -1).join(', ');
  return `Achados sugestivos de ${inicio} e ${ultimo}, a serem correlacionados ao quadro clínico`;
}

// ─────────────────────────────────────────────────────────────────────────
// Geração da seção ACHADOS — hierarquia P1/P2/P3/P4 + ordem final.
// ─────────────────────────────────────────────────────────────────────────

/**
 * Frase P1 — todas as 6 janelas marcadas como normais (sem nenhuma com
 * achados). Linha única consolidada.
 */
const FRASE_P1 =
  'Exame eFAST sem evidência de líquido livre nas cavidades avaliadas, sem derrame pericárdico ou pneumotórax.';

/** Frase P2 — par pleural bilateral preservado. */
const FRASE_P2 = 'Pleura bilateral sem alterações ecográficas significativas.';

/**
 * P3 — janela única normal. Concatena os achados normais canônicos sem
 * prefixo de janela (eles já contêm localização anatômica explícita).
 */
function fraseP3(nomeJanela: string): string | null {
  const achados = ACHADOS_NORMAIS_POR_JANELA[nomeJanela];
  if (!achados) return null;
  return juntarAchados(achados);
}

/** P4 — hemitórax pleural isolado normal. */
function fraseP4(nomeJanela: string): string {
  return `${nomeJanela} sem alterações ecográficas significativas.`;
}

/**
 * Para uma janela com achados, monta a linha:
 *   - Sem prefixo se algum achado contém termo de localização embutida
 *     (caso típico das janelas únicas do eFAST).
 *   - Com prefixo "{nome completo}: " caso contrário (caso das pleurais).
 */
function linhaJanelaComAchados(janela: JanelaNormalizada): string {
  if (janela.tipo !== 'achados') return '';
  const linhaJunta = juntarAchados(janela.achados);
  if (linhaJunta.length === 0) return '';

  if (janela.achados.some(achadoContemLocalizacao)) {
    return linhaJunta;
  }

  // Coloca a primeira letra em minúscula (continuação após ":").
  const primeiro = linhaJunta[0];
  let corpo = linhaJunta;
  if (/[A-ZÀ-Ú]/.test(primeiro)) {
    corpo = primeiro.toLowerCase() + linhaJunta.slice(1);
  }
  return `${janela.nome}: ${corpo}`;
}

function gerarLinhasEfast(janelas: readonly JanelaNormalizada[]): string[] {
  // ── P1 ── Todas as 6 janelas normais.
  const todas6Normais =
    janelas.length === TODAS_JANELAS.length &&
    TODAS_JANELAS.every((nome) => {
      const j = janelaPorNome(janelas, nome);
      return j !== undefined && j.tipo === 'normal';
    });

  if (todas6Normais) {
    return [FRASE_P1];
  }

  const linhasNormais: string[] = [];
  const linhasAchadosUnicas: string[] = [];
  const linhasAchadosPleurais: string[] = [];
  const consumidas = new Set<string>();

  // ── P2 ── Par pleural bilateral ambos normais.
  const pleuralD = janelaPorNome(janelas, NOME_PLEURAL_D);
  const pleuralE = janelaPorNome(janelas, NOME_PLEURAL_E);
  const pleuralDNormal = pleuralD !== undefined && pleuralD.tipo === 'normal';
  const pleuralENormal = pleuralE !== undefined && pleuralE.tipo === 'normal';
  if (pleuralDNormal && pleuralENormal) {
    linhasNormais.push(FRASE_P2);
    consumidas.add(NOME_PLEURAL_D);
    consumidas.add(NOME_PLEURAL_E);
  }

  // ── Janelas únicas: P3 (normal) ou bucket "achados únicas".
  for (const nome of JANELAS_UNICAS) {
    if (consumidas.has(nome)) continue;
    const j = janelaPorNome(janelas, nome);
    if (!j) continue; // janela não preenchida → omitida
    if (j.tipo === 'normal') {
      const frase = fraseP3(nome);
      if (frase !== null && frase.length > 0) {
        linhasNormais.push(frase);
      }
      consumidas.add(nome);
    } else {
      const linha = linhaJanelaComAchados(j);
      if (linha.length > 0) linhasAchadosUnicas.push(linha);
      consumidas.add(nome);
    }
  }

  // ── Janelas pleurais: P4 (normal) ou bucket "achados pleurais".
  for (const nome of JANELAS_PLEURAIS) {
    if (consumidas.has(nome)) continue;
    const j = janelaPorNome(janelas, nome);
    if (!j) continue;
    if (j.tipo === 'normal') {
      linhasNormais.push(fraseP4(nome));
      consumidas.add(nome);
    } else {
      const linha = linhaJanelaComAchados(j);
      if (linha.length > 0) linhasAchadosPleurais.push(linha);
      consumidas.add(nome);
    }
  }

  // Ordem final: normais (P2 + P3 + P4) → únicas com achados → pleurais com achados.
  return [...linhasNormais, ...linhasAchadosUnicas, ...linhasAchadosPleurais];
}

function gerarAchadosSecao(janelas: readonly JanelaNormalizada[]): string {
  return gerarLinhasEfast(janelas).join('\n');
}

// ─────────────────────────────────────────────────────────────────────────
// Objetivo (parágrafo único — versão prontuário).
// ─────────────────────────────────────────────────────────────────────────

function gerarObjetivo(
  input: InputBruto,
  janelas: readonly JanelaNormalizada[],
  sintese: string | undefined,
  dataExame: string
): string {
  const partes: string[] = [`POCUS ${input.sigla} (${dataExame}):`];
  partes.push(
    `Exame realizado com transdutor ${input.transdutor.toLowerCase()}, direcionado a avaliação de líquido livre em cavidades torácica, abdominal e pélvica, com avaliação pleural e pericárdica focada.`
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

// ─────────────────────────────────────────────────────────────────────────
// Adapter público.
// ─────────────────────────────────────────────────────────────────────────

export function adaptarEfast(input: InputBruto): LaudoGerado | null {
  // invariant: input.observacoes.trim().length === 0 here (decisao.ts).
  const janelas = normalizarJanelas(input);

  const tecnica = gerarTecnica(input);
  const achados = gerarAchadosSecao(janelas);
  const sintese = inferirSinteseEfast(janelas);
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
