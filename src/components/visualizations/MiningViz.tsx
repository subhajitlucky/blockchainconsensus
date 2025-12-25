import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateBlockHash } from '../../utils/hash';
import { Play, Pause, RefreshCw, CheckCircle } from 'lucide-react';

const MiningViz: React.FC = () => {
  const [nonce, setNonce] = useState(0);
  const [isMining, setIsMining] = useState(false);
  const [data, setData] = useState('Block Transaction Data');
  const [difficulty] = useState(3);

  // Derived state
  const hash = calculateBlockHash(1, '00000000', 1234567890, data, nonce);
  const target = '0'.repeat(difficulty);
  const found = hash.startsWith(target);

  // Mining loop
  const miningRef = useRef<number | null>(null);

  useEffect(() => {
    if (isMining && !found) {
      const mine = () => {
        setNonce(n => {
            const next = n + 1;
            // Pre-calculate to stop loop immediately
            const nextHash = calculateBlockHash(1, '00000000', 1234567890, data, next);
            if (nextHash.startsWith(target)) {
                setIsMining(false);
            }
            return next;
        });
        miningRef.current = requestAnimationFrame(mine);
      };
      miningRef.current = requestAnimationFrame(mine);
    }
    return () => {
      if (miningRef.current) cancelAnimationFrame(miningRef.current);
    };
  }, [isMining, found, data, target]);

  const reset = () => {
    setIsMining(false);
    setNonce(0);
  };

  return (
    <div className="space-y-4 w-full max-w-2xl mx-auto">
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-black text-sm text-gray-900 dark:text-white uppercase tracking-tight">Mining Simulator</h3>
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
             <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">Target: {difficulty} Zeros</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-slate-950 p-4 rounded-xl space-y-3 font-mono text-[11px] border border-gray-100 dark:border-gray-800 shadow-inner">
             <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="w-16 text-gray-400 font-bold uppercase tracking-tighter">Data:</label>
                <input 
                  type="text" 
                  value={data} 
                  onChange={(e) => { setData(e.target.value); }}
                  className="bg-transparent border-b border-gray-200 dark:border-gray-700 focus:border-blue-500 outline-none flex-1 text-gray-800 dark:text-gray-200 py-0.5"
                />
             </div>
             <div className="flex items-center gap-2">
                <label className="w-16 text-gray-400 font-bold uppercase tracking-tighter">Nonce:</label>
                <span className="text-blue-600 dark:text-blue-400 font-black tracking-widest">{nonce}</span>
             </div>
             <div className="flex items-center gap-2">
                <label className="w-16 text-gray-400 font-bold uppercase tracking-tighter">Hash:</label>
                <span className={found ? "text-green-600 font-black break-all" : "text-gray-500 dark:text-gray-400 break-all"}>
                  {hash}
                </span>
             </div>
          </div>

          <div className="flex justify-between items-center pt-1">
            <div className="flex gap-2">
               <button
                 onClick={() => setIsMining(!isMining)}
                 disabled={found}
                 className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-500/20"
               >
                 {isMining ? <Pause size={14} /> : <Play size={14} />}
                 {isMining ? 'Pause' : 'Mine'}
               </button>
               <button
                 onClick={() => { setNonce(n => n + 1); }}
                 disabled={isMining || found}
                 className="px-4 py-2 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-all text-xs font-bold uppercase tracking-widest"
               >
                 Step
               </button>
            </div>
            
            <button 
              onClick={reset}
              className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
              title="Reset"
            >
              <RefreshCw size={18} />
            </button>
          </div>

          <AnimatePresence>
            {found && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-500 text-white p-3 rounded-xl flex items-center gap-3 shadow-lg shadow-green-500/20"
              >
                <CheckCircle className="w-5 h-5 shrink-0" />
                <div className="min-w-0">
                  <p className="font-black text-xs uppercase tracking-widest leading-none mb-1">Golden Nonce Found!</p>
                  <p className="text-[10px] opacity-90 leading-tight">Hash matches target difficulty.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <div className="text-center text-[10px] text-gray-400 max-w-sm mx-auto uppercase font-bold tracking-widest">
        Change data to break the hash.
      </div>
    </div>
  );
};

export default MiningViz;