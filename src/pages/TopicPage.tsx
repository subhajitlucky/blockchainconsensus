import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Lightbulb, Target, ChevronLeft, ChevronRight } from 'lucide-react';
import { topicContent } from '../data/content';
import MiningViz from '../components/visualizations/MiningViz';
import ConsensusIntroViz from '../components/visualizations/ConsensusIntroViz';
import LongestChainViz from '../components/visualizations/LongestChainViz';
import PoSViz from '../components/visualizations/PoSViz';
import FinalityViz from '../components/visualizations/FinalityViz';

const TopicPage: React.FC = () => {
  const { topicId } = useParams();
  const content = topicId ? topicContent[topicId] : null;

  const topicKeys = Object.keys(topicContent);
  const currentIndex = topicId ? topicKeys.indexOf(topicId) : -1;
  
  const prevTopicId = currentIndex > 0 ? topicKeys[currentIndex - 1] : null;
  const nextTopicId = currentIndex !== -1 && currentIndex < topicKeys.length - 1 ? topicKeys[currentIndex + 1] : null;
  
  const prevTopic = prevTopicId ? topicContent[prevTopicId] : null;
  const nextTopic = nextTopicId ? topicContent[nextTopicId] : null;

  const renderVisualization = () => {
    switch (topicId) {
      case 'why-consensus':
        return <ConsensusIntroViz />;
      case 'pow-mining':
        return <MiningViz />;
      case 'longest-chain':
        return <LongestChainViz />;
      case 'pos-staking':
        return <PoSViz />;
      case 'finality':
        return <FinalityViz />;
      default:
        return (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-gray-800 p-8 min-h-[400px] flex items-center justify-center">
             <p className="text-gray-500">Interactive Visualization for "{topicId}" is coming soon.</p>
          </div>
        );
    }
  };

  if (!content) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Topic not found</h2>
        <Link to="/learn" className="text-blue-600 hover:underline mt-4 inline-block">Return to Learning Path</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Link to="/learn" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 mb-8 transition-colors group">
        <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Learning Path
      </Link>
      
      <div className="space-y-8">
        <header className="space-y-4">
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            {content.title}
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
            {content.definition}
          </p>
        </header>

        <section className="bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500 p-5 rounded-r-xl">
          <div className="flex items-center gap-2 mb-2 text-blue-700 dark:text-blue-400">
            <Lightbulb className="w-4 h-4" />
            <h3 className="font-bold uppercase tracking-wider text-xs">The "Quirky" Analogy</h3>
          </div>
          <p className="italic text-sm sm:text-base text-gray-700 dark:text-gray-300">
            "{content.quirkyExample}"
          </p>
        </section>

        <div className="py-4">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-indigo-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Interactive Concept</h2>
          </div>
          {renderVisualization()}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <BookOpen className="w-4 h-4" />
              <h3 className="font-bold text-base">Key Takeaways</h3>
            </div>
            <ul className="space-y-3">
              {content.keyTakeaways.map((item, i) => (
                <li key={i} className="flex gap-3 text-gray-600 dark:text-gray-400">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex-shrink-0 flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Deep Dive</h3>
            <div className="prose dark:prose-invert text-gray-600 dark:text-gray-400 whitespace-pre-line text-sm leading-relaxed">
              {content.deepDive}
            </div>
          </section>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-8 border-t border-gray-200 dark:border-gray-800">
          {prevTopic ? (
            <Link
              to={`/learn/${prevTopic.id}`}
              className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all group w-full md:w-auto md:pr-8"
            >
              <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
              <div className="text-left">
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Previous</div>
                <div className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{prevTopic.title}</div>
              </div>
            </Link>
          ) : (
            <div /> 
          )}

          {nextTopic ? (
            <Link
              to={`/learn/${nextTopic.id}`}
              className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all group w-full md:w-auto md:pl-8 justify-end md:justify-start"
            >
              <div className="text-right">
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Next</div>
                <div className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{nextTopic.title}</div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
            </Link>
          ) : (
             <div />
          )}
        </div>
      </div>
    </div>
  );
};

export default TopicPage;
