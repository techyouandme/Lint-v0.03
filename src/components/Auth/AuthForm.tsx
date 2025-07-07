import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Mail, Lock, Eye, EyeOff, AlertCircle, Code2, Sparkles, Shield, Zap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { BackgroundEffects } from '../UI/BackgroundEffects';
import { GlassCard } from '../UI/GlassCard';
import { AnimatedButton } from '../UI/AnimatedButton';

export const AuthForm: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signInWithGitHub, signInWithEmail, signUpWithEmail } = useAuth();

  const handleGitHubSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithGitHub();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with GitHub');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
        setError('Check your email for a confirmation link!');
      } else {
        await signInWithEmail(email, password);
      }
    } catch (err: any) {
      setError(err.message || `Failed to ${isSignUp ? 'sign up' : 'sign in'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900 flex items-center justify-center p-4 transition-colors duration-500 relative overflow-hidden">
      <BackgroundEffects />
      
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <GlassCard className="p-8" gradient glow>
          <div className="text-center mb-8">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, duration: 0.8, type: "spring", stiffness: 200 }}
              className="relative inline-block mb-6"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl blur-2xl opacity-40 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-5 rounded-3xl shadow-2xl">
                <Code2 className="h-12 w-12 text-white" />
              </div>
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute -top-2 -right-2"
              >
                <div className="bg-yellow-400 p-1.5 rounded-full shadow-lg">
                  <Sparkles className="h-4 w-4 text-yellow-900" />
                </div>
              </motion.div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-3xl font-black bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2"
            >
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-gray-600 dark:text-gray-400 font-medium"
            >
              {isSignUp ? 'Start analyzing your code today' : 'Sign in to continue your analysis'}
            </motion.p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50/90 dark:bg-red-900/30 border border-red-200/60 dark:border-red-800/60 rounded-2xl flex items-center space-x-3 text-red-700 dark:text-red-400 text-sm backdrop-blur-sm shadow-lg"
            >
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span className="font-medium">{error}</span>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <AnimatedButton
              onClick={handleGitHubSignIn}
              disabled={loading}
              variant="secondary"
              className="w-full mb-6 bg-gray-900/90 dark:bg-gray-800/90 text-white hover:bg-gray-800/90 dark:hover:bg-gray-700/90 border-0 shadow-xl font-bold"
              icon={Github}
              size="lg"
            >
              Continue with GitHub
            </AnimatedButton>
          </motion.div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300/60 dark:border-gray-600/60" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-6 py-2 bg-white/90 dark:bg-gray-900/90 text-gray-500 dark:text-gray-400 backdrop-blur-sm rounded-full font-semibold shadow-md">
                Or continue with email
              </span>
            </div>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            onSubmit={handleEmailAuth}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-300/60 dark:border-gray-600/60 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 font-medium shadow-md hover:shadow-lg"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-12 pr-12 py-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-300/60 dark:border-gray-600/60 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 font-medium shadow-md hover:shadow-lg"
                  placeholder="Enter your password"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-lg"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </motion.button>
              </div>
            </div>

            <AnimatedButton
              type="submit"
              disabled={loading}
              className="w-full font-bold shadow-xl"
              size="lg"
              loading={loading}
              icon={loading ? undefined : (isSignUp ? Shield : Zap)}
              glow
            >
              {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
            </AnimatedButton>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-8 text-center"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-bold"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </motion.button>
          </motion.div>
        </GlassCard>
      </motion.div>
    </div>
  );
};