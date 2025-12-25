import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, AlertTriangle } from 'lucide-react';

interface Block {
  id: string;
  chain: 'A' | 'B';
  height: number;
}

const LongestChainViz: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([
    { id: '100', chain: 'A', height: 0 },
    { id: '101', chain: 'A', height: 1 },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [blocks]);

  const addBlock = (chain: 'A' | 'B') => {
    const height = blocks.filter(b => b.chain === chain).length;
    const newId = (101 + blocks.length).toString();
    
    // If we start chain B, it branches from 100
    if (chain === 'B' && !blocks.some(b => b.chain === 'B')) {
         setBlocks([...blocks, { id: '101b', chain: 'B', height: 1 }]);
    } else {
        setBlocks([...blocks, { id: newId, chain, height }]);
    }
  };

  const chainA = blocks.filter(b => b.chain === 'A');
  const chainB = blocks.filter(b => b.chain === 'B');
  
  const activeChain = chainA.length >= chainB.length ? 'A' : 'B';

  const reset = () => {
      setBlocks([
        { id: '100', chain: 'A', height: 0 },
        { id: '101', chain: 'A', height: 1 },
      ]);
  }

  return (
    <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-gray-800">
      <div className="flex justify-between items-center mb-8">
          <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Longest Chain Simulation</h3>
              <p className="text-xs text-gray-500">Nodes follow the chain with the most work.</p>
          </div>
          <button 
            onClick={reset}
            className="text-xs px-3 py-1 bg-gray-100 dark:bg-slate-800 rounded hover:bg-gray-200"
          >
              Reset
          </button>
      </div>

      <div className="space-y-12 relative min-h-[250px] flex flex-col justify-center overflow-x-auto overflow-y-hidden py-4 px-2 custom-scrollbar scroll-smooth" 
           ref={scrollRef}>
          {/* Chain A */}
          <div className="flex items-center gap-2">
              <div className="w-12 h-12 flex items-center justify-center text-xs font-bold text-gray-400">USA</div>
              <div className="flex gap-2">
                <AnimatePresence>
                    {chainA.map((b, i) => (
                        <motion.div
                            key={b.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ 
                                scale: 1, 
                                opacity: activeChain === 'A' ? 1 : 0.4,
                                borderColor: activeChain === 'A' ? '#3b82f6' : '#94a3b8'
                            }}
                            className={`w-14 h-14 border-2 rounded-lg flex flex-col items-center justify-center bg-white dark:bg-slate-800 shadow-sm`}
                        >
                            <span className="text-[10px] text-gray-400">#{b.id}</span>
                            {activeChain === 'A' && i === chainA.length - 1 && <Trophy className="w-4 h-4 text-yellow-500" />}
                        </motion.div>
                    ))}
                </AnimatePresence>
                <button 
                    onClick={() => addBlock('A')}
                    className="w-14 h-14 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors"
                >
                    +
                </button>
              </div>
          </div>

          {/* Chain B */}
          <div className="flex items-center gap-2">
              <div className="w-12 h-12 flex items-center justify-center text-xs font-bold text-gray-400">China</div>
              <div className="flex gap-2">
                <div className="w-14 h-14 invisible" /> {/* Offset for the fork */}
                <AnimatePresence>
                    {chainB.map((b, i) => (
                        <motion.div
                            key={b.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ 
                                scale: 1, 
                                opacity: activeChain === 'B' ? 1 : 0.4,
                                borderColor: activeChain === 'B' ? '#3b82f6' : '#94a3b8'
                            }}
                            className={`w-14 h-14 border-2 rounded-lg flex flex-col items-center justify-center bg-white dark:bg-slate-800 shadow-sm`}
                        >
                            <span className="text-[10px] text-gray-400">#{b.id}</span>
                            {activeChain === 'B' && i === chainB.length - 1 && <Trophy className="w-4 h-4 text-yellow-500" />}
                        </motion.div>
                    ))}
                </AnimatePresence>
                <button 
                    onClick={() => addBlock('B')}
                    className="w-14 h-14 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors"
                >
                    +
                </button>
              </div>
          </div>
          
          {/* Connector for Fork */}
          {chainB.length > 0 && (
              <svg className="absolute left-16 top-1/2 -translate-y-1/2 -z-10 w-24 h-24" style={{ pointerEvents: 'none' }}>
                  <path d="M 10 30 L 10 70 L 40 70" fill="transparent" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4" />
              </svg>
          )}
      </div>

      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm flex gap-3">
          <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <p className="text-blue-800 dark:text-blue-300">
              Currently following <strong>Chain {activeChain}</strong>. 
              {chainA.length === chainB.length ? " Both chains have equal weight. The next block will decide the winner!" : ` Chain ${activeChain} is longer, so the network considers it the canonical truth.`}
          </p>
      </div>
    </div>
  );
};

export default LongestChainViz;
