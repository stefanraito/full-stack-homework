import { NextRequest, NextResponse } from 'next/server';
import { getNumbers, createNumber } from '../../../services/numbers';

export async function GET() {
  try {
    const rows = await getNumbers();
    return NextResponse.json(rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { value } = await req.json();
    if (typeof value !== 'number') {
      return NextResponse.json(
        { error: 'Value must be a number' },
        { status: 400 }
      );
    }
    const newNumber = await createNumber(value);
    return NextResponse.json(newNumber, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}