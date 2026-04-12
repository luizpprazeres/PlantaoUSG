import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from './schema';

// SQLite só funciona em nativo (iOS/Android) — web usa stub
const isNative = Platform.OS !== 'web';

const expo = isNative
  ? SQLite.openDatabaseSync('plantao-usg.db', { enableChangeListener: true })
  : null;

export const db = isNative ? drizzle(expo!, { schema }) : (null as any);

export async function runMigrations() {
  if (!isNative) return;
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
