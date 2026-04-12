import { useCallback } from 'react';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { preferences } from '@/db/schema';

export function usePreferences() {
  const get = useCallback(async (key: string): Promise<string | null> => {
    const result = await db
      .select()
      .from(preferences)
      .where(eq(preferences.key, key))
      .limit(1);
    return result[0]?.value ?? null;
  }, []);

  const set = useCallback(async (key: string, value: string) => {
    await db
      .insert(preferences)
      .values({ key, value })
      .onConflictDoUpdate({ target: preferences.key, set: { value } });
  }, []);

  const increment = useCallback(
    async (key: string): Promise<number> => {
      const current = await get(key);
      const next = (parseInt(current ?? '0', 10) + 1).toString();
      await set(key, next);
      return parseInt(next, 10);
    },
    [get, set]
  );

  return { get, set, increment };
}
