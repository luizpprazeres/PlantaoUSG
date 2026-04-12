import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const laudos = sqliteTable('laudos', {
  id: text('id').primaryKey(),
  protocolo: text('protocolo').notNull(),
  timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(),
  inputRawJson: text('input_raw_json').notNull(),
  outputExtenso: text('output_extenso').notNull(),
  outputObjetivo: text('output_objetivo').notNull(),
});

export const preferences = sqliteTable('preferences', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
});

export type Laudo = typeof laudos.$inferSelect;
export type NewLaudo = typeof laudos.$inferInsert;
