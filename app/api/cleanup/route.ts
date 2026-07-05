import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET() {
  const BOT_TOKEN = process.env.BOT_TOKEN;
  
  // 1. Get all keys starting with 'delete:'
  const keys = await kv.keys('delete:*');

  for (const key of keys) {
    const data: any = await kv.get(key);
    if (data) {
      // 2. Delete from Telegram
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/deleteMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: data.chatId, message_id: data.messageId })
      });
      // 3. Remove from KV
      await kv.del(key);
    }
  }
  return NextResponse.json({ ok: true });
}