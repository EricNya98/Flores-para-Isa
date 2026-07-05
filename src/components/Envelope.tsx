import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, MailOpen } from 'lucide-react';
import { romanticSynth } from '../lib/synth';

interface EnvelopeProps {
  onOpen: () => void;
}

export const Envelope: React.FC<EnvelopeProps> = ({ onOpen }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const handleOpen = () => {
    if (isOpening) return;
    setIsOpening(true);
    romanticSynth.playSealBreak();
    
    // Allow the seal break animation and flap lift to finish before transitioning
    setTimeout(() => {
      onOpen();
    }, 1800);
  };

  return (
    <div id="envelope-container" className="relative flex flex-col items-center justify-center min-h-[400px] w-full max-w-md mx-auto p-4 z-10">
      <AnimatePresence>
        {!isOpening && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.9, transition: { duration: 0.8, ease: 'easeInOut' } }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative w-full aspect-[4/3] bg-neutral-900 rounded-2xl border border-neutral-800 shadow-2xl p-1 flex flex-col justify-between overflow-hidden cursor-pointer"
            onClick={handleOpen}
          >
            {/* Background envelope design / lining */}
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950" />

            {/* Diagonal lines to represent envelope flaps */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              {/* Left fold */}
              <line x1="0" y1="100%" x2="50%" y2="60%" stroke="#222" strokeWidth="2" />
              {/* Right fold */}
              <line x1="100%" y1="100%" x2="50%" y2="60%" stroke="#222" strokeWidth="2" />
              {/* Bottom fold shading */}
              <polygon points="0,100% 50%,60% 100%,100%" fill="rgba(10, 10, 12, 0.4)" />
            </svg>

            {/* Envelope flap folded down */}
            <motion.div 
              className="absolute top-0 left-0 right-0 h-[60%] bg-neutral-900 border-b border-neutral-800 origin-top z-10 shadow-lg"
              style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
              animate={isHovered ? { rotateX: 5 } : { rotateX: 0 }}
              transition={{ duration: 0.3 }}
            />

            {/* Glowing Aura around wax seal */}
            <div className="absolute top-[60%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-24 h-24 bg-[#E07A7A]/15 blur-xl rounded-full z-15" />

            {/* Heart Seal (Wax Seal) */}
            <motion.div
              className="absolute top-[60%] left-[50%] -translate-x-[50%] -translate-y-[50%] z-20 flex flex-col items-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#E07A7A] via-[#C95B5B] to-[#AD4343] flex items-center justify-center shadow-xl border-2 border-white/20">
                {/* Decorative silver/white ring inside seal */}
                <div className="absolute inset-1 rounded-full border border-dashed border-white/30" />
                
                {/* Heart icon in the center - pure white */}
                <Heart className="w-6 h-6 text-white fill-white drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
              </div>
              <motion.span 
                className="mt-2 text-xs font-serif tracking-widest text-white/80 uppercase font-light"
                animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0.6, y: -2 }}
              >
                Abrir
              </motion.span>
            </motion.div>

            {/* Front invitation text */}
            <div className="absolute top-[25%] inset-x-0 text-center z-10 px-4">
              <span className="font-cursive text-3xl text-[#E07A7A] block text-glow">
                Abrir sorpresa
              </span>
              <span className="font-sans text-[10px] tracking-widest text-neutral-500 block uppercase mt-1">
                Haz clic en el sello para abrir
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Opening Animation Sequence */}
      <AnimatePresence>
        {isOpening && (
          <div className="absolute inset-0 flex items-center justify-center w-full aspect-[4/3] z-10 pointer-events-none">
            {/* The base envelope opening */}
            <motion.div
              initial={{ scale: 1, y: 0, opacity: 1 }}
              animate={{ 
                scale: [1, 1.05, 0.9], 
                y: [0, -10, 200], 
                opacity: [1, 1, 0] 
              }}
              transition={{ duration: 1.8, ease: 'easeInOut' }}
              className="relative w-full h-full bg-neutral-900 rounded-2xl border border-neutral-800 shadow-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-neutral-900" />
              
              {/* Back Flap lifting up (3D Rotation) */}
              <motion.div 
                className="absolute top-0 left-0 right-0 h-[60%] bg-neutral-950 border-b border-neutral-800 origin-top z-10"
                style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
                initial={{ rotateX: 0 }}
                animate={{ rotateX: 180, y: -10 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />

              {/* Slit opening back panel */}
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <line x1="0" y1="100%" x2="50%" y2="60%" stroke="#111" strokeWidth="3" />
                <line x1="100%" y1="100%" x2="50%" y2="60%" stroke="#111" strokeWidth="3" />
              </svg>

              {/* Broken Seal splitting */}
              <motion.div
                className="absolute top-[60%] left-[50%] -translate-x-[50%] -translate-y-[50%] z-20 flex"
                initial={{ scale: 1 }}
                animate={{ scale: 0, opacity: 0, rotate: 45 }}
                transition={{ duration: 0.6 }}
              >
                <div className="w-16 h-16 rounded-full bg-[#E07A7A] flex items-center justify-center shadow-2xl border border-white/30">
                  <Heart className="w-6 h-6 text-white fill-white" />
                </div>
              </motion.div>

              {/* The letter sliding UPWARD first */}
              <motion.div
                initial={{ y: 50, scale: 0.8, opacity: 0 }}
                animate={{ y: -80, scale: 0.95, opacity: 1 }}
                transition={{ delay: 0.5, duration: 1.0, ease: 'easeOut' }}
                className="absolute inset-x-8 bottom-4 top-20 bg-neutral-950 border border-[#E07A7A]/15 rounded-t-lg p-4 flex flex-col items-center justify-center"
              >
                <MailOpen className="w-10 h-10 text-[#E07A7A] animate-bounce mb-2" />
                <span className="font-cursive text-xl text-rose-100">Cargando tu detalle...</span>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
