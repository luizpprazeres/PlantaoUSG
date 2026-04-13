export type ProtocoloVideo =
  | 'geral'
  | 'efast'
  | 'blue'
  | 'rush'
  | 'cardiac'
  | 'vexus'
  | 'tecnica'
  | 'acesso';

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
