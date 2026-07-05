"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Add onBackToLobby to props
export default function DiceGame({ photo, onBackToLobby }: { photo: string, onBackToLobby: () => void }) {
  const [status, setStatus] = useState("ทอยเพื่อตัดสินผลแพ้ชนะ!");
  const [isRolling, setIsRolling] = useState(false);
  const [turn, setTurn] = useState<'bot' | 'user' | null>(null);
  const [botRoll, setBotRoll] = useState<number | null>(null);
  const [userRoll, setUserRoll] = useState<number | null>(null);
  const [displayNumber, setDisplayNumber] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);

  // ... (runRollingEffect remains the same)
  const runRollingEffect = async () => {
    for (let i = 0; i < 15; i++) {
      setDisplayNumber(Math.floor(Math.random() * 6) + 1);
      await new Promise(r => setTimeout(r, 80));
    }
  };

  const startBotTurn = async () => {
    setIsRolling(true);
    setTurn('bot');
    setStatus("บอทกำลังทอย...");
    await runRollingEffect();
    const b = Math.floor(Math.random() * 6) + 1;
    setBotRoll(b);
    setDisplayNumber(b);
    setIsRolling(false);
    setStatus("บอทได้แต้ม " + b + "! ตาของคุณแล้ว!");
  };

  const startUserTurn = async () => {
    setIsRolling(true);
    setTurn('user');
    setStatus("กำลังทอย...");
    await runRollingEffect();
    const u = Math.floor(Math.random() * 6) + 1;
    setUserRoll(u);
    setDisplayNumber(u);
    setIsRolling(false);
    
    if (u < (botRoll ?? 0)) {
      setStatus("แพ้แล้ว! บอทส่งรูปแกล้งคุณเข้ากลุ่ม!");
    } else {
      setStatus("ชนะแล้ว! คุณรอดตัวไป!");
    }
    setGameOver(true);
  };

  const resetGame = () => {
    setBotRoll(null);
    setUserRoll(null);
    setDisplayNumber(null);
    setTurn(null);
    setGameOver(false);
    setStatus("ทอยเพื่อตัดสินผลแพ้ชนะ!");
  };

  return (
    <div className="flex flex-col items-center justify-between h-full py-10 px-6">
      {/* Bot Score */}
      {botRoll && (
        <div className="text-center">
          <p className="text-sm text-gray-400">คะแนนบอท</p>
          <div className="text-3xl font-bold text-rose-500">{botRoll}</div>
        </div>
      )}

      {/* Center Stage */}
      <div className="relative flex flex-col items-center gap-6">
        <div className="h-40 flex items-center justify-center">
          <AnimatePresence mode='wait'>
            <motion.div 
              key={displayNumber ?? "idle"}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 1 }}
              className={`text-8xl font-black ${turn === 'bot' ? 'text-rose-500' : 'text-indigo-400'}`}
            >
              {displayNumber ?? "🎲"}
            </motion.div>
          </AnimatePresence>
        </div>
        <p className="text-xl font-medium text-center text-gray-300">{status}</p>
      </div>

      {/* Controls */}
      <div className="w-full">
        {!isRolling && (
          <div className="flex flex-col gap-3">
            {!botRoll && (
              <button onClick={startBotTurn} className="w-full bg-rose-600 py-4 rounded-2xl font-bold text-lg active:scale-95 transition-transform">
                เริ่มทอย (บอท)
              </button>
            )}
            {botRoll && !userRoll && (
              <button onClick={startUserTurn} className="w-full bg-indigo-600 py-4 rounded-2xl font-bold text-lg animate-pulse active:scale-95 transition-transform">
                ทอยเลย! (ของคุณ)
              </button>
            )}
            
            {/* Game Over Buttons */}
            {gameOver && (
              <div className="grid grid-cols-2 gap-3">
                <button onClick={resetGame} className="bg-emerald-600 py-4 rounded-2xl font-bold active:scale-95 transition-transform">
                  เล่นใหม่
                </button>
                <button onClick={onBackToLobby} className="bg-gray-700 py-4 rounded-2xl font-bold active:scale-95 transition-transform">
                  กลับล็อบบี้
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}