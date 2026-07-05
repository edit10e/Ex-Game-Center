import { NextResponse } from 'next/server';
import { Client } from "@upstash/qstash";

const qstash = new Client({ token: process.env.QSTASH_TOKEN! });

export async function POST(req: Request) {
  const body = await req.json();
  const { message } = body;
  
  if (!message) return NextResponse.json({ ok: true });

  const BOT_TOKEN = process.env.BOT_TOKEN;
  const BOT_VERSION = "1.0.2";
  const chatId = message.chat.id;
  const messageId = message.message_id;

  // 1. Handle /status command
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

  // 2. Handle Media (Photo, Video, GIF)
  const hasMedia = message.photo || message.video || message.animation;
  if (hasMedia) {
    const userName = message.from.first_name || "User";

    // Acknowledge the media
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: `[${userName}](tg://user?id=${message.from.id}) ห้ามส่งสื่อในกลุ่มนี้! จะถูกลบในอีก 30 วินาที`,
        parse_mode: 'Markdown',
        reply_to_message_id: messageId
      })
    });

    // Schedule deletion via QStash
    await qstash.publishJSON({
      url: `https://${process.env.VERCEL_URL}/api/delete-message`,
      body: { chatId, messageId },
      delay: 30, // 30 seconds
    });
  }

  return NextResponse.json({ ok: true });
}