import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function POST(req: Request) {
  const body = await req.json();
  const { message } = body;
  
  if (!message) return NextResponse.json({ ok: true });

  const BOT_TOKEN = process.env.BOT_TOKEN;
  const BOT_VERSION = "1.0.2";
  const chatId = message.chat.id;

  // 1. Simple status command
  if (message.text?.startsWith('/status')) {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: `📦 Version: ${BOT_VERSION}`,
      })
    });
    return NextResponse.json({ ok: true });
  }

  // 2. Handle Media for automatic deletion
  if (message.photo || message.video || message.animation) {
    const messageId = message.message_id;
    // Store in KV with a 60-second expiration for the cleanup task to find
    await kv.set(`delete:${Date.now()}:${chatId}:${messageId}`, { chatId, messageId }, { ex: 60 });
  }

  return NextResponse.json({ ok: true });
}