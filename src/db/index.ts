import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from './schema';

const expo = SQLite.openDatabaseSync('plantao-usg.db', {
  enableChangeListener: true,
});

export const db = drizzle(expo, { schema });

export async function runMigrations() {
  await db.run(`
    CREATE TABLE IF NOT EXISTS laudos (
      id TEXT PRIMARY KEY,
      protocolo TEXT NOT NULL,
      timestamp INTEGER NOT NULL,
      input_raw_json TEXT NOT NULL,
      output_extenso TEXT NOT NULL,
      output_objetivo TEXT NOT NULL
    )
  `);
  await db.run(`
    CREATE TABLE IF NOT EXISTS preferences (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);
}
