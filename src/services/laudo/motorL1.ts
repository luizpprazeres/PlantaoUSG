/**
 * Motor L1 — geração local determinística de laudos POCUS.
 *
 * Ponto de entrada: `gerarLaudoLocal(inputBruto)`. Retorna `LaudoGerado`
 * (mesmo shape do proxy L4) ou `null` quando não há adapter para o
 * protocolo informado — caso em que o chamador deve cair em L4.
 *
 * Adapters são registrados em `ADAPTERS` por `id` de protocolo (`InputBruto.protocolo`
 * traz o nome completo, então usamos a sigla — chave canônica em minúscula).
 *
 * Esta camada NÃO faz a decisão de roteamento (ver `decisao.ts`); apenas
 * tenta executar o adapter correspondente e propaga `null` em qualquer
 * falha (incluindo exceções), preservando o invariante de "sem regressão
 * clínica" — o chamador cai para L4 quando o motor não consegue.
 */

import type { AdapterFn, InputBruto, LaudoGerado } from './tipos';
import { adaptarBlue } from './adapters/blue';
import { adaptarEfast } from './adapters/efast';

/**
 * Registro de adapters por sigla normalizada (lowercase).
 * Conforme novos protocolos forem implementados, basta adicionar aqui.
 */
const ADAPTERS: Record<string, AdapterFn> = {
  blue: adaptarBlue,
  efast: adaptarEfast,
};

function chaveProtocolo(input: InputBruto): string {
  return input.sigla.trim().toLowerCase();
}

/**
 * Gera o laudo localmente. Retorna `null` se:
 *   - não há adapter para o protocolo;
 *   - o adapter retorna `null` (caso de degradação);
 *   - ocorre exceção durante a geração (proteção defensiva — o chamador
 *     cai para L4 sem alarmar o usuário).
 */
export function gerarLaudoLocal(input: InputBruto): LaudoGerado | null {
  const chave = chaveProtocolo(input);
  const adapter = ADAPTERS[chave];
  if (!adapter) return null;

  try {
    return adapter(input);
  } catch {
    // Falha defensiva: nunca propaga exceção para a UI; cai para L4.
    return null;
  }
}

/**
 * Lista de protocolos com adapter L1 registrado. Útil para diagnósticos
 * e telemetria futura.
 */
export function protocolosComAdapter(): string[] {
  return Object.keys(ADAPTERS);
}
