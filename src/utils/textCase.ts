export type TextCaseMode = 'normal' | 'upper';

export function applyTextCase(text: string, mode: TextCaseMode): string {
  return mode === 'upper' ? text.toUpperCase() : text;
}
