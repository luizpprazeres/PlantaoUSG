/**
 * Decisão de roteamento entre L1 (motor local) e L4 (proxy LLM).
 *
 * Regra única (2026-04-27):
 *   Qualquer observação livre não-vazia força o caso para L4. Texto
 *   livre carrega contexto clínico arbitrário que o motor determinístico
 *   não consegue integrar com segurança ao laudo. Quando `observacoes`
 *   está vazia, o caso permanece em L1 (chips + limitações são
 *   suficientes para templating local).
 *
 * O critério "protocolo sem adapter" continua sendo gerenciado
 * naturalmente pelo `motorL1.gerarLaudoLocal`, que retorna `null`
 * quando não há adapter registrado e o orquestrador cai em fallback.
 */

import type { DecisaoRoteamento, InputBruto } from './tipos';

export function devePassarParaL4(input: InputBruto): DecisaoRoteamento {
  if (input.observacoes.trim().length > 0) {
    return {
      passar: true,
      motivo: 'observacao_livre_presente',
    };
  }

  return { passar: false };
}
