/**
 * Adapter de key-value sobre expo-sqlite para uso com zustand/persist.
 * Implementa a interface StateStorage do zustand middleware.
 */
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('app_kv.db');

db.execSync(
  'CREATE TABLE IF NOT EXISTS kv (key TEXT PRIMARY KEY, value TEXT NOT NULL)'
);

export const sqliteStorage = {
  getItem: (key: string): string | null => {
    const row = db.getFirstSync<{ value: string }>(
      'SELECT value FROM kv WHERE key = ?',
      [key]
    );
    return row?.value ?? null;
  },

  setItem: (key: string, value: string): void => {
    db.runSync(
      'INSERT OR REPLACE INTO kv (key, value) VALUES (?, ?)',
      [key, value]
    );
  },

  removeItem: (key: string): void => {
    db.runSync('DELETE FROM kv WHERE key = ?', [key]);
  },
};
