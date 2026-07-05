import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const { message } = body;
  if (!message) return NextResponse.json({ ok: true });

  const BOT_TOKEN = process.env.BOT_TOKEN;
  const BOT_VERSION = "1.0.1";
  const chatId = message.chat.id;

  // Handle /status
  if (message.text?.startsWith('/status')) {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: `✅ บอททำงานปกติ!\n📦 Version: ${BOT_VERSION}`,
      })
    });
    return NextResponse.json({ ok: true });
  }

  // Handle Media
  if (message.photo || message.video || message.animation) {
    const messageId = message.message_id;
    
    // Send warning
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: `ห้ามส่งสื่อในกลุ่มนี้! จะถูกลบในอีก 30 วินาที`,
        reply_to_message_id: messageId
      })
    });

    // TRIGGER DELETION (Use QStash as explained before)
    // If you don't have QStash yet, you MUST get it to make this work on Vercel.
    // For now, this is where your "trigger" logic goes.
  }

  return NextResponse.json({ ok: true });
}