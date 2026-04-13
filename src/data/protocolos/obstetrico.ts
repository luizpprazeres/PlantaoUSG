import type { Protocolo } from './tipos';

export const OBSTETRICO: Protocolo = {
  id: 'obstetrico',
  nome: 'Obstétrico',
  nomeCompleto: 'POCUS Obstétrico de Emergência',
  icone: '🤰',
  indicacao: 'Gestação ectópica, vitalidade fetal, apresentação, placenta e líquido amniótico',
  categoria: 'OBSTÉTRICO',
  transdutor: 'Transdutor convexo (abdominal) ou linear (transvaginal)',

  janelas: [
    // ── 1. VITALIDADE FETAL ────────────────────────────────────────────────
    {
      id: 'obs_vitalidade',
      nome: 'Vitalidade Fetal',
      grupos: [
        {
          categoria: 'bcf',
          label: 'Batimentos Cardíacos Fetais',
          achados: [
            { id: 'obs_bcf_presentes', label: 'BCF presentes' },
            { id: 'obs_bcf_ausentes', label: 'BCF ausentes' },
            { id: 'obs_bcf_bradicardico', label: 'BCF bradicárdico (<110 bpm)' },
            { id: 'obs_bcf_nao_visualizado', label: 'Não visualizado — janela insuficiente' },
          ],
        },
        {
          categoria: 'movimentos',
          label: 'Movimentos e Tônus Fetais',
          achados: [
            { id: 'obs_mov_presente', label: 'Movimento fetal presente' },
            { id: 'obs_mov_ausente', label: 'Movimento fetal ausente' },
            { id: 'obs_tonus_presente', label: 'Tônus fetal presente' },
            { id: 'obs_tonus_ausente', label: 'Tônus fetal ausente' },
          ],
        },
      ],
    },

    // ── 2. GESTAÇÃO ECTÓPICA / PELVE ──────────────────────────────────────
    {
      id: 'obs_ectopica',
      nome: 'Gestação Ectópica / Pelve',
      grupos: [
        {
          categoria: 'saco_gestacional',
          label: 'Saco Gestacional Intrauterino',
          achados: [
            { id: 'obs_sgi_presente', label: 'Saco gestacional intrauterino identificado' },
            { id: 'obs_sgi_ausente', label: 'Saco gestacional intrauterino não visualizado' },
            { id: 'obs_embriao_bcf', label: 'Embrião visível com BCF' },
            { id: 'obs_embriao_sem_bcf', label: 'Embrião visível sem BCF' },
            { id: 'obs_pseudossaco', label: 'Pseudossaco gestacional (saco sem embrião)' },
          ],
        },
        {
          categoria: 'ectopica',
          label: 'Região Anexial',
          achados: [
            { id: 'obs_ectopica_suspeita', label: 'Massa anexial suspeita — possível gestação ectópica' },
            { id: 'obs_ectopica_bcf', label: 'Massa anexial com embrião e BCF — ectópica provável' },
          ],
        },
        {
          categoria: 'liquido_pelvico',
          label: 'Líquido Livre Pélvico',
          achados: [
            { id: 'obs_ll_pelvico_ausente', label: 'Sem líquido livre pélvico' },
            { id: 'obs_ll_pelvico_minimo', label: 'Mínimo líquido livre (fundo de saco)' },
            { id: 'obs_ll_pelvico_moderado', label: 'Moderado líquido livre pélvico' },
            { id: 'obs_ll_pelvico_importante', label: 'Importante líquido livre pélvico — hemoperitônio suspeito' },
          ],
        },
      ],
    },

    // ── 3. APRESENTAÇÃO E PLACENTA ────────────────────────────────────────
    {
      id: 'obs_apresentacao',
      nome: 'Apresentação e Placenta',
      grupos: [
        {
          categoria: 'apresentacao',
          label: 'Apresentação Fetal',
          achados: [
            { id: 'obs_apresentacao_cefalica', label: 'Apresentação cefálica' },
            { id: 'obs_apresentacao_pelvica', label: 'Apresentação pélvica' },
            { id: 'obs_apresentacao_transversa', label: 'Apresentação transversa/córmica' },
            { id: 'obs_apresentacao_indeterminada', label: 'Apresentação não determinada' },
          ],
        },
        {
          categoria: 'placenta',
          label: 'Placenta',
          achados: [
            { id: 'obs_placenta_anterior', label: 'Placenta anterior' },
            { id: 'obs_placenta_posterior', label: 'Placenta posterior' },
            { id: 'obs_placenta_fundica', label: 'Placenta fúndica' },
            { id: 'obs_placenta_previa_suspeita', label: 'Placenta de inserção baixa — suspeita de prévia' },
            { id: 'obs_placenta_previa', label: 'Placenta prévia — cobre orifício interno' },
          ],
        },
      ],
    },

    // ── 4. LÍQUIDO AMNIÓTICO ──────────────────────────────────────────────
    {
      id: 'obs_la',
      nome: 'Líquido Amniótico',
      grupos: [
        {
          categoria: 'volume_amniotico',
          label: 'Volume Amniótico (ILA estimado)',
          achados: [
            { id: 'obs_la_normal', label: 'Volume de líquido amniótico normal' },
            { id: 'obs_oligodramnio', label: 'Oligohidrâmnio — redução do líquido amniótico' },
            { id: 'obs_anidramnio', label: 'Anidrâmnio — ausência de líquido amniótico' },
            { id: 'obs_polihidramnio', label: 'Polidrâmnio — aumento do líquido amniótico' },
          ],
        },
      ],
    },

    // ── 5. ABDOME SUPERIOR ────────────────────────────────────────────────
    {
      id: 'obs_abd',
      nome: 'Abdome Superior (Líquido Livre)',
      grupos: [
        {
          categoria: 'liquido_abd',
          label: 'Espaço Hepatorrenal e Esplenorrenal',
          achados: [
            { id: 'obs_ll_abd_ausente', label: 'Sem líquido livre em espaços peritoniais superiores' },
            { id: 'obs_ll_morrison', label: 'Líquido livre em espaço hepatorrenal (Morrison)' },
            { id: 'obs_ll_esplenorrenal', label: 'Líquido livre em espaço esplenorrenal' },
            { id: 'obs_ll_abd_extenso', label: 'Líquido livre extenso — hemoperitônio a esclarecer' },
          ],
        },
      ],
    },
  ],

  // ── JANELA OPCIONAL: DOPPLER OBSTÉTRICO ─────────────────────────────────
  janelasOpcionais: [
    {
      id: 'obs_doppler',
      nome: 'Doppler Obstétrico',
      chipAtivadorId: 'obs_doppler_ativar',
      grupos: [
        {
          categoria: 'doppler_umbilical',
          label: 'Artéria Umbilical',
          achados: [
            { id: 'obs_dop_umb_presente', label: 'Fluxo diastólico presente (normal)' },
            { id: 'obs_dop_umb_reduzido', label: 'Fluxo diastólico reduzido' },
            { id: 'obs_dop_umb_ausente', label: 'Fluxo diastólico ausente' },
            { id: 'obs_dop_umb_reverso', label: 'Fluxo diastólico reverso' },
          ],
        },
        {
          categoria: 'doppler_acm',
          label: 'Artéria Cerebral Média (ACM)',
          achados: [
            { id: 'obs_dop_acm_normal', label: 'IP da ACM normal' },
            { id: 'obs_dop_acm_elevado', label: 'IP da ACM elevado — redistribuição de fluxo' },
            { id: 'obs_dop_acm_centralizacao', label: 'Centralização fetal confirmada' },
          ],
        },
      ],
    },
  ],

  limitacoesTecnicas: [
    { id: 'obs_lim_obesidade', label: 'Obesidade — janela acústica limitada' },
    { id: 'obs_lim_cicatriz', label: 'Cicatriz abdominal anterior' },
    { id: 'obs_lim_bexiga_vazia', label: 'Bexiga vazia — prejudica janela suprapúbica' },
    { id: 'obs_lim_gases', label: 'Interposição de alças' },
    { id: 'obs_lim_precoce', label: 'Gestação muito precoce — limitação de resolução' },
    { id: 'obs_lim_sem_doppler', label: 'Doppler não disponível no equipamento' },
  ],
};
