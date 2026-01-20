import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ShieldAlert, Zap, RefreshCw, Activity, Database, Layout, Target } from 'lucide-react';
import { clsx } from 'clsx';

type GeneralStatus = 'idle' | 'messaging' | 'attacking';

interface General {
  id: 'N' | 'E' | 'S' | 'W';
  label: string;
  isTraitor: boolean;
}

const ConsensusIntroViz: React.FC = () => {
  const [status, setStatus] = useState<GeneralStatus>('idle');
  const [hasTraitor, setHasTraitor] = useState(false);
  const [consensus, setConsensus] = useState<boolean | null>(null);
  const [distance, setDistance] = useState(130);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 480) {
        setDistance(100);
      } else {
        setDistance(130);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const generals: General[] = [
    { id: 'N', label: 'Node_Alpha', isTraitor: hasTraitor },
    { id: 'E', label: 'Node_Bravo', isTraitor: false },
    { id: 'S', label: 'Node_Charlie', isTraitor: false },
    { id: 'W', label: 'Node_Delta', isTraitor: false },
  ];

  const getPos = (id: string) => {
    switch (id) {
      case 'N': return { x: 0, y: -distance };
      case 'S': return { x: 0, y: distance };
      case 'E': return { x: distance, y: 0 };
      case 'W': return { x: -distance, y: 0 };
      default: return { x: 0, y: 0 };
    }
  };

  const startSim = (traitor: boolean) => {
    setHasTraitor(traitor);
    setStatus('messaging');
    setConsensus(null);
  };

  useEffect(() => {
    if (status === 'messaging') {
      const timer = setTimeout(() => {
        setStatus('attacking');
        setConsensus(!hasTraitor);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [status, hasTraitor]);

  const reset = () => {
    setStatus('idle');
    setConsensus(null);
  };

  return (
    <div className="relative bg-white dark:bg-slate-950 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-xl dark:shadow-2xl overflow-hidden p-4 sm:p-8 font-mono min-h-[600px] flex flex-col justify-between transition-colors text-left text-gray-900 dark:text-white">
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="relative z-10 space-y-8">
        {/* Strategic HUD Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 p-4 rounded-xl flex flex-col justify-between h-24 transition-colors">
             <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold uppercase">
                <Target size={14} />
                <span className="text-[10px] tracking-widest">Mission Objective</span>
             </div>
             <div className="flex items-end justify-between">
                <div className="text-xl font-black uppercase tracking-tighter transition-colors">Coord_Atk</div>
                <div className="text-[8px] text-blue-500 font-black uppercase tracking-widest">Time: 09:00</div>
             </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 p-4 rounded-xl flex flex-col justify-between h-24 transition-colors">
             <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500 font-bold uppercase">
                <Activity size={14} />
                <span className="text-[10px] tracking-widest">Consensus Quorum</span>
             </div>
             <div className="flex items-end justify-between">
                <div className="text-2xl font-black text-gray-800 dark:text-slate-200 transition-colors">
                   {status === 'attacking' ? (consensus ? '100' : '75') : '0'}<span className="text-[10px] text-gray-400 dark:text-slate-500">%</span>
                </div>
                <div className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">Agreement</div>
             </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 p-3 rounded-xl overflow-hidden h-24 transition-colors">
             <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-2 font-bold uppercase">
                <Database size={14} />
                <span className="text-[10px] tracking-widest">Command Log</span>
             </div>
             <div className="space-y-1">
                <div className={clsx("text-[8px] truncate font-bold", status === 'idle' ? "text-gray-400" : "text-blue-500 animate-pulse")}>
                   {status === 'idle' ? '> Standby for command...' : status === 'messaging' ? '> P2P HANDSHAKE: BROADCAST' : '> ATK_COMMAND: EXECUTED'}
                </div>
                <div className="text-[8px] text-gray-400 dark:text-slate-600 truncate uppercase tracking-tighter">
                   {status !== 'idle' && (hasTraitor ? '> THREAT_LEVEL: CRITICAL' : '> THREAT_LEVEL: NOMINAL')}
                </div>
             </div>
          </div>
        </div>

        {/* Command Stage */}
        <div className="relative h-[350px] w-full border border-gray-100 dark:border-slate-800 rounded-3xl flex items-center justify-center overflow-hidden bg-gray-50/30 dark:bg-slate-950 shadow-inner transition-colors">
           {/* Strategic Radar Crosshair */}
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05] dark:opacity-20">
              <div className="absolute w-[280px] h-[280px] border border-blue-500/20 rounded-full" />
              <div className="absolute w-[140px] h-[140px] border border-blue-500/20 rounded-full" />
              <div className="w-[1px] h-full bg-blue-500/20" />
              <div className="h-[1px] w-full bg-blue-500/20" />
           </div>

           {/* Central Core Objective */}
           <motion.div 
             className="z-30 relative"
             animate={status === 'attacking' && !consensus ? {
               x: [0, -2, 2, -2, 2, 0],
               rotate: [0, -1, 1, -1, 1, 0]
             } : {}}
             transition={{ repeat: Infinity, duration: 0.3 }}
           >
             <div className={clsx(
               "w-20 h-20 rounded-[2.5rem] border-2 flex flex-col items-center justify-center gap-1 shadow-2xl transition-all duration-700",
               status === 'attacking' ? (consensus ? 'bg-emerald-500/10 border-emerald-500 shadow-emerald-500/20' : 'bg-red-500/10 border-red-500 shadow-red-500/20') : 'bg-blue-500/10 border-blue-500 shadow-blue-500/20'
             )}>
                <Layout className={clsx("w-8 h-8 transition-colors duration-700", status === 'attacking' ? (consensus ? 'text-emerald-500' : 'text-red-500') : 'text-blue-500')} />
                <span className={clsx("text-[7px] font-black uppercase tracking-widest", status === 'attacking' ? (consensus ? 'text-emerald-500' : 'text-red-500') : 'text-blue-500')}>Objective</span>
             </div>
           </motion.div>

           {/* Strategic SVG Layer */}
           <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 480">
             <g transform="translate(200, 240)">
               {generals.map((g) => {
                 const pos = getPos(g.id);
                 return (
                   <React.Fragment key={`svg-${g.id}`}>
                     {/* Messaging Pulse */}
                     {status === 'messaging' && (
                       <motion.circle
                         cx="0" cy="0" r={distance}
                         fill="none"
                         stroke="#6366f1"
                         strokeWidth="1"
                         strokeDasharray="4 8"
                         animate={{ rotate: 360 }}
                         transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                       />
                     )}

                     {/* Attack Flow */}
                     {status === 'attacking' && (
                       <g>
                         <motion.path
                           d={`M ${pos.x} ${pos.y} L 0 0`}
                           stroke={g.isTraitor ? "#ef4444" : "#10b981"}
                           strokeWidth="2"
                           strokeDasharray="4 4"
                           initial={{ pathLength: 0 }}
                           animate={{ pathLength: 1 }}
                           opacity="0.3"
                         />
                         {!g.isTraitor && (
                           <motion.path
                             d={`M ${pos.x} ${pos.y} L 0 0`}
                             stroke="#10b981"
                             strokeWidth="4"
                             strokeLinecap="round"
                             strokeDasharray="1, 15"
                             initial={{ strokeDashoffset: 100 }}
                             animate={{ strokeDashoffset: 0 }}
                             transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                           />
                         )}
                       </g>
                     )}
                   </React.Fragment>
                 );
               })}
             </g>
           </svg>

           {/* Strategic Nodes */}
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             {generals.map((g) => {
               const pos = getPos(g.id);
               return (
                 <motion.div
                   key={g.id}
                   className="absolute pointer-events-auto"
                   initial={false}
                   animate={{ x: pos.x, y: pos.y }}
                 >
                   <div className="relative flex flex-col items-center gap-2">
                     <motion.div 
                       className={clsx(
                         "w-14 h-14 rounded-2xl border-2 flex items-center justify-center shadow-lg transition-all duration-500",
                         status === 'idle' ? 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800' : 
                         g.isTraitor ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-blue-500/10 border-blue-500 text-blue-500'
                       )}
                       whileHover={{ scale: 1.05 }}
                     >
                       {g.isTraitor && status !== 'idle' ? <ShieldAlert size={20} /> : <Shield size={20} />}
                     </motion.div>
                     
                     <div className="text-[8px] font-black uppercase text-gray-400 dark:text-slate-600 tracking-widest">{g.label}</div>

                     {/* Decision Bubble */}
                     <AnimatePresence>
                       {status !== 'idle' && (
                         <motion.div
                           initial={{ opacity: 0, scale: 0.8, y: 5 }}
                           animate={{ opacity: 1, scale: 1, y: 0 }}
                           exit={{ opacity: 0 }}
                           className="absolute -top-10 whitespace-nowrap"
                         >
                           <div className={clsx(
                             "px-2 py-1 rounded-lg text-[8px] font-black uppercase border shadow-xl",
                             g.isTraitor ? 'bg-red-600 border-red-800 text-white' : 'bg-blue-600 border-blue-800 text-white'
                           )}>
                             {status === 'messaging' ? 'Voting...' : (g.isTraitor ? 'CMD: RETREAT' : 'CMD: ATTACK')}
                           </div>
                         </motion.div>
                       )}
                     </AnimatePresence>
                   </div>
                 </motion.div>
               );
             })}
           </div>

           <div className="absolute bottom-6 right-6 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[9px] text-gray-400 dark:text-slate-500 uppercase font-black tracking-widest">Network Simulation_Active</span>
           </div>
        </div>

        {/* Narrative Description */}
        <div className="min-h-[100px] max-w-2xl text-left">
           <AnimatePresence mode="wait">
              <motion.div
                key={status}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-2"
              >
                 <h3 className={clsx("text-sm font-black uppercase tracking-widest", status === 'attacking' ? (consensus ? 'text-emerald-500' : 'text-red-500') : 'text-blue-500')}>
                    {status === 'idle' ? 'Byzantine Fault Tolerance' : status === 'messaging' ? 'P2P Agreement Protocol' : (consensus ? 'Successful Consensus' : 'Consensus Failure')}
                 </h3>
                 <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 leading-relaxed font-bold">
                    {status === 'idle' && "In decentralized systems, nodes must agree on a single truth without a central leader. But what happens if some nodes lie or go offline?"}
                    {status === 'messaging' && "The nodes are exchanging cryptographically signed messages. Each node compares the votes it received to decide on the common action."}
                    {status === 'attacking' && (consensus 
                      ? "Success! Despite the decentralized nature, all honest nodes agreed on the same command and successfully coordinated the objective." 
                      : "Failure! The traitor node sent conflicting information, causing honest nodes to de-synchronize. This is why blockchains need strong consensus rules.")
                    }
                 </p>
              </motion.div>
           </AnimatePresence>
        </div>
      </div>

      {/* Control Actions */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-gray-100 dark:border-slate-900/50">
        <div className="flex items-start gap-3 max-w-md text-left">
           <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex-shrink-0 transition-colors">
              <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
           </div>
           <p className="text-[10px] text-gray-500 dark:text-slate-500 leading-relaxed font-bold uppercase tracking-tight transition-colors">
              <span className="text-blue-600 dark:text-blue-400 uppercase mr-1">Strategic Logic:</span>
              Consensus mechanisms (PoW/PoS) are the mathematical solutions to this coordination problem, ensuring honest actors win even with "Byzantine" traitors in the network.
           </p>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          {status === 'idle' ? (
            <>
              <button 
                onClick={() => startSim(false)}
                className="flex-1 sm:flex-none py-4 px-8 bg-blue-600 border-blue-800 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl border-b-4 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Shield size={16} /> Honest_Network
              </button>
              <button 
                onClick={() => startSim(true)}
                className="flex-1 sm:flex-none py-4 px-8 bg-red-600 border-red-800 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl border-b-4 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <ShieldAlert size={16} /> Traitor_Detected
              </button>
            </>
          ) : (
            <button 
              onClick={reset}
              className="flex-1 sm:flex-none py-4 px-10 bg-gray-100 dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-500 dark:text-slate-400 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] border-b-4 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw size={16} /> Reset_Command
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsensusIntroViz;