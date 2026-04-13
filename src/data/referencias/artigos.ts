import type { Artigo } from './tipos';

export const ARTIGOS: Artigo[] = [
  // ── GERAL / FUNDAMENTOS ──────────────────────────────────────────────────
  {
    id: 'moore2011',
    titulo: 'Point-of-Care Ultrasonography',
    autores: 'Moore CL, Copel JA',
    revista: 'N Engl J Med',
    ano: 2011,
    doi: '10.1056/NEJMra0909487',
    pmid: '21208112',
    categorias: ['geral'],
    resumo:
      'Revisão seminal sobre POCUS na prática clínica. Define indicações, limitações e competências para uso do ultrassom point-of-care em emergência e cuidados intensivos. Referência fundamental para qualquer praticante de POCUS.',
    impacto: 'fundamental',
    acesso: 'pago',
  },
  {
    id: 'shokoohi2021',
    titulo: 'Point-of-Care Ultrasound in Emergency Medicine: A Structured Review of Impact on Diagnosis',
    autores: 'Shokoohi H, et al.',
    revista: 'Ann Emerg Med',
    ano: 2021,
    doi: '10.1016/j.annemergmed.2021.01.005',
    categorias: ['geral'],
    resumo:
      'Revisão estruturada do impacto do POCUS na acurácia diagnóstica em medicina de emergência. Demonstra redução de erros diagnósticos e melhora de desfechos em múltiplos cenários clínicos.',
    impacto: 'fundamental',
    acesso: 'pago',
  },

  // ── PULMÃO / BLUE ────────────────────────────────────────────────────────
  {
    id: 'volpicelli2012',
    titulo: 'International Evidence-Based Recommendations for Point-of-Care Lung Ultrasound',
    autores: 'Volpicelli G, et al. — International Liaison Committee on Lung Ultrasound (ILC-LUS)',
    revista: 'Intensive Care Med',
    ano: 2012,
    doi: '10.1007/s00134-012-2513-4',
    pmid: '22392031',
    categorias: ['blue', 'geral', 'diretriz'],
    resumo:
      'Diretriz internacional de consenso sobre USG pulmonar point-of-care. Define os padrões semiológicos (linha A, linha B, consolidação, sinal do pulmão deslizante) e suas interpretações clínicas. Referência obrigatória para o protocolo BLUE.',
    impacto: 'fundamental',
    acesso: 'aberto',
  },
  {
    id: 'lichtenstein2019',
    titulo: 'Current Misconceptions in Lung Ultrasound: A Short Guide for Experts',
    autores: 'Lichtenstein DA',
    revista: 'Chest',
    ano: 2019,
    doi: '10.1016/j.chest.2018.09.007',
    pmid: '30266626',
    categorias: ['blue'],
    resumo:
      'Correção de erros comuns na interpretação do USG pulmonar por especialistas. Aborda artefatos, limitações técnicas e ciladas diagnósticas. Leitura essencial para evitar sobrediagnóstico.',
    impacto: 'importante',
    acesso: 'pago',
  },

  // ── CARDÍACO / RUSH ──────────────────────────────────────────────────────
  {
    id: 'labovitz2010',
    titulo: 'Focused Cardiac Ultrasound in the Emergent Setting: A Consensus Statement of the ACEP and the ASE',
    autores: 'Labovitz AJ, et al.',
    revista: 'J Am Soc Echocardiogr',
    ano: 2010,
    doi: '10.1016/j.echo.2010.10.005',
    pmid: '21074967',
    categorias: ['cardiac', 'rush', 'diretriz'],
    resumo:
      'Declaração de consenso ACEP/ASE sobre USG cardíaco focado em emergência. Define protocolos, indicações e limitações do ecocardiograma point-of-care. Base para os protocolos FoCUS e RUSH.',
    impacto: 'fundamental',
    acesso: 'aberto',
  },
  {
    id: 'via2014',
    titulo: 'International Evidence-Based Recommendations for Focused Cardiac Ultrasound',
    autores: 'Via G, et al.',
    revista: 'J Am Soc Echocardiogr',
    ano: 2014,
    doi: '10.1016/j.echo.2014.05.001',
    pmid: '24882675',
    categorias: ['cardiac', 'rush', 'diretriz'],
    resumo:
      'Recomendações internacionais baseadas em evidências para USG cardíaco focado em UTI e emergência. Cobre avaliação de função sistólica, derrame pericárdico, VCI e pressões de enchimento. Amplamente adotado em cursos POCUS.',
    impacto: 'fundamental',
    acesso: 'pago',
  },
  {
    id: 'levitov2016',
    titulo:
      'Guidelines for the Appropriate Use of Bedside General and Cardiac Ultrasonography in the Evaluation of Critically Ill Patients',
    autores: 'Levitov A, et al. — SCCM',
    revista: 'Crit Care Med',
    ano: 2016,
    doi: '10.1097/CCM.0000000000001847',
    pmid: '27182849',
    categorias: ['cardiac', 'rush', 'diretriz'],
    resumo:
      'Diretriz SCCM para uso do ultrassom à beira do leito em pacientes críticos. Inclui recomendações para avaliação cardíaca, pulmonar, vascular e guia de procedimentos.',
    impacto: 'fundamental',
    acesso: 'pago',
  },

  // ── VExUS ────────────────────────────────────────────────────────────────
  {
    id: 'beaubien2020',
    titulo: 'The VExUS Score: A Venous Excess Ultrasound System for Assessment of Fluid Overload',
    autores: 'Beaubien-Souligny W, et al.',
    revista: 'NEJM Evid',
    ano: 2020,
    doi: '10.1056/EVIDoa2100030',
    categorias: ['vexus'],
    resumo:
      'Artigo original descrevendo o sistema VExUS (Venous Excess Ultrasound). Define a gradação 0-3 baseada em padrões de fluxo doppler na veia cava inferior, veia porta, veias hepáticas e veia renal intrarrenal. Prediz injúria renal aguda pós-operatória.',
    impacto: 'fundamental',
    acesso: 'aberto',
  },

  // ── eFAST / TRAUMA ───────────────────────────────────────────────────────
  {
    id: 'kirkpatrick2023',
    titulo: 'Point-of-Care Ultrasound in Critical Care: A Narrative Review',
    autores: 'Kirkpatrick AW, et al.',
    revista: 'Can J Anaesth',
    ano: 2023,
    doi: '10.1007/s12630-022-02385-3',
    categorias: ['efast', 'geral'],
    resumo:
      'Revisão narrativa atualizada sobre POCUS em terapia intensiva e trauma. Aborda integração do eFAST no ATLS, limitações em pneumotórax oculto e hemotórax. Perspectiva canadense com relevância global.',
    impacto: 'importante',
    acesso: 'pago',
  },

  // ── OBSTÉTRICO ───────────────────────────────────────────────────────────
  {
    id: 'hernandez2019',
    titulo: 'Point-of-Care Ultrasound for Obstetric and Gynecologic Emergencies',
    autores: 'Hernandez C, et al.',
    revista: 'West J Emerg Med',
    ano: 2019,
    doi: '10.5811/westjem.2018.10.38860',
    pmid: '30881573',
    categorias: ['obstetrico'],
    resumo:
      'Revisão sobre POCUS em emergências obstétricas e ginecológicas. Cobre diagnóstico de gestação ectópica, avaliação de vitalidade fetal, apresentação e localização placentária. Inclui sensibilidade e especificidade por indicação.',
    impacto: 'importante',
    acesso: 'aberto',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// DIRETRIZES INSTITUCIONAIS
// ─────────────────────────────────────────────────────────────────────────────

export interface Diretriz {
  id: string;
  orgao: string;
  titulo: string;
  ano: number;
  url?: string;
  categorias: string[];
  descricao: string;
}

export const DIRETRIZES: Diretriz[] = [
  {
    id: 'acep2023',
    orgao: 'ACEP',
    titulo: 'Emergency Ultrasound Guidelines',
    ano: 2023,
    url: 'https://www.acep.org/patient-care/policy-statements/emergency-ultrasound-guidelines/',
    categorias: ['geral', 'efast', 'cardiac', 'obstetrico'],
    descricao:
      'Diretrizes do American College of Emergency Physicians para uso de ultrassom em emergência. Cobre 17 aplicações clínicas, requisitos de treinamento e documentação.',
  },
  {
    id: 'sccm2016',
    orgao: 'SCCM',
    titulo: 'Guidelines for Bedside Ultrasonography in the Critically Ill',
    ano: 2016,
    categorias: ['geral', 'cardiac', 'rush', 'vexus'],
    descricao:
      'Diretrizes da Society of Critical Care Medicine para uso do ultrassom à beira do leito em UTI. Graded evidence recommendations para avaliação hemodinâmica e guia de procedimentos.',
  },
  {
    id: 'efsumb2022',
    orgao: 'EFSUMB',
    titulo: 'EFSUMB Guidelines on Point of Care Ultrasound',
    ano: 2022,
    url: 'https://www.efsumb.org/guidelines/',
    categorias: ['geral', 'blue', 'cardiac'],
    descricao:
      'Diretrizes da European Federation of Societies for Ultrasound in Medicine and Biology para POCUS. Amplamente adotado em treinamentos europeus e ibero-americanos.',
  },
  {
    id: 'cfm2018',
    orgao: 'CFM',
    titulo: 'Resolução CFM 2.236/2018 — Uso de Ultrassonografia por Médicos',
    ano: 2018,
    categorias: ['geral'],
    descricao:
      'Resolução do Conselho Federal de Medicina que regulamenta o uso de ultrassonografia por médicos não radiologistas. Define competências mínimas e documentação necessária para uso do POCUS no Brasil.',
  },
];
