import { Module, OnModuleDestroy, OnModuleInit, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { join } from 'path';
import * as schema from './schema';
import { CountriesRepository } from './countries/countries.repository';
import { CountriesDbService } from './countries/countries.service';
import { DRIZZLE_PROVIDER } from './db.constants';

@Module({
  providers: [
    {
      provide: 'PG_POOL',
      useFactory: () => {
        return new Pool({
          connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:5432/postgres',
        });
      },
    },
    {
      provide: DRIZZLE_PROVIDER,
      useFactory: (pool: Pool) => {
        return drizzle(pool, { schema });
      },
      inject: ['PG_POOL'],
    },
    CountriesRepository,
    CountriesDbService,
  ],
  exports: [DRIZZLE_PROVIDER, CountriesRepository, CountriesDbService],
})
export class DBModule implements OnModuleDestroy, OnModuleInit {
  constructor(
    @Inject('PG_POOL') private readonly pool: Pool,
    @Inject(DRIZZLE_PROVIDER) private readonly db: NodePgDatabase<typeof schema>
  ) {}

  async onModuleInit() {
    try {
      console.log('Running database migrations...');
      const migrationsFolder = join(__dirname, 'drizzle');
      console.log('Resolved migrationsFolder:', migrationsFolder);

      await migrate(this.db, {
        migrationsFolder,
      });
      console.log('Migrations completed successfully!');
    } catch (error) {
      console.error('Failed to apply database migrations:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}

