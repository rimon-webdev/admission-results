import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { parse } from 'papaparse';

interface Student {
  Roll: string;
  Choice1?: string;
  Result1?: string;
  Choice2?: string;
  Result2?: string;
  Choice3?: string;
  Result3?: string;
  Choice4?: string;
  Result4?: string;
  [key: string]: string | undefined;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const roll = searchParams.get('roll');

  if (!roll) {
    return NextResponse.json({ error: 'Roll number is required' }, { status: 400 });
  }

  try {
    const csvFilePath = path.join(process.cwd(), 'public', 'admission_results.csv');
    const csvFile = fs.readFileSync(csvFilePath, 'utf8');
    const parsed = parse(csvFile, { header: true, skipEmptyLines: true });
    const result = (parsed.data as Student[]).find(student => student.Roll === roll);

    if (!result) {
      return NextResponse.json({ error: 'No result found' }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (_err) { // err unused, ignore with underscore
    return NextResponse.json({ error: 'Failed to read CSV file' }, { status: 500 });
  }
}
