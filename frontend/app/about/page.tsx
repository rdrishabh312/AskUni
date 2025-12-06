'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    ArrowLeft,
    GraduationCap,
    Target,
    Users,
    Zap,
    Globe,
    Shield,
    MessageSquare
} from 'lucide-react';

export default function AboutPage() {
    const features = [
        {
            icon: Zap,
            title: "Instant Responses",
            description: "No waiting time. Get immediate answers to all your university questions."
        },
        {
            icon: Globe,
            title: "24/7 Available",
            description: "Works round the clock, making information accessible beyond college hours."
        },
        {
            icon: Target,
            title: "Accurate Information",
            description: "AI-driven responses providing reliable answers to your questions."
        },
        {
            icon: Users,
            title: "Student Focused",
            description: "Designed specifically for students, by understanding their needs."
        },
        {
            icon: Shield,
            title: "Privacy First",
            description: "Your conversations are private and secure. We respect your data."
        },
        {
            icon: MessageSquare,
            title: "Natural Conversations",
            description: "Chat naturally like you would with a friend. No complex commands needed."
        }
    ];

    return (
        <div className="min-h-screen relative">

            <div className="relative z-10">
                {/* Header */}
                <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-xl bg-[#020617]/80">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
                        <div className="flex items-center justify-between">
                            <Link href="/" className="flex items-center gap-2 sm:gap-3">
                                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
                                    <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                </div>
                                <span className="text-lg sm:text-xl font-bold">AskUni</span>
                            </Link>
                            <Link
                                href="/"
                                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span className="text-sm">Back</span>
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-40 pb-12 sm:pb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                            About{' '}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-accent-400">
                                AskUni
                            </span>
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
                            Your AI-powered companion for navigating university life. Get instant answers,
                            personalized guidance, and 24/7 support—all in one place.
                        </p>
                    </motion.div>
                </section>

                {/* Mission */}
                <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="glass-card p-8 sm:p-12 rounded-3xl"
                    >
                        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Our Mission</h2>
                        <p className="text-base sm:text-lg text-gray-300 leading-relaxed text-center max-w-3xl mx-auto">
                            We&apos;re on a mission to simplify university life for students worldwide.
                            By harnessing the power of AI, we provide instant, accurate answers to your
                            questions about courses, admissions, events, and more—eliminating the frustration
                            of long wait times and confusing information.
                        </p>
                    </motion.div>
                </section>

                {/* Features Grid */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
                    <div className="text-center mb-12 sm:mb-16">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">What Makes Us Different</h2>
                        <p className="text-base sm:text-lg text-gray-400">Built with students in mind</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="glass-card p-6 sm:p-8 rounded-2xl hover:border-primary-500/30 transition-all group"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500/10 to-accent-500/10 border border-primary-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <feature.icon className="w-7 h-7 text-primary-400" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="glass-card p-8 sm:p-12 md:p-16 rounded-3xl text-center border-t border-white/10"
                    >
                        <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                            Ready to Simplify Your University Life?
                        </h2>
                        <p className="text-lg text-gray-300 mb-8">
                            Join thousands of students already using AskUni
                        </p>
                        <Link
                            href="/chat"
                            className="inline-block px-8 sm:px-10 py-4 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-bold text-lg shadow-2xl hover:scale-105 transition-transform"
                        >
                            Start Chatting Free
                        </Link>
                    </motion.div>
                </section>

                {/* Footer */}
                <footer className="border-t border-white/5 bg-[#020617]/50 backdrop-blur-xl mt-12 sm:mt-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                                    <GraduationCap className="w-5 h-5 text-white" />
                                </div>
                                <span className="font-bold text-lg">AskUni</span>
                            </div>
                            <p className="text-gray-500 text-sm">
                                © 2025 AskUni. By <span className="text-primary-400 font-medium">rdrishabh312</span>
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
