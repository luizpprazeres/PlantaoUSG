export type Achado = {
  id: string;
  label: string;
};

export type GrupoAchados = {
  categoria: string;
  label: string;
  achados: Achado[];
};

export type Janela = {
  id: string;
  nome: string;
  grupos: GrupoAchados[];
};

export type JanelaOpcional = Janela & {
  chipAtivadorId: string;
};

export type LimitacaoTecnica = {
  id: string;
  label: string;
};

export type Protocolo = {
  id: string;
  nome: string;
  nomeCompleto: string;
  indicacao: string;
  icone: string;
  transdutor: string;
  janelas: Janela[];
  janelasOpcionais?: JanelaOpcional[];
  limitacoesTecnicas: LimitacaoTecnica[];
};
