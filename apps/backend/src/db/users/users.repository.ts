import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE_PROVIDER } from '../db.constants';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../schema';
import { eq, and } from 'drizzle-orm';

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
}
