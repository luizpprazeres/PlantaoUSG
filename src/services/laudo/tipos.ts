/**
 * Tipos compartilhados do motor L1 de geração local de laudos.
 *
 * `LaudoGerado` e `InputBruto` são reusados de `services/llmClient.ts` —
 * a interface externa do motor L1 é deliberadamente idêntica à do proxy L4
 * para permitir substituição transparente.
 */

import type { InputBruto, JanelaPayload, LaudoGerado } from '../llmClient';

export type { InputBruto, JanelaPayload, LaudoGerado };

/**
 * Representação interna de uma janela após normalização do payload.
 * Distingue os três estados possíveis: normal, com achados, ou ausente
 * (ausentes são filtradas antes de chegar ao adapter).
 */
export type JanelaNormal = {
  tipo: 'normal';
  nome: string;
};

export type JanelaComAchados = {
  tipo: 'achados';
  nome: string;
  achados: string[];
};

export type JanelaNormalizada = JanelaNormal | JanelaComAchados;

/**
 * Resultado da decisão de roteamento entre L1 e L4.
 */
export interface DecisaoRoteamento {
  passar: boolean;
  motivo?: string;
}

/**
 * Função de adapter de protocolo. Recebe input já validado e devolve
 * o laudo extenso e objetivo, ou `null` se o adapter não conseguir
 * gerar (caso em que o motor cai em fallback).
 */
export type AdapterFn = (input: InputBruto) => LaudoGerado | null;

/**
 * Referência bibliográfica formatada em Vancouver simplificado.
 */
export interface RefFormatada {
  id: string;
  texto: string;
}
