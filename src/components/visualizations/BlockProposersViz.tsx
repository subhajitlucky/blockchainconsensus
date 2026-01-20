import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Play, RotateCcw } from 'lucide-react';

const BlockProposersViz: React.FC = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<number | null>(null);
  const controls = useAnimation();

  const validators = [
    { id: 1, name: "Alice", stake: 50, color: "#3b82f6" },
    { id: 2, name: "Bob", stake: 25, color: "#8b5cf6" },
    { id: 3, name: "Charlie", stake: 15, color: "#ec4899" },
    { id: 4, name: "Dave", stake: 10, color: "#10b981" },
  ];

  const spin = async () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWinner(null);
    
    const rotation = 1440 + Math.random() * 360;
    await controls.start({
      rotate: rotation,
      transition: { duration: 4, ease: "easeOut" }
    });
    
    setIsSpinning(false);
    
    // Determine winner based on final rotation
    const normalizedRotation = rotation % 360;
    // Simple logic for demo: mapping rotation to sections
    if (normalizedRotation < 180) setWinner(1);
    else if (normalizedRotation < 270) setWinner(2);
    else if (normalizedRotation < 324) setWinner(3);
    else setWinner(4);
  };

  const reset = () => {
    controls.set({ rotate: 0 });
    setWinner(null);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-8 flex flex-col items-center">
      <div className="relative w-64 h-64">
        {/* The Wheel */}
        <motion.svg
          viewBox="0 0 100 100"
          animate={controls}
          className="w-full h-full drop-shadow-2xl"
        >
          {/* Alice 50% */}
          <path d="M 50 50 L 50 0 A 50 50 0 0 1 50 100 Z" fill={validators[0].color} />
          {/* Bob 25% */}
          <path d="M 50 50 L 50 100 A 50 50 0 0 1 0 50 Z" fill={validators[1].color} />
          {/* Charlie 15% */}
          <path d="M 50 50 L 0 50 A 50 50 0 0 1 20 10 Z" fill={validators[2].color} />
          {/* Dave 10% */}
          <path d="M 50 50 L 20 10 A 50 50 0 0 1 50 0 Z" fill={validators[3].color} />
          
          <circle cx="50" cy="50" r="4" fill="white" />
        </motion.svg>
        
        {/* Pointer */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-6 bg-gray-900 dark:bg-white clip-path-triangle" style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }} />
      </div>

      <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
        {validators.map((v) => (
          <div 
            key={v.id}
            className={`p-3 rounded-xl border-2 transition-all flex items-center justify-between ${
              winner === v.id 
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 scale-105' 
                : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: v.color }} />
              <span className="text-xs font-black text-gray-900 dark:text-white">{v.name}</span>
            </div>
            <span className="text-[10px] font-bold text-gray-400">{v.stake}% Stake</span>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          onClick={spin}
          disabled={isSpinning}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-black text-sm hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/30"
        >
          <Play size={16} fill="currentColor" /> Select Proposer
        </button>
        <button
          onClick={reset}
          className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 transition-all"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      {winner && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-bold text-emerald-600 dark:text-emerald-400"
        >
          {validators.find(v => v.id === winner)?.name} has been selected to propose the next block!
        </motion.p>
      )}
    </div>
  );
};

export default BlockProposersViz;
