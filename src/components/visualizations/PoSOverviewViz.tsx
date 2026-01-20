import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck, Vote, CheckCircle2, Wallet, Activity, Database } from 'lucide-react';
import { clsx } from 'clsx';

const PoSOverviewViz: React.FC = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((s) => (s + 1) % 4);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const phases = [
    { 
      id: 'stake',
      title: "Capital Lock", 
      icon: <Wallet className="w-6 h-6" />, 
      color: "blue",
      stat: "32.0 ETH",
      statLabel: "MIN_DEPOSIT",
      desc: "Validators lock up their coins as a security deposit to join the network. This creates economic 'skin in the game'." 
    },
    { 
      id: 'select',
      title: "Proposer Selection", 
      icon: <UserCheck className="w-6 h-6" />, 
      color: "indigo",
      stat: "RANDAO",
      statLabel: "SELECTION_SEED",
      desc: "The protocol randomly picks one validator to propose the next block. Chance is proportional to the amount staked." 
    },
    { 
      id: 'vote',
      title: "Attestation Committee", 
      icon: <Vote className="w-6 h-6" />, 
      color: "purple",
      stat: "Supermajority",
      statLabel: "VOTE_THRESHOLD",
      desc: "A group of other validators (the committee) checks the block and 'votes' on its validity via attestations." 
    },
    { 
      id: 'reward',
      title: "Finalization & Yield", 
      icon: <CheckCircle2 className="w-6 h-6" />, 
      color: "emerald",
      stat: "4.8% APR",
      statLabel: "STAKING_YIELD",
      desc: "Once finalized, the block is permanent. The proposer and voters earn newly issued coins and transaction fees." 
    }
  ];

  return (
    <div className="relative bg-white dark:bg-slate-950 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-xl dark:shadow-2xl overflow-hidden p-4 sm:p-8 font-mono min-h-[550px] flex flex-col justify-between transition-colors text-left text-gray-900 dark:text-white">
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="relative z-10 space-y-8">
        {/* HUD Top Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {phases.map((p, i) => (
            <div 
              key={p.id}
              className={clsx(
                "p-3 rounded-xl border transition-all duration-500",
                step === i 
                  ? `bg-gray-50 dark:bg-slate-900 border-indigo-500 dark:border-indigo-500 shadow-sm opacity-100 scale-[1.02]` 
                  : "bg-gray-50 dark:bg-slate-900/40 border-gray-100 dark:border-slate-800/50 opacity-40 scale-100"
              )}
            >
              <div className={clsx("text-[8px] font-black uppercase mb-1", step === i ? `text-indigo-600 dark:text-indigo-400` : "text-gray-400")}>
                Phase 0{i+1}
              </div>
              <div className="text-[10px] font-bold truncate tracking-tight">{p.title}</div>
            </div>
          ))}
        </div>

        {/* Central Engine Stage */}
        <div className="relative h-[280px] w-full border border-gray-100 dark:border-slate-800 rounded-3xl flex items-center justify-center overflow-hidden bg-gray-50/30 dark:bg-slate-950 shadow-inner transition-colors">
           {/* Decorative Radar */}
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05] dark:opacity-20">
              <div className="absolute w-[240px] h-[240px] border border-indigo-500/20 rounded-full" />
              <div className="absolute w-[120px] h-[120px] border border-indigo-500/20 rounded-full" />
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute w-[300px] h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent" 
              />
           </div>

           {/* Core Engine Node */}
           <div className="relative w-48 h-48 flex items-center justify-center">
              <AnimatePresence mode="wait">
                 <motion.div
                   key={step}
                   initial={{ scale: 0.8, opacity: 0, rotate: -20 }}
                   animate={{ scale: 1, opacity: 1, rotate: 0 }}
                   exit={{ scale: 1.2, opacity: 0, rotate: 20 }}
                   transition={{ type: 'spring', damping: 15 }}
                   className={clsx(
                     "relative z-20 w-32 h-32 rounded-[2.5rem] border-2 flex flex-col items-center justify-center gap-3 shadow-2xl transition-all duration-700",
                     phases[step].color === 'blue' ? "bg-blue-500/10 border-blue-500 shadow-blue-500/20" :
                     phases[step].color === 'indigo' ? "bg-indigo-500/10 border-indigo-500 shadow-indigo-500/20" :
                     phases[step].color === 'purple' ? "bg-purple-500/10 border-purple-500 shadow-purple-500/20" :
                     "bg-emerald-500/10 border-emerald-500 shadow-emerald-500/20"
                   )}
                 >
                    <div className={clsx(
                      phases[step].color === 'blue' ? "text-blue-600 dark:text-blue-400" :
                      phases[step].color === 'indigo' ? "text-indigo-600 dark:text-indigo-400" :
                      phases[step].color === 'purple' ? "text-purple-600 dark:text-purple-400" :
                      "text-emerald-600 dark:text-emerald-400"
                    )}>
                       {phases[step].icon}
                    </div>
                    <div className="flex flex-col items-center text-center px-2">
                       <span className="text-[7px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-slate-500 mb-1">Status</span>
                       <span className={clsx(
                         "text-[9px] font-black uppercase tracking-wider",
                         phases[step].color === 'blue' ? "text-blue-600 dark:text-blue-400" :
                         phases[step].color === 'indigo' ? "text-indigo-600 dark:text-indigo-400" :
                         phases[step].color === 'purple' ? "text-purple-600 dark:text-purple-400" :
                         "text-emerald-600 dark:text-emerald-400"
                       )}>
                          {phases[step].id === 'reward' ? 'ACTIVE_YIELD' : phases[step].id === 'stake' ? 'COLLATERAL_LOCKED' : 'PROCESSING'}
                       </span>
                    </div>
                 </motion.div>
              </AnimatePresence>

              {/* Orbital Particles */}
              <div className="absolute inset-0">
                 {[1, 2, 3, 4, 5, 6].map(i => (
                   <motion.div
                     key={i}
                     animate={{ rotate: 360 }}
                     transition={{ duration: 3 + i, repeat: Infinity, ease: "linear" }}
                     className="absolute inset-0 flex items-start justify-center"
                   >
                      <div className={clsx(
                        "w-1 h-1 rounded-full mt-4", 
                        phases[step].color === 'blue' ? "bg-blue-500 shadow-[0_0_8px_#3b82f6]" :
                        phases[step].color === 'indigo' ? "bg-indigo-500 shadow-[0_0_8px_#6366f1]" :
                        phases[step].color === 'purple' ? "bg-purple-500 shadow-[0_0_8px_#a855f7]" :
                        "bg-emerald-500 shadow-[0_0_8px_#10b981]"
                      )} />
                   </motion.div>
                 ))}
              </div>
           </div>

           {/* Stats HUD */}
           <div className="absolute bottom-6 left-6 space-y-4 hidden sm:block">
              <div className="space-y-1">
                 <div className="text-[8px] font-black text-gray-400 dark:text-slate-600 uppercase tracking-widest">{phases[step].statLabel}</div>
                 <div className="text-sm font-bold text-gray-700 dark:text-slate-300">{phases[step].stat}</div>
              </div>
              <div className="space-y-1">
                 <div className="text-[8px] font-black text-gray-400 dark:text-slate-600 uppercase tracking-widest">NETWORK_LOAD</div>
                 <div className="flex items-center gap-2">
                    <Activity size={10} className="text-indigo-500" />
                    <span className="text-[10px] font-bold">STABLE</span>
                 </div>
              </div>
           </div>

           <div className="absolute top-6 right-6 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] text-gray-400 dark:text-slate-500 uppercase font-black tracking-widest">Epoch synchronization active</span>
           </div>
        </div>

        {/* Narrative Description */}
        <div className="min-h-[100px] max-w-2xl">
           <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-2"
              >
                 <h3 className={clsx(
                   "text-sm font-black uppercase tracking-widest",
                   phases[step].color === 'blue' ? "text-blue-600 dark:text-blue-400" :
                   phases[step].color === 'indigo' ? "text-indigo-600 dark:text-indigo-400" :
                   phases[step].color === 'purple' ? "text-purple-600 dark:text-purple-400" :
                   "text-emerald-600 dark:text-emerald-400"
                 )}>
                    {phases[step].title}
                 </h3>
                 <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 leading-relaxed font-bold">
                    {phases[step].desc}
                 </p>
              </motion.div>
           </AnimatePresence>
        </div>
      </div>

      {/* Footer Instructions */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-gray-100 dark:border-slate-900/50">
        <div className="flex items-start gap-3 max-w-md">
           <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg flex-shrink-0 transition-colors">
              <Database className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
           </div>
           <p className="text-[10px] text-gray-500 dark:text-slate-500 leading-relaxed text-left font-bold uppercase tracking-tight">
              <span className="text-indigo-600 dark:text-indigo-400 mr-1">Consensus Model:</span>
              Proof of Stake replaces physical electricity with financial capital. This makes the network 99.9% more energy efficient while maintaining robust economic security.
           </p>
        </div>

        <div className="flex gap-1.5">
           {phases.map((_, i) => (
             <motion.div 
               key={i}
               animate={{ 
                 width: step === i ? 24 : 8,
                 backgroundColor: step === i ? '#6366f1' : 'rgba(226, 232, 240, 0.5)'
               }}
               className="h-1 rounded-full transition-all duration-500"
             />
           ))}
        </div>
      </div>
    </div>
  );
};

export default PoSOverviewViz;