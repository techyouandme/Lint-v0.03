import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
  glow?: boolean;
  interactive?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  hover = true,
  gradient = false,
  glow = false,
  interactive = false
}) => {
  const baseClasses = `
    relative backdrop-blur-2xl 
    ${gradient 
      ? 'bg-gradient-to-br from-white/95 via-white/90 to-white/85 dark:from-gray-900/95 dark:via-gray-900/90 dark:to-gray-900/85' 
      : 'bg-white/90 dark:bg-gray-900/90'
    }
    border border-white/40 dark:border-gray-700/40 
    rounded-3xl shadow-xl hover:shadow-2xl 
    transition-all duration-500 ease-out
    ${glow ? 'shadow-glow dark:shadow-glow' : ''}
    ${interactive ? 'cursor-pointer' : ''}
    ${className}
  `;

  const hoverAnimation = hover ? { 
    y: -8, 
    scale: 1.02,
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
  } : {};

  return (
    <motion.div
      whileHover={hoverAnimation}
      whileTap={interactive ? { scale: 0.98 } : {}}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        duration: 0.3 
      }}
      className={baseClasses}
    >
      {/* Subtle inner glow */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/30 via-transparent to-transparent dark:from-white/10 pointer-events-none" />
      
      {/* Border highlight */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-20">
        {children}
      </div>

      {/* Shimmer effect on hover */}
      {interactive && (
        <motion.div
          className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0"
          whileHover={{
            opacity: [0, 1, 0],
            x: ['-100%', '100%']
          }}
          transition={{ duration: 0.8 }}
        />
      )}
    </motion.div>
  );
};