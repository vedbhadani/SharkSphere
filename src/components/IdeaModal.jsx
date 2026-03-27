import { motion, AnimatePresence } from 'framer-motion';
import { X, Lightbulb } from 'lucide-react';
import Button from './Button.jsx';
import StructuredBrief from './StructuredBrief';

const IdeaModal = ({ idea, isOpen, onClose }) => {
  if (!idea) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="glass-strong border border-white/10 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-[0_0_50px_-12px_rgba(0,0,0,0.8)] mx-4 relative">
              {/* Decorative Accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-neon/40 to-transparent" />

              {/* Header */}
              <div className="flex items-start justify-between p-6 sm:p-8 border-b border-white/5 bg-white/[0.01] relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none opacity-20">
                  <div className="bg-dots-soft" />
                </div>

                <div className="flex-1 pr-4 min-w-0 relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-neon/60 bg-purple-neon/5 px-2 py-0.5 rounded border border-purple-neon/10">
                      Idea Dossier
                    </span>
                    {idea.stage && (
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-widest flex items-center gap-1.5 shadow-[0_0_15px_-3px] transition-all duration-300 ${idea.stage === 'REVENUE'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30 shadow-green-500/20' :
                        idea.stage === 'PROTOTYPE'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-blue-500/20' :
                          'bg-purple-500/20 text-purple-400 border border-purple-500/30 shadow-purple-500/20'
                        }`}>
                        <span className={`w-1 h-1 rounded-full animate-pulse ${idea.stage === 'REVENUE' ? 'bg-green-400' :
                          idea.stage === 'PROTOTYPE' ? 'bg-blue-400' : 'bg-purple-400'
                          }`} />
                        {idea.stage}
                      </span>
                    )}
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-text-heading mb-4 tracking-tight leading-tight">
                    {idea.title}
                  </h2>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-neon to-purple-600 flex items-center justify-center text-white text-sm font-black shadow-[0_0_20px_rgba(123,95,255,0.3)]">
                        {idea.author.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-text-heading">{idea.author.name}</span>
                        <span className="text-[10px] text-text-muted font-mono uppercase tracking-wider">Contributor</span>
                      </div>
                    </div>
                    <div className="h-8 w-px bg-white/5" />
                    <div className="flex flex-col">
                      <span className="text-[10px] text-text-muted font-mono uppercase tracking-wider">Date Filed</span>
                      <span className="text-xs font-medium text-text-muted/80">
                        {new Date(idea.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-text-muted hover:text-white hover:bg-white/5 transition-all duration-200 relative z-10 border border-transparent hover:border-white/10"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
                <div className="space-y-8">
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-neon shadow-[0_0_8px_rgba(123,95,255,1)]" />
                      <h3 className="text-xs font-black text-purple-neon uppercase tracking-[0.2em]">
                        Strategic Brief
                      </h3>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 sm:p-6 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                        <Lightbulb className="w-24 h-24" />
                      </div>
                      <StructuredBrief content={idea.description} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col justify-center items-center text-center">
                      <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.1em] mb-1">
                        Community Backing
                      </div>
                      <div className="text-2xl font-black text-purple-neon">
                        {idea.votes?.upvotes || 0}
                      </div>
                      <div className="text-[9px] text-text-muted/60 font-medium">Positive Signals</div>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col justify-center items-center text-center">
                      <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.1em] mb-1">
                        Engagement Velocity
                      </div>
                      <div className="text-2xl font-black text-text-heading">
                        {idea.votes?.total || 0}
                      </div>
                      <div className="text-[9px] text-text-muted/60 font-medium">Accumulated Votes</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 sm:p-8 border-t border-white/5 bg-white/[0.01]">
                <button
                  onClick={onClose}
                  className="w-full py-4 rounded-xl bg-white/5 hover:bg-white/10 text-text-heading font-black uppercase tracking-[0.2em] text-xs transition-all border border-white/5 hover:border-white/10 active:scale-[0.98] shadow-lg"
                >
                  Close Archive
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default IdeaModal;

