// components/TelegramGuard.tsx
"use client";
import { useEffect, useState } from 'react';

export default function TelegramGuard({ children }: { children: React.ReactNode }) {
  const [isTelegram, setIsTelegram] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if the Telegram WebApp script has initialized
    const tg = typeof window !== 'undefined' ? (window as any).Telegram?.WebApp : null;
    
    // In production, we check if initData is present or if the platform is known
    if (tg && tg.initData) {
      setIsTelegram(true);
      tg.ready(); // Signal Telegram that the app is ready
    } else {
      setIsTelegram(false);
    }
  }, []);

  if (isTelegram === null) return <div className="h-full flex items-center justify-center">Loading...</div>;
  if (!isTelegram) return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center text-white">
      <h2 className="text-2xl font-bold mb-4">Access Denied 🚫</h2>
      <p>This game can only be played inside the Telegram App.</p>
      <p className="mt-2 text-gray-400">Please open the official bot to launch.</p>
    </div>
  );

  return <>{children}</>;
}