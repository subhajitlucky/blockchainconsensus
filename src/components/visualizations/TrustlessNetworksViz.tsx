import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Server, User, ShieldCheck, Send, CheckCircle2, X } from 'lucide-react';

const TrustlessNetworksViz: React.FC = () => {
  const [mode, setMode] = useState<'centralized' | 'decentralized'>('centralized');
  const [isTransacting, setIsTransacting] = useState(false);
  const [verifyingNodes, setVerifyingNodes] = useState<number[]>([]);

  const users = [
    { id: 1, pos: { x: 50, y: 100 } },
    { id: 2, pos: { x: 250, y: 100 } },
    { id: 3, pos: { x: 50, y: 250 } },
    { id: 4, pos: { x: 250, y: 250 } },
  ];

  const triggerTransaction = async () => {
    if (isTransacting) return;
    setIsTransacting(true);
    setVerifyingNodes([]);

    if (mode === 'centralized') {
      // Step 1: User 1 sends to server
      await new Promise(r => setTimeout(r, 800));
      // Step 2: Server updates, sends to others
      setVerifyingNodes([0]); // The server "verifies"
      await new Promise(r => setTimeout(r, 800));
    } else {
      // Step 1: User 1 broadcasts to all neighbors
      await new Promise(r => setTimeout(r, 800));
      // Step 2: Nodes verify independently
      for (let i = 1; i <= users.length; i++) {
        await new Promise(r => setTimeout(r, 200));
        setVerifyingNodes(prev => [...prev, i]);
      }
    }

    await new Promise(r => setTimeout(r, 2000));
    setIsTransacting(false);
    setVerifyingNodes([]);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          <button
            onClick={() => { setMode('centralized'); setVerifyingNodes([]); }}
            className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${
              mode === 'centralized' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600' : 'text-gray-500'
            }`}
          >
            Centralized
          </button>
          <button
            onClick={() => { setMode('decentralized'); setVerifyingNodes([]); }}
            className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${
              mode === 'decentralized' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600' : 'text-gray-500'
            }`}
          >
            Decentralized
          </button>
        </div>

        <button
          onClick={triggerTransaction}
          disabled={isTransacting}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-black hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/20"
        >
          <Send size={14} /> Simulate Transaction
        </button>
      </div>

      <div className="relative h-[350px] w-full border border-gray-100 dark:border-gray-800 rounded-xl flex items-center justify-center overflow-hidden bg-gray-50/50 dark:bg-slate-950/50">
        <svg viewBox="0 0 300 350" className="w-full h-full max-w-[300px]">
          {/* Static Connections */}
          {mode === 'centralized' ? (
            users.map((u) => (
              <line key={`l-${u.id}`} x1={150} y1={175} x2={u.pos.x} y2={u.pos.y} stroke="currentColor" strokeWidth="1" className="text-gray-200 dark:text-gray-800" />
            ))
          ) : (
            users.map((u, i) => users.slice(i + 1).map((v) => (
              <line key={`l-${u.id}-${v.id}`} x1={u.pos.x} y1={u.pos.y} x2={v.pos.x} y2={v.pos.y} stroke="currentColor" strokeWidth="1" className="text-gray-200 dark:text-gray-800" />
            )))
          )}

          {/* Animated Message Flow */}
          <AnimatePresence>
            {isTransacting && mode === 'centralized' && (
              <>
                {/* User 1 to Server */}
                <motion.circle
                  initial={{ cx: 50, cy: 100, r: 0 }}
                  animate={{ cx: 150, cy: 175, r: 4 }}
                  transition={{ duration: 0.8 }}
                  fill="#3b82f6"
                />
                {/* Server to others after delay */}
                {verifyingNodes.includes(0) && users.slice(1).map(u => (
                  <motion.circle
                    key={`flow-${u.id}`}
                    initial={{ cx: 150, cy: 175, r: 4 }}
                    animate={{ cx: u.pos.x, cy: u.pos.y, r: 4 }}
                    transition={{ duration: 0.8 }}
                    fill="#3b82f6"
                  />
                ))}
              </>
            )}

            {isTransacting && mode === 'decentralized' && (
              <>
                {/* User 1 Broadcasts to everyone */}
                {users.slice(1).map(u => (
                  <motion.circle
                    key={`p2p-${u.id}`}
                    initial={{ cx: 50, cy: 100, r: 0 }}
                    animate={{ cx: u.pos.x, cy: u.pos.y, r: 4 }}
                    transition={{ duration: 0.8 }}
                    fill="#6366f1"
                  />
                ))}
              </>
            )}
          </AnimatePresence>

          {/* Center Server */}
          {mode === 'centralized' && (
            <motion.g>
              <circle cx="150" cy="175" r="25" fill={verifyingNodes.includes(0) ? "#10b981" : "#3b82f6"} className="transition-colors duration-500" />
              <foreignObject x="138" y="163" width="24" height="24">
                <Server className="text-white w-6 h-6" />
              </foreignObject>
              {verifyingNodes.includes(0) && (
                <text x="150" y="215" textAnchor="middle" className="text-[8px] font-black fill-emerald-500 uppercase">Single Verifier</text>
              )}
            </motion.g>
          )}

          {/* User Nodes */}
          {users.map((u) => (
            <g key={u.id}>
              <circle 
                cx={u.pos.x} cy={u.pos.y} r="20" 
                className={`transition-all duration-500 ${
                  verifyingNodes.includes(u.id) 
                    ? 'fill-emerald-100 stroke-emerald-500 dark:fill-emerald-900/30' 
                    : 'fill-white dark:fill-slate-800 stroke-gray-200 dark:stroke-gray-700'
                }`} 
                strokeWidth="2" 
              />
              <foreignObject x={u.pos.x - 10} y={u.pos.y - 10} width="20" height="20">
                <User className={`${verifyingNodes.includes(u.id) ? 'text-emerald-600' : 'text-gray-400'} w-5 h-5`} />
              </foreignObject>
              {verifyingNodes.includes(u.id) && mode === 'decentralized' && (
                <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <foreignObject x={u.pos.x + 8} y={u.pos.y - 25} width="16" height="16">
                    <CheckCircle2 className="text-emerald-500 w-4 h-4" />
                  </foreignObject>
                </motion.g>
              )}
            </g>
          ))}
        </svg>

        {/* Labels */}
        <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-none">
          {mode === 'centralized' ? (
            <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border border-amber-200 dark:border-amber-800 flex items-center gap-1">
              <X size={12} /> Trusted Middleman
            </div>
          ) : (
            <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
              <ShieldCheck size={12} /> Independent Verification
            </div>
          )}
        </div>
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-sm text-gray-600 dark:text-gray-400 leading-relaxed min-h-[80px]">
        {mode === 'centralized' ? (
          "In Centralized networks, the server is the only one who 'knows' the truth. If it tells the other users the transaction happened, they must believe it without checking for themselves."
        ) : (
          "In Trustless networks, everyone receives the transaction. Each node then performs its own check. They don't need to trust each other because they all have the same rules to verify the math."
        )}
      </div>
    </div>
  );
};

export default TrustlessNetworksViz;