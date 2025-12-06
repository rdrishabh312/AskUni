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
    Filter
} from 'lucide-react';

export default function HomePage() {
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
            description: "Uses AI-driven conversations instead of static web pages, making engagement more dynamic"
        },
        {
            icon: Shield,
            title: "Consistent Accuracy",
            description: "Eliminates human error in responses, ensuring reliable and precise information"
        },
        {
            icon: Settings,
            title: "Scalable & Customization",
            description: "Can be tailored to match the needs of different universities and departments"
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
            description: "Connects directly to the university website for accurate information"
        },
        {
            icon: Filter,
            title: "Fast & Filtered Information",
            description: "Quickly finds relevant details, filtered by department"
        },
        {
            icon: Bot,
            title: "User-Friendly",
            description: "Presents information in an easy-to-understand manner"
        },
        {
            icon: Settings,
            title: "Customizable AI Chat",
            description: "Universities can customize responses to better suit how they communicate"
        }
    ];

    return (
        <div className="min-h-screen text-white overflow-hidden relative">
            {/* Animated Background */}
            <div className="gradient-bg" />
            <div className="gradient-orb orb-1" />
            <div className="gradient-orb orb-2" />
            <div className="gradient-orb orb-3" />

            <div className="relative z-10">
                {/* Header/Nav */}
                <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-xl bg-[#020617]/70 supports-[backdrop-filter]:bg-[#020617]/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
                                    <GraduationCap className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">AskUni</span>
                            </div>

                            <div className="flex items-center gap-6">
                                <nav className="hidden md:flex items-center gap-6">
                                    <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Home</Link>
                                    <Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">About</Link>
                                    <Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Contact</Link>
                                </nav>
                                <div className="flex items-center gap-3">
                                    <Link
                                        href="/login"
                                        className="hidden sm:block px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white transition-colors"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href="/login"
                                        className="px-5 py-2.5 rounded-xl bg-white text-black hover:bg-gray-100 transition-all font-semibold text-sm shadow-lg shadow-white/10"
                                    >
                                        Sign Up Free
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-20 md:pt-48 md:pb-32">
                    <div className="text-center max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8">
                                <Sparkles className="w-4 h-4 text-primary-400" />
                                <span className="text-sm text-primary-200 font-medium">AI-Powered University Assistant</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight">
                                Your Campus Life, <br />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 animate-gradient">Simplified.</span>
                            </h1>

                            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                                AskUni eliminates the confusion of university life. Get instant answers about admissions, courses, and events—24/7 without the wait.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link
                                    href="/login"
                                    className="w-full sm:w-auto px-8 py-4 rounded-xl btn-primary shadow-xl shadow-primary-500/20 flex items-center justify-center gap-2 group"
                                >
                                    Start Chatting
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    href="/about"
                                    className="w-full sm:w-auto px-8 py-4 rounded-xl glass-input hover:bg-white/10 transition-all font-semibold text-lg flex items-center justify-center"
                                >
                                    Learn More
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Platform Preview */}
                <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="glass-card p-2 rounded-3xl"
                    >
                        <div className="rounded-2xl overflow-hidden bg-[#0a0a0a] border border-white/5 aspect-[16/9] relative group">
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-10" />
                            <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Link
                                    href="/login"
                                    className="px-6 py-3 rounded-full bg-white text-black font-semibold shadow-2xl transform scale-90 group-hover:scale-100 transition-all duration-300"
                                >
                                    Try Interactive Demo
                                </Link>
                            </div>
                            {/* Placeholder for actual screenshot or UI mockup */}
                            <div className="w-full h-full flex items-center justify-center text-gray-700">
                                <div className="text-center">
                                    <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                    <p className="opacity-20 font-mono text-sm">Interactive Chat Interface Preview</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* Key Features */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Power-Packed Features</h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">Everything you need to navigate university life with confidence and speed.</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {keyFeatures.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="p-8 rounded-3xl glass-card hover:border-primary-500/30 transition-all group hover:-translate-y-1"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500/10 to-accent-500/10 border border-primary-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <feature.icon className="w-7 h-7 text-primary-400" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Benefits */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="glass-card p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />

                        <div className="text-center mb-16 relative z-10">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">Why Choose AskUni?</h2>
                            <p className="text-gray-400 text-lg">Built for the modern student experience</p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                            {benefits.map((benefit, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                    className="flex flex-col items-center text-center group"
                                >
                                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:bg-primary-500/20 transition-colors duration-300">
                                        <benefit.icon className="w-8 h-8 text-gray-300 group-hover:text-primary-300 transition-colors" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                                    <p className="text-gray-400 leading-relaxed text-sm">{benefit.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="relative text-center">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-accent-500/20 blur-3xl rounded-full" />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative z-10 glass-card p-12 md:p-16 rounded-[2.5rem] border-t border-white/10"
                        >
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-400">
                                Ready to Get Started?
                            </h2>
                            <p className="text-xl text-gray-300 mb-10 max-w-xl mx-auto">
                                Join thousands of students using AskUni today. It&apos;s completely free.
                            </p>
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 px-10 py-5 rounded-2xl bg-white text-black hover:bg-gray-100 transition-all font-bold text-lg shadow-2xl hover:scale-105 active:scale-95 duration-300"
                            >
                                Sign Up Free <ArrowRight className="w-5 h-5" />
                            </Link>
                        </motion.div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-white/5 bg-[#020617]/50 backdrop-blur-xl">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                                    <GraduationCap className="w-5 h-5 text-white" />
                                </div>
                                <span className="font-bold text-lg">AskUni</span>
                            </div>

                            <div className="flex items-center gap-8">
                                <Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">About</Link>
                                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">Contact</Link>
                                <Link href="/admin" className="text-gray-400 hover:text-white transition-colors text-sm opacity-0 hover:opacity-100">Admin</Link>
                            </div>

                            <p className="text-gray-500 text-sm">
                                © 2025 AskUni. Developed by <span className="text-primary-400 font-medium hover:text-primary-300 transition-colors cursor-default">rdrishabh312</span>
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
