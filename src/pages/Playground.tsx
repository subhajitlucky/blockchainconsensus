import React from 'react';
import { useSimulation } from '../hooks/useSimulation';
import { Play, Pause, Plus, Server, Pickaxe, Zap, Database, Share2, GitFork, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BlockViz from '../components/visualizations/BlockViz';
import NetworkViz from '../components/visualizations/NetworkViz';

const Playground: React.FC = () => {
  const { nodes, mempool, messages, isRunning, toggleSimulation, addNode, toggleMining, triggerFork } = useSimulation();

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-8 px-4">
      {/* Quick Start Guide */}
      <section className="bg-blue-600 dark:bg-blue-900/20 rounded-2xl p-6 text-white dark:text-blue-100 border border-blue-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
           <Share2 size={120} />
        </div>
        <h2 className="text-xl font-black mb-4 flex items-center gap-2 uppercase tracking-tight">
          <Zap className="fill-current text-yellow-300" /> How to use the Simulation
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
          {[
            { step: '1', title: 'Start Flow', desc: 'Click "Start Simulation" to generate transactions in the Mempool.' },
            { step: '2', title: 'Mine Blocks', desc: 'Click "Mine" on a node to start processing transactions.' },
            { step: '3', title: 'Simulate Fork', desc: 'Click "Simulate Fork" to force a split and watch the network disagree.' },
            { step: '4', title: 'Consensus', desc: 'Watch how the "Longest Chain" rule eventually resolves the conflict.' }
          ].map((item) => (
            <div key={item.step} className="bg-white/10 dark:bg-blue-900/40 backdrop-blur-md p-3 rounded-xl border border-white/20">
              <div className="text-[10px] font-black opacity-60 mb-1">STEP {item.step}</div>
              <div className="font-bold text-sm mb-1">{item.title}</div>
              <div className="text-[11px] leading-tight opacity-90">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm gap-4">
        <div>
           <h1 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
             <Database className="text-blue-500 w-4 h-4 sm:w-5 sm:h-5" /> Playground
           </h1>
           <p className="text-[10px] sm:text-[11px] text-gray-500">Observe P2P gossip, mining, and chain synchronization.</p>
        </div>
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          <button 
            onClick={toggleSimulation}
            className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-black uppercase tracking-widest text-[9px] transition-all active:scale-95 ${
              isRunning ? 'bg-amber-500 text-white' : 'bg-blue-600 text-white'
            }`}
          >
            {isRunning ? <><Pause size={12} /> Pause</> : <><Play size={12} /> Start</>}
          </button>
          <button 
            onClick={() => addNode(`Node-${nodes.length + 1}`)}
            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg font-black uppercase tracking-widest text-[9px] hover:bg-slate-200 transition-all border border-slate-200 dark:border-slate-700"
          >
            <Plus size={12} /> Add Node
          </button>
          <button 
            onClick={triggerFork}
            className="px-3 py-1.5 bg-purple-600 text-white rounded-lg font-black uppercase tracking-widest text-[9px] hover:bg-purple-700 transition-all shadow-md shadow-purple-500/10 flex items-center gap-1.5"
          >
            <GitFork size={12} /> Simulate Fork
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Network Gossip & Mempool */}
        <div className="lg:col-span-1 space-y-6">
          <section className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Share2 size={14} /> P2P Network Gossip
            </h3>
            <NetworkViz nodes={nodes} messages={messages} />
          </section>

          <section className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Database size={14} /> Mempool Cloud
              </h3>
              <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full font-bold">
                {mempool.length} TXs
              </span>
            </div>
            <div className="flex flex-wrap gap-2 min-h-[100px] p-4 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
              <AnimatePresence>
                {mempool.map(tx => (
                  <motion.div
                    key={tx.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0, y: -20 }}
                    className="w-3 h-3 rounded-full shadow-sm"
                    style={{ backgroundColor: tx.color }}
                  />
                ))}
              </AnimatePresence>
            </div>
          </section>
        </div>

        {/* Right: Node View */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
          {nodes.map(node => (
            <motion.div 
              key={node.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm overflow-hidden"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${node.isMining ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600'}`}>
                    <Server className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-tight">{node.id}</h3>
                    <div className="text-[10px] text-gray-400 font-medium flex gap-3">
                       <span>CHAIN: {node.chain.length}</span>
                       <span className={node.isMining ? 'text-amber-500 animate-pulse' : ''}>
                           {node.isMining ? 'STATUS: MINING...' : 'STATUS: READY'}
                       </span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => toggleMining(node.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                    node.isMining 
                      ? 'bg-amber-500 text-white shadow-md' 
                      : 'bg-slate-100 text-slate-500 dark:bg-slate-800 hover:bg-slate-200'
                  }`}
                >
                  {node.isMining ? <><RefreshCw size={12} className="animate-spin" /> Stop</> : <><Pickaxe size={12} /> Mine</>}
                </button>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2 pt-2 custom-scrollbar">
                {node.chain.slice().reverse().map((block, i) => (
                  <div key={block.id} className="flex-shrink-0">
                    <BlockViz block={block} isHead={i === 0} />
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Playground;
