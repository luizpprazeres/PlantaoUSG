import { useState, useEffect, useCallback } from 'react';
import { usePreferences } from './usePreferences';

export interface MedicoInfo {
  nome: string;
  crm: string;
  crmEstado: string;
  especialidade: string;
}

const DEFAULTS: MedicoInfo = {
  nome: '',
  crm: '',
  crmEstado: 'SP',
  especialidade: 'Medicina de Emergência',
};

export function useMedico() {
  const { get, set } = usePreferences();
  const [medico, setMedico] = useState<MedicoInfo>(DEFAULTS);

  useEffect(() => {
    Promise.all([
      get('medico_nome'),
      get('medico_crm'),
      get('medico_crm_estado'),
      get('medico_especialidade'),
    ]).then(([nome, crm, crmEstado, especialidade]) => {
      setMedico({
        nome: nome ?? DEFAULTS.nome,
        crm: crm ?? DEFAULTS.crm,
        crmEstado: crmEstado ?? DEFAULTS.crmEstado,
        especialidade: especialidade ?? DEFAULTS.especialidade,
      });
    });
  }, [get]);

  const atualizar = useCallback(
    async (campo: keyof MedicoInfo, valor: string) => {
      const chaves: Record<keyof MedicoInfo, string> = {
        nome: 'medico_nome',
        crm: 'medico_crm',
        crmEstado: 'medico_crm_estado',
        especialidade: 'medico_especialidade',
      };
      await set(chaves[campo], valor);
      setMedico((prev) => ({ ...prev, [campo]: valor }));
    },
    [set]
  );

  return { medico, atualizar };
}
