import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE_PROVIDER } from '../db.constants';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../schema';
import { eq, and, or, desc } from 'drizzle-orm';

@Injectable()
export class UsersRepository {
  constructor(
    @Inject(DRIZZLE_PROVIDER)
    private readonly db: NodePgDatabase<typeof schema>
  ) {}

  async findById(id: string) {
    const results = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, id))
      .limit(1);
    return results[0] || null;
  }

  async findByEmail(email: string) {
    const results = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1);
    return results[0] || null;
  }

  async findByPhone(phone: string, country: string) {
    const results = await this.db
      .select()
      .from(schema.users)
      .where(
        and(
          eq(schema.users.phone, phone),
          eq(schema.users.country, country)
        )
      )
      .limit(1);
    return results[0] || null;
  }

  async findByOAuthProviderId(provider: 'google' | 'apple' | 'facebook', providerId: string) {
    let whereClause;
    if (provider === 'google') {
      whereClause = eq(schema.users.googleId, providerId);
    } else if (provider === 'apple') {
      whereClause = eq(schema.users.appleId, providerId);
    } else if (provider === 'facebook') {
      whereClause = eq(schema.users.facebookId, providerId);
    } else {
      return null;
    }
    const results = await this.db
      .select()
      .from(schema.users)
      .where(whereClause)
      .limit(1);
    return results[0] || null;
  }

  async findByAppCode(appCode: string) {
    const results = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.appCode, appCode))
      .limit(1);
    return results[0] || null;
  }

  async create(user: typeof schema.users.$inferInsert) {
    const results = await this.db
      .insert(schema.users)
      .values(user)
      .returning();
    return results[0];
  }

  async update(id: string, user: Partial<typeof schema.users.$inferInsert>) {
    const results = await this.db
      .update(schema.users)
      .set(user)
      .where(eq(schema.users.id, id))
      .returning();
    return results[0];
  }

  async createLog(logData: typeof schema.userLogs.$inferInsert) {
    const results = await this.db
      .insert(schema.userLogs)
      .values(logData)
      .returning();
    return results[0];
  }

  async findLogsByUserId(userId: string, limit: number, offset: number) {
    return this.db
      .select()
      .from(schema.userLogs)
      .where(eq(schema.userLogs.userId, userId))
      .orderBy(desc(schema.userLogs.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async findActivePartnership(userId: string) {
    const results = await this.db
      .select()
      .from(schema.partners)
      .where(
        and(
          or(
            eq(schema.partners.userId, userId),
            eq(schema.partners.partnerId, userId)
          ),
          eq(schema.partners.status, 'active')
        )
      )
      .limit(1);
    return results[0] || null;
  }

  async linkPartner(userId: string, partnerId: string) {
    // Delete any existing partnerships for both users
    await this.db
      .delete(schema.partners)
      .where(
        or(
          eq(schema.partners.userId, userId),
          eq(schema.partners.partnerId, userId),
          eq(schema.partners.userId, partnerId),
          eq(schema.partners.partnerId, partnerId)
        )
      );

    // Insert new active partnership
    const results = await this.db
      .insert(schema.partners)
      .values({
        userId,
        partnerId,
        status: 'active'
      })
      .returning();
    return results[0];
  }

  async unsyncPartner(userId: string) {
    return this.db
      .delete(schema.partners)
      .where(
        or(
          eq(schema.partners.userId, userId),
          eq(schema.partners.partnerId, userId)
        )
      );
  }
}
