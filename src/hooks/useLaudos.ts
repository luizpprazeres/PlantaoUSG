import { useCallback } from 'react';
import { eq, desc } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { db } from '@/db';
import { laudos, type NewLaudo } from '@/db/schema';
import * as Crypto from 'expo-crypto';

export function useLaudos() {
  const { data: allLaudos } = useLiveQuery(
    db.select().from(laudos).orderBy(desc(laudos.timestamp))
  );

  const salvarLaudo = useCallback(
    async (laudo: Omit<NewLaudo, 'id' | 'timestamp'>) => {
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
    await db.delete(laudos).where(eq(laudos.id, id));
  }, []);

  return { laudos: allLaudos ?? [], salvarLaudo, deletarLaudo };
}
