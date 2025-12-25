import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Coins, UserCheck, ShieldAlert, Zap } from 'lucide-react';

interface Validator {
  id: string;
  name: string;
  stake: number;
  status: 'idle' | 'selected' | 'slashed';
}

const PoSViz: React.FC = () => {
  const [validators, setValidators] = useState<Validator[]>([
    { id: '1', name: 'Alice', stake: 500, status: 'idle' },
    { id: '2', name: 'Bob', stake: 300, status: 'idle' },
    { id: '3', name: 'Charlie', stake: 100, status: 'idle' },
    { id: '4', name: 'Dave', stake: 100, status: 'idle' },
  ]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [blocks, setBlocks] = useState<number[]>([]);

  const selectValidator = () => {
    setIsSelecting(true);
    
    // Reset statuses
    setValidators(prev => prev.map(v => v.status === 'slashed' ? v : { ...v, status: 'idle' }));

    setTimeout(() => {
      const activeValidators = validators.filter(v => v.status !== 'slashed');
      const totalStake = activeValidators.reduce((acc, v) => acc + v.stake, 0);
      let random = Math.random() * totalStake;
      
      let selectedId = activeValidators[0].id;
      for (const v of activeValidators) {
        if (random < v.stake) {
          selectedId = v.id;
          break;
        }
        random -= v.stake;
      }

      setValidators(prev => prev.map(v => v.id === selectedId ? { ...v, status: 'selected' } : v));
      setBlocks(prev => [...prev, prev.length + 1]);
      setIsSelecting(false);
    }, 1500);
  };

  const slashValidator = (id: string) => {
    setValidators(prev => prev.map(v => v.id === id ? { ...v, status: 'slashed', stake: Math.floor(v.stake * 0.5) } : v));
  };

  const totalStake = validators.reduce((acc, v) => acc + v.stake, 0);

  return (
    <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="flex justify-between items-center mb-6">
          <div>
              <h3 className="font-black text-sm text-gray-900 dark:text-white uppercase tracking-tight">PoS Lottery</h3>
              <p className="text-[10px] text-gray-500">Chance is proportional to stake.</p>
          </div>
          <button 
            onClick={selectValidator}
            disabled={isSelecting || validators.every(v => v.status === 'slashed')}
            className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 transition-all text-xs font-bold shadow-lg shadow-indigo-500/20"
          >
              <Zap className={`w-3 h-3 ${isSelecting ? 'animate-pulse' : ''}`} />
              {isSelecting ? 'Selecting...' : 'Next Block'}
          </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {validators.map((v) => (
              <motion.div
                key={v.id}
                animate={{ 
                    scale: v.status === 'selected' ? 1.02 : 1,
                    borderColor: v.status === 'selected' ? '#6366f1' : v.status === 'slashed' ? '#ef4444' : 'transparent'
                }}
                className={`p-3 border-[1.5px] rounded-xl relative overflow-hidden transition-colors ${v.status === 'slashed' ? 'bg-red-50 dark:bg-red-900/10' : 'bg-gray-50 dark:bg-slate-800/50'}`}
              >
                  {v.status === 'selected' && (
                      <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        className="absolute top-0 right-0 p-1.5 text-indigo-600"
                      >
                          <UserCheck className="w-4 h-4" />
                      </motion.div>
                  )}
                  <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-white text-xs ${v.status === 'slashed' ? 'bg-red-500' : 'bg-indigo-500'}`}>
                          {v.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                          <div className="font-bold text-xs text-gray-900 dark:text-white truncate">{v.name}</div>
                          <div className="flex items-center gap-1 text-[9px] text-gray-500">
                              <Coins className="w-2.5 h-2.5" />
                              {v.stake} ETH ({((v.stake / totalStake) * 100).toFixed(0)}%)
                          </div>
                      </div>
                      {v.status !== 'slashed' && (
                          <button 
                            onClick={() => slashValidator(v.id)}
                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 rounded transition-colors"
                            title="Slash"
                          >
                              <ShieldAlert className="w-3.5 h-3.5" />
                          </button>
                      )}
                  </div>
              </motion.div>
          ))}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {blocks.map((b, i) => (
              <motion.div
                key={i}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="flex-shrink-0 w-10 h-10 bg-white dark:bg-slate-800 border-[1.5px] border-indigo-100 dark:border-indigo-900 rounded-lg flex items-center justify-center text-[10px] font-black text-indigo-600 shadow-sm"
              >
                  #{b}
              </motion.div>
          ))}
          {isSelecting && (
              <div className="flex-shrink-0 w-10 h-10 border-[1.5px] border-dashed border-gray-200 dark:border-gray-800 rounded-lg animate-pulse" />
          )}
      </div>
    </div>
  );
};

export default PoSViz;
