import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Zap, Shield, BarChart3, FileText, Users, ArrowRight, CheckCircle, Sparkles, Brain, Target, TrendingUp, Play, ExternalLink, Star, Award, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Layout/Navbar';
import { BackgroundEffects } from '../components/UI/BackgroundEffects';
import { GlassCard } from '../components/UI/GlassCard';
import { AnimatedButton } from '../components/UI/AnimatedButton';

export const Landing: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced Gemini 2.0 Flash AI analyzes your code for patterns, smells, and technical debt with unprecedented accuracy.',
      color: 'from-blue-500 to-cyan-500',
      delay: 0.1
    },
    {
      icon: BarChart3,
      title: 'Comprehensive Reports',
      description: 'Get detailed PDF reports with debt scores, file-by-file analysis, and prioritized recommendations.',
      color: 'from-purple-500 to-pink-500',
      delay: 0.2
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your code is processed securely with enterprise-grade encryption. No data is stored permanently.',
      color: 'from-green-500 to-emerald-500',
      delay: 0.3
    },
    {
      icon: Target,
      title: 'Actionable Insights',
      description: 'Receive specific, actionable recommendations to improve code quality and reduce maintenance costs.',
      color: 'from-orange-500 to-red-500',
      delay: 0.4
    },
    {
      icon: Code2,
      title: 'Multi-Language Support',
      description: 'Supports JavaScript, TypeScript, Python, Java, C++, and many other popular programming languages.',
      color: 'from-indigo-500 to-purple-500',
      delay: 0.5
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Share reports with your team, track improvements over time, and maintain code quality standards.',
      color: 'from-teal-500 to-blue-500',
      delay: 0.6
    }
  ];

  const steps = [
    {
      step: '01',
      title: 'Upload Your Code',
      description: 'Drag and drop your project files or select them from your computer. We support all major programming languages.',
      icon: Code2,
      color: 'from-blue-600 to-purple-600'
    },
    {
      step: '02',
      title: 'AI Analysis',
      description: 'Our advanced AI analyzes your codebase for technical debt, code smells, security issues, and performance problems.',
      icon: Zap,
      color: 'from-purple-600 to-pink-600'
    },
    {
      step: '03',
      title: 'Get Your Report',
      description: 'Receive a comprehensive PDF report with debt scores, detailed findings, and actionable recommendations.',
      icon: FileText,
      color: 'from-pink-600 to-red-600'
    }
  ];

  const stats = [
    { label: 'Code Files Analyzed', value: '500+', icon: FileText, color: 'from-blue-500 to-cyan-500' },
    { label: 'Issues Detected', value: '200+', icon: Target, color: 'from-purple-500 to-pink-500' },
    { label: 'Happy Developers', value: '50+', icon: Users, color: 'from-green-500 to-emerald-500' },
    { label: 'Languages Supported', value: '15+', icon: Code2, color: 'from-orange-500 to-red-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900 transition-colors duration-500 relative overflow-hidden">
      <BackgroundEffects />
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-28 sm:pt-36 pb-20 sm:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Hero Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 backdrop-blur-sm border border-blue-200/30 dark:border-blue-800/30 rounded-full mb-8"
            >
              <div className="relative">
                <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-blue-400 rounded-full opacity-20 blur-sm"
                />
              </div>
              <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Powered by Walmart Innovation
              </span>
              <Award className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight px-4"
            >
              <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
                Professional
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                Tech Debt Analysis
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed px-4 font-medium"
            >
              Identify technical debt, code smells, and architectural issues in your codebase. 
              Get actionable insights powered by advanced AI analysis and comprehensive reports.
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16 px-4"
            >
              <Link to="/dashboard" className="w-full sm:w-auto">
                <AnimatedButton 
                  size="xl" 
                  icon={Rocket} 
                  className="w-full sm:w-auto text-lg font-bold shadow-2xl"
                  glow
                >
                  Start Free Analysis
                </AnimatedButton>
              </Link>
              
              <AnimatedButton 
                variant="secondary" 
                size="xl" 
                icon={Play} 
                className="w-full sm:w-auto text-lg font-bold"
              >
                Watch Demo
              </AnimatedButton>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto px-4"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                >
                  <GlassCard className="p-6 text-center hover:scale-105 transition-transform duration-300" glow>
                    <div className={`bg-gradient-to-r ${stat.color} p-3 rounded-2xl inline-block mb-4 shadow-lg`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600/10 to-pink-600/10 backdrop-blur-sm border border-purple-200/30 dark:border-purple-800/30 rounded-full mb-6">
              <Star className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                Comprehensive Analysis
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 px-4">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4 font-medium">
              Our AI-powered platform analyzes your codebase thoroughly to identify technical debt, 
              performance issues, and architectural problems.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: feature.delay, duration: 0.6 }}
              >
                <GlassCard className="p-8 h-full group" hover interactive>
                  <div className={`bg-gradient-to-r ${feature.color} p-4 rounded-3xl inline-block mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                    {feature.description}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 sm:py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600/10 to-emerald-600/10 backdrop-blur-sm border border-green-200/30 dark:border-green-800/30 rounded-full mb-6">
              <Zap className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                Simple Process
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 px-4">
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                How It Works
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4 font-medium">
              Get professional code analysis in three simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="text-center relative"
              >
                {/* Connection line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-20 left-full w-full h-1 bg-gradient-to-r from-blue-600/30 to-purple-600/30 transform -translate-x-1/2 z-0 rounded-full" />
                )}
                
                <GlassCard className="p-8 relative z-10 group" hover>
                  <div className="relative mb-6">
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`bg-gradient-to-r ${step.color} text-white text-2xl font-black w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl group-hover:shadow-glow transition-all duration-300`}
                    >
                      {step.step}
                    </motion.div>
                    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-3 rounded-2xl inline-block shadow-lg">
                      <step.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                    {step.description}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 backdrop-blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-blue-200/40 dark:border-blue-800/40 rounded-full mb-8">
              <Rocket className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                Ready to Start?
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 px-4">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Improve Your Code Quality
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto px-4 font-medium">
              Join thousands of developers who trust our platform to identify and fix technical debt. 
              Start your free analysis today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12 px-4">
              <Link to="/dashboard" className="w-full sm:w-auto">
                <AnimatedButton 
                  size="xl" 
                  icon={ArrowRight} 
                  className="w-full sm:w-auto text-lg font-bold shadow-2xl"
                  glow
                >
                  Start Free Analysis
                </AnimatedButton>
              </Link>
              
              <div className="flex flex-wrap items-center justify-center gap-6 text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium">Free to start</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium">Secure & private</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium">No credit card</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-16 border-t border-gray-200/30 dark:border-gray-700/30 bg-white/60 dark:bg-gray-900/60 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col lg:flex-row justify-between items-center gap-8"
          >
            {/* Developer Credits */}
            <div className="text-center lg:text-left">
              <p className="text-gray-600 dark:text-gray-400 mb-3 font-medium">
                Developed for{' '}
                <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Sparkathon by Walmart
                </span>
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 text-sm">
                <span className="text-gray-500 dark:text-gray-500 font-medium">by</span>
                <div className="flex items-center gap-4">
                  <motion.a
                    href="https://www.linkedin.com/in/yaswanthd/"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600/10 to-purple-600/10 hover:from-blue-600/20 hover:to-purple-600/20 backdrop-blur-sm border border-blue-200/30 dark:border-blue-800/30 rounded-xl transition-all duration-300 group shadow-md hover:shadow-lg"
                  >
                    <span className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      D. Yaswanth
                    </span>
                    <ExternalLink className="h-3 w-3 text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                  </motion.a>
                  
                  <span className="text-gray-400 dark:text-gray-600 font-bold">&</span>
                  
                  <motion.a
                    href="https://www.linkedin.com/in/sai-seshu/"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600/10 to-purple-600/10 hover:from-blue-600/20 hover:to-purple-600/20 backdrop-blur-sm border border-blue-200/30 dark:border-blue-800/30 rounded-xl transition-all duration-300 group shadow-md hover:shadow-lg"
                  >
                    <span className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      S. Seshu
                    </span>
                    <ExternalLink className="h-3 w-3 text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                  </motion.a>
                </div>
              </div>
            </div>

            {/* Walmart Logo */}
            <motion.a
              href="https://www.walmart.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-4 px-6 py-4 bg-gradient-to-r from-gray-900/5 to-gray-800/5 dark:from-white/5 dark:to-gray-100/5 hover:from-gray-900/10 hover:to-gray-800/10 dark:hover:from-white/10 dark:hover:to-gray-100/10 backdrop-blur-sm border border-gray-200/40 dark:border-gray-700/40 rounded-2xl transition-all duration-300 group shadow-lg hover:shadow-xl"
            >
              <div className="relative">
                <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-yellow-500/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg" />
              </div>
              <div className="text-left">
                <div className="text-base font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Powered by Walmart
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors font-medium">
                  Sparkathon Innovation
                </div>
              </div>
              <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
            </motion.a>
          </motion.div>

          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-12 pt-8 border-t border-gray-200/30 dark:border-gray-700/30 text-center"
          >
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              © {new Date().getFullYear()} TechDebt Analyzer. Built for developers, by developers.
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};