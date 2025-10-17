import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  user: 'root',
  host: 'localhost',
  database: 'gasless_gossip',
  password: 'root',
  port: 5432,
});

(async () => {
  try {
    await client.connect();
    console.log('🟢 Connected to PostgreSQL');

    const dropAllTablesSQL = `
      DO $$ DECLARE
          r RECORD;
      BEGIN
          FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
              EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
          END LOOP;
      END $$;
    `;

    await client.query(dropAllTablesSQL);
    console.log('🔥 All tables dropped successfully!');
  } catch (err) {
    console.error('❌ Error clearing database:', err);
  } finally {
    await client.end();
    console.log('🔴 PostgreSQL connection closed.');
  }
})();
