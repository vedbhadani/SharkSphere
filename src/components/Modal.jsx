import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

const Modal = ({ isOpen, onClose, children, title }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="glass-strong border border-white/10 rounded-3xl p-0 max-w-2xl w-full shadow-[0_0_50px_-12px_rgba(0,0,0,0.8)] max-h-[90vh] overflow-hidden flex flex-col pointer-events-auto relative"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-neon/40 to-transparent" />

              {title && (
                <div className="flex items-center justify-between p-6 sm:p-8 border-b border-white/5 bg-white/[0.01]">
                  <h2 className="text-xl sm:text-2xl font-black text-text-heading tracking-tight">{title}</h2>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-xl text-text-muted hover:text-white hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
                    aria-label="Close"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;

