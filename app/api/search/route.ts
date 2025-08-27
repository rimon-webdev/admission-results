import { NextRequest, NextResponse } from 'next/server';

// Import your JSON data (you'll need to place your data in a file)


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const roll = searchParams.get('roll');

  if (!roll) {
    return NextResponse.json({ error: 'Roll number is required' }, { status: 400 });
  }

  // Find the student with the matching roll number
  const result = data.find((student: any) => student.id === roll);

  if (!result) {
    return NextResponse.json({ error: 'No result found' }, { status: 404 });
  }

  return NextResponse.json(result);
}