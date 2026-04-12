import { create } from 'zustand';

type AchadosSelecionados = Record<string, string[]>;

interface LaudadorState {
  protocoloId: string | null;
  achadosSelecionados: AchadosSelecionados;
  observacoes: string;
  limitacoesSelecionadas: string[];
  chipAtivadoresAtivos: string[];
  toggleAchado: (janelaId: string, achadoId: string) => void;
  setObservacoes: (texto: string) => void;
  appendObservacoes: (texto: string) => void;
  toggleLimitacao: (limitacaoId: string) => void;
  toggleChipAtivador: (chipId: string) => void;
  iniciar: (protocoloId: string) => void;
  resetar: () => void;
}

export const useLaudadorStore = create<LaudadorState>((set) => ({
  protocoloId: null,
  achadosSelecionados: {},
  observacoes: '',
  limitacoesSelecionadas: [],
  chipAtivadoresAtivos: [],

  iniciar: (protocoloId) =>
    set({
      protocoloId,
      achadosSelecionados: {},
      observacoes: '',
      limitacoesSelecionadas: [],
      chipAtivadoresAtivos: [],
    }),

  toggleAchado: (janelaId, achadoId) =>
    set((state) => {
      const current = state.achadosSelecionados[janelaId] ?? [];
      const next = current.includes(achadoId)
        ? current.filter((id) => id !== achadoId)
        : [...current, achadoId];
      return {
        achadosSelecionados: { ...state.achadosSelecionados, [janelaId]: next },
      };
    }),

  setObservacoes: (texto) => set({ observacoes: texto }),

  appendObservacoes: (texto) =>
    set((state) => ({
      observacoes: state.observacoes ? `${state.observacoes} ${texto}` : texto,
    })),

  toggleLimitacao: (limitacaoId) =>
    set((state) => ({
      limitacoesSelecionadas: state.limitacoesSelecionadas.includes(limitacaoId)
        ? state.limitacoesSelecionadas.filter((id) => id !== limitacaoId)
        : [...state.limitacoesSelecionadas, limitacaoId],
    })),

  toggleChipAtivador: (chipId) =>
    set((state) => ({
      chipAtivadoresAtivos: state.chipAtivadoresAtivos.includes(chipId)
        ? state.chipAtivadoresAtivos.filter((id) => id !== chipId)
        : [...state.chipAtivadoresAtivos, chipId],
    })),

  resetar: () =>
    set({
      protocoloId: null,
      achadosSelecionados: {},
      observacoes: '',
      limitacoesSelecionadas: [],
      chipAtivadoresAtivos: [],
    }),
}));
