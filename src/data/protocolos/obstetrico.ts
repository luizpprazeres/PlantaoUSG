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
    {
      id: 'obs_suprapubica_long',
      nome: 'Suprapúbica Longitudinal',
      grupos: [
        {
          categoria: 'gestacao',
          label: 'Útero / Gravidez',
          achados: [
            { id: 'obs_sgi_presente', label: 'Saco gestacional intrauterino identificado' },
            { id: 'obs_sgi_ausente', label: 'Saco gestacional intrauterino não visualizado' },
            { id: 'obs_embriao_visivel', label: 'Embrião/feto visível' },
            { id: 'obs_bcf_presentes', label: 'Batimentos cardíacos fetais presentes' },
            { id: 'obs_bcf_ausentes', label: 'Batimentos cardíacos fetais ausentes' },
            { id: 'obs_ectopica_suspeita', label: 'Massa anexial suspeita — possível gestação ectópica' },
            { id: 'obs_pseudossaco', label: 'Pseudossaco gestacional (saco intrauterino sem embrião)' },
          ],
        },
        {
          categoria: 'liquido_pelvico',
          label: 'Líquido Livre Pélvico',
          achados: [
            { id: 'obs_ll_pelvico_ausente', label: 'Sem líquido livre em fundo de saco de Douglas' },
            { id: 'obs_ll_pelvico_minimo', label: 'Mínimo líquido livre em fundo de saco' },
            { id: 'obs_ll_pelvico_moderado', label: 'Moderado líquido livre pélvico' },
            { id: 'obs_ll_pelvico_importante', label: 'Importante quantidade de líquido livre pélvico' },
          ],
        },
      ],
    },
    {
      id: 'obs_suprapubica_trans',
      nome: 'Suprapúbica Transversal',
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
    {
      id: 'obs_liquido_amniotico',
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
    {
      id: 'obs_abd_superior',
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
  limitacoesTecnicas: [
    { id: 'obs_lim_obesidade', label: 'Obesidade — janela acústica limitada' },
    { id: 'obs_lim_cicatriz', label: 'Cicatriz abdominal anterior' },
    { id: 'obs_lim_bexiga_vazia', label: 'Bexiga vazia — prejudica janela suprapúbica' },
    { id: 'obs_lim_gases', label: 'Interposição de alças' },
    { id: 'obs_lim_precoce', label: 'Gestação muito precoce — limitação de resolução' },
  ],
};
