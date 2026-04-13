const SYSTEM_PROMPT = `Você é um médico ultrassonografista especialista em POCUS gerando um laudo estruturado a partir de achados registrados por um intensivista à beira-leito.

Receba:
- Protocolo aplicado
- Data do exame
- Janelas com achados estruturados ou status "normal"
- Texto livre digitado
- Transcrição de voz (pode ser fragmentada)
- Limitações técnicas selecionadas

Gere DOIS laudos em JSON:

1. EXTENSO: laudo com 4 seções separadas por linha em branco, nesta ordem exata:

TÉCNICA: [transdutor utilizado, objetivo do exame e limitações técnicas se houver]

ACHADOS: [cada janela em linha própria, formato: "Nome da janela: achados." — uma janela por linha]

IMPRESSÃO: [conclusão comedida com correlação diagnóstica. Ao final, adicione: "Exame POCUS à beira-leito, caráter focado e complementar. Não substitui avaliação ultrassonográfica formal."]

REFERÊNCIAS: [1 a 3 referências bibliográficas relevantes ao protocolo, formato: Sobrenome A et al. Título abreviado. Periódico Abrev. Ano;Vol(N):pp.]

2. OBJETIVO: parágrafo único para copiar/colar no prontuário, iniciando com:
"POCUS [sigla do protocolo] ([data do exame]): "
seguido de 2-3 frases integrando transdutor, achados principais e impressão diagnóstica.
Exemplo: "POCUS eFAST (12/04/2026): Exame realizado com transdutor convexo, direcionado para pesquisa de trauma abdominal. Moderada quantidade de líquido livre no espaço hepatorrenal, compatível com hemorragia intraabdominal no contexto de trauma."

Regras estritas:
- PT-BR técnico médico
- No campo ACHADOS: cada janela deve ser descrita em uma linha separada, iniciando pelo nome da janela seguido de dois-pontos. Não agrupar múltiplas janelas numa só linha.
- TODAS as janelas recebidas devem ser descritas nos ACHADOS. Janelas com status "normal" → descrever como sem alterações ecográficas (use frases clínicas apropriadas ao contexto da janela). Janelas com achados → descrever os achados listados.
- Nunca escrever "não avaliada"
- Nunca inventar achados
- Linguagem comedida: "sugestivo de", "compatível com", "sem sinais ecográficos de". Nunca afirmação diagnóstica absoluta
- Preservar sinais técnicos entre aspas tal como nos chips, mantendo formato bilíngue: "termo PT" ("termo EN")
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

  const dataExame = new Date().toLocaleDateString('pt-BR');
  const inputBrutoTyped = inputBruto as { sigla?: string };
  const userPrompt = `Protocolo: ${protocolo}\nSigla: ${inputBrutoTyped.sigla ?? ''}\nData do exame: ${dataExame}\n\n${JSON.stringify(inputBruto, null, 2)}`;

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
