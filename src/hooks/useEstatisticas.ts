import { useMemo } from 'react';
import { useLaudos } from './useLaudos';
import type { Laudo } from '@/db/schema';

export interface NivelCompetencia {
  nivel: 'I' | 'II' | 'III' | 'IV';
  titulo: string;
  progresso: number; // 0–1 dentro do nível atual
  proximoMarco: number; // total de laudos para próximo nível
  laudosAtuais: number;
}

export interface EstatisticasMes {
  mes: string;
  count: number;
}

export interface Estatisticas {
  total: number;
  protocolosDistintos: number;
  porProtocolo: Record<string, number>;
  sequenciaDias: number;
  nivel: NivelCompetencia;
  historico: EstatisticasMes[];
  laudos: Laudo[];
}

function calcularNivel(total: number): NivelCompetencia {
  if (total < 10) {
    return {
      nivel: 'I',
      titulo: 'Iniciante',
      progresso: total / 10,
      proximoMarco: 10,
      laudosAtuais: total,
    };
  } else if (total < 50) {
    return {
      nivel: 'II',
      titulo: 'Proficiente',
      progresso: (total - 10) / 40,
      proximoMarco: 50,
      laudosAtuais: total,
    };
  } else if (total < 100) {
    return {
      nivel: 'III',
      titulo: 'Avançado',
      progresso: (total - 50) / 50,
      proximoMarco: 100,
      laudosAtuais: total,
    };
  } else {
    return {
      nivel: 'IV',
      titulo: 'Especialista',
      progresso: 1,
      proximoMarco: 100,
      laudosAtuais: total,
    };
  }
}

function calcularSequencia(laudos: Laudo[]): number {
  if (laudos.length === 0) return 0;

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const diasSet = new Set<string>();
  for (const l of laudos) {
    const d = new Date(l.timestamp);
    d.setHours(0, 0, 0, 0);
    diasSet.add(d.toISOString());
  }

  const dias = Array.from(diasSet).sort((a, b) => b.localeCompare(a));

  const maisRecente = new Date(dias[0]);
  const diffDias = Math.floor((hoje.getTime() - maisRecente.getTime()) / 86400000);
  if (diffDias > 1) return 0;

  let sequencia = 1;
  for (let i = 1; i < dias.length; i++) {
    const prev = new Date(dias[i - 1]);
    const curr = new Date(dias[i]);
    const diff = Math.floor((prev.getTime() - curr.getTime()) / 86400000);
    if (diff === 1) {
      sequencia++;
    } else {
      break;
    }
  }

  return sequencia;
}

function calcularHistorico(laudos: Laudo[]): EstatisticasMes[] {
  const agora = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(agora.getFullYear(), agora.getMonth() - (5 - i), 1);
    const mes = d.toLocaleString('pt-BR', { month: 'short' }).toUpperCase().replace('.', '');
    const count = laudos.filter((l) => {
      const ld = new Date(l.timestamp);
      return ld.getMonth() === d.getMonth() && ld.getFullYear() === d.getFullYear();
    }).length;
    return { mes, count };
  });
}

export function useEstatisticas(): Estatisticas {
  const { laudos } = useLaudos();

  return useMemo(() => {
    const total = laudos.length;

    const porProtocolo: Record<string, number> = {};
    for (const l of laudos) {
      porProtocolo[l.protocolo] = (porProtocolo[l.protocolo] ?? 0) + 1;
    }

    return {
      total,
      protocolosDistintos: Object.keys(porProtocolo).length,
      porProtocolo,
      sequenciaDias: calcularSequencia(laudos),
      nivel: calcularNivel(total),
      historico: calcularHistorico(laudos),
      laudos,
    };
  }, [laudos]);
}
