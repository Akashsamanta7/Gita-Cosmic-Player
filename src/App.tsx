import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Sparkles } from 'lucide-react';
import { CosmicBackground } from './components/CosmicBackground';
import { GitaPlayer } from './components/GitaPlayer';

export default function App() {
  const [hasStarted, setHasStarted] = useState(false);

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-cosmic-dark selection:bg-gold/30 selection:text-gold">
      <CosmicBackground />
      
      <AnimatePresence mode="wait">
        {!hasStarted ? (
          <motion.div
            key="start-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-8 max-w-xl"
            >
              <div className="space-y-4">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gold/20 blur-3xl rounded-full animate-pulse" />
                    <Sparkles className="w-16 h-16 text-gold relative z-10" />
                  </div>
                </div>
                <h1 className="font-serif text-5xl md:text-7xl text-gold text-glow leading-tight">
                  Shrimad <br /> Bhagavad Gita
                </h1>
                <p className="text-white/60 font-serif italic text-xl md:text-2xl tracking-wide">
                  A Cosmic Journey Through Divine Wisdom
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setHasStarted(true)}
                className="group relative inline-flex items-center justify-center px-10 py-5 font-serif text-xl tracking-widest text-cosmic-dark bg-gold rounded-full overflow-hidden transition-all hover:shadow-[0_0_50px_rgba(212,175,55,0.4)]"
              >
                <span className="relative z-10 flex items-center">
                  BEGIN RECITATION
                  <Play className="ml-3 w-5 h-5 fill-current" />
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </motion.button>
              
              <p className="text-white/30 text-xs uppercase tracking-[0.3em] font-medium">
                Experience the eternal song of the divine
              </p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="player-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative z-10"
          >
            <GitaPlayer />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative elements */}
      <div className="fixed top-10 left-10 pointer-events-none opacity-20 hidden md:block">
        <div className="font-serif text-xs uppercase tracking-[0.5em] vertical-rl rotate-180">
          Eternal Wisdom • Cosmic Peace
        </div>
      </div>
      <div className="fixed bottom-10 right-10 pointer-events-none opacity-20 hidden md:block">
        <div className="font-serif text-xs uppercase tracking-[0.5em] vertical-rl">
          Dharma • Karma • Moksha
        </div>
      </div>
    </main>
  );
}
