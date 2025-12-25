import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ShieldAlert, Zap, Swords, RefreshCw } from 'lucide-react';

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
    { id: 'N', label: 'North', isTraitor: hasTraitor },
    { id: 'E', label: 'East', isTraitor: false },
    { id: 'S', label: 'South', isTraitor: false },
    { id: 'W', label: 'West', isTraitor: false },
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

  // Logic to determine where the vote bubble should appear (Outer side)
  const getLabelStyle = (id: string) => {
    switch (id) {
      case 'N': return 'bottom-full mb-3 left-1/2 -translate-x-1/2';
      case 'S': return 'top-full mt-8 left-1/2 -translate-x-1/2'; // Extra margin for S to avoid army label
      case 'E': return 'left-full ml-3 top-1/2 -translate-y-1/2';
      case 'W': return 'right-full mr-3 top-1/2 -translate-y-1/2';
      default: return '';
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
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status, hasTraitor]);

  const reset = () => {
    setStatus('idle');
    setConsensus(null);
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6 w-full max-w-2xl mx-auto bg-white dark:bg-slate-950 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
      
      {/* Simulation Stage */}
      <div className="relative w-full h-[500px] flex items-center justify-center">
        
        {/* Background Radar/Grid Decorative Elements */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="absolute w-[280px] h-[280px] border border-dashed border-blue-500 rounded-full" />
          <div className="absolute w-[140px] h-[140px] border border-dotted border-slate-300 rounded-full" />
          <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
          <div className="absolute h-full w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent" />
        </div>

        {/* Central Palace */}
        <motion.div 
          className="z-30 relative"
          animate={status === 'attacking' && !consensus ? {
            x: [0, -2, 2, -2, 2, 0],
            rotate: [0, -1, 1, -1, 1, 0]
          } : {}}
          transition={{ repeat: Infinity, duration: 0.3 }}
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-amber-400 to-orange-600 rounded-2xl shadow-2xl flex items-center justify-center text-3xl sm:text-4xl border-4 border-amber-200 relative">
             <div className="absolute -inset-2 bg-amber-400/20 rounded-3xl blur-xl animate-pulse" />
             🏰
          </div>
          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-amber-700 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded shadow-sm">
              Capital
            </span>
          </div>
        </motion.div>

        {/* Dynamic SVG Layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 480">
          <defs>
            <filter id="electricity-glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          <g transform="translate(200, 240)">
            {generals.map((g) => {
              const pos = getPos(g.id);
              return (
                <React.Fragment key={`svg-${g.id}`}>
                  {/* Electricity/Dot Flow */}
                  {status === 'attacking' && (
                    <g>
                      {/* Static track */}
                      <motion.path
                        d={`M ${pos.x} ${pos.y} L 0 0`}
                        stroke="currentColor"
                        strokeWidth="1"
                        className="text-slate-200 dark:text-slate-800"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                      />
                      
                      {/* Moving Dots (Traitor doesn't send flow) */}
                      {!g.isTraitor && (
                        <motion.path
                          d={`M ${pos.x} ${pos.y} L 0 0`}
                          stroke={g.isTraitor ? "#ef4444" : "#3b82f6"}
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeDasharray="1, 15"
                          filter="url(#electricity-glow)"
                          initial={{ strokeDashoffset: 100 }}
                          animate={{ strokeDashoffset: 0 }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.8,
                            ease: "linear"
                          }}
                        />
                      )}
                    </g>
                  )}

                  {/* Messaging Pulse */}
                  {status === 'messaging' && (
                    <motion.circle
                      cx="0" cy="0" r={distance}
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="1"
                      strokeDasharray="10 20"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </g>
        </svg>

        {/* Armies Container */}
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
                <div className="relative group">
                  {/* Army Icon */}
                  <motion.div 
                    className={`
                      w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-xl sm:text-2xl shadow-lg border-4 transition-all duration-500 z-20 relative
                      ${status === 'idle' ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700' : ''}
                      ${status !== 'idle' && g.isTraitor ? 'bg-red-100 border-red-500 dark:bg-red-900/30' : ''}
                      ${status !== 'idle' && !g.isTraitor ? 'bg-blue-100 border-blue-500 dark:bg-blue-900/30' : ''}
                    `}
                    whileHover={{ scale: 1.1 }}
                  >
                    {status !== 'idle' && g.isTraitor ? '👺' : '⚔️'}
                  </motion.div>
                  {/* Army Label (Fixed under icon) */}
                  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <span className="text-[8px] font-bold uppercase tracking-tighter text-slate-400 dark:text-slate-500">
                      {g.label}
                    </span>
                  </div>

                  {/* Voting/Attack Bubbles (Radial Outer Position) */}
                  <AnimatePresence>
                    {status !== 'idle' && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className={`absolute ${getLabelStyle(g.id)} z-50`}
                      >
                        <div className={`
                          px-1.5 py-0.5 sm:px-2 sm:py-1 rounded shadow-lg text-[8px] sm:text-[10px] font-black whitespace-nowrap border-[1.5px] sm:border-2
                          ${g.isTraitor ? 'bg-red-500 border-red-400 text-white' : 'bg-blue-600 border-blue-400 text-white'}
                        `}>
                          {status === 'messaging' ? 'VOTING...' : (g.isTraitor ? 'ATK 10:00' : 'ATK 09:00')}
                          
                          {/* Pointer arrow for the bubble */}
                          <div className={`absolute w-2 h-2 rotate-45 ${g.isTraitor ? 'bg-red-500' : 'bg-blue-600'} 
                            ${g.id === 'N' ? 'top-full -mt-1 left-1/2 -translate-x-1/2' : ''}
                            ${g.id === 'S' ? 'bottom-full -mb-1 left-1/2 -translate-x-1/2' : ''}
                            ${g.id === 'E' ? 'right-full -mr-1 top-1/2 -translate-y-1/2' : ''}
                            ${g.id === 'W' ? 'left-full -ml-1 top-1/2 -translate-y-1/2' : ''}
                          `} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Control Panel */}
      <div className="w-full bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
        <div className="h-8 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {status === 'idle' && (
              <motion.p key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-slate-500 font-medium">
                Test the Byzantine Generals Problem in two scenarios.
              </motion.p>
            )}
            {status === 'messaging' && (
              <motion.div key="msg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-widest">
                <Zap className="w-3 h-3 animate-pulse" /> Messaging via P2P Network...
              </motion.div>
            )}
            {status === 'attacking' && (
              <motion.div key="res" initial={{ scale: 0.9 }} animate={{ scale: 1 }} className={`flex items-center gap-2 font-black uppercase tracking-widest text-sm ${consensus ? 'text-green-600' : 'text-red-600'}`}>
                {consensus ? <><Swords className="w-4 h-4" /> Strategic Victory</> : <><ShieldAlert className="w-4 h-4" /> Desync Failure</>}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-4">
          {status === 'idle' ? (
            <>
              <button 
                onClick={() => startSim(false)}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4" /> Honest
              </button>
              <button 
                onClick={() => startSim(true)}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
              >
                <ShieldAlert className="w-4 h-4" /> Traitor
              </button>
            </>
          ) : (
            <button 
              onClick={reset}
              className="px-8 py-3 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-300 dark:hover:bg-slate-700 transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-3 h-3" /> Reset Sim
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsensusIntroViz;
