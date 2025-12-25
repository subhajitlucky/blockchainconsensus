import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Lock, Unlock } from 'lucide-react';

const FinalityViz: React.FC = () => {
  const [blocks, setBlocks] = useState([
    { id: 100, confirmed: true },
    { id: 101, confirmed: true },
    { id: 102, confirmed: false },
  ]);

  const addBlock = () => {
    setBlocks(prev => {
        const next = [...prev, { id: prev[prev.length - 1].id + 1, confirmed: false }];
        if (next.length > 3) {
            next[next.length - 3].confirmed = true;
        }
        return next;
    });
  };

  const txBlockIndex = blocks.findIndex(b => b.id === 102);
  const confirmations = txBlockIndex === -1 ? 0 : Math.max(0, blocks.length - 1 - txBlockIndex);

  return (
    <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="flex justify-between items-start mb-6">
          <div>
              <h3 className="font-black text-sm text-gray-900 dark:text-white uppercase tracking-tight">Finality Simulation</h3>
              <p className="text-[10px] text-gray-500 max-w-xs">
                  Confidence in Block #102 grows as new blocks are added.
              </p>
          </div>
          <div className="text-right">
              <div className="text-xl font-black text-blue-600">{confirmations}</div>
              <div className="text-[8px] font-black uppercase text-gray-400">Confirmations</div>
          </div>
      </div>

      <div className="flex gap-3 items-center justify-center min-h-[140px] overflow-x-auto py-2 px-1 custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {blocks.map((b) => (
                <motion.div
                    key={b.id}
                    layout
                    initial={{ scale: 0.8, opacity: 0, x: 20 }}
                    animate={{ scale: 1, opacity: 1, x: 0 }}
                    className={`relative flex-shrink-0 w-20 h-28 border-[1.5px] rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all ${
                        b.id === 102 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg shadow-blue-500/10' 
                        : 'border-gray-200 dark:border-gray-800'
                    }`}
                >
                    <span className="text-[8px] font-mono font-black text-gray-400">BLOCK</span>
                    <span className={`text-xs font-black ${b.id === 102 ? 'text-blue-600' : 'text-gray-600 dark:text-gray-300'}`}>#{b.id}</span>
                    
                    {b.id === 102 && (
                        <div className="absolute -top-2.5 bg-blue-500 text-white text-[7px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-tighter">
                            Your Tx
                        </div>
                    )}

                    <div className="mt-1">
                        {b.confirmed ? (
                            <div className="flex flex-col items-center text-green-500">
                                <Lock className="w-3.5 h-3.5" />
                                <span className="text-[7px] font-black">FINAL</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center text-yellow-500 animate-pulse">
                                <Unlock className="w-3.5 h-3.5" />
                                <span className="text-[7px] font-black tracking-tighter">PENDING</span>
                            </div>
                        )}
                    </div>
                </motion.div>
            ))}
          </AnimatePresence>
          
          <button 
            onClick={addBlock}
            className="flex-shrink-0 w-12 h-12 border-[1.5px] border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-all shadow-sm"
          >
              +
          </button>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-2 mb-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-orange-500" />
                  <span className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-wider">Reversal Risk</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: "100%" }}
                    animate={{ width: `${Math.max(5, 100 - (confirmations * 30))}%` }}
                    className="h-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]"
                  />
              </div>
          </div>
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-2 mb-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                  <span className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-wider">Safety Level</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: `${Math.min(100, (confirmations * 33) + 10)}%` }}
                    className="h-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                  />
              </div>
          </div>
      </div>
    </div>
  );
};

export default FinalityViz;