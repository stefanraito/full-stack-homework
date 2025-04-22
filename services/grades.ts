import db from '../lib/db';
import { Filter, GradeEntry, ClassAverage } from '../types/grade';

const QUERY_MAP: Record<Filter, string> = {
  all: `
    SELECT id, class, grade
      FROM grades
     ORDER BY id
  `,
  averages: `
    SELECT class, ROUND(AVG(grade)::numeric,2) AS average
      FROM grades
  GROUP BY class
     ORDER BY class
  `,
  passing: `
    SELECT class, ROUND(AVG(grade)::numeric,2) AS average
      FROM grades
     WHERE grade > 55
  GROUP BY class
     ORDER BY class
  `,
  high: `
    SELECT class, ROUND(AVG(grade)::numeric,2) AS average
      FROM grades
  GROUP BY class
    HAVING AVG(grade) >= 70
     ORDER BY class
  `,
};

export async function getGrades(filter: Filter): Promise<GradeEntry[]|ClassAverage[]> {
  const query = QUERY_MAP[filter];
  const { rows } = await db.query<GradeEntry|ClassAverage>(query);
  return rows as ClassAverage[];
}

export async function createGrade(input: { class: GradeEntry['class']; grade: number })
  : Promise<GradeEntry> {
  const { rows } = await db.query<GradeEntry>(
    `INSERT INTO grades (class, grade) VALUES ($1, $2) RETURNING *`,
    [input.class, input.grade]
  );
  return rows[0];
}