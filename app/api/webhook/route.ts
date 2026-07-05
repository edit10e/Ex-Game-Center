import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("DEBUG: Received payload:", JSON.stringify(body));

    const { message } = body;
    if (!message) return NextResponse.json({ ok: true });

    const BOT_TOKEN = process.env.BOT_TOKEN;
    const chatId = message.chat.id;

    // Handle /status
    if (message.text?.startsWith('/status')) {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: "✅ บอททำงานปกติ!" })
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DEBUG: Error:", error);
    return NextResponse.json({ ok: true });
  }
}