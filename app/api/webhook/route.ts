import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const { message } = body;

  if (!message) return NextResponse.json({ ok: true });

  const chatId = message.chat.id;
  const BOT_TOKEN = process.env.BOT_TOKEN;

  // 1. Handle "/status" command
  if (message.text?.startsWith('/status')) {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: "✅ บอททำงานปกติ!",
      })
    });
    return NextResponse.json({ ok: true });
  }

  // 2. Handle Media (Photo, Video, GIF)
  const hasMedia = message.photo || message.video || message.animation;

  if (hasMedia) {
    const messageId = message.message_id;
    const userId = message.from.id;
    const userName = message.from.first_name || "User";

    // Reply to the user
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: `[${userName}](tg://user?id=${userId}) จะถูกลบในอีก 30 วินาที`,
        parse_mode: 'Markdown',
        reply_to_message_id: messageId
      })
    });

    // Attempt deletion (Note: This is best-effort in serverless)
    setTimeout(async () => {
      try {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/deleteMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            message_id: messageId
          })
        });
      } catch (err) {
        console.error("Failed to delete message:", err);
      }
    }, 30000); 
  }

  return NextResponse.json({ ok: true });
}