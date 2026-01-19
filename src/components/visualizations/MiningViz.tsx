import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateBlockHash } from '../../utils/hash';
import { Play, Pause, RefreshCw, CheckCircle, Settings, Hash, Clock, Zap } from 'lucide-react';
import { clsx } from 'clsx';

const MiningViz: React.FC = () => {
  // Block Header State
  const [blockHeight] = useState(1052);
  const [prevHash] = useState('0000a456b7c8d9e0f1...');
  const [timestamp, setTimestamp] = useState(Math.floor(Date.now() / 1000));
  const [data, setData] = useState('Transaction: Alice -> Bob 50 BTC');
  const [nonce, setNonce] = useState(0);

  // Mining State
  const [isMining, setIsMining] = useState(false);
  const [difficulty, setDifficulty] = useState(3);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [hashRate, setHashRate] = useState(0);

  // Derived
  const hash = calculateBlockHash(blockHeight, prevHash, timestamp, data, nonce);
  const targetPrefix = '0'.repeat(difficulty);
  const isFound = hash.startsWith(targetPrefix);

  const miningRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);
  const nonceRef = useRef(nonce); // Ref to keep track of nonce in loop without re-renders

  // Sync ref with state
  useEffect(() => { nonceRef.current = nonce; }, [nonce]);

  // Mining Loop
  useEffect(() => {
    if (isMining && !isFound) {
      if (!startTime) setStartTime(Date.now());

      const mine = (time: number) => {
        // Mine a batch of nonces for performance
        let currentNonce = nonceRef.current;
        const batchSize = 100; // Adjust based on performance needed
        let found = false;

        for (let i = 0; i < batchSize; i++) {
          currentNonce++;
          const tempHash = calculateBlockHash(blockHeight, prevHash, timestamp, data, currentNonce);
          if (tempHash.startsWith(targetPrefix)) {
            found = true;
            break;
          }
        }

        setNonce(currentNonce);
        
        // Update stats every 100ms
        if (time - lastUpdateRef.current > 100) {
            setElapsedTime((Date.now() - (startTime || Date.now())) / 1000);
            // Simple pseudo-hashrate (batchSize * 60fps approx)
            setHashRate(Math.floor(batchSize * 60)); 
            lastUpdateRef.current = time;
        }

        if (found) {
          setIsMining(false);
          setElapsedTime((Date.now() - (startTime || Date.now())) / 1000);
        } else {
          miningRef.current = requestAnimationFrame(mine);
        }
      };
      
      miningRef.current = requestAnimationFrame(mine);
    } else if (!isMining) {
        setHashRate(0);
    }

    return () => {
      if (miningRef.current) cancelAnimationFrame(miningRef.current);
    };
  }, [isMining, isFound, targetPrefix, data, timestamp, blockHeight, prevHash, startTime]);

  const resetBlock = () => {
    setIsMining(false);
    setNonce(0);
    setTimestamp(Math.floor(Date.now() / 1000));
    setElapsedTime(0);
    setStartTime(null);
    setHashRate(0);
  };

  const handleDataChange = (val: string) => {
      setData(val);
      if (isFound) {
          // If we were found, changing data invalidates it.
          // We don't reset nonce to 0, but we stop mining to let user see it broke.
          setIsMining(false);
      }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Control Panel */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
              <h3 className="font-black text-lg text-gray-900 dark:text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-500" />
                Mining Simulator
              </h3>
              <p className="text-sm text-gray-500 font-medium">Find a nonce that produces a hash with {difficulty} leading zeros.</p>
          </div>
          
          <div className="flex items-center gap-4 bg-gray-50 dark:bg-slate-800/50 p-2 rounded-xl">
             <span className="text-xs font-bold uppercase text-gray-400 pl-2">Difficulty:</span>
             <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(d => (
                    <button
                        key={d}
                        onClick={() => { setDifficulty(d); resetBlock(); }}
                        className={clsx(
                            "w-8 h-8 rounded-lg text-xs font-bold transition-all",
                            difficulty === d 
                                ? "bg-blue-600 text-white shadow-md" 
                                : "bg-white dark:bg-slate-800 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700"
                        )}
                    >
                        {d}
                    </button>
                ))}
             </div>
          </div>
        </div>

        {/* Block Visualization */}
        <div className={clsx(
            "relative rounded-xl border-2 transition-all overflow-hidden",
            isFound 
                ? "border-green-500 bg-green-50/50 dark:bg-green-900/10 shadow-[0_0_30px_-10px_rgba(34,197,94,0.3)]" 
                : "border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-slate-950"
        )}>
            {/* Header Status */}
            <div className="absolute top-0 right-0 p-4">
                {isFound ? (
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full shadow-sm border border-green-200 dark:border-green-900/30">
                        <CheckCircle size={16} />
                        <span className="text-xs font-black uppercase tracking-widest">Valid Block</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-gray-400 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full shadow-sm border border-gray-200 dark:border-gray-800">
                        <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-widest">Invalid</span>
                    </div>
                )}
            </div>

            <div className="p-6 space-y-4">
                {/* Immutable Fields */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 opacity-70">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Block Height</label>
                        <div className="font-mono text-sm font-bold text-gray-700 dark:text-gray-300">#{blockHeight}</div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Timestamp</label>
                        <div className="font-mono text-sm font-bold text-gray-700 dark:text-gray-300">{timestamp}</div>
                    </div>
                    <div className="space-y-1 hidden md:block">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Prev Hash</label>
                        <div className="font-mono text-xs font-bold text-gray-500 truncate">{prevHash}</div>
                    </div>
                </div>

                {/* Editable Data */}
                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider flex items-center gap-2">
                        Data <span className="text-[9px] font-normal text-gray-400 normal-case">(Changing this breaks the hash)</span>
                    </label>
                    <textarea 
                        value={data}
                        onChange={(e) => handleDataChange(e.target.value)}
                        rows={2}
                        className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-lg p-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                    />
                </div>

                {/* Nonce & Hash */}
                <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 space-y-4 shadow-inner">
                    <div className="flex items-center gap-4">
                        <div className="space-y-1 flex-1">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Nonce</label>
                            <input 
                                type="number" 
                                value={nonce} 
                                onChange={(e) => { setNonce(parseInt(e.target.value) || 0); setIsMining(false); }}
                                className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded px-2 py-1 font-mono font-bold text-blue-600 dark:text-blue-400"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Block Hash</label>
                        <div className="font-mono text-sm break-all bg-gray-50 dark:bg-slate-950 p-2 rounded border border-gray-100 dark:border-gray-800">
                            <span className="text-green-600 dark:text-green-500 font-bold">{hash.substring(0, isFound ? difficulty : 0)}</span>
                            <span className="text-gray-500 dark:text-gray-400">{hash.substring(isFound ? difficulty : 0)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mining Stats Bar */}
            <div className="bg-gray-50 dark:bg-slate-900/50 border-t border-gray-200 dark:border-gray-800 p-4 flex justify-between items-center text-xs font-mono">
                <div className="flex gap-4 text-gray-500">
                    <div className="flex items-center gap-1.5">
                        <Clock size={12} />
                        <span>{elapsedTime.toFixed(2)}s</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Zap size={12} />
                        <span>{hashRate} H/s</span>
                    </div>
                </div>
                {isFound && <div className="text-green-600 font-bold uppercase tracking-widest">Target Met</div>}
            </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
            <button
                onClick={() => {
                    if (isMining) {
                        setIsMining(false);
                        setStartTime(null);
                    } else {
                        setIsMining(true);
                        // Don't reset time if resuming, only if new start
                        if (!startTime) setStartTime(Date.now());
                    }
                }}
                disabled={isFound}
                className={clsx(
                    "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-lg",
                    isMining 
                        ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20" 
                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 disabled:opacity-50 disabled:shadow-none"
                )}
            >
                {isMining ? <Pause size={16} /> : <Play size={16} />}
                {isMining ? 'Stop Mining' : isFound ? 'Block Found' : 'Start Mining'}
            </button>
            
            <button
                onClick={resetBlock}
                className="px-6 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-xl font-bold uppercase tracking-widest text-xs transition-all flex items-center gap-2"
            >
                <RefreshCw size={16} />
                <span className="hidden sm:inline">Reset</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default MiningViz;