import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import type { Filter } from '../../../types/grade';
import { createGrade, getGrades } from '../../../services/grades';

const filterSchema = z.enum(['all','averages','passing','high']).default('all');
const payloadSchema = z.object({
  class: z.enum(['Math','Science','History']),
  grade: z.number().int().min(0).max(100),
});

export async function GET(req: NextRequest) {
  try {
    const filter = filterSchema.parse(req.nextUrl.searchParams.get('filter'));
    const grades = await getGrades(filter as Filter);
    return NextResponse.json(grades);
  } catch (err) {
    return NextResponse.json({ error: err instanceof z.ZodError ? err.errors : 'Unknown' }, {
      status: err instanceof z.ZodError ? 400 : 500
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = payloadSchema.parse(await req.json());
    const newGrade = await createGrade(payload);
    return NextResponse.json(newGrade, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err instanceof z.ZodError ? err.errors : 'Unknown' }, {
      status: err instanceof z.ZodError ? 400 : 500
    });
  }
}