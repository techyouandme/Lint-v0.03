import React from 'react';
import { motion } from 'framer-motion';

export const BackgroundEffects: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Main gradient orbs */}
      <motion.div
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -100, 50, 0],
          scale: [1, 1.3, 0.8, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 via-purple-400/15 to-cyan-400/20 rounded-full blur-3xl"
      />
      
      <motion.div
        animate={{
          x: [0, -120, 80, 0],
          y: [0, 120, -80, 0],
          scale: [1, 0.7, 1.2, 1],
          rotate: [0, -180, -360],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5
        }}
        className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/20 via-pink-400/15 to-indigo-400/20 rounded-full blur-3xl"
      />

      <motion.div
        animate={{
          x: [0, 60, -40, 0],
          y: [0, -60, 40, 0],
          scale: [1, 1.1, 0.9, 1],
          rotate: [0, 90, 180, 270, 360],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 10
        }}
        className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-cyan-400/20 via-blue-400/15 to-teal-400/20 rounded-full blur-3xl"
      />

      {/* Secondary smaller orbs */}
      <motion.div
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -40, 20, 0],
          scale: [1, 1.2, 0.8, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 15
        }}
        className="absolute top-1/6 right-1/6 w-48 h-48 bg-gradient-to-r from-emerald-400/15 via-green-400/10 to-lime-400/15 rounded-full blur-2xl"
      />

      <motion.div
        animate={{
          x: [0, -30, 15, 0],
          y: [0, 30, -15, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 8
        }}
        className="absolute bottom-1/6 left-1/6 w-56 h-56 bg-gradient-to-r from-rose-400/15 via-pink-400/10 to-fuchsia-400/15 rounded-full blur-2xl"
      />

      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -150, 0],
            x: [0, Math.random() * 100 - 50, 0],
            opacity: [0, 0.6, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: Math.random() * 15 + 10,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: "easeInOut"
          }}
          className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}

      {/* Micro particles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={`micro-${i}`}
          animate={{
            y: [0, -80, 0],
            opacity: [0, 0.4, 0],
          }}
          transition={{
            duration: Math.random() * 8 + 5,
            repeat: Infinity,
            delay: Math.random() * 8,
            ease: "linear"
          }}
          className="absolute w-1 h-1 bg-blue-400/40 dark:bg-blue-300/60 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      
      {/* Subtle dot pattern */}
      <div className="absolute inset-0 bg-dot-pattern opacity-20" />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-white/10 dark:to-black/20" />
    </div>
  );
};