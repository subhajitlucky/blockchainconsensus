import React from 'react';
import type { Block } from '../../simulation/types';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

interface BlockVizProps {
  block: Block;
  isHead?: boolean;
}

const BlockViz: React.FC<BlockVizProps> = ({ block, isHead }) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={clsx(
        'w-48 p-3 rounded-xl border-2 flex flex-col gap-2 font-mono text-[10px] shadow-sm bg-white dark:bg-slate-900',
        isHead ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-200 dark:border-gray-800'
      )}
    >
      <div className="flex justify-between items-center border-b pb-1.5 border-gray-100 dark:border-gray-800">
        <span className="font-black text-gray-400">BLOCK</span>
        <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[8px] font-bold">
          {block.id.substring(0, 8)}
        </span>
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between">
          <span className="text-gray-400">PREV:</span>
          <span className="text-gray-600 dark:text-gray-400">{block.prevHash.substring(0, 6)}...</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">NONCE:</span>
          <span className="text-blue-600 dark:text-blue-400 font-bold">{block.nonce}</span>
        </div>
      </div>

      <div className="py-2 border-t border-gray-100 dark:border-gray-800">
        <div className="text-[8px] text-gray-400 mb-1 uppercase font-black">Transactions ({block.transactions.length})</div>
        <div className="flex flex-wrap gap-1">
          {block.transactions.map((tx, idx) => (
            <div 
              key={`${block.id}-tx-${idx}`} 
              className="w-2 h-2 rounded-full shadow-inner" 
              style={{ backgroundColor: tx.color }}
            />
          ))}
          {block.transactions.length === 0 && <span className="text-[8px] text-gray-500 italic">No TXs</span>}
        </div>
      </div>

      <div className="text-[8px] mt-auto pt-1 flex justify-between items-center opacity-60">
        <span>BY: {block.minerId}</span>
      </div>
    </motion.div>
  );
};

export default BlockViz;
