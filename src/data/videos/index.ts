import type { VideoItem, ProtocoloVideo } from './tipos';

// ─────────────────────────────────────────────────────────────────────────────
// CURADORIA DE VÍDEOS
// Para adicionar um vídeo, copie o bloco abaixo e preencha os campos.
// youtubeId: parte final da URL do YouTube após ?v=
//   Ex: https://youtube.com/watch?v=dQw4w9WgXcQ → youtubeId: 'dQw4w9WgXcQ'
// ─────────────────────────────────────────────────────────────────────────────

export const VIDEOS: VideoItem[] = [
  // ── ADICIONE OS VÍDEOS AQUI ──────────────────────────────────────────────
  //
  // {
  //   id: 'v001',
  //   titulo: 'eFAST — Passo a Passo',
  //   canal: 'Nome do Canal',
  //   duracaoMin: 12,
  //   protocolos: ['efast'],
  //   tags: ['técnica', 'trauma'],
  //   youtubeId: 'YOUTUBE_ID_AQUI',
  //   idioma: 'pt',
  //   nivel: 'basico',
  // },
];

// ─────────────────────────────────────────────────────────────────────────────

export const FILTROS: { label: string; valor: ProtocoloVideo | 'todos' }[] = [
  { label: 'TODOS', valor: 'todos' },
  { label: 'eFAST', valor: 'efast' },
  { label: 'BLUE', valor: 'blue' },
  { label: 'RUSH', valor: 'rush' },
  { label: 'CARDÍACO', valor: 'cardiac' },
  { label: 'VExUS', valor: 'vexus' },
  { label: 'TÉCNICA', valor: 'tecnica' },
  { label: 'ACESSO', valor: 'acesso' },
];

export function filtrarVideos(
  videos: VideoItem[],
  filtro: ProtocoloVideo | 'todos'
): VideoItem[] {
  if (filtro === 'todos') return videos;
  return videos.filter((v) => v.protocolos.includes(filtro));
}

export type { VideoItem, ProtocoloVideo };
