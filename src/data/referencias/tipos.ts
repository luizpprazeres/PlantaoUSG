export type CategoriaArtigo =
  | 'efast'
  | 'blue'
  | 'rush'
  | 'cardiac'
  | 'vexus'
  | 'obstetrico'
  | 'geral'
  | 'diretriz';

export interface Artigo {
  id: string;
  titulo: string;
  autores: string;
  revista: string;
  ano: number;
  doi?: string;
  pmid?: string;
  /** Volume do periódico (ex: "38"). */
  volume?: string;
  /** Número/issue dentro do volume (ex: "4"). */
  numero?: string;
  /** Faixa de páginas (ex: "577-591"). */
  paginas?: string;
  categorias: CategoriaArtigo[];
  resumo: string;
  impacto: 'fundamental' | 'importante' | 'complementar';
  acesso: 'aberto' | 'pago';
}

export interface ValorReferencia {
  id: string;
  parametro: string;
  normal: string;
  anormal?: string;
  critico?: string;
  unidade?: string;
  nota?: string;
  protocolo: string;
}

export interface GrupoValores {
  protocolo: string;
  titulo: string;
  valores: ValorReferencia[];
}
