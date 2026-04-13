import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { sqliteStorage } from '@/utils/sqliteStorage';

export type FaseAula = 'conteudo' | 'quiz' | 'resultado';

export interface ProgressoModulo {
  aulaIdx: number;
  questaoIdx: number;
  fase: FaseAula;
  acertosTotal: number;
  aulasConcluidas: number;
  concluido: boolean;
}

interface CursoState {
  progresso: Record<string, ProgressoModulo>;
  salvar: (moduloId: string, dados: Partial<ProgressoModulo>) => void;
  concluirAula: (moduloId: string) => void;
  concluirModulo: (moduloId: string) => void;
  resetar: (moduloId: string) => void;
}

const VAZIO: ProgressoModulo = {
  aulaIdx: 0,
  questaoIdx: 0,
  fase: 'conteudo',
  acertosTotal: 0,
  aulasConcluidas: 0,
  concluido: false,
};

export const useCursoStore = create<CursoState>()(
  persist(
    (set, get) => ({
      progresso: {},

      salvar: (moduloId, dados) =>
        set((state) => ({
          progresso: {
            ...state.progresso,
            [moduloId]: {
              ...(state.progresso[moduloId] ?? VAZIO),
              ...dados,
            },
          },
        })),

      concluirAula: (moduloId) =>
        set((state) => {
          const atual = state.progresso[moduloId] ?? VAZIO;
          return {
            progresso: {
              ...state.progresso,
              [moduloId]: {
                ...atual,
                aulasConcluidas: atual.aulasConcluidas + 1,
              },
            },
          };
        }),

      concluirModulo: (moduloId) =>
        set((state) => ({
          progresso: {
            ...state.progresso,
            [moduloId]: {
              ...(state.progresso[moduloId] ?? VAZIO),
              concluido: true,
            },
          },
        })),

      resetar: (moduloId) =>
        set((state) => ({
          progresso: {
            ...state.progresso,
            [moduloId]: { ...VAZIO },
          },
        })),
    }),
    {
      name: 'curso-progresso',
      storage: createJSONStorage(() => sqliteStorage),
    }
  )
);
