import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitFork, RefreshCcw, CheckCircle2 } from 'lucide-react';

const ForksReorgsViz: React.FC = () => {
  const [stage, setStage] = useState(0); // 0: single, 1: fork, 2: resolution

  const next = () => setStage((s) => (s + 1) % 3);

  const blocks = {
    base: [
      { id: '100', x: 50, y: 150 },
      { id: '101', x: 130, y: 150 },
    ],
    chainA: [
      { id: '102A', x: 210, y: 100 },
      { id: '103A', x: 290, y: 100 },
    ],
    chainB: [
      { id: '102B', x: 210, y: 200 },
      { id: '103B', x: 290, y: 200 },
      { id: '104B', x: 370, y: 200 },
    ]
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {stage === 0 && (
            <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border border-blue-200 dark:border-blue-800">
              Stable Chain
            </div>
          )}
          {stage === 1 && (
            <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border border-amber-200 dark:border-amber-800 flex items-center gap-1">
              <GitFork size={12} /> Network Fork!
            </div>
          )}
          {stage === 2 && (
            <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
              <RefreshCcw size={12} /> Chain Reorg
            </div>
          )}
        </div>
        <button
          onClick={next}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors"
        >
          {stage === 2 ? 'Reset' : 'Next Step'}
        </button>
      </div>

      <div className="relative h-[300px] w-full border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden bg-gray-50/30 dark:bg-slate-950/30 p-4">
        <svg viewBox="0 0 450 300" className="w-full h-full">
          {/* Base Chain */}
          {blocks.base.map((b, i) => (
            <g key={b.id}>
              {i > 0 && <line x1={blocks.base[i-1].x + 30} y1={150} x2={b.x - 30} y2={150} stroke="#94a3b8" strokeWidth="2" />}
              <rect x={b.x - 25} y={b.y - 25} width="50" height="50" rx="8" className="fill-white dark:fill-slate-800 stroke-gray-300 dark:stroke-gray-700" strokeWidth="2" />
              <text x={b.x} y={b.y + 5} textAnchor="middle" className="text-[10px] font-black fill-gray-900 dark:fill-white">#{b.id}</text>
            </g>
          ))}

          {/* Fork Lines */}
          <AnimatePresence>
            {stage >= 1 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <line x1={160} y1={150} x2={185} y2={100} stroke="#94a3b8" strokeWidth="2" strokeDasharray="4" />
                <line x1={160} y1={150} x2={185} y2={200} stroke="#94a3b8" strokeWidth="2" strokeDasharray="4" />
              </motion.g>
            )}
          </AnimatePresence>

          {/* Chain A */}
          {stage >= 1 && blocks.chainA.map((b, i) => (
            <motion.g key={b.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: stage === 2 ? 0.2 : 1, x: 0 }}>
              {i > 0 && <line x1={blocks.chainA[i-1].x + 30} y1={100} x2={b.x - 30} y2={100} stroke="#94a3b8" strokeWidth="2" />}
              <rect x={b.x - 25} y={b.y - 25} width="50" height="50" rx="8" className="fill-white dark:fill-slate-800 stroke-gray-300 dark:stroke-gray-700" strokeWidth="2" />
              <text x={b.x} y={b.y + 5} textAnchor="middle" className="text-[10px] font-black fill-gray-900 dark:fill-white">#{b.id}</text>
              {stage === 2 && (
                <text x={b.x} y={b.y + 40} textAnchor="middle" className="text-[8px] font-bold fill-red-500 uppercase">Orphaned</text>
              )}
            </motion.g>
          ))}

          {/* Chain B */}
          {stage >= 1 && blocks.chainB.map((b, i) => (
            <motion.g key={b.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              {(i === 0 || (i < 3 && stage === 2)) && i > 0 && <line x1={blocks.chainB[i-1].x + 30} y1={200} x2={b.x - 30} y2={200} stroke="#94a3b8" strokeWidth="2" />}
              {/* Only show 104B in stage 2 */}
              {(b.id !== '104B' || stage === 2) && (
                <>
                  <rect x={b.x - 25} y={b.y - 25} width="50" height="50" rx="8" className={`fill-white dark:fill-slate-800 ${stage === 2 ? 'stroke-emerald-500' : 'stroke-gray-300 dark:stroke-gray-700'}`} strokeWidth="2" />
                  <text x={b.x} y={b.y + 5} textAnchor="middle" className="text-[10px] font-black fill-gray-900 dark:fill-white">#{b.id}</text>
                  {stage === 2 && i === 2 && (
                    <motion.foreignObject x={b.x + 30} y={b.y - 12} width="24" height="24" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <CheckCircle2 className="text-emerald-500" />
                    </motion.foreignObject>
                  )}
                </>
              )}
            </motion.g>
          ))}
        </svg>

        <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-end">
          <p className="text-[10px] text-gray-500 max-w-[200px]">
            {stage === 0 && "Normal block production is sequential."}
            {stage === 1 && "Two blocks found at the same time! The network is split."}
            {stage === 2 && "Chain B became longer. Chain A is abandoned (Reorg)."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForksReorgsViz;
