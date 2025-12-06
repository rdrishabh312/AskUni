'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    ArrowLeft,
    GraduationCap,
    Mail,
    Linkedin,
    Twitter,
    Instagram,
    ExternalLink,
    Send
} from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const socialLinks = [
        {
            name: 'LinkedIn',
            icon: <Linkedin className="w-5 h-5" />,
            url: 'https://linkedin.com/in/rdrishabh312',
            color: 'hover:text-blue-400'
        },
        {
            name: 'Twitter',
            icon: <Twitter className="w-5 h-5" />,
            url: 'https://twitter.com/rdrishabh312',
            color: 'hover:text-sky-400'
        },
        {
            name: 'Instagram',
            icon: <Instagram className="w-5 h-5" />,
            url: 'https://instagram.com/rdrishabh312',
            color: 'hover:text-pink-400'
        }
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Open email client with pre-filled data
        const mailtoLink = `mailto:rdrishabh312@zohomail.in?subject=AskUni Contact: ${formData.name}&body=${encodeURIComponent(formData.message)}%0A%0AFrom: ${formData.email}`;
        window.location.href = mailtoLink;
    };

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
                                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">About</Link>
                                <Link href="/contact" className="text-white font-medium">Contact</Link>
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
                        Get in <span className="text-primary-400">Touch</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl text-gray-400 max-w-2xl mx-auto"
                    >
                        Have questions, suggestions, or want to collaborate? I&apos;d love to hear from you!
                    </motion.p>
                </div>
            </section>

            {/* Contact Content */}
            <section className="py-16 px-6">
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="glass-card p-8"
                    >
                        <h2 className="text-2xl font-bold mb-6">Send a Message</h2>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Your Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="John Doe"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="you@example.com"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Message</label>
                                <textarea
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    placeholder="Your message..."
                                    required
                                    rows={5}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-all resize-none"
                                />
                            </div>

                            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                                <Send className="w-5 h-5" />
                                Send Message
                            </button>
                        </form>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        {/* Email Card */}
                        <div className="glass-card p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Mail className="w-5 h-5 text-primary-400" />
                                Email
                            </h3>
                            <a
                                href="mailto:rdrishabh312@zohomail.in"
                                className="text-gray-300 hover:text-primary-400 transition-colors flex items-center gap-2"
                            >
                                rdrishabh312@zohomail.in
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>

                        {/* Social Links Card */}
                        <div className="glass-card p-6">
                            <h3 className="text-lg font-semibold mb-4">Connect with Me</h3>
                            <div className="flex flex-col gap-3">
                                {socialLinks.map((social) => (
                                    <a
                                        key={social.name}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 transition-all hover:bg-white/10 hover:border-primary-500/30 ${social.color}`}
                                    >
                                        {social.icon}
                                        <span>{social.name}</span>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Response Time */}
                        <div className="glass-card p-6 bg-gradient-to-br from-primary-500/10 to-accent-500/10">
                            <h3 className="text-lg font-semibold mb-2">Quick Response</h3>
                            <p className="text-gray-400 text-sm">
                                I typically respond within 24-48 hours. For urgent matters, please reach out via social media.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
