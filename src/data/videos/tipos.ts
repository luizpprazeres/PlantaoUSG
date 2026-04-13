export type ProtocoloVideo =
  | 'geral'
  | 'efast'
  | 'blue'
  | 'rush'
  | 'cardiac'
  | 'vexus'
  | 'obstetrico'
  | 'tecnica'
  | 'acesso';

export interface RecursoExterno {
  id: string;
  nome: string;
  descricao: string;
  url: string;
  categoria: 'atlas' | 'curso' | 'referencia' | 'podcast';
  idioma: 'pt' | 'en';
  gratuito: boolean;
}

export type NivelVideo = 'basico' | 'avancado';
export type IdiomaVideo = 'pt' | 'en';

export interface VideoItem {
  id: string;
  titulo: string;
  canal: string;
  duracaoMin: number;
  protocolos: ProtocoloVideo[];
  tags: string[];
  youtubeId: string;
  idioma: IdiomaVideo;
  nivel: NivelVideo;
}
