import { pgTable, uuid, varchar, boolean, timestamp, index, pgEnum, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { RelationshipStatus } from './enums';

export const relationshipStatusEnum = pgEnum('relationship_status', [
  RelationshipStatus.Single,
  RelationshipStatus.Dating,
  RelationshipStatus.Engaged,
  RelationshipStatus.Married
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
  partnerName: varchar('partnerName', { length: 255 }),
  anniversaryDate: varchar('anniversaryDate', { length: 50 }),
  partnerDob: varchar('partnerDob', { length: 50 }),
  appCode: varchar('appCode', { length: 10 }),
  theme: varchar('theme', { length: 50 }).default('system').notNull(),
  isNotificationsEnabled: boolean('isNotificationsEnabled').default(false).notNull(),
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

export const feelings = pgTable('Feelings', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  emoji: varchar('emoji', { length: 50 }).notNull(),
  note: varchar('note', { length: 1000 }),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow().$onUpdate(() => new Date()).notNull(),
}, (table) => {
  return {
    userIdIdx: index('Feelings_userId_idx').on(table.userId),
    createdAtIdx: index('Feelings_createdAt_idx').on(table.createdAt),
  };
});

export const partners = pgTable('Partners', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  partnerId: uuid('partnerId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  status: varchar('status', { length: 50 }).default('pending').notNull(),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow().$onUpdate(() => new Date()).notNull(),
}, (table) => {
  return {
    userIdIdx: index('Partners_userId_idx').on(table.userId),
    partnerIdIdx: index('Partners_partnerId_idx').on(table.partnerId),
  };
});

export const userLogs = pgTable('UserLogs', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  action: varchar('action', { length: 255 }).notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
}, (table) => {
  return {
    userIdIdx: index('UserLogs_userId_idx').on(table.userId),
  };
});

export const usersRelations = relations(users, ({ many }) => ({
  initiatedPartnerships: many(partners, { relationName: 'initiatedPartnerships' }),
  receivedPartnerships: many(partners, { relationName: 'receivedPartnerships' }),
}));

export const partnersRelations = relations(partners, ({ one }) => ({
  user: one(users, {
    fields: [partners.userId],
    references: [users.id],
    relationName: 'initiatedPartnerships'
  }),
  partner: one(users, {
    fields: [partners.partnerId],
    references: [users.id],
    relationName: 'receivedPartnerships'
  }),
}));
