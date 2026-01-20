import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck, Vote, CheckCircle2, ChevronRight, Wallet } from 'lucide-react';

const PoSOverviewViz: React.FC = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((s) => (s + 1) % 4);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const steps = [
    { 
      title: "Stake Capital", 
      icon: <Wallet className="w-8 h-8" />, 
      color: "blue",
      desc: "Validators lock up their coins as a security deposit to join the network." 
    },
    { 
      title: "Get Selected", 
      icon: <UserCheck className="w-8 h-8" />, 
      color: "indigo",
      desc: "The protocol randomly picks one validator to propose the next block." 
    },
    { 
      title: "Collect Votes", 
      icon: <Vote className="w-8 h-8" />, 
      color: "purple",
      desc: "Other validators (the committee) vote on whether the block is valid." 
    },
    { 
      title: "Earn Interest", 
      icon: <CheckCircle2 className="w-8 h-8" />, 
      color: "emerald",
      desc: "If successful, the proposer and voters earn staking rewards." 
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12">
        {steps.map((s, i) => (
          <React.Fragment key={i}>
            <div className={`relative flex flex-col items-center text-center gap-3 transition-all duration-500 ${step === i ? 'scale-110 opacity-100' : 'scale-90 opacity-40'}`}>
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-${s.color}-100 dark:bg-${s.color}-900/30 text-${s.color}-600 dark:text-${s.color}-400 border-2 border-${s.color}-200 dark:border-${s.color}-800`}>
                {s.icon}
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-[10px] uppercase tracking-wider text-gray-400">Phase 0{i+1}</h4>
                <p className="font-bold text-xs whitespace-nowrap text-gray-900 dark:text-white">{s.title}</p>
              </div>
            </div>
            {i < steps.length - 1 && (
              <ChevronRight className="hidden md:block text-gray-300 dark:text-gray-700" size={20} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="min-h-[80px] text-center max-w-md mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-2"
          >
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              {steps[step].desc}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex justify-center gap-1">
        {steps.map((_, i) => (
          <div 
            key={i} 
            className={`h-1 rounded-full transition-all duration-500 ${step === i ? 'w-8 bg-indigo-600' : 'w-2 bg-gray-200 dark:bg-gray-800'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PoSOverviewViz;
