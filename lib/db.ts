import { Pool, QueryResultRow } from 'pg';

const pool = new Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
});

pool.on('error', (err: Error) => {
  console.error('Unexpected PG error', err);
  process.exit(-1);
});

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  query: <T extends QueryResultRow>(text: string, params?: unknown[]) => pool.query<T>(text, params),
};