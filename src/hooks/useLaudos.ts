import { useCallback } from 'react';
import { Platform } from 'react-native';
import { eq, desc } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { db } from '@/db';
import { laudos, type NewLaudo } from '@/db/schema';
import * as Crypto from 'expo-crypto';

const isNative = Platform.OS !== 'web';

// Stub query para web (useLiveQuery requer db válido)
const stubQuery = { data: [] as any[], error: null };

export function useLaudos() {
  const liveResult = isNative
    ? useLiveQuery(db.select().from(laudos).orderBy(desc(laudos.timestamp)))
    : stubQuery;

  const salvarLaudo = useCallback(
    async (laudo: Omit<NewLaudo, 'id' | 'timestamp'>) => {
      if (!isNative) return 'web-stub-id';
      const newLaudo: NewLaudo = {
        ...laudo,
        id: Crypto.randomUUID(),
        timestamp: new Date(),
      };
      await db.insert(laudos).values(newLaudo);
      return newLaudo.id;
    },
    []
  );

  const deletarLaudo = useCallback(async (id: string) => {
    if (!isNative) return;
    await db.delete(laudos).where(eq(laudos.id, id));
  }, []);

  return { laudos: liveResult.data ?? [], salvarLaudo, deletarLaudo };
}
