import { NumbersRow } from '../types/numbers';
import db from '../lib/db';

export async function getNumbers(): Promise<NumbersRow[]> {
  const { rows } = await db.query<NumbersRow>(
    `SELECT
       a.id   AS id1,
       a.value AS value1,
       b.id   AS id2,
       b.value AS value2,
       (a.value + b.value) AS sum
     FROM numbers a
     JOIN numbers b
       ON b.id = a.id + 1
    ORDER BY a.id`
  );
  return rows;
}

export async function createNumber(value: number): Promise<{ id: number; value: number }> {
  const { rows } = await db.query<{ id: number; value: number }>(
    'INSERT INTO numbers (value) VALUES ($1) RETURNING *',
    [value]
  );
  return rows[0];
}