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
        <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
            {/* Gradient Orbs */}
            <div className="gradient-orb orb-1" />
            <div className="gradient-orb orb-2" />
            <div className="gradient-orb orb-3" />

            <div className="relative z-10">
                {/* Header/Nav */}
                <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 backdrop-blur-xl bg-[#0a0a0a]/80">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/50">
                                    <GraduationCap className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">AskUni</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                                    About
                                </Link>
                                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                                    Contact
                                </Link>
                                <Link
                                    href="/login"
                                    className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/chat"
                                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 hover:opacity-90 transition-opacity font-medium"
                                >
                                    Try Free
                                </Link>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40 pt-40">
                    <div className="text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h1 className="text-5xl md:text-7xl font-bold mb-6">
                                Your AI-Powered
                                <br />
                                <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                                    University Assistant
                                </span>
                            </h1>
                            <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
                                Makes it simple for students to find details about courses, admissions, deadlines, and events.
                                Helps universities share updates efficiently through an AI-powered smart assistant.
                            </p>
                            <div className="flex items-center justify-center gap-4">
                                <Link
                                    href="/chat"
                                    className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 hover:opacity-90 transition-all font-semibold text-lg flex items-center gap-2 shadow-xl shadow-primary-500/20"
                                >
                                    Start Chatting <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Link
                                    href="/about"
                                    className="px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10 font-semibold text-lg"
                                >
                                    Learn More
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Key Features */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Features</h2>
                        <p className="text-gray-400 text-lg">Everything you need in a university assistant</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {keyFeatures.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="p-6 rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 hover:border-primary-500/50 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 group backdrop-blur-sm"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-primary-500/30">
                                    <feature.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Benefits */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose AskUni?</h2>
                        <p className="text-gray-400 text-lg">Built for modern education</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {benefits.map((benefit, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="p-7 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 hover:border-accent-500/50 hover:shadow-2xl hover:shadow-accent-500/10 transition-all duration-300 backdrop-blur-sm group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400/20 to-accent-400/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <benefit.icon className="w-6 h-6 text-primary-400" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">{benefit.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{benefit.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="relative rounded-3xl bg-gradient-to-br from-primary-600/30 to-accent-600/30 border border-primary-500/50 p-12 md:p-16 text-center overflow-hidden backdrop-blur-xl shadow-2xl shadow-primary-500/20">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-accent-500/20 blur-3xl" />
                        <div className="relative z-10">
                            <Sparkles className="w-12 h-12 text-primary-400 mx-auto mb-6" />
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Ready to Get Started?
                            </h2>
                            <p className="text-gray-300 mb-8 text-lg">
                                Try AskUni for free. No credit card required.
                            </p>
                            <Link
                                href="/chat"
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-black hover:bg-gray-100 transition-all font-bold text-lg shadow-2xl hover:shadow-white/30 hover:scale-105 duration-300"
                            >
                                Start Free Trial <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-white/5 mt-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                                    <GraduationCap className="w-5 h-5 text-white" />
                                </div>
                                <span className="font-semibold">AskUni</span>
                            </div>
                            <p className="text-gray-500 text-sm">
                                © 2025 AskUni. All rights reserved.
                            </p>
                            <div className="flex items-center gap-6">
                                <Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    About
                                </Link>
                                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Contact
                                </Link>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
