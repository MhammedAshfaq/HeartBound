import { pgTable, uuid, varchar, boolean, timestamp, index } from 'drizzle-orm/pg-core';

export const users = pgTable('Users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).unique(),
  name: varchar('name', { length: 255 }),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow().$onUpdate(() => new Date()).notNull(),
});

export const countries = pgTable('Countries', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  isoCode: varchar('isoCode', { length: 50 }).unique().notNull(),
  dialCode: varchar('dialCode', { length: 50 }).notNull(),
  flagUrl: varchar('flagUrl', { length: 255 }).notNull(),
  currency: varchar('currency', { length: 50 }),
  isActive: boolean('isActive').default(true).notNull(),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow().$onUpdate(() => new Date()).notNull(),
}, (table) => {
  return {
    nameIdx: index('Countries_name_idx').on(table.name),
    isoCodeIdx: index('Countries_isoCode_idx').on(table.isoCode),
  };
});
