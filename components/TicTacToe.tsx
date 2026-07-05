"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TicTacToe({ imageUrl, onBackToLobby }: { imageUrl: string, onBackToLobby: () => void }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [status, setStatus] = useState("ตาของคุณ (X)");
  const [winner, setWinner] = useState<string | null>(null);

  const checkWinner = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let line of lines) {
      const [a, b, c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
    }
    return squares.includes(null) ? null : 'Draw';
  };

  const handleClick = (index: number) => {
    if (board[index] || winner || !isPlayerTurn) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    
    const result = checkWinner(newBoard);
    if (result) {
      setWinner(result);
      setStatus(result === 'Draw' ? "เสมอ!" : "คุณชนะ!");
      return;
    }

    setIsPlayerTurn(false);
    setStatus("บอทกำลังคิด...");

    setTimeout(() => {
      const emptyIndices = newBoard.map((val, i) => val === null ? i : null).filter(val => val !== null) as number[];
      if (emptyIndices.length > 0) {
        const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        newBoard[randomIndex] = 'O';
        setBoard(newBoard);
        
        const botResult = checkWinner(newBoard);
        if (botResult) {
          setWinner(botResult);
          setStatus(botResult === 'Draw' ? "เสมอ!" : "บอทชนะ!");
        } else {
          setIsPlayerTurn(true);
          setStatus("ตาของคุณ (X)");
        }
      }
    }, 800);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setIsPlayerTurn(true);
    setStatus("ตาของคุณ (X)");
  };

  return (
    <div className="flex flex-col items-center p-6 h-full justify-between">
      <h2 className="text-2xl font-bold text-white mb-4">{status}</h2>

      {/* Game Board */}
      <div className="grid grid-cols-3 gap-3">
        {board.map((val, i) => (
          <motion.button 
            key={i} 
            whileTap={{ scale: 0.9 }}
            className="w-24 h-24 bg-gray-800 rounded-2xl flex items-center justify-center text-4xl font-bold text-white shadow-xl border-2 border-gray-700"
            onClick={() => handleClick(i)}
          >
            {val}
          </motion.button>
        ))}
      </div>

      {/* Controls */}
      <div className="w-full mt-8">
        {winner && (
          <div className="grid grid-cols-2 gap-3">
            <button onClick={resetGame} className="bg-emerald-600 py-4 rounded-2xl font-bold text-white">เล่นใหม่</button>
            <button onClick={onBackToLobby} className="bg-gray-700 py-4 rounded-2xl font-bold text-white">กลับล็อบบี้</button>
          </div>
        )}
      </div>
    </div>
  );
}