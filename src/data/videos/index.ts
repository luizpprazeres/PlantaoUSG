import type { VideoItem, ProtocoloVideo, RecursoExterno } from './tipos';

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
  { label: 'OBSTÉTRICO', valor: 'obstetrico' },
  { label: 'TÉCNICA', valor: 'tecnica' },
  { label: 'ACESSO', valor: 'acesso' },
];

// ─────────────────────────────────────────────────────────────────────────────
// RECURSOS EXTERNOS — POCUS Atlas, cursos, sites de referência
// ─────────────────────────────────────────────────────────────────────────────

export const RECURSOS_EXTERNOS: RecursoExterno[] = [
  {
    id: 'pocus_atlas',
    nome: 'The POCUS Atlas',
    descricao: 'Maior biblioteca de imagens e vídeos POCUS do mundo. Casos reais organizados por protocolo, patologia e achado.',
    url: 'https://www.thepocusatlas.com',
    categoria: 'atlas',
    idioma: 'en',
    gratuito: true,
  },
  {
    id: 'pocus_101',
    nome: 'POCUS 101',
    descricao: 'Tutoriais em vídeo e guias escritos para iniciantes e avançados. Cobre todos os protocolos de emergência.',
    url: 'https://www.pocus101.com',
    categoria: 'curso',
    idioma: 'en',
    gratuito: true,
  },
  {
    id: 'core_ultrasound',
    nome: 'Core Ultrasound',
    descricao: 'Recursos educacionais em POCUS com foco em emergência. Módulos por protocolo com imagens anotadas.',
    url: 'https://www.coreultrasound.com',
    categoria: 'curso',
    idioma: 'en',
    gratuito: true,
  },
  {
    id: 'sono_games',
    nome: 'SonoGames / SonoWorld',
    descricao: 'Plataforma de aprendizado baseada em casos com quiz interativo de interpretação de imagens POCUS.',
    url: 'https://www.sonoworld.com',
    categoria: 'curso',
    idioma: 'en',
    gratuito: false,
  },
  {
    id: 'cfm_pocus',
    nome: 'CFM — Resolução 2.236/2018',
    descricao: 'Resolução do Conselho Federal de Medicina que regulamenta o uso de POCUS por médicos não radiologistas no Brasil.',
    url: 'https://www.cfm.org.br/index.php?option=com_resolucoes',
    categoria: 'referencia',
    idioma: 'pt',
    gratuito: true,
  },
  {
    id: 'efsumb_guidelines',
    nome: 'EFSUMB Guidelines on POCUS',
    descricao: 'Diretrizes europeias para POCUS. Amplamente adotadas em treinamentos ibero-americanos e da SBUM.',
    url: 'https://www.efsumb.org/guidelines/',
    categoria: 'referencia',
    idioma: 'en',
    gratuito: true,
  },
];

export function filtrarVideos(
  videos: VideoItem[],
  filtro: ProtocoloVideo | 'todos'
): VideoItem[] {
  if (filtro === 'todos') return videos;
  return videos.filter((v) => v.protocolos.includes(filtro));
}

export type { VideoItem, ProtocoloVideo, RecursoExterno };
