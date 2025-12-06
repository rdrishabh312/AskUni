'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowUp,
  Sparkles,
  BookOpen,
  Calendar,
  Users,
  GraduationCap
} from 'lucide-react';

export default function Home() {
  const [inputFocus, setInputFocus] = useState(false);

  const quickActions = [
    { label: "Course Information", icon: BookOpen },
    { label: "Admissions Help", icon: Users },
    { label: "Deadline Tracker", icon: Calendar },
    { label: "Campus Events", icon: Sparkles }
  ];

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="max-w-[900px] w-full">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-3 mb-16"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 flex items-center justify-center">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">AskUni</span>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-4 leading-tight">
            Let&apos;s make your dream a{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500">
              reality.
            </span>
          </h1>
          <p className="text-gray-700 text-lg md:text-xl">
            AskUni is your AI university assistant. Get instant answers about courses, admissions, and campus life.
          </p>
        </motion.div>

        {/* Input Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className={`glass-input rounded-3xl p-2 transition-all ${inputFocus ? 'ring-2 ring-orange-400' : ''}`}>
            <div className="flex items-center gap-3 px-4 py-3">
              <input
                type="text"
                placeholder="What do you want to know?"
                className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-500 text-lg"
                onFocus={() => setInputFocus(true)}
                onBlur={() => setInputFocus(false)}
              />
              <Link
                href="/chat"
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-lg"
              >
                <ArrowUp className="w-6 h-6 text-white" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <p className="text-gray-700 text-sm mb-4 font-medium">Not sure where to start? Try one of these:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {quickActions.map((action, i) => (
              <Link
                key={i}
                href="/chat"
                className="px-6 py-2.5 rounded-full bg-white/60 hover:bg-white/80 backdrop-blur-sm border border-white/40 text-gray-700 text-sm font-medium transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-sm"
              >
                <action.icon className="w-4 h-4" />
                {action.label}
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Bottom Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-16 flex items-center justify-center gap-6 text-sm"
        >
          <Link href="/about" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
            About
          </Link>
          <Link href="/contact" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
            Contact
          </Link>
          <Link href="/login" className="px-6 py-2 rounded-full bg-white/60 hover:bg-white/80 backdrop-blur-sm border border-white/40 text-gray-700 font-medium transition-all hover:scale-105">
            Sign In
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
