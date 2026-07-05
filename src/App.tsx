import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Volume2, VolumeX, Sparkles, Bug } from 'lucide-react';
import { BackgroundParticles } from './components/BackgroundParticles';
import { Envelope } from './components/Envelope';
import { romanticSynth } from './lib/synth';
import patoImg from './assets/images/pato_con_flores_1783236644429.jpg';
import polillaImg from './assets/images/polilla_bonita_1783237750742.jpg';




export default function App() {
  const [isOpened, setIsOpened] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [heartScale, setHeartScale] = useState(1);

  // Sync mute state with our procedural synthesizer
  useEffect(() => {
    if (isOpened) {
      romanticSynth.toggle(!isMuted);
    }
  }, [isMuted, isOpened]);

  // Clean up synth when component unmounts
  useEffect(() => {
    return () => {
      romanticSynth.stop();
    };
  }, []);

  const handleOpenEnvelope = () => {
    setIsOpened(true);
    romanticSynth.start();
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="relative min-h-screen w-full text-[#F5F5F0] flex flex-col justify-between overflow-x-hidden romantic-gradient selection:bg-[#E07A7A]/20 selection:text-[#F5F5F0]">
      
      {/* 1. Magical Background Canvas Particles */}
      <BackgroundParticles interactive={isOpened} />

      {/* 2. Top Header (Mute Button & Sparkle Accents) */}
      <header className="w-full max-w-7xl mx-auto px-6 py-4 flex justify-between items-center z-50">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          className="flex items-center gap-1.5"
        >
          <Bug className="w-3.5 h-3.5 text-[#E07A7A]" />
          <span className="font-serif italic text-xs tracking-wider text-[#F5F5F0]/80">
            sorpresaaaa
          </span>
        </motion.div>

        {isOpened && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={toggleMute}
            className="flex items-center justify-center p-2.5 rounded-full bg-neutral-900/60 backdrop-blur-md border border-[#E07A7A]/15 text-[#F5F5F0]/80 hover:text-white hover:bg-neutral-800/80 hover:border-[#E07A7A]/35 transition-all shadow-lg cursor-pointer"
            aria-label={isMuted ? 'Activar música' : 'Silenciar música'}
            title={isMuted ? 'Activar música' : 'Silenciar música'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-[#E07A7A]" /> : <Volume2 className="w-4 h-4 text-rose-300 animate-pulse" />}
          </motion.button>
        )}
      </header>

      {/* 3. Main Center Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 z-10 w-full max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {!isOpened ? (
            /* ENVELOPE OPENING STAGE */
            <motion.div
              key="envelope-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, transition: { duration: 0.5 } }}
              className="w-full flex flex-col items-center justify-center"
            >
              <Envelope onOpen={handleOpenEnvelope} />
            </motion.div>
          ) : (
            /* REVEALED CARD STAGE */
            <motion.div
              key="card-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full flex flex-col items-center space-y-8 py-4"
            >
              {/* Header Text & Heart */}
              <div className="text-center space-y-2 max-w-xl">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="flex flex-col items-center justify-center"
                >
                  <h1 className="font-serif italic text-3xl sm:text-4xl md:text-5xl text-[#F5F5F0] tracking-tight text-glow select-none text-center">
                    “Flores para ti por bonita”
                  </h1>
                </motion.div>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  transition={{ delay: 0.4 }}
                  className="text-[10px] tracking-widest font-sans uppercase text-neutral-400"
                >
                  Un regalo para ti Isa con cariño
                </motion.p>
              </div>

              {/* Central Flower Bouquet & Adorable Duck Panel */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 1.0, ease: 'easeOut' }}
                className="relative group w-full max-w-sm"
              >
                {/* Dreamy glass/neon framing backing */}
                <div className="absolute -inset-1.5 bg-gradient-to-tr from-[#E07A7A]/10 via-sky-500/10 to-amber-500/15 rounded-3xl blur-2xl opacity-60 group-hover:opacity-85 transition duration-1000" />
                
                {/* Card Container */}
                <div className="relative rounded-3xl border border-[#E07A7A]/15 bg-neutral-950 p-4 shadow-3xl overflow-hidden card-glow flex flex-col items-center">
                  
                  {/* Subtle sparkle indicators */}
                  <div className="absolute top-4 left-4 text-amber-300/30">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                  </div>
                  <div className="absolute bottom-4 right-4 text-sky-300/30">
                    <Sparkles className="w-4 h-4 animate-pulse" style={{ animationDelay: '0.8s' }} />
                  </div>

                  {/* Duck delivering Bouquet Image */}
                  <motion.div
                    animate={{
                      y: [0, -6, 0],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 4,
                      ease: 'easeInOut',
                    }}
                    className="w-full aspect-square rounded-2xl overflow-hidden shadow-inner border border-neutral-900"
                  >
                    <img
                      src="/src/assets/images/pato_con_flores_1783236644429.jpg"
                      alt="Un adorable patito entregando un hermoso ramo de peonías blancas, hortensias azules y rosas blancas"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover select-none pointer-events-none transform hover:scale-105 transition-transform duration-700"
                    />
                  </motion.div>

                  {/* Bouquet Tags / Legend overlaying slightly */}
                  <div className="mt-4 flex flex-wrap gap-2 justify-center">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-sans tracking-wide bg-amber-500/5 text-amber-200/90 border border-amber-500/20">
                      Peonías Blancas 🌸
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-sans tracking-wide bg-sky-500/5 text-sky-200/90 border border-sky-500/20">
                      Hortensias Azules 🪻
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-sans tracking-wide bg-neutral-500/10 text-neutral-200/90 border border-neutral-500/20">
                      Rosas Blancas 🤍
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* 4. Elegant customizable Polilla scroll */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 1.0 }}
                className="text-center space-y-2 max-w-xl pt-6"
              >
                <p className="font-serif italic text-lg sm:text-xl md:text-2xl text-[#F5F5F0] tracking-tight text-glow select-none px-4">
                  Mira una polilla bonita casi tan bonita como tu Isa 🤍
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 1.0, ease: 'easeOut' }}
                className="relative group w-full max-w-sm pb-8"
              >
                {/* Dreamy glass/neon framing backing */}
                <div className="absolute -inset-1.5 bg-gradient-to-tr from-[#E07A7A]/10 via-amber-500/10 to-rose-500/15 rounded-3xl blur-2xl opacity-60 group-hover:opacity-85 transition duration-1000" />
                
                {/* Card Container */}
                <div className="relative rounded-3xl border border-[#E07A7A]/15 bg-neutral-950 p-4 shadow-3xl overflow-hidden card-glow flex flex-col items-center">
                  
                  {/* Subtle sparkle indicators */}
                  <div className="absolute top-4 right-4 text-pink-300/30">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                  </div>

                  {/* Moth Image */}
                  <motion.div
                    animate={{
                      y: [0, 6, 0],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 4.5,
                      ease: 'easeInOut',
                    }}
                    className="w-full aspect-square rounded-2xl overflow-hidden shadow-inner border border-neutral-900"
                  >
                    <img
                      src="/src/assets/images/polilla_bonita_1783237750742.jpg"
                      alt="Una hermosa polilla rosa y amarilla"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover select-none pointer-events-none transform hover:scale-105 transition-transform duration-700"
                    />
                  </motion.div>


                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 6. Page Footer */}
      <footer className="w-full text-center py-6 px-4 z-10 border-t border-neutral-900/30">
        <div className="w-12 h-[1px] bg-[#E07A7A]/40 mx-auto" />
      </footer>
    </div>
  );
}

