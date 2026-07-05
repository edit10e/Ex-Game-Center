"use client";
import { useState } from 'react';
import GameSelector from '@/components/GameSelector';
import DiceGame from '@/components/DiceGame';
import TicTacToe from '@/components/TicTacToe'; // Ensure this is imported

export default function Home() {
  const [stage, setStage] = useState<'select' | 'upload' | 'play'>('select');
  // Update state to include tictactoe
  const [selectedGame, setSelectedGame] = useState<'dice' | 'tictactoe' | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);

  return (
    <main className="h-full w-full bg-gray-950 text-white overflow-hidden relative">
      
      {/* 1. Selection Stage */}
      {stage === 'select' && (
        <div className="h-full flex items-center justify-center p-4">
          <GameSelector onSelect={(g) => { setSelectedGame(g); setStage('upload'); }} />
        </div>
      )}

      {/* 2. Upload Stage */}
      {stage === 'upload' && (
        <div className="h-full w-full flex flex-col relative">
          {!photo ? (
            <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-gray-900 transition-colors">
              <span className="text-6xl mb-4">📸</span>
              <span>แตะเพื่อเลือกรูปภาพ</span>
              <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                if (e.target.files?.[0]) {
                  const reader = new FileReader();
                  reader.onload = (e) => setPhoto(e.target?.result as string);
                  reader.readAsDataURL(e.target.files[0]);
                }
              }} />
            </label>
          ) : (
            <>
              <img src={photo} className="w-full h-full object-cover" alt="Preview" />
              <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-3">
                <button 
                  onClick={() => setStage('play')}
                  className="w-full bg-blue-600 font-bold py-4 rounded-2xl active:scale-95 transition-transform"
                >
                  ยืนยัน (Confirm)
                </button>
                <button 
                  onClick={() => setPhoto(null)} 
                  className="w-full bg-gray-800/80 py-4 rounded-2xl backdrop-blur-md"
                >
                  เลือกใหม่
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* 3. Play Stage */}
{stage === 'play' && photo && (
  <div className="h-full w-full flex flex-col p-4 relative">
    {/* Cancel Button - visible during the game */}
    <button 
      onClick={() => { setStage('select'); setPhoto(null); }}
      className="absolute top-4 left-4 z-50 bg-gray-800/50 text-white px-4 py-2 rounded-full text-sm backdrop-blur-md hover:bg-gray-700 transition"
    >
      ยกเลิก
    </button>

    <div className="flex-1">
      {selectedGame === 'dice' ? (
        <DiceGame 
          photo={photo} 
          onBackToLobby={() => { setStage('select'); setPhoto(null); }} 
        />
      ) : (
        <TicTacToe 
          imageUrl={photo} 
          onBackToLobby={() => { setStage('select'); setPhoto(null); }} 
        />
      )}
    </div>
  </div>
)}
    </main>
  );
}