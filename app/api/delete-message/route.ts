import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { chatId, messageId } = await req.json();
    const BOT_TOKEN = process.env.BOT_TOKEN;

    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/deleteMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId
      })
    });

    const data = await response.json();
    if (!data.ok) {
      console.error("Telegram API Error:", data.description);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Deletion failed:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}