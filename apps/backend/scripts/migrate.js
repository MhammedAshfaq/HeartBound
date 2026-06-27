const { Pool } = require('pg');
const { drizzle } = require('drizzle-orm/node-postgres');
const { migrate } = require('drizzle-orm/node-postgres/migrator');
const path = require('path');

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:5432/postgres';

async function main() {
  console.log('Running Drizzle migrations via standalone script...');
  const pool = new Pool({
    connectionString,
  });
  const db = drizzle(pool);

  await migrate(db, {
    migrationsFolder: path.join(__dirname, '../src/db/drizzle'),
  });

  console.log('Migrations applied successfully!');
  await pool.end();
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
