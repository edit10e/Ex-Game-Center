import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const { message } = body;

  if (!message) return NextResponse.json({ ok: true });

  // Check if message has photo, video, or animation (GIF)
  const hasMedia = message.photo || message.video || message.animation;

  if (hasMedia) {
    const chatId = message.chat.id;
    const messageId = message.message_id;
    const userId = message.from.id;
    const userName = message.from.first_name;

    // 1. Tag the user (Reply to their message)
    await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: `[${userName}](tg://user?id=${userId}) ห้ามส่งสื่อในกลุ่มนี้!`,
        parse_mode: 'Markdown',
        reply_to_message_id: messageId
      })
    });

    // 2. Delete the user's media message after 30 seconds
    setTimeout(async () => {
      await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/deleteMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          message_id: messageId
        })
      });
    }, 30000); // 30,000 milliseconds = 30 seconds
  }

  return NextResponse.json({ ok: true });
}