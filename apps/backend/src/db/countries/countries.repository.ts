import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE_PROVIDER } from '../db.constants';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../schema';
import { asc, eq } from 'drizzle-orm';

@Injectable()
export class CountriesRepository {
  constructor(
    @Inject(DRIZZLE_PROVIDER)
    private readonly db: NodePgDatabase<typeof schema>
  ) {}

  async findAll() {
    return this.db
      .select()
      .from(schema.countries)
      .where(eq(schema.countries.isActive, true))
      .orderBy(asc(schema.countries.name));
  }
}
