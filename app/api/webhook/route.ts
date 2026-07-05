// Add this package: npm install @upstash/qstash
import { Client } from "@upstash/qstash";

const qstash = new Client({ token: process.env.QSTASH_TOKEN! });

// Inside your media handler:
await qstash.publishJSON({
  url: `https://${process.env.VERCEL_URL}/api/delete-message`,
  body: { chatId, messageId },
  delay: 30, // 30 seconds delay
});