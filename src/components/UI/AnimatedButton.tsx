import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  type?: 'button' | 'submit';
  glow?: boolean;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  className = '',
  type = 'button',
  glow = false
}) => {
  const baseClasses = "relative inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group";
  
  const variants = {
    primary: `text-white bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 focus:ring-blue-500/50 shadow-lg hover:shadow-xl ${glow ? 'shadow-glow' : ''}`,
    secondary: `text-gray-700 dark:text-gray-200 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/60 hover:bg-white/90 dark:hover:bg-gray-800/90 hover:border-gray-300/80 dark:hover:border-gray-600/80 focus:ring-gray-500/50 shadow-md hover:shadow-lg`,
    ghost: `text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-gray-900 dark:hover:text-white focus:ring-gray-500/50`,
    danger: `text-white bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 hover:from-red-700 hover:via-rose-700 hover:to-pink-700 focus:ring-red-500/50 shadow-lg hover:shadow-xl`,
    success: `text-white bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 focus:ring-emerald-500/50 shadow-lg hover:shadow-xl`
  };

  const sizes = {
    sm: "px-4 py-2 text-sm space-x-2 min-h-[36px]",
    md: "px-6 py-3 text-sm space-x-2 min-h-[44px]",
    lg: "px-8 py-4 text-base space-x-3 min-h-[52px]",
    xl: "px-10 py-5 text-lg space-x-3 min-h-[60px]"
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-4 w-4",
    lg: "h-5 w-5",
    xl: "h-6 w-6"
  };

  return (
    <motion.button
      whileHover={{ 
        scale: 1.02,
        y: -2
      }}
      whileTap={{ 
        scale: 0.98,
        y: 0
      }}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {/* Shimmer effect for primary and gradient buttons */}
      {(variant === 'primary' || variant === 'danger' || variant === 'success') && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6 }}
        />
      )}

      {/* Glow effect */}
      {glow && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
      )}
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center space-x-2">
        {loading ? (
          <div className={`animate-spin rounded-full border-2 border-current border-t-transparent ${iconSizes[size]}`} />
        ) : (
          <>
            {Icon && iconPosition === 'left' && <Icon className={iconSizes[size]} />}
            <span className="font-medium">{children}</span>
            {Icon && iconPosition === 'right' && <Icon className={iconSizes[size]} />}
          </>
        )}
      </div>

      {/* Ripple effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        initial={{ scale: 0, opacity: 0.5 }}
        whileTap={{ scale: 1, opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: variant === 'primary' || variant === 'danger' || variant === 'success' 
            ? 'rgba(255, 255, 255, 0.3)' 
            : 'rgba(0, 0, 0, 0.1)'
        }}
      />
    </motion.button>
  );
};