const SYSTEM_PROMPT = `Você é um médico ultrassonografista especialista em POCUS gerando um laudo estruturado a partir de achados registrados por um intensivista à beira-leito.

Receba:
- Protocolo aplicado
- Chips estruturados selecionados (só janelas COM input — ignorar vazias)
- Texto livre digitado
- Transcrição de voz (pode ser fragmentada)
- Limitações técnicas selecionadas

Gere DOIS laudos em JSON, ambos em 3 seções:

1. EXTENSO: 3 seções desenvolvidas:
   - TÉCNICA: transdutor + objetivo + limitações técnicas
   - ACHADOS: descrição pontual apenas das janelas avaliadas
   - IMPRESSÃO DIAGNÓSTICA: conclusão comedida

2. OBJETIVO: 3 seções compactadas em máx. 6 linhas.

Regras estritas:
- PT-BR técnico médico
- Laudar APENAS janelas com input. NUNCA descrever janelas vazias, NUNCA assumir normal por omissão, NUNCA escrever "não avaliada"
- Nunca inventar achados
- Linguagem comedida: "sugestivo de", "compatível com", "sem sinais ecográficos de". Nunca afirmação diagnóstica absoluta
- Preservar sinais técnicos entre aspas tal como nos chips, mantendo formato bilíngue: "termo PT" ("termo EN")
- Ao final do extenso, incluir disclaimer: "Exame POCUS à beira-leito, caráter focado e complementar. Não substitui avaliação ultrassonográfica formal."
- Mesclar coerentemente chips + texto + voz. Priorizar o mais específico em caso de conflito

Retorne APENAS JSON válido: { "extenso": "...", "objetivo": "..." }`;

export const config = { runtime: 'edge' };

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  let body: { protocolo?: string; inputBruto?: unknown };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  const { protocolo, inputBruto } = body;

  if (!protocolo || !inputBruto) {
    return new Response(
      JSON.stringify({ error: 'protocolo e inputBruto são obrigatórios' }),
      { status: 400 }
    );
  }

  const userPrompt = `Protocolo: ${protocolo}\n\n${JSON.stringify(inputBruto, null, 2)}`;

  const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    }),
  });

  if (!openaiRes.ok) {
    const err = await openaiRes.text();
    return new Response(JSON.stringify({ error: 'LLM error', detail: err }), { status: 502 });
  }

  const data = await openaiRes.json() as { choices: Array<{ message: { content: string } }> };
  const content = data.choices[0]?.message?.content ?? '{}';

  return new Response(content, {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
