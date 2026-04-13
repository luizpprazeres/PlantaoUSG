import type { Calculadora } from './definitions';

export const CALCULADORAS: Calculadora[] = [
  {
    id: 'shock_index',
    nome: 'Índice de Choque',
    categoria: 'CHOQUE',
    descricao: 'FC / PAS — triagem rápida de gravidade hemodinâmica',
    fonte: 'Cannon CM et al. Ann Emerg Med. 2009;54(1):29-36',
    campos: [
      { id: 'fc', label: 'Frequência Cardíaca', unit: 'bpm', type: 'number', min: 20, max: 300, placeholder: 'ex: 110' },
      { id: 'pas', label: 'Pressão Arterial Sistólica', unit: 'mmHg', type: 'number', min: 40, max: 300, placeholder: 'ex: 90' },
    ],
    calcular: (v) => {
      const is = v.fc / v.pas;
      const valor = is.toFixed(2);
      if (is < 0.7) return { valor, interpretacao: 'Normal — baixo risco hemodinâmico', cor: 'normal' };
      if (is < 1.0) return { valor, interpretacao: 'Atenção — monitorização e reavaliação', cor: 'atencao' };
      return { valor, interpretacao: 'Crítico — choque iminente, intervenção imediata', cor: 'critico' };
    },
  },
  {
    id: 'map',
    nome: 'Pressão Arterial Média (PAM)',
    categoria: 'CHOQUE',
    descricao: 'Pressão de perfusão tecidual — meta ≥65 mmHg na sepse',
    fonte: 'Rhodes A et al. Surviving Sepsis Campaign. Crit Care Med. 2017;45(3):486-552',
    campos: [
      { id: 'pas', label: 'Pressão Arterial Sistólica', unit: 'mmHg', type: 'number', min: 40, max: 300, placeholder: 'ex: 100' },
      { id: 'pad', label: 'Pressão Arterial Diastólica', unit: 'mmHg', type: 'number', min: 20, max: 200, placeholder: 'ex: 60' },
    ],
    calcular: (v) => {
      const pam = Math.round(v.pad + (v.pas - v.pad) / 3);
      const valor = `${pam} mmHg`;
      if (pam >= 65) return { valor, interpretacao: 'Adequada — perfusão tecidual preservada', cor: 'normal' };
      if (pam >= 55) return { valor, interpretacao: 'Atenção — otimizar volemia e vasopressores', cor: 'atencao' };
      return { valor, interpretacao: 'Crítica — hipoperfusão grave, ação imediata', cor: 'critico' };
    },
  },
  {
    id: 'qsofa',
    nome: 'qSOFA',
    categoria: 'SEPSE',
    descricao: 'Triagem rápida de disfunção orgânica por sepse fora da UTI',
    fonte: 'Singer M et al. JAMA. 2016;315(8):801-810 (Sepsis-3)',
    campos: [
      {
        id: 'glasgow',
        label: 'Glasgow ≤13',
        type: 'select',
        options: [{ label: 'Não (0 pts)', value: 0 }, { label: 'Sim (1 pt)', value: 1 }],
      },
      {
        id: 'fr',
        label: 'Frequência Respiratória ≥22 irpm',
        type: 'select',
        options: [{ label: 'Não (0 pts)', value: 0 }, { label: 'Sim (1 pt)', value: 1 }],
      },
      {
        id: 'pas',
        label: 'PAS ≤100 mmHg',
        type: 'select',
        options: [{ label: 'Não (0 pts)', value: 0 }, { label: 'Sim (1 pt)', value: 1 }],
      },
    ],
    calcular: (v) => {
      const score = (v.glasgow ?? 0) + (v.fr ?? 0) + (v.pas ?? 0);
      const valor = `${score}/3`;
      if (score === 0) return { valor, interpretacao: 'Baixo risco — qSOFA negativo', cor: 'normal' };
      if (score === 1) return { valor, interpretacao: 'Atenção — monitorar, reavaliar critérios', cor: 'atencao' };
      return { valor, interpretacao: 'Alto risco de sepse — avaliar SOFA completo, considerar UTI', cor: 'critico' };
    },
  },
  {
    id: 'wells_dvt',
    nome: 'Wells TVP',
    categoria: 'PULMONAR / TVP',
    descricao: 'Probabilidade pré-teste de trombose venosa profunda',
    fonte: 'Wells PS et al. Lancet. 1997;350(9094):1795-1798',
    campos: [
      { id: 'cancer', label: 'Câncer ativo (tratamento em curso ou últimos 6 meses)', type: 'select', options: [{ label: 'Não', value: 0 }, { label: 'Sim (+1)', value: 1 }] },
      { id: 'paralisia', label: 'Paralisia, paresia ou imobilização recente de MMII', type: 'select', options: [{ label: 'Não', value: 0 }, { label: 'Sim (+1)', value: 1 }] },
      { id: 'acamado', label: 'Acamado >3 dias ou cirurgia <12 semanas', type: 'select', options: [{ label: 'Não', value: 0 }, { label: 'Sim (+1)', value: 1 }] },
      { id: 'dor_trajeto', label: 'Dor à palpação no trajeto venoso profundo', type: 'select', options: [{ label: 'Não', value: 0 }, { label: 'Sim (+1)', value: 1 }] },
      { id: 'edema_total', label: 'Edema de toda a perna', type: 'select', options: [{ label: 'Não', value: 0 }, { label: 'Sim (+1)', value: 1 }] },
      { id: 'panturrilha', label: 'Circunferência panturrilha >3cm vs contralateral', type: 'select', options: [{ label: 'Não', value: 0 }, { label: 'Sim (+1)', value: 1 }] },
      { id: 'edema_depressivel', label: 'Edema depressível unilateral', type: 'select', options: [{ label: 'Não', value: 0 }, { label: 'Sim (+1)', value: 1 }] },
      { id: 'colaterais', label: 'Veias superficiais colaterais (não varicosas)', type: 'select', options: [{ label: 'Não', value: 0 }, { label: 'Sim (+1)', value: 1 }] },
      { id: 'alternativo', label: 'Diagnóstico alternativo tão ou mais provável', type: 'select', options: [{ label: 'Não', value: 0 }, { label: 'Sim (-2)', value: -2 }] },
    ],
    calcular: (v) => {
      const score = Object.values(v).reduce((a, b) => a + b, 0);
      const valor = `${score} pts`;
      if (score <= 0) return { valor, interpretacao: 'Baixa probabilidade — D-dímero pode excluir diagnóstico', cor: 'normal' };
      if (score <= 2) return { valor, interpretacao: 'Probabilidade intermediária — considerar USG compressão', cor: 'atencao' };
      return { valor, interpretacao: 'Alta probabilidade — USG compressão indicado, considerar anticoagulação', cor: 'critico' };
    },
  },
  {
    id: 'pleural_effusion',
    nome: 'Derrame Pleural — Estimativa de Volume',
    categoria: 'PULMONAR / TVP',
    descricao: 'Estimativa pelo método de Balik (USG em decúbito lateral)',
    fonte: 'Balik M et al. Intensive Care Med. 2006;32(2):318-321',
    campos: [
      { id: 'distancia', label: 'Distância hemidiafragma–base pulmonar em decúbito lateral', unit: 'mm', type: 'number', min: 0, max: 200, placeholder: 'ex: 45' },
    ],
    calcular: (v) => {
      const vol = Math.round(v.distancia * 70);
      const valor = `~${vol} mL`;
      if (vol < 200) return { valor, interpretacao: 'Derrame discreto — observação e monitorização', cor: 'normal' };
      if (vol < 500) return { valor, interpretacao: 'Derrame moderado — considerar toracocentese diagnóstica', cor: 'atencao' };
      return { valor, interpretacao: 'Derrame volumoso — toracocentese terapêutica indicada', cor: 'critico' };
    },
  },
  {
    id: 'ascites',
    nome: 'Ascite — Graduação Ultrassonográfica',
    categoria: 'ABDOMINAL',
    descricao: 'Classificação semiquantitativa de ascite ao POCUS',
    fonte: 'Alhammadi AH et al. J Ultrasound Med. 2014;33(8):1451-1457',
    campos: [
      {
        id: 'grau',
        label: 'Achado ultrassonográfico',
        type: 'select',
        options: [
          { label: 'Apenas em recessos (Douglas, Morrison)', value: 1 },
          { label: 'Flancos + pelve, alças intestinais flutuando parcialmente', value: 2 },
          { label: 'Difusa, alças flutuando livremente no líquido', value: 3 },
        ],
      },
    ],
    calcular: (v) => {
      if (v.grau === 1) return { valor: 'Grau 1 — Leve', interpretacao: 'Ascite discreta. Paracentese diagnóstica se clinicamente indicada.', cor: 'normal' };
      if (v.grau === 2) return { valor: 'Grau 2 — Moderada', interpretacao: 'Ascite moderada. Considerar paracentese terapêutica e investigação etiológica.', cor: 'atencao' };
      return { valor: 'Grau 3 — Volumosa', interpretacao: 'Ascite volumosa. Paracentese terapêutica indicada — avaliar PBE, albumina, etiologia.', cor: 'critico' };
    },
  },
  {
    id: 'cardiac_output',
    nome: 'Débito Cardíaco (VTI)',
    categoria: 'CARDÍACO',
    descricao: 'Cálculo pelo VTI na via de saída do ventrículo esquerdo (VSVE)',
    fonte: 'Levitov A et al. SCCM Guidelines. Crit Care Med. 2016;44(8):1579-1602',
    campos: [
      { id: 'vti', label: 'VTI da VSVE (integral velocidade-tempo)', unit: 'cm', type: 'number', min: 5, max: 50, placeholder: 'ex: 22' },
      { id: 'diametro', label: 'Diâmetro da VSVE', unit: 'mm', type: 'number', min: 10, max: 35, placeholder: 'ex: 20' },
      { id: 'fc', label: 'Frequência Cardíaca', unit: 'bpm', type: 'number', min: 20, max: 300, placeholder: 'ex: 80' },
    ],
    calcular: (v) => {
      const raioCm = (v.diametro / 10) / 2;
      const asc = Math.PI * raioCm * raioCm;
      const vs = asc * v.vti;
      const dc = (vs * v.fc) / 1000;
      const valor = `${dc.toFixed(1)} L/min`;
      if (dc >= 4 && dc <= 8) return { valor, interpretacao: `VS: ${Math.round(vs)} mL — Débito cardíaco normal`, cor: 'normal' };
      if (dc >= 2.5) return { valor, interpretacao: `VS: ${Math.round(vs)} mL — Débito reduzido — avaliar volemia e contratilidade`, cor: 'atencao' };
      return { valor, interpretacao: `VS: ${Math.round(vs)} mL — Débito gravemente reduzido — choque cardiogênico`, cor: 'critico' };
    },
  },
  {
    id: 'tapse',
    nome: 'TAPSE',
    categoria: 'CARDÍACO',
    descricao: 'Tricuspid Annular Plane Systolic Excursion — função sistólica do VD',
    fonte: 'Lang RM et al. ASE/EACVI Guidelines. J Am Soc Echocardiogr. 2015;28(1):1-39',
    campos: [
      { id: 'valor', label: 'TAPSE medido', unit: 'mm', type: 'number', min: 5, max: 40, placeholder: 'ex: 18' },
    ],
    calcular: (v) => {
      const t = v.valor;
      const val = `${t} mm`;
      if (t >= 17) return { valor: val, interpretacao: 'Função sistólica do VD preservada', cor: 'normal' };
      if (t >= 12) return { valor: val, interpretacao: 'Disfunção leve a moderada do VD — monitorar, avaliar causa', cor: 'atencao' };
      return { valor: val, interpretacao: 'Disfunção grave do VD — insuficiência ventricular direita significativa', cor: 'critico' };
    },
  },
  {
    id: 'aorta_diameter',
    nome: 'Diâmetro da Aorta Abdominal',
    categoria: 'ABDOMINAL',
    descricao: 'Triagem de aneurisma de aorta abdominal (AAA)',
    fonte: 'Chaikof EL et al. SVS Guidelines. J Vasc Surg. 2018;67(1):2-77',
    campos: [
      { id: 'diametro', label: 'Diâmetro máximo da aorta abdominal', unit: 'mm', type: 'number', min: 10, max: 120, placeholder: 'ex: 28' },
    ],
    calcular: (v) => {
      const d = v.diametro;
      const val = `${d} mm`;
      if (d < 30) return { valor: val, interpretacao: 'Normal — sem evidência de aneurisma', cor: 'normal' };
      if (d < 50) return { valor: val, interpretacao: 'Dilatação / AAA pequeno — rastreamento anual indicado', cor: 'atencao' };
      if (d < 55) return { valor: val, interpretacao: 'AAA ≥5cm — referenciar cirurgia vascular eletivamente', cor: 'critico' };
      return { valor: val, interpretacao: 'AAA ≥5,5cm — intervenção indicada, risco de ruptura elevado', cor: 'critico' };
    },
  },
  {
    id: 'ef_visual',
    nome: 'Fração de Ejeção Visual (qualitativa)',
    categoria: 'CARDÍACO',
    descricao: 'Estimativa visual da FEVE ao POCUS — método eyeballing',
    fonte: 'Via G et al. J Am Soc Echocardiogr. 2014;27(7):683.e1-33',
    campos: [
      {
        id: 'faixa',
        label: 'Estimativa visual da contratilidade do VE',
        type: 'select',
        options: [
          { label: 'Hiperdinâmico — FEVE >70%', value: 4 },
          { label: 'Normal — FEVE 55–70%', value: 3 },
          { label: 'Levemente reduzida — FEVE 45–54%', value: 2 },
          { label: 'Moderadamente reduzida — FEVE 30–44%', value: 1 },
          { label: 'Gravemente reduzida — FEVE <30%', value: 0 },
        ],
      },
    ],
    calcular: (v) => {
      const faixas = [
        { valor: 'FEVE <30% — Grave', interpretacao: 'Disfunção sistólica grave — choque cardiogênico, inotrópicos, suporte especializado urgente', cor: 'critico' as const },
        { valor: 'FEVE 30–44% — Moderada', interpretacao: 'Disfunção sistólica moderada — otimizar pré e pós-carga, considerar cardiologista', cor: 'critico' as const },
        { valor: 'FEVE 45–54% — Leve', interpretacao: 'Disfunção sistólica leve — monitorar, investigar etiologia', cor: 'atencao' as const },
        { valor: 'FEVE 55–70% — Normal', interpretacao: 'Função sistólica preservada', cor: 'normal' as const },
        { valor: 'FEVE >70% — Hiperdinâmica', interpretacao: 'Função hiperdinâmica — considerar hipovolemia, choque distributivo, febre', cor: 'atencao' as const },
      ];
      return faixas[v.faixa] ?? faixas[3];
    },
  },

  // ── OBSTÉTRICO ────────────────────────────────────────────────────────────
  {
    id: 'ig_ccn',
    nome: 'IG pelo CCN',
    categoria: 'OBSTÉTRICO',
    descricao: 'Idade gestacional pelo Comprimento Cabeça-Nádega (1º trimestre, 5–84mm)',
    fonte: 'Hadlock FP et al. Am J Obstet Gynecol. 1992;167(4):903-908',
    campos: [
      { id: 'ccn', label: 'CCN — Comprimento Cabeça-Nádega', unit: 'mm', type: 'number', min: 5, max: 84, placeholder: 'ex: 25' },
    ],
    calcular: (v) => {
      const igSemanas = v.ccn / 7 + 6;
      const semanas = Math.floor(igSemanas);
      const dias = Math.round((igSemanas - semanas) * 7);
      const valor = `${semanas}s ${dias}d`;
      return {
        valor,
        interpretacao: `${semanas} semanas e ${dias} dias de gestação (pelo CCN de ${v.ccn} mm)`,
        cor: 'normal',
      };
    },
  },
  {
    id: 'ig_dmsg',
    nome: 'IG pelo DMSG',
    categoria: 'OBSTÉTRICO',
    descricao: 'Idade gestacional pelo Diâmetro Médio do Saco Gestacional (gestação muito precoce, 2–30mm)',
    fonte: 'Robinson HP, Fleming JEE. BJOG. 1975;82(9):702-710',
    campos: [
      { id: 'dmsg', label: 'DMSG — Diâmetro Médio do Saco Gestacional', unit: 'mm', type: 'number', min: 2, max: 30, placeholder: 'ex: 12' },
    ],
    calcular: (v) => {
      const igDias = v.dmsg + 30;
      const semanas = Math.floor(igDias / 7);
      const dias = igDias % 7;
      const valor = `${semanas}s ${dias}d`;
      return {
        valor,
        interpretacao: `${semanas} semanas e ${dias} dias de gestação (pelo DMSG de ${v.dmsg} mm) — válido antes da visualização do embrião`,
        cor: 'normal',
      };
    },
  },
  {
    id: 'ila',
    nome: 'ILA — Índice de Líquido Amniótico',
    categoria: 'OBSTÉTRICO',
    descricao: 'Soma dos maiores bolsões nos 4 quadrantes uterinos (técnica de Phelan)',
    fonte: 'Phelan JP et al. Am J Obstet Gynecol. 1987;157(3):762-764',
    campos: [
      { id: 'q1', label: 'Quadrante superior direito', unit: 'mm', type: 'number', min: 0, max: 200, placeholder: 'ex: 45' },
      { id: 'q2', label: 'Quadrante superior esquerdo', unit: 'mm', type: 'number', min: 0, max: 200, placeholder: 'ex: 40' },
      { id: 'q3', label: 'Quadrante inferior direito', unit: 'mm', type: 'number', min: 0, max: 200, placeholder: 'ex: 50' },
      { id: 'q4', label: 'Quadrante inferior esquerdo', unit: 'mm', type: 'number', min: 0, max: 200, placeholder: 'ex: 35' },
    ],
    calcular: (v) => {
      const ila = (v.q1 ?? 0) + (v.q2 ?? 0) + (v.q3 ?? 0) + (v.q4 ?? 0);
      const valor = `${ila} mm`;
      if (ila < 50) return { valor, interpretacao: 'Oligohidrâmnio grave — avaliação obstétrica urgente', cor: 'critico' };
      if (ila < 80) return { valor, interpretacao: 'Oligohidrâmnio leve — monitorização fetal e avaliação obstétrica', cor: 'atencao' };
      if (ila <= 200) return { valor, interpretacao: 'Volume amniótico normal', cor: 'normal' };
      return { valor, interpretacao: 'Polidrâmnio — avaliar causa (diabetes, anomalias fetais)', cor: 'atencao' };
    },
  },
];

export const CALCULADORA_MAP: Record<string, Calculadora> = Object.fromEntries(
  CALCULADORAS.map((c) => [c.id, c])
);

export const CATEGORIAS_CALCULADORAS = [...new Set(CALCULADORAS.map((c) => c.categoria))];
