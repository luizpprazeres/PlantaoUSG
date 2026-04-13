import type { Laudo } from '@/db/schema';

export interface Marco {
  id: string;
  titulo: string;
  descricao: string;
  conquistado: (laudos: Laudo[]) => boolean;
}

export interface Certificado {
  id: string;
  titulo: string;
  subtitulo: string;
  descricao: string;
  conquistado: (laudos: Laudo[]) => boolean;
}

const TODOS_PROTOCOLOS = ['efast', 'blue', 'rush', 'cardiac', 'vexus', 'obstetrico'];

export const MARCOS: Marco[] = [
  {
    id: 'primeiro_laudo',
    titulo: 'Primeiro laudo gerado',
    descricao: 'Realize o primeiro laudo POCUS guiado',
    conquistado: (laudos) => laudos.length >= 1,
  },
  {
    id: 'cinco_laudos',
    titulo: '5 laudos realizados',
    descricao: 'Volume inicial de prática documentada',
    conquistado: (laudos) => laudos.length >= 5,
  },
  {
    id: 'dois_protocolos',
    titulo: '2 protocolos diferentes',
    descricao: 'Amplie o repertório além do protocolo inicial',
    conquistado: (laudos) => new Set(laudos.map((l) => l.protocolo)).size >= 2,
  },
  {
    id: 'vinte_laudos',
    titulo: '20 laudos realizados',
    descricao: 'Volume consistente de prática clínica',
    conquistado: (laudos) => laudos.length >= 20,
  },
  {
    id: 'quatro_protocolos',
    titulo: '4 protocolos diferentes',
    descricao: 'Cobertura ampla do arsenal diagnóstico POCUS',
    conquistado: (laudos) => new Set(laudos.map((l) => l.protocolo)).size >= 4,
  },
  {
    id: 'cinquenta_laudos',
    titulo: '50 laudos realizados',
    descricao: 'Marco de proficiência clínica estabelecida',
    conquistado: (laudos) => laudos.length >= 50,
  },
  {
    id: 'todos_protocolos',
    titulo: 'Todos os protocolos utilizados',
    descricao: 'Domínio completo dos módulos disponíveis',
    conquistado: (laudos) => {
      const usados = new Set(laudos.map((l) => l.protocolo));
      return TODOS_PROTOCOLOS.every((p) => usados.has(p));
    },
  },
  {
    id: 'cem_laudos',
    titulo: '100 laudos realizados',
    descricao: 'Excelência operacional documentada',
    conquistado: (laudos) => laudos.length >= 100,
  },
];

export const CERTIFICADOS: Certificado[] = [
  {
    id: 'cert_iniciacao',
    titulo: 'Iniciação ao POCUS',
    subtitulo: 'Nível I',
    descricao: 'Concluiu os primeiros passos na ultrassonografia point-of-care com laudo estruturado',
    conquistado: (laudos) => laudos.length >= 1,
  },
  {
    id: 'cert_diversidade',
    titulo: 'Diversidade de Protocolos',
    subtitulo: 'Nível II',
    descricao: 'Demonstrou capacidade técnica em múltiplos protocolos POCUS: eFAST, BLUE, RUSH e outros',
    conquistado: (laudos) => new Set(laudos.map((l) => l.protocolo)).size >= 4,
  },
  {
    id: 'cert_proficiencia',
    titulo: 'Proficiência Clínica',
    subtitulo: 'Nível III',
    descricao: 'Atingiu volume de prática consistente com proficiência clínica estabelecida (50 laudos)',
    conquistado: (laudos) => laudos.length >= 50,
  },
  {
    id: 'cert_especialista',
    titulo: 'Especialista POCUS',
    subtitulo: 'Nível IV',
    descricao: 'Excelência clínica documentada: 100+ laudos com cobertura completa de todos os protocolos disponíveis',
    conquistado: (laudos) => {
      const usados = new Set(laudos.map((l) => l.protocolo));
      return laudos.length >= 100 && TODOS_PROTOCOLOS.every((p) => usados.has(p));
    },
  },
];
