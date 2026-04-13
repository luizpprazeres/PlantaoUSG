import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import type { MedicoInfo } from '@/hooks/useMedico';

function formatarData(): { data: string; hora: string } {
  const now = new Date();
  const data = now.toLocaleDateString('pt-BR');
  const hora = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return { data, hora };
}

function laudoParaHTML(texto: string): string {
  const HEADERS = ['TÉCNICA', 'ACHADOS', 'IMPRESSÃO', 'REFERÊNCIAS'];
  const lines = texto.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  let html = '';

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      html += '<br>';
      continue;
    }
    const isHeader = HEADERS.find(h => {
      const upper = trimmed.toUpperCase();
      return upper === h || upper.startsWith(`${h}:`) || upper.startsWith(`${h} `);
    });
    if (isHeader) {
      html += `<p class="section-title">${trimmed}</p>`;
    } else {
      html += `<p class="content-line">${trimmed}</p>`;
    }
  }

  return html;
}

function gerarHTML(
  laudoExtenso: string,
  laudoObjetivo: string,
  protocolo: string,
  medico: MedicoInfo
): string {
  const { data, hora } = formatarData();

  const medicoLinha = medico.nome
    ? `Dr(a). ${medico.nome}${medico.crm ? ` · CRM-${medico.crmEstado} ${medico.crm}` : ''}${medico.especialidade ? ` · ${medico.especialidade}` : ''}`
    : '';

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Courier New', Courier, monospace;
      font-size: 11px;
      color: #1a1a1a;
      padding: 48px 48px 40px;
      line-height: 1.5;
    }
    .header {
      border-bottom: 2px solid #1a1a1a;
      padding-bottom: 16px;
      margin-bottom: 28px;
    }
    .app-name {
      font-size: 16px;
      font-weight: bold;
      letter-spacing: 3px;
      text-transform: uppercase;
    }
    .app-sub {
      font-size: 9px;
      letter-spacing: 2px;
      color: #666;
      margin-top: 2px;
    }
    .medico-info {
      margin-top: 12px;
      font-size: 10px;
      color: #333;
    }
    .medico-nome {
      font-weight: bold;
      font-size: 11px;
    }
    .exame-info {
      margin-top: 4px;
      font-size: 10px;
      color: #555;
    }
    .section-block {
      margin-bottom: 28px;
    }
    .section-label {
      font-size: 9px;
      letter-spacing: 2px;
      color: #888;
      text-transform: uppercase;
      margin-bottom: 10px;
      border-bottom: 1px solid #eee;
      padding-bottom: 4px;
    }
    .section-title {
      font-weight: bold;
      font-size: 11px;
      margin-top: 14px;
      margin-bottom: 4px;
      letter-spacing: 0.5px;
    }
    .content-line {
      font-size: 11px;
      color: #2a2a2a;
      margin-bottom: 3px;
    }
    .objetivo-text {
      font-size: 11px;
      color: #2a2a2a;
      line-height: 1.7;
    }
    .disclaimer {
      margin-top: 36px;
      padding-top: 14px;
      border-top: 1px solid #ddd;
      font-size: 9px;
      color: #777;
      line-height: 1.6;
    }
    .footer {
      margin-top: 20px;
      font-size: 8px;
      color: #aaa;
      text-align: center;
      letter-spacing: 1px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="app-name">Plantão USG</div>
    <div class="app-sub">POCUS · LAUDOS · EMERGÊNCIA</div>
    ${medicoLinha ? `
    <div class="medico-info">
      <div class="medico-nome">${medicoLinha}</div>
    </div>` : ''}
    <div class="exame-info">
      Protocolo: ${protocolo} &nbsp;·&nbsp; ${data} às ${hora}
    </div>
  </div>

  <div class="section-block">
    <div class="section-label">Laudo Estruturado</div>
    ${laudoParaHTML(laudoExtenso)}
  </div>

  <div class="section-block">
    <div class="section-label">Versão para Prontuário</div>
    <p class="objetivo-text">${laudoObjetivo.replace(/\n/g, '<br>')}</p>
  </div>

  <div class="disclaimer">
    Laudo elaborado pelo médico com auxílio de ferramenta digital de suporte à documentação clínica.
    A responsabilidade clínica é do profissional médico signatário.
    Exame POCUS de caráter focado e complementar — não substitui avaliação ultrassonográfica formal.
    Resolução CFM nº 2.314/2022.
  </div>

  <div class="footer">GERADO COM PLANTÃO USG · LAUDOUSG.COM</div>
</body>
</html>`;
}

export async function exportarPDF(
  laudoExtenso: string,
  laudoObjetivo: string,
  protocolo: string,
  medico: MedicoInfo
): Promise<void> {
  const html = gerarHTML(laudoExtenso, laudoObjetivo, protocolo, medico);

  const { uri } = await Print.printToFileAsync({ html, base64: false });

  const podeCompartilhar = await Sharing.isAvailableAsync();
  if (podeCompartilhar) {
    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      dialogTitle: 'Exportar laudo POCUS',
      UTI: 'com.adobe.pdf',
    });
  }
}
