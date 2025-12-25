import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Box, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  return (
    <div className="space-y-16 py-12 px-4">
      <section className="text-center space-y-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest"
        >
          <Zap size={14} className="fill-current" /> Interactive Learning
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white"
        >
          Understand <span className="text-blue-600 dark:text-blue-400">Consensus</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
        >
          Interactive visualizations to help you grasp Proof of Work, Proof of Stake, and how decentralized networks reach agreement.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-4 pt-4"
        >
          <Link to="/learn" className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors flex items-center gap-2">
            Start Learning <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/playground" className="px-6 py-3 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 font-bold hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
            Playground
          </Link>
        </motion.div>
      </section>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {[
          { title: 'Visual Theory', icon: Box, desc: 'See blocks, chains, and forks form in real-time.' },
          { title: 'Live Network', icon: Zap, desc: 'Observe P2P gossip and block propagation.' },
          { title: 'Attack Simulation', icon: Shield, desc: 'Experiment with forks and re-orgs safely.' },
        ].map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 shadow-sm"
          >
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
              <feature.icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Home;