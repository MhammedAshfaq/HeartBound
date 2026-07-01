import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE_PROVIDER } from '../db.constants';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class McqAnswersRepository {
  constructor(
    @Inject(DRIZZLE_PROVIDER)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  /**
   * Returns all MCQ answer records for a given user, ordered newest first.
   */
  async findAllByUserId(userId: string) {
    return this.db
      .select()
      .from(schema.mcqAnswers)
      .where(eq(schema.mcqAnswers.userId, userId))
      .orderBy(schema.mcqAnswers.createdAt);
  }

  /**
   * Inserts a new MCQ answer record and returns the created row.
   */
  async create(data: typeof schema.mcqAnswers.$inferInsert) {
    const results = await this.db
      .insert(schema.mcqAnswers)
      .values(data)
      .returning();
    return results[0];
  }
}
