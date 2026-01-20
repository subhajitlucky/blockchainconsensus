import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Leaf, Scale, Cpu, Wallet } from 'lucide-react';

const ConsensusComparisonViz: React.FC = () => {
  const metrics = [
    { 
      label: "Energy Efficiency", 
      pow: 1, 
      pos: 10, 
      icon: <Leaf className="w-4 h-4" />,
      desc: "PoS uses 99.9% less energy than PoW."
    },
    { 
      label: "Security Type", 
      pow: "Physical (Hashrate)", 
      pos: "Economic (Stake)", 
      icon: <Shield className="w-4 h-4" />,
      desc: "PoW relies on electricity; PoS relies on financial collateral."
    },
    { 
      label: "Hardware Requirements", 
      pow: "ASICs / GPUs", 
      pos: "Standard Servers", 
      icon: <Cpu className="w-4 h-4" />,
      desc: "PoW requires specialized, expensive hardware."
    },
    { 
      label: "Entry Barrier", 
      pow: "Hardware + Electricity", 
      pos: "Minimum Token Stake", 
      icon: <Wallet className="w-4 h-4" />,
      desc: "Both have high costs, but different forms of capital."
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800/50">
            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Metric</th>
            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-blue-600">Proof of Work</th>
            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-indigo-600">Proof of Stake</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {metrics.map((m, i) => (
            <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <div className="text-gray-400">{m.icon}</div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{m.label}</span>
                </div>
              </td>
              <td className="p-4">
                {typeof m.pow === 'number' ? (
                  <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${m.pow * 10}%` }}
                      className="h-full bg-blue-500"
                    />
                  </div>
                ) : (
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{m.pow}</span>
                )}
              </td>
              <td className="p-4">
                {typeof m.pos === 'number' ? (
                  <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${m.pos * 10}%` }}
                      className="h-full bg-indigo-500"
                    />
                  </div>
                ) : (
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{m.pos}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
          <Scale size={14} />
          <span className="text-[10px] font-black uppercase tracking-wider">The Bottom Line</span>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
          PoW is better for decentralized security with physical unforgeability, while PoS is better for scalability, energy efficiency, and faster finality.
        </p>
      </div>
    </div>
  );
};

export default ConsensusComparisonViz;
