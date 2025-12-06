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
            icon: <Zap className="w-6 h-6" />,
            title: "Instant Responses",
            description: "No waiting time. Get immediate answers to all your university questions."
        },
        {
            icon: <Globe className="w-6 h-6" />,
            title: "24/7 Available",
            description: "Works round the clock, making information accessible beyond college hours."
        },
        {
            icon: <Target className="w-6 h-6" />,
            title: "Accurate Information",
            description: "AI-driven responses providing reliable answers to your questions."
        },
        {
            icon: <Users className="w-6 h-6" />,
            title: "Student Focused",
            description: "Designed specifically for students, by understanding their needs."
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Privacy First",
            description: "Your conversations are private and secure. We respect your data."
        },
        {
            icon: <MessageSquare className="w-6 h-6" />,
            title: "Natural Conversations",
            description: "Chat naturally like you would with a friend. No complex commands needed."
        }
    ];

    return (
        <div className="min-h-screen">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50">
                <div className="glass-card mx-4 mt-4 !rounded-2xl">
                    <div className="max-w-7xl mx-auto px-6 py-4">
                        <div className="flex items-center justify-between">
                            <Link href="/" className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                                    <GraduationCap className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xl font-bold bg-gradient-to-r from-white to-primary-300 bg-clip-text text-transparent">
                                    AskUni
                                </span>
                            </Link>

                            <div className="flex items-center gap-4">
                                <Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
                                <Link href="/about" className="text-white font-medium">About</Link>
                                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link>
                                <Link href="/login" className="btn-primary text-sm py-2 px-6">
                                    Get Started
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-40 pb-16 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Home
                        </Link>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl md:text-6xl font-bold mb-6"
                    >
                        About <span className="text-primary-400">AskUni</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl text-gray-400 max-w-2xl mx-auto"
                    >
                        An AI-powered smart assistant designed to help students navigate their university journey with ease and efficiency.
                    </motion.p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="glass-card p-8 md:p-12"
                    >
                        <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
                            <Target className="w-8 h-8 text-primary-400" />
                            Our Mission
                        </h2>
                        <p className="text-gray-300 text-lg leading-relaxed mb-6">
                            AskUni was created with a simple goal: to make university information accessible to every student, anytime, anywhere. We believe that no student should have to wait in long queues or navigate confusing websites to find basic information about their courses, admissions, or campus events.
                        </p>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            Using advanced AI technology, we provide instant, accurate, and personalized responses while keeping your data private and secure. Our assistant understands natural language, so you can ask questions just like you would ask a friend.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-3xl font-bold text-center mb-12"
                    >
                        Why Choose AskUni?
                    </motion.h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <section className="py-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="glass-card p-8 md:p-12 text-center bg-gradient-to-br from-primary-500/10 to-accent-500/10"
                    >
                        <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Get Started?</h2>
                        <p className="text-gray-400 mb-6">
                            Try AskUni for free and experience the future of university assistance.
                        </p>
                        <Link href="/login" className="btn-primary inline-flex items-center gap-2">
                            Start Chatting Now
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
