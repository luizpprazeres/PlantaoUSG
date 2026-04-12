import type { Protocolo } from './tipos';
import { LIMITACOES_GLOBAIS } from '../limitacoes';

export const EFAST: Protocolo = {
  id: 'efast',
  nome: 'eFAST',
  nomeCompleto: 'Extended Focused Assessment with Sonography in Trauma',
  indicacao: 'Líquido livre em cavidades + pneumotórax/hemotórax na emergência',
  icone: 'Crosshair',
  categoria: 'TRAUMA',
  transdutor: 'Convexo (abdominal) + Linear alta frequência (pleural)',
  janelas: [
    {
      id: 'morrison',
      nome: 'Quadrante Superior Direito (Morrison)',
      grupos: [
        {
          categoria: 'normal',
          label: 'Normal',
          achados: [
            { id: 'ef_m1', label: 'Espaço hepatorrenal sem evidência de líquido livre' },
            { id: 'ef_m2', label: 'Recesso subfrênico direito sem líquido livre' },
            { id: 'ef_m3', label: 'Goteira parietocólica direita sem líquido livre' },
          ],
        },
        {
          categoria: 'alterado',
          label: 'Alterado',
          achados: [
            { id: 'ef_m4', label: 'Lâmina fina de líquido livre no espaço hepatorrenal' },
            { id: 'ef_m5', label: 'Moderada quantidade de líquido livre no espaço hepatorrenal' },
            { id: 'ef_m6', label: 'Volumoso líquido livre no espaço hepatorrenal' },
            { id: 'ef_m7', label: 'Líquido livre em recesso subfrênico direito' },
            { id: 'ef_m8', label: 'Líquido livre em goteira parietocólica direita' },
            { id: 'ef_m9', label: 'Líquido de aspecto ecogênico/heterogêneo em Morrison, sugestivo de conteúdo hemático' },
          ],
        },
      ],
    },
    {
      id: 'esplenorrenal',
      nome: 'Quadrante Superior Esquerdo (Esplenorrenal)',
      grupos: [
        {
          categoria: 'normal',
          label: 'Normal',
          achados: [
            { id: 'ef_e1', label: 'Espaço esplenorrenal sem evidência de líquido livre' },
            { id: 'ef_e2', label: 'Recesso subfrênico esquerdo sem líquido livre' },
            { id: 'ef_e3', label: 'Goteira parietocólica esquerda sem líquido livre' },
          ],
        },
        {
          categoria: 'alterado',
          label: 'Alterado',
          achados: [
            { id: 'ef_e4', label: 'Lâmina fina de líquido livre em recesso subfrênico esquerdo' },
            { id: 'ef_e5', label: 'Moderada quantidade de líquido livre perisplênico' },
            { id: 'ef_e6', label: 'Volumoso líquido livre perisplênico' },
            { id: 'ef_e7', label: 'Líquido livre em goteira parietocólica esquerda' },
            { id: 'ef_e8', label: 'Líquido de aspecto ecogênico/heterogêneo perisplênico, sugestivo de conteúdo hemático' },
          ],
        },
      ],
    },
    {
      id: 'suprapubica',
      nome: 'Suprapúbica (Fundo de saco de Douglas)',
      grupos: [
        {
          categoria: 'normal',
          label: 'Normal',
          achados: [
            { id: 'ef_s1', label: 'Fundo de saco de Douglas sem evidência de líquido livre' },
            { id: 'ef_s2', label: 'Sem líquido livre perivesical' },
            { id: 'ef_s3', label: 'Bexiga adequadamente repleta' },
          ],
        },
        {
          categoria: 'alterado',
          label: 'Alterado',
          achados: [
            { id: 'ef_s4', label: 'Lâmina fina de líquido livre em fundo de saco de Douglas' },
            { id: 'ef_s5', label: 'Moderada quantidade de líquido livre em pelve' },
            { id: 'ef_s6', label: 'Volumoso líquido livre em pelve' },
            { id: 'ef_s7', label: 'Líquido livre perivesical' },
            { id: 'ef_s8', label: 'Líquido com debris/ecogênico em pelve, sugestivo de conteúdo hemático' },
          ],
        },
      ],
    },
    {
      id: 'subxifoide',
      nome: 'Subxifoide (Pericárdio)',
      grupos: [
        {
          categoria: 'normal',
          label: 'Normal',
          achados: [
            { id: 'ef_p1', label: 'Saco pericárdico sem evidência de derrame' },
            { id: 'ef_p2', label: 'Sem sinais ecográficos de tamponamento' },
          ],
        },
        {
          categoria: 'alterado',
          label: 'Alterado',
          achados: [
            { id: 'ef_p3', label: 'Derrame pericárdico de pequena monta' },
            { id: 'ef_p4', label: 'Derrame pericárdico moderado' },
            { id: 'ef_p5', label: 'Derrame pericárdico volumoso' },
            { id: 'ef_p6', label: 'Derrame pericárdico com sinais sugestivos de tamponamento (colabamento diastólico de câmaras direitas)' },
            { id: 'ef_p7', label: 'Derrame pericárdico de aspecto ecogênico, sugestivo de conteúdo hemático' },
          ],
        },
      ],
    },
    {
      id: 'pleural_direito',
      nome: 'Hemitórax Direito (pleural)',
      grupos: [
        {
          categoria: 'normal',
          label: 'Normal',
          achados: [
            { id: 'ef_pd1', label: 'Deslizamento pleural presente ("sinal da praia" / "seashore sign" ao modo M)' },
            { id: 'ef_pd2', label: 'Padrão de linhas A preservado' },
            { id: 'ef_pd3', label: 'Sem sinais ecográficos de pneumotórax' },
            { id: 'ef_pd4', label: 'Sem líquido pleural' },
          ],
        },
        {
          categoria: 'alterado',
          label: 'Alterado',
          achados: [
            { id: 'ef_pd5', label: 'Ausência de deslizamento pleural com "sinal do código de barras" ("stratosphere sign") ao modo M, sugestivo de pneumotórax' },
            { id: 'ef_pd6', label: 'Ausência de deslizamento pleural com identificação de "ponto pulmonar" ("lung point"), altamente sugestivo de pneumotórax' },
            { id: 'ef_pd7', label: 'Presença de 3 a 5 linhas B focais' },
            { id: 'ef_pd8', label: 'Mais de 5 linhas B focais (padrão intersticial focal)' },
            { id: 'ef_pd9', label: 'Linhas B confluentes formando "pulmão branco" ("white lung")' },
            { id: 'ef_pd10', label: 'Pequena quantidade de líquido pleural' },
            { id: 'ef_pd11', label: 'Moderada quantidade de líquido pleural com "sinal da barbatana de tubarão"' },
            { id: 'ef_pd12', label: 'Volumoso líquido pleural' },
            { id: 'ef_pd13', label: 'Líquido pleural com debris/septações, sugestivo de conteúdo hemático ou complicado' },
          ],
        },
      ],
    },
    {
      id: 'pleural_esquerdo',
      nome: 'Hemitórax Esquerdo (pleural)',
      grupos: [
        {
          categoria: 'normal',
          label: 'Normal',
          achados: [
            { id: 'ef_pe1', label: 'Deslizamento pleural presente ("sinal da praia" / "seashore sign" ao modo M)' },
            { id: 'ef_pe2', label: 'Padrão de linhas A preservado' },
            { id: 'ef_pe3', label: 'Sem sinais ecográficos de pneumotórax' },
            { id: 'ef_pe4', label: 'Sem líquido pleural' },
          ],
        },
        {
          categoria: 'alterado',
          label: 'Alterado',
          achados: [
            { id: 'ef_pe5', label: 'Ausência de deslizamento pleural com "sinal do código de barras" ("stratosphere sign") ao modo M, sugestivo de pneumotórax' },
            { id: 'ef_pe6', label: 'Ausência de deslizamento pleural com identificação de "ponto pulmonar" ("lung point"), altamente sugestivo de pneumotórax' },
            { id: 'ef_pe7', label: 'Presença de 3 a 5 linhas B focais' },
            { id: 'ef_pe8', label: 'Mais de 5 linhas B focais (padrão intersticial focal)' },
            { id: 'ef_pe9', label: 'Linhas B confluentes formando "pulmão branco" ("white lung")' },
            { id: 'ef_pe10', label: 'Pequena quantidade de líquido pleural' },
            { id: 'ef_pe11', label: 'Moderada quantidade de líquido pleural com "sinal da barbatana de tubarão"' },
            { id: 'ef_pe12', label: 'Volumoso líquido pleural' },
            { id: 'ef_pe13', label: 'Líquido pleural com debris/septações, sugestivo de conteúdo hemático ou complicado' },
          ],
        },
      ],
    },
  ],
  limitacoesTecnicas: LIMITACOES_GLOBAIS,
};
