'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ArrowRight, Loader2, ShieldCheck, AlertCircle, Lock } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function VerifyPhonePage() {
    const router = useRouter();
    const { user, updatePhone, verifyOtp, isLoading: authLoading } = useAuth();

    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        } else if (!authLoading && user?.phone) {
            router.push('/chat');
        } else if (user && user.user_metadata?.phone && step === 'phone') {
            setPhone(user.user_metadata.phone);
        }
    }, [user, authLoading, router, step]);



    const handleSendCode = async () => {
        if (!phone || phone.length < 10) {
            setError('Please enter a valid phone number');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            // Initiate phone update verification
            const { error } = await updatePhone(phone);
            if (error) throw error;
            setStep('otp');
        } catch {
            setError('Failed to send verification code. Try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Auto-send code if phone is pre-filled from metadata
    useEffect(() => {
        if (user?.user_metadata?.phone && phone === user.user_metadata.phone && step === 'phone' && !isLoading) {
            handleSendCode();
        }
    }, [user, phone, step, isLoading]);

    const handleVerify = async () => {
        if (!otp || otp.length !== 6) {
            setError('Please enter the 6-digit code');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            // Verify the phone change OTP
            const { error } = await verifyOtp(phone, otp);
            if (error) throw error;
            // Success! Redirect to chat
            router.push('/chat');
        } catch {
            setError('Invalid code. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#020617]">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-[#020617] relative overflow-hidden">
            {/* Background Effects */}
            <div className="gradient-orb orb-1" />
            <div className="gradient-orb orb-2" />

            <div className="w-full max-w-md relative z-10">
                <AnimatePresence mode="wait">
                    {step === 'phone' ? (
                        <motion.div
                            key="phone"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="glass-card p-8"
                        >
                            <div className="w-16 h-16 rounded-full bg-primary-500/20 flex items-center justify-center mx-auto mb-6">
                                <ShieldCheck className="w-8 h-8 text-primary-400" />
                            </div>

                            <h1 className="text-2xl font-bold text-center mb-2">Verify Your Phone</h1>
                            <p className="text-gray-400 text-center text-sm mb-8">
                                To keep AskUni secure, we need to verify your phone number.
                            </p>

                            {error && (
                                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm text-gray-300 mb-2">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="+1 234 567 8900"
                                        className="w-full glass-input rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleSendCode}
                                disabled={isLoading}
                                className="w-full btn-primary mt-8 flex items-center justify-center gap-2"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Send Code <ArrowRight className="w-4 h-4" /></>}
                            </button>

                            <button
                                onClick={() => setStep('otp')}
                                className="w-full mt-4 text-gray-500 hover:text-white text-sm transition-colors"
                            >
                                I already have a code
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="otp"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            className="glass-card p-8"
                        >
                            <button onClick={() => setStep('phone')} className="mb-6 text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
                                <ArrowRight className="w-4 h-4 rotate-180" />
                                Back
                            </button>

                            <h2 className="text-2xl font-bold mb-2">Enter Code</h2>
                            <p className="text-gray-400 text-sm mb-6">
                                Sent to {phone}
                            </p>

                            {error && (
                                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm text-gray-300 mb-2">6-Digit Code</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="123456"
                                        className="w-full glass-input rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none tracking-widest text-lg"
                                        maxLength={6}
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleVerify}
                                disabled={isLoading}
                                className="w-full btn-primary mt-8 flex items-center justify-center gap-2"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Verify & Continue <ArrowRight className="w-4 h-4" /></>}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
