'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'reading', label: 'Lectura', icon: '✦' },
  { id: 'library', label: 'Biblioteca', icon: '📚' },
  { id: 'about', label: 'Acerca de', icon: '🔮' },
];

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="w-full glass sticky top-0 z-40 mb-8">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="text-3xl">🌙</span>
            <div>
              <h1 className="font-serif text-xl font-bold gold-accent">
                Tarot Místico
              </h1>
              <p className="text-xs text-gray-400 hidden sm:block">
                Lecturas con Inteligencia Artificial
              </p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'bg-purple-500/30 text-purple-200'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <motion.span
              animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
              className="text-2xl"
            >
              {isMobileMenuOpen ? '✕' : '☰'}
            </motion.span>
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden mt-4 pt-4 border-t border-white/10"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="flex flex-col space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      onTabChange(tab.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`px-4 py-3 rounded-lg transition-all duration-300 flex items-center space-x-3 ${
                      activeTab === tab.id
                        ? 'bg-purple-500/30 text-purple-200'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
