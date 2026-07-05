import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const { message } = body;

  if (!message) return NextResponse.json({ ok: true });

  const chatId = message.chat.id;
  const BOT_TOKEN = process.env.BOT_TOKEN;

  // 1. Handle "/status" command
  if (message.text === '/status' || message.text === '/status@YourBotUsername') {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: "✅ บอททำงานปกติและพร้อมใช้งาน!",
      })
    });
    return NextResponse.json({ ok: true });
  }

  // 2. Handle Media Deletion (Photo, Video, GIF)
  const hasMedia = message.photo || message.video || message.animation;

  if (hasMedia) {
    const messageId = message.message_id;
    const userId = message.from.id;
    const userName = message.from.first_name;

    // Tag the user
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: `[${userName}](tg://user?id=${userId}) ห้ามส่งสื่อในกลุ่มนี้!`,
        parse_mode: 'Markdown',
        reply_to_message_id: messageId
      })
    });

    // Schedule deletion
    setTimeout(async () => {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/deleteMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          message_id: messageId
        })
      });
    }, 30000); // 30 seconds
  }

  return NextResponse.json({ ok: true });
}