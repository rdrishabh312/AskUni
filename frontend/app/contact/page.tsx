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
            icon: Linkedin,
            url: 'https://linkedin.com/in/rdrishabh312',
            color: 'hover:text-blue-400'
        },
        {
            name: 'Twitter',
            icon: Twitter,
            url: 'https://twitter.com/rdrishabh312',
            color: 'hover:text-sky-400'
        },
        {
            name: 'Instagram',
            icon: Instagram,
            url: 'https://instagram.com/in/rdrishabh312',
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
                            Get in{' '}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-accent-400">
                                Touch
                            </span>
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
                            Have questions or feedback? We&apos;d love to hear from you.
                            Reach out and let&apos;s chat!
                        </p>
                    </motion.div>
                </section>

                {/* Contact Form and Info */}
                <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="glass-card p-6 sm:p-8 rounded-3xl"
                        >
                            <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        className="w-full glass-input rounded-xl py-3 px-4 text-white placeholder-gray-400 focus:outline-none"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                        Your Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                        className="w-full glass-input rounded-xl py-3 px-4 text-white placeholder-gray-400 focus:outline-none"
                                        placeholder="you@example.com"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        required
                                        rows={5}
                                        className="w-full glass-input rounded-xl py-3 px-4 text-white placeholder-gray-400 focus:outline-none resize-none"
                                        placeholder="Your message here..."
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full btn-primary flex items-center justify-center gap-2"
                                >
                                    <Send className="w-5 h-5" />
                                    Send Message
                                </button>
                            </form>
                        </motion.div>

                        {/* Contact Info */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="space-y-6"
                        >
                            {/* Email */}
                            <div className="glass-card p-6 sm:p-8 rounded-3xl">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500/10 to-accent-500/10 border border-primary-500/20 flex items-center justify-center">
                                        <Mail className="w-6 h-6 text-primary-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">Email</h3>
                                        <p className="text-sm text-gray-400">Drop us a line anytime</p>
                                    </div>
                                </div>
                                <a
                                    href="mailto:rdrishabh312@zohomail.in"
                                    className="text-primary-400 hover:text-primary-300 transition-colors text-sm"
                                >
                                    rdrishabh312@zohomail.in
                                </a>
                            </div>

                            {/* Social Links */}
                            <div className="glass-card p-6 sm:p-8 rounded-3xl">
                                <h3 className="text-lg font-bold mb-6 text-white">Connect With Us</h3>
                                <div className="space-y-4">
                                    {socialLinks.map((link, i) => (
                                        <a
                                            key={i}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all group ${link.color}`}
                                        >
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500/10 to-accent-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <link.icon className="w-5 h-5" />
                                            </div>
                                            <span className="text-gray-300 group-hover:text-white transition-colors font-medium">
                                                {link.name}
                                            </span>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Info */}
                            <div className="glass-card p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-primary-600/10 to-accent-600/10 border-primary-500/20">
                                <h3 className="text-lg font-bold mb-3 text-white">Quick Response</h3>
                                <p className="text-sm text-gray-300 leading-relaxed">
                                    We typically respond within 24-48 hours. For urgent matters,
                                    please reach out via email directly.
                                </p>
                            </div>
                        </motion.div>
                    </div>
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
