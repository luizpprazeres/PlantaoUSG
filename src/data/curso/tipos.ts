export type NivelCurso = 'iniciante' | 'intermediario' | 'avancado';
export type StatusModulo = 'bloqueado' | 'disponivel' | 'em_progresso' | 'concluido';

export interface QuestaoAula {
  id: string;
  enunciado: string;
  opcoes: string[];
  correta: number; // índice da opção correta
  explicacao: string;
}

export interface Aula {
  id: string;
  titulo: string;
  conteudo: string; // markdown
  esquemaHtml?: string; // HTML simples para diagrama/tabela
  duracaoMin: number;
  questoes: QuestaoAula[];
}

export interface Modulo {
  id: string;
  protocolo: string; // efast, blue, rush, cardiac, vexus, obstetrico, geral
  titulo: string;
  subtitulo: string;
  descricao: string;
  icone: string;
  nivel: NivelCurso;
  aulas: Aula[];
  pontosTotal: number; // soma de pontos de todas as aulas (10 pts por questão correta)
}

export interface ProgressoAula {
  aulaId: string;
  concluida: boolean;
  pontos: number;
  tentativas: number;
}

export interface ProgressoModulo {
  moduloId: string;
  aulasProgresso: ProgressoAula[];
  pontosTotais: number;
  concluido: boolean;
  dataInicio?: string;
  dataConclusao?: string;
}
