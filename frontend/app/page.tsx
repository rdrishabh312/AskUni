'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  MessageSquare,
  Zap,
  Globe,
  Shield,
  Clock,
  Sparkles,
  GraduationCap,
  Search,
  BookOpen,
  ArrowRight,
  Heart
} from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: <Clock className="w-6 h-6" />,
      title: "24/7 Availability",
      description: "Get answers anytime, anywhere. AskUni is always ready to help."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Responses",
      description: "No waiting. Get immediate answers to all your university questions."
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Web-Powered",
      description: "Access up-to-date information from university websites and resources."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Accurate & Reliable",
      description: "AI-driven responses with source citations for trustworthy information."
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: "Smart Search",
      description: "Find courses, deadlines, events filtered by department instantly."
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Personalized",
      description: "Customized responses tailored to your university's communication style."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="glass-card mx-4 mt-4 !rounded-2xl">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-white to-primary-300 bg-clip-text text-transparent">
                  AskUni
                </span>
              </div>

              <div className="flex items-center gap-4">
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors hidden md:block">About</Link>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors hidden md:block">Contact</Link>
                <Link href="/login" className="btn-secondary text-sm py-2 px-6">
                  Sign In
                </Link>
                <Link href="/login" className="btn-primary text-sm py-2 px-6">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              AI-Powered University Assistant
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            Your Smart Guide to
            <span className="bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              {" "}University Life
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto"
          >
            Get instant answers about courses, admissions, deadlines, and campus events.
            Powered by AI with real-time web access for accurate information.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/login" className="btn-primary text-lg py-4 px-8 flex items-center justify-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Start Chatting
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/about" className="btn-secondary text-lg py-4 px-8 flex items-center justify-center gap-2">
              <BookOpen className="w-5 h-5" />
              Learn More
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Demo Preview */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass-card p-2 overflow-hidden"
          >
            <div className="bg-dark-950/80 rounded-2xl p-6">
              {/* Mock Chat Interface */}
              <div className="flex items-center gap-3 pb-4 border-b border-white/10 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold">AskUni Chat</span>
                <div className="ml-auto flex items-center gap-2 text-sm text-green-400">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  Online
                </div>
              </div>

              {/* Messages */}
              <div className="space-y-4">
                <div className="message message-user ml-auto !max-w-[80%]">
                  <p className="text-white/90">What are the admission deadlines for Computer Science?</p>
                </div>

                <div className="message message-assistant">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white/90 mb-3">
                        Here are the upcoming admission deadlines for Computer Science:
                      </p>
                      <ul className="list-disc list-inside text-white/80 space-y-1 mb-3">
                        <li>Early Application: <strong>December 15, 2024</strong></li>
                        <li>Regular Decision: <strong>January 31, 2025</strong></li>
                        <li>Late Application: <strong>March 15, 2025</strong></li>
                      </ul>
                      <div className="flex gap-2 flex-wrap">
                        <span className="source-card !p-2 !rounded-lg text-xs">
                          📎 admissions.university.edu
                        </span>
                        <span className="source-card !p-2 !rounded-lg text-xs">
                          📎 cs.department.edu
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mock Input */}
              <div className="mt-6 relative">
                <input
                  type="text"
                  placeholder="Ask anything about your university..."
                  className="chat-input"
                  disabled
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Why Choose <span className="text-primary-400">AskUni</span>?
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Experience the future of university information access with our AI-powered assistant.
            </p>
          </motion.div>

          <div className="feature-grid">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card glass-card-hover p-6"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center mb-4 text-primary-400">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="glass-card p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 via-accent-600/20 to-primary-600/20 animate-gradient bg-[length:200%_auto]" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of students who are already using AskUni to navigate their university journey.
              </p>
              <Link href="/login" className="btn-primary text-lg py-4 px-10 inline-flex items-center gap-2">
                Sign in with Google
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold">AskUni</span>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <Link href="/about" className="text-gray-400 hover:text-white transition-colors">About</Link>
              <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link>
              <Link href="/chat" className="text-gray-400 hover:text-white transition-colors">Chat</Link>
            </div>

            <p className="text-gray-500 text-sm flex items-center gap-2">
              Created with <Heart className="w-4 h-4 text-red-400" /> by{' '}
              <span className="font-semibold text-gray-400">rdrishabh312</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
