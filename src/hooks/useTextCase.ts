import { useState, useEffect, useCallback } from 'react';
import { usePreferences } from './usePreferences';
import type { TextCaseMode } from '@/utils/textCase';

const PREF_KEY = 'text_case';

export function useTextCase() {
  const { get, set } = usePreferences();
  const [mode, setMode] = useState<TextCaseMode>('normal');

  useEffect(() => {
    get(PREF_KEY).then((val) => {
      if (val === 'upper' || val === 'normal') setMode(val);
    });
  }, [get]);

  const toggle = useCallback(async () => {
    const next: TextCaseMode = mode === 'normal' ? 'upper' : 'normal';
    await set(PREF_KEY, next);
    setMode(next);
  }, [mode, set]);

  return { mode, toggle };
}
