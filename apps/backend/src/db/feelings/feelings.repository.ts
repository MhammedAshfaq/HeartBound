import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE_PROVIDER } from '../db.constants';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../schema';
import { and, eq, gte, lt } from 'drizzle-orm';

@Injectable()
export class FeelingsRepository {
  constructor(
    @Inject(DRIZZLE_PROVIDER)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async findTodayByUserId(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const results = await this.db
      .select()
      .from(schema.feelings)
      .where(
        and(
          eq(schema.feelings.userId, userId),
          gte(schema.feelings.createdAt, today),
          lt(schema.feelings.createdAt, tomorrow),
        ),
      );
      
    return results.length > 0 ? results[0] : null;
  }

  async create(data: typeof schema.feelings.$inferInsert) {
    const results = await this.db
      .insert(schema.feelings)
      .values(data)
      .returning();
    return results[0];
  }
}
