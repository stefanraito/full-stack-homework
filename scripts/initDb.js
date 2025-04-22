import pkg from 'pg';

const { Client } = pkg

async function initDB() {
  const client = new Client({
    host: process.env.PGHOST || 'localhost',
    port: +process.env.PGPORT || 5432,
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || 'postgres',
    database: process.env.PGDATABASE || 'postgres',
  });
  await client.connect();

  await client.query(`
    CREATE TABLE IF NOT EXISTS numbers (
      id SERIAL PRIMARY KEY,
      value INTEGER NOT NULL
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS grades (
      id SERIAL PRIMARY KEY,
      class VARCHAR(50) NOT NULL,
      grade INTEGER NOT NULL
    );
  `);

  const numbers = [7, 13, 21, 34, 55, 89, 144, 233, 377, 610];
  for (const value of numbers) {
    await client.query('INSERT INTO numbers(value) VALUES($1)', [value]);
  }

  const gradeSeeds = [
    { class: 'Math',    grade: 92 },
    { class: 'Math',    grade: 76 },
    { class: 'Math',    grade: 88 },
    { class: 'Math',    grade: 64 },
    { class: 'Science', grade: 85 },
    { class: 'Science', grade: 90 },
    { class: 'Science', grade: 73 },
    { class: 'Science', grade: 58 },
    { class: 'History', grade: 79 },
    { class: 'History', grade: 82 },
    { class: 'History', grade: 68 },
    { class: 'History', grade: 95 },
  ];
  for (const { class: cls, grade } of gradeSeeds) {
    await client.query(
      'INSERT INTO grades(class, grade) VALUES($1, $2)',
      [cls, grade]
    );
  }

  await client.end();
  console.log('DB init complete!');
}

initDB().catch(err => console.error(err));