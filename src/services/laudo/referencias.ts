/**
 * Mapeamento protocolo → 2 referências bibliográficas (Vancouver simplificado).
 *
 * Lê do catálogo curado em `src/data/referencias/artigos.ts`. Estratégia:
 *   1. Filtra `ARTIGOS` por `categorias.includes(<categoria do protocolo>)`.
 *   2. Ordena por impacto (`fundamental` primeiro, depois `importante`,
 *      depois `complementar`) e por ano descendente como desempate.
 *   3. Pega os 2 primeiros e formata em Vancouver simplificado.
 *
 * Formato: `Autores. Título. Revista. Ano[;Vol[(N)][:pp]].`
 *
 * Composição condicional do sufixo `;Vol[(N)][:pp]`:
 *   - vol + N + pp        → `;38(4):577-591.`
 *   - vol + pp (sem N)    → `;38:577-591.`
 *   - vol apenas          → `;38.`
 *   - nenhum              → (sufixo omitido — termina em `Ano.`)
 *
 * A ordem dos campos é fixa. Quando vol/N/pp ausentes, mantém o formato
 * legado `Autores. Título. Revista. Ano.`.
 */

import { ARTIGOS } from '../../data/referencias/artigos';
import type { Artigo, CategoriaArtigo } from '../../data/referencias/tipos';
import type { RefFormatada } from './tipos';

const ORDEM_IMPACTO: Record<Artigo['impacto'], number> = {
  fundamental: 0,
  importante: 1,
  complementar: 2,
};

/**
 * Mapeia sigla do protocolo (`InputBruto.sigla`) para a categoria do
 * catálogo de artigos. Mantém um único ponto de mapeamento.
 */
function categoriaDeSigla(sigla: string): CategoriaArtigo | null {
  switch (sigla.toUpperCase()) {
    case 'BLUE':
      return 'blue';
    case 'EFAST':
      return 'efast';
    case 'RUSH':
      return 'rush';
    case 'CARDIAC':
      return 'cardiac';
    case 'VEXUS':
      return 'vexus';
    case 'OBSTETRICO':
      return 'obstetrico';
    default:
      return null;
  }
}

function formatarVancouver(artigo: Artigo): string {
  const base = `${artigo.autores}. ${artigo.titulo}. ${artigo.revista}.`;
  const { volume, numero, paginas, ano } = artigo;

  // Sem volume → encerra em "Ano." (formato legado).
  if (!volume) {
    return `${base} ${ano}.`;
  }

  // Com volume: monta sufixo Vol[(N)][:pp].
  let sufixo = volume;
  if (numero) sufixo += `(${numero})`;
  if (paginas) sufixo += `:${paginas}`;

  return `${base} ${ano};${sufixo}.`;
}

/**
 * Devolve as 2 referências mais relevantes para o protocolo, formatadas.
 * Se a categoria não tiver 2 artigos, complementa com artigos da
 * categoria 'geral'. Se ainda assim faltar, devolve o que tiver.
 */
export function obterReferenciasProtocolo(sigla: string): RefFormatada[] {
  const categoria = categoriaDeSigla(sigla);
  if (!categoria) return [];

  const ordenar = (a: Artigo, b: Artigo): number => {
    const dif = ORDEM_IMPACTO[a.impacto] - ORDEM_IMPACTO[b.impacto];
    if (dif !== 0) return dif;
    return b.ano - a.ano;
  };

  const especificas = ARTIGOS
    .filter((a) => a.categorias.includes(categoria))
    .sort(ordenar);

  let escolhidos = especificas.slice(0, 2);

  if (escolhidos.length < 2) {
    const gerais = ARTIGOS
      .filter((a) => a.categorias.includes('geral') && !escolhidos.includes(a))
      .sort(ordenar);
    escolhidos = [...escolhidos, ...gerais].slice(0, 2);
  }

  return escolhidos.map((a) => ({ id: a.id, texto: formatarVancouver(a) }));
}

/**
 * Renderiza a seção REFERÊNCIAS já como string única, uma por linha.
 */
export function gerarReferenciasTexto(sigla: string): string {
  const refs = obterReferenciasProtocolo(sigla);
  return refs.map((r) => r.texto).join('\n');
}
