CREATE TABLE IF NOT EXISTS numbers (
  id SERIAL PRIMARY KEY,
  value INTEGER NOT NULL
);

CREATE TYPE class_enum AS ENUM ('Math', 'Science', 'History');

CREATE TABLE IF NOT EXISTS grades (
  id SERIAL PRIMARY KEY,
  class class_enum NOT NULL,
  grade INTEGER NOT NULL CHECK (grade BETWEEN 0 AND 100)
);
