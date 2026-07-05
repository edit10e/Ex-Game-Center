import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  let cursor: string | number = "0";
  
  // Declare 'res' with a explicit type or just let TS infer it outside the loop
  // The Upstash 'scan' method returns a tuple: [string, string[]]
  let res: [string, string[]];

  do {
    res = await redis.scan(cursor, { match: 'delete:*', count: 100 });
    cursor = res[0];
    const keys = res[1];

    for (const key of keys) {
      const data: any = await redis.get(key);
      if (data) {
        await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/deleteMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: data.chatId, message_id: data.messageId })
        });
        await redis.del(key);
      }
    }
  } while (cursor !== "0");

  return NextResponse.json({ ok: true });
}