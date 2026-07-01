import { pgTable, uuid, varchar, boolean, timestamp, index, pgEnum, jsonb } from 'drizzle-orm/pg-core';

export const relationshipStatusEnum = pgEnum('relationship_status', [
  'single',
  'dating',
  'engaged',
  'married'
]);

export const users = pgTable('Users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).unique(),
  name: varchar('name', { length: 255 }),
  phone: varchar('phone', { length: 50 }).unique(),
  country: varchar('country', { length: 255 }),
  googleId: varchar('googleId', { length: 255 }).unique(),
  appleId: varchar('appleId', { length: 255 }).unique(),
  facebookId: varchar('facebookId', { length: 255 }).unique(),
  avatar: varchar('avatar', { length: 500 }),
  dateOfBirth: varchar('dateOfBirth', { length: 50 }),
  gender: varchar('gender', { length: 50 }),
  relationshipStatus: relationshipStatusEnum('relationshipStatus'),
  partnerId: varchar('partnerId', { length: 255 }),
  partnerName: varchar('partnerName', { length: 255 }),
  anniversaryDate: varchar('anniversaryDate', { length: 50 }),
  partnerDob: varchar('partnerDob', { length: 50 }),
  partnerEmail: varchar('partnerEmail', { length: 255 }),
  partnerCode: varchar('partnerCode', { length: 100 }),
  profileCompleter: boolean('profileCompleter').default(false).notNull(),
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

export interface McqResponse {
  questionId: string;
  answer: string;
}

export const mcqAnswers = pgTable('McqAnswers', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  responses: jsonb('responses').notNull().$type<McqResponse[]>(),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow().$onUpdate(() => new Date()).notNull(),
}, (table) => {
  return {
    userIdIdx: index('McqAnswers_userId_idx').on(table.userId),
  };
});
