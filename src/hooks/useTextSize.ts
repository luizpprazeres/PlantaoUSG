import { useState, useEffect, useCallback } from 'react';
import { usePreferences } from './usePreferences';

export type TextSizeMode = 'sm' | 'md' | 'lg';

const PREF_KEY = 'text_size';

const SIZE_MAP: Record<TextSizeMode, number> = {
  sm: 11,
  md: 13,
  lg: 15,
};

export function useTextSize() {
  const { get, set } = usePreferences();
  const [mode, setMode] = useState<TextSizeMode>('md');

  useEffect(() => {
    get(PREF_KEY).then((val) => {
      if (val === 'sm' || val === 'md' || val === 'lg') setMode(val as TextSizeMode);
    });
  }, [get]);

  const cycle = useCallback(async () => {
    const next: TextSizeMode = mode === 'sm' ? 'md' : mode === 'md' ? 'lg' : 'sm';
    await set(PREF_KEY, next);
    setMode(next);
  }, [mode, set]);

  const fontSize = SIZE_MAP[mode];

  return { mode, fontSize, cycle };
}
