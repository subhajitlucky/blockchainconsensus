import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Flame, Wallet, AlertTriangle } from 'lucide-react';

const SlashingViz: React.FC = () => {
  const [isSlashing, setIsSlashing] = useState(false);
  const [stake, setStake] = useState(32);
  const [message, setMessage] = useState("Validator is behaving honestly.");

  const [particles] = useState(() => {
    return Array.from({ length: 10 }).map((_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 40,
      delay: i * 0.1
    }));
  });

  const triggerSlashing = async () => {
    setIsSlashing(true);
    setMessage("DETECTED: Double-signing detected on two different forks!");
    
    await new Promise(r => setTimeout(r, 1500));
    setMessage("SLASHING: Burning 50% of staked collateral...");
    
    const interval = setInterval(() => {
      setStake(s => {
        if (s <= 16) {
          clearInterval(interval);
          return 16;
        }
        return s - 0.5;
      });
    }, 50);

    await new Promise(r => setTimeout(r, 2000));
    setIsSlashing(false);
    setMessage("PENALIZED: Validator slashed. Remaining stake: 16 ETH.");
  };

  const reset = () => {
    setStake(32);
    setIsSlashing(false);
    setMessage("Validator is behaving honestly.");
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-400">Validator Balance</h4>
          <div className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <Wallet className="text-blue-500" /> {stake.toFixed(1)} ETH
          </div>
        </div>
        {!isSlashing && stake === 32 ? (
          <button
            onClick={triggerSlashing}
            className="flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg text-xs font-black hover:bg-red-200 transition-all border border-red-200 dark:border-red-800"
          >
            <ShieldAlert size={16} /> Simulate Attack
          </button>
        ) : (
          <button
            onClick={reset}
            disabled={isSlashing}
            className="text-xs font-bold text-gray-400 hover:text-gray-900"
          >
            Reset Simulation
          </button>
        )}
      </div>

      <div className="relative h-48 w-full bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center p-8">
        {/* Validator Node */}
        <motion.div
          animate={isSlashing ? {
            x: [0, -5, 5, -5, 5, 0],
            scale: [1, 1.1, 1],
          } : {}}
          transition={{ duration: 0.2, repeat: isSlashing ? Infinity : 0 }}
          className={`relative z-10 w-24 h-24 rounded-3xl border-4 flex items-center justify-center transition-colors duration-500 ${
            isSlashing ? 'border-red-500 bg-red-500/20' : 'border-blue-500 bg-blue-500/20'
          }`}
        >
          {isSlashing ? (
             <Flame className="w-12 h-12 text-red-500 animate-bounce" />
          ) : (
             <ShieldAlert className="w-12 h-12 text-blue-500" />
          )}

          {/* Particle Effects for Slashing */}
          <AnimatePresence>
            {isSlashing && particles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 0, x: 0 }}
                animate={{ opacity: [0, 1, 0], y: -50, x: p.x }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, repeat: Infinity, delay: p.delay }}
                className="absolute w-2 h-2 bg-orange-500 rounded-full"
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Warning Indicator */}
        <AnimatePresence>
          {isSlashing && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute top-4 right-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
            >
              <AlertTriangle size={12} /> Malicious Activity
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className={`p-4 rounded-xl border transition-all ${
        isSlashing 
          ? 'bg-red-50 border-red-100 dark:bg-red-900/10 dark:border-red-900/20' 
          : 'bg-blue-50 border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/20'
      }`}>
        <p className={`text-sm font-bold ${isSlashing ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`}>
          {message}
        </p>
      </div>
    </div>
  );
};

export default SlashingViz;
