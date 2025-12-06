'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    GraduationCap,
    Sparkles,
    Clock,
    Globe,
    Zap,
    Shield,
    Settings,
    MessageSquare,
    ArrowRight,
    Bot,
    Filter,
    Menu,
    X
} from 'lucide-react';
import { useState } from 'react';

export default function HomePage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const benefits = [
        {
            icon: Clock,
            title: "No Waiting Time",
            description: "Unlike call or in-person inquiries, AskUni provides instant responses"
        },
        {
            icon: Globe,
            title: "Available Anytime",
            description: "Works 24/7, making information accessible beyond college hours"
        },
        {
            icon: MessageSquare,
            title: "More Interactive",
            description: "Uses AI-driven conversations instead of static web pages"
        },
        {
            icon: Shield,
            title: "Consistent Accuracy",
            description: "Eliminates human error in responses, ensuring reliable information"
        },
        {
            icon: Settings,
            title: "Scalable",
            description: "Tailored to match the needs of different universities"
        }
    ];

    const keyFeatures = [
        {
            icon: Zap,
            title: "24/7 Instant Answers",
            description: "Students can ask anything and receive immediate responses"
        },
        {
            icon: Globe,
            title: "Website Integration",
            description: "Connects directly to university websites for accurate information"
        },
        {
            icon: Filter,
            title: "Fast & Filtered",
            description: "Quickly finds relevant details, filtered by department"
        },
        {
            icon: Bot,
            title: "User-Friendly",
            description: "Presents information in an easy-to-understand manner"
        },
        {
            icon: Settings,
            title: "Customizable",
            description: "Universities can customize responses to match their tone"
        }
    ];

    return (
        <div className="min-h-screen text-white relative">
            {/* Animated Background */}
            <div className="gradient-bg" />
            <div className="gradient-orb orb-1" />
            <div className="gradient-orb orb-2" />
            <div className="gradient-orb orb-3" />

            <div className="relative z-10">
                {/* Header/Nav */}
                <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-xl bg-[#020617]/80">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
                        <div className="flex items-center justify-between">
                            <Link href="/" className="flex items-center gap-2 sm:gap-3">
                                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
                                    <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                </div>
                                <span className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">AskUni</span>
                            </Link>

                            {/* Desktop Nav */}
                            <nav className="hidden lg:flex items-center gap-8">
                                <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors font-medium">Home</Link>
                                <Link href="/about" className="text-sm text-gray-400 hover:text-white transition-colors font-medium">About</Link>
                                <Link href="/contact" className="text-sm text-gray-400 hover:text-white transition-colors font-medium">Contact</Link>
                            </nav>

                            <div className="flex items-center gap-2 sm:gap-3">
                                <Link
                                    href="/login"
                                    className="hidden sm:block px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium text-gray-300 hover:text-white transition-colors"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href="/login"
                                    className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-white text-black hover:bg-gray-100 transition-all font-bold text-xs sm:text-sm shadow-lg"
                                >
                                    Sign Up Free
                                </Link>
                                <button
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                    className="lg:hidden p-2 rounded-lg glass-input"
                                >
                                    {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Mobile Menu */}
                        {mobileMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="lg:hidden mt-4 pb-4 border-t border-white/10 pt-4"
                            >
                                <div className="flex flex-col gap-3">
                                    <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors font-medium py-2">Home</Link>
                                    <Link href="/about" className="text-sm text-gray-400 hover:text-white transition-colors font-medium py-2">About</Link>
                                    <Link href="/contact" className="text-sm text-gray-400 hover:text-white transition-colors font-medium py-2">Contact</Link>
                                    <Link href="/login" className="text-sm text-primary-400 hover:text-primary-300 transition-colors font-medium py-2 sm:hidden">Log in</Link>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </header>

                {/* Hero Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 md:pt-44 pb-16 sm:pb-24">
                    <div className="text-center max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full glass-card mb-6 sm:mb-8 text-xs sm:text-sm">
                                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-primary-400" />
                                <span className="text-primary-200 font-medium">AI-Powered University Assistant</span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 leading-tight">
                                Your Campus Life,<br className="hidden sm:block" />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400">
                                    Simplified.
                                </span>
                            </h1>

                            <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-4">
                                Get instant answers about admissions, courses, and events—24/7 without the wait
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
                                <Link
                                    href="/login"
                                    className="w-full sm:w-auto btn-primary shadow-xl flex items-center justify-center gap-2 group"
                                >
                                    <span>Start Chatting</span>
                                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    href="/about"
                                    className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl glass-input hover:bg-white/10 transition-all font-semibold text-base sm:text-lg flex items-center justify-center"
                                >
                                    Learn More
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Key Features */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
                    <div className="text-center mb-10 sm:mb-16">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">Power-Packed Features</h2>
                        <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto px-4">Everything you need to navigate university life with confidence</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {keyFeatures.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="p-6 sm:p-8 rounded-3xl glass-card hover:border-primary-500/30 transition-all group hover:-translate-y-1"
                            >
                                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-primary-500/10 to-accent-500/10 border border-primary-500/20 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary-400" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">{feature.title}</h3>
                                <p className="text-sm sm:text-base text-gray-400 leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Benefits */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
                    <div className="glass-card p-6 sm:p-8 md:p-12 rounded-3xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-primary-600/20 blur-[100px] sm:blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />

                        <div className="text-center mb-10 sm:mb-16 relative z-10">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">Why Choose AskUni?</h2>
                            <p className="text-base sm:text-lg text-gray-400">Built for the modern student experience</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 relative z-10">
                            {benefits.map((benefit, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                    className="flex flex-col items-center text-center group"
                                >
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-primary-500/20 transition-colors duration-300">
                                        <benefit.icon className="w-7 h-7 sm:w-8 sm:h-8 text-gray-300 group-hover:text-primary-300 transition-colors" />
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">{benefit.title}</h3>
                                    <p className="text-sm sm:text-base text-gray-400 leading-relaxed">{benefit.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
                    <div className="relative text-center">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-accent-500/20 blur-3xl rounded-full" />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative z-10 glass-card p-8 sm:p-12 md:p-16 rounded-3xl border-t border-white/10"
                        >
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-400">
                                Ready to Get Started?
                            </h2>
                            <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 sm:mb-10 max-w-xl mx-auto">
                                Join thousands of students using AskUni today. It&apos;s completely free.
                            </p>
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 px-8 sm:px-10 py-4 sm:py-5 rounded-2xl bg-white text-black hover:bg-gray-100 transition-all font-bold text-base sm:text-lg shadow-2xl hover:scale-105 active:scale-95 duration-300"
                            >
                                Sign Up Free <ArrowRight className="w-5 h-5" />
                            </Link>
                        </motion.div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-white/5 bg-[#020617]/50 backdrop-blur-xl mt-12 sm:mt-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                                    <GraduationCap className="w-5 h-5 text-white" />
                                </div>
                                <span className="font-bold text-base sm:text-lg">AskUni</span>
                            </div>

                            <div className="flex items-center gap-6 sm:gap-8">
                                <Link href="/about" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">About</Link>
                                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">Contact</Link>
                            </div>

                            <p className="text-gray-500 text-xs sm:text-sm text-center md:text-right">
                                © 2025 AskUni. By{' '}
                                <span className="text-primary-400 font-medium">rdrishabh312</span>
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
