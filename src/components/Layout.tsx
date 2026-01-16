import React from 'react';
import Navbar from './Navbar';
import { Outlet, Link } from 'react-router-dom';
import { Github, Twitter, Cpu, Globe } from 'lucide-react';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-950 transition-colors duration-200">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Outlet />
      </main>
      <footer className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-gray-800 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-white" />
                </div>
                <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white">
                  Consensus<span className="text-blue-600 dark:text-blue-500">Viz</span>
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm text-sm leading-relaxed">
                An interactive educational platform designed to visualize and simplify complex 
                blockchain consensus mechanisms. Learn how decentralization works through live simulations.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Explore</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors">Home</Link></li>
                <li><Link to="/learn" className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors">Learning Path</Link></li>
                <li><Link to="/playground" className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors">Simulation Playground</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Connect</h3>
              <div className="flex space-x-4">
                <a href="#" className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all">
                  <Globe className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm text-slate-500 dark:text-slate-400">
            <p>© {new Date().getFullYear()} ConsensusViz. Built for educational purposes.</p>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
