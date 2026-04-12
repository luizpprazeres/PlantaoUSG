import Constants from 'expo-constants';

const API_URL =
  (Constants.expoConfig?.extra?.apiUrl as string | undefined) ??
  'http://localhost:3000';

export interface InputBruto {
  protocolo: string;
  transdutor: string;
  janelasComInput: Array<{
    nome: string;
    achados: string[];
  }>;
  observacoes: string;
  limitacoes: string[];
}

export interface LaudoGerado {
  extenso: string;
  objetivo: string;
}

export async function gerarLaudo(
  protocolo: string,
  inputBruto: InputBruto
): Promise<LaudoGerado> {
  const response = await fetch(`${API_URL}/api/gerar-laudo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ protocolo, inputBruto }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
    throw new Error((err as { error: string }).error ?? `Erro ${response.status}`);
  }

  return response.json() as Promise<LaudoGerado>;
}
