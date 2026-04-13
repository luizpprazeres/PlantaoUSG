import Constants from 'expo-constants';

const API_URL =
  (Constants.expoConfig?.extra?.apiUrl as string | undefined) ??
  'http://localhost:3000';

export type JanelaPayload =
  | { nome: string; achados: string[] }
  | { nome: string; status: 'normal' };

export interface InputBruto {
  protocolo: string;    // nome completo ex: "Extended Focused Assessment with Sonography in Trauma"
  sigla: string;        // abreviação ex: "eFAST"
  transdutor: string;
  janelas: JanelaPayload[];
  observacoes: string;
  limitacoes: string[];
}

export interface LaudoGerado {
  extenso: string;
  objetivo: string;
}

export interface MensagemChat {
  role: 'user' | 'assistant';
  content: string;
}

export async function tirarDuvida(
  mensagens: MensagemChat[]
): Promise<string> {
  const response = await fetch(`${API_URL}/api/tira-duvidas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mensagens }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
    throw new Error((err as { error: string }).error ?? `Erro ${response.status}`);
  }

  const data = await response.json() as { resposta: string };
  return data.resposta;
}

export async function gerarLaudo(
  inputBruto: InputBruto
): Promise<LaudoGerado> {
  const response = await fetch(`${API_URL}/api/gerar-laudo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ protocolo: inputBruto.protocolo, inputBruto }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
    throw new Error((err as { error: string }).error ?? `Erro ${response.status}`);
  }

  return response.json() as Promise<LaudoGerado>;
}
