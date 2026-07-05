"use client";

export default function GameSelector({ onSelect }: { onSelect: (game: 'dice' | 'tictactoe') => void }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6">
      <h2 className="text-4xl font-black text-white mb-10 tracking-tight">เลือกเกมที่ต้องการ</h2>
      
      <div className="w-full flex flex-col gap-6">
        {/* Dice Game Card */}
        <button 
          onClick={() => onSelect('dice')}
          className="group relative overflow-hidden bg-gradient-to-br from-indigo-700 to-purple-900 p-8 rounded-3xl text-left shadow-2xl active:scale-[0.98] transition-all"
        >
          <div className="absolute top-4 right-4 text-4xl opacity-50">🎲</div>
          <div className="text-3xl font-bold text-white mb-1">ทอยเต๋าประลอง</div>
          <p className="text-indigo-200">ทอยให้ได้แต้มสูงกว่าบอท</p>
        </button>

        {/* Tic-Tac-Toe Card */}
        <button 
          onClick={() => onSelect('tictactoe')}
          className="group relative overflow-hidden bg-gradient-to-br from-emerald-700 to-teal-900 p-8 rounded-3xl text-left shadow-2xl active:scale-[0.98] transition-all"
        >
          <div className="absolute top-4 right-4 text-4xl opacity-50">❌</div>
          <div className="text-3xl font-bold text-white mb-1">OX เกม (Tic-Tac-Toe)</div>
          <p className="text-teal-200">เกมวางแผนคลาสสิกกับบอท</p>
        </button>
      </div>

      <p className="mt-12 text-gray-500 text-sm">เลือกเกมเพื่อเริ่มเล่นเลย!</p>
    </div>
  );
}