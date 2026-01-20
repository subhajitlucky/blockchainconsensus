import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronRight, 
  Share2, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  CheckCircle2, 
  Users, 
  GanttChartSquare, 
  Activity, 
  GitFork, 
  UserCheck, 
  Flame, 
  Scale 
} from 'lucide-react';

const topics = [
  { id: 'why-consensus', title: 'Why Consensus Needed', desc: 'The fundamental problem of agreement in distributed systems.', category: 'Basics', icon: Share2 },
  { id: 'trustless-networks', title: 'Trustless Networks', desc: 'How we coordinate without middlemen or central authorities.', category: 'Basics', icon: Users },
  { id: 'pow-overview', title: 'Proof of Work Overview', desc: 'Securing the network through computational effort.', category: 'PoW', icon: GanttChartSquare },
  { id: 'pow-mining', title: 'Mining & Hash Puzzles', desc: 'The mechanics of brute-forcing cryptographic puzzles.', category: 'PoW', icon: Cpu },
  { id: 'difficulty-adjustment', title: 'Difficulty Adjustment', desc: 'How blockchains maintain a steady heartbeat.', category: 'PoW', icon: Activity },
  { id: 'longest-chain', title: 'Longest Chain Rule', desc: 'The protocol for choosing the winning version of history.', category: 'PoW', icon: Zap },
  { id: 'forks-reorgs', title: 'Forks & Reorgs', desc: 'When the chain splits and how it heals itself.', category: 'PoW', icon: GitFork },
  { id: 'pos-overview', title: 'Proof of Stake Overview', desc: 'Security through economic capital instead of energy.', category: 'PoS', icon: ShieldCheck },
  { id: 'pos-staking', title: 'Validators & Staking', desc: 'Participating in consensus with "skin in the game".', category: 'PoS', icon: UserCheck },
  { id: 'block-proposers', title: 'Block Proposers', desc: 'How the network picks who creates the next block.', category: 'PoS', icon: GanttChartSquare },
  { id: 'finality', title: 'Attestations & Finality', desc: 'The process of locking in transactions permanently.', category: 'PoS', icon: CheckCircle2 },
  { id: 'slashing', title: 'Slashing Conditions', desc: 'The economic penalties that enforce honest behavior.', category: 'PoS', icon: Flame },
  { id: 'consensus-comparison', title: 'PoW vs PoS Trade-offs', desc: 'Comparing energy, security, and decentralization.', category: 'Advanced', icon: Scale },
];

const LearningPath: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-12 py-10 px-4">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">Learning Path</h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 font-medium">Master blockchain mechanics step-by-step.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-1 max-w-4xl mx-auto">
        {topics.map((topic, i) => {
          const Icon = topic.icon;
          return (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to={`/learn/${topic.id}`} className="block group">
                <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:border-blue-500 transition-all flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Icon size={20} />
                    </div>
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-blue-500">{topic.category}</span>
                      <h3 className="text-lg font-black text-gray-900 dark:text-white leading-tight">{topic.title}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block mt-0.5">{topic.desc}</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default LearningPath;
