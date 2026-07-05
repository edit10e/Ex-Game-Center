// app/api/cleanup/route.ts
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  // Simple security check
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // Your cleanup logic here...
  return NextResponse.json({ ok: true });
}