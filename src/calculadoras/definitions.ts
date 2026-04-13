export type CampoTipo = 'number' | 'select';

export type OpcaoSelect = {
  label: string;
  value: number;
};

export type Campo = {
  id: string;
  label: string;
  unit?: string;
  type: CampoTipo;
  options?: OpcaoSelect[];
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
};

export type ResultadoCor = 'normal' | 'atencao' | 'critico';

export type ResultadoCalculo = {
  valor: string;
  interpretacao: string;
  cor: ResultadoCor;
};

export type Calculadora = {
  id: string;
  nome: string;
  categoria: string;
  descricao: string;
  campos: Campo[];
  fonte?: string;
  calcular: (valores: Record<string, number>) => ResultadoCalculo;
};
