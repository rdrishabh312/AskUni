'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    GraduationCap,
    ArrowRight,
    ArrowLeft,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Clock,
    AlertCircle,
    Check,
    Loader2
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

type Step = 'welcome' | 'email' | 'password' | 'complete';

export default function LoginPage() {
    const router = useRouter();
    const { signInWithGoogle, signInWithEmail, signUpWithEmail, startTrial, user, isLoading: authLoading } = useAuth();

    const [step, setStep] = useState<Step>('welcome');
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Redirect if already logged in
    useEffect(() => {
        if (!authLoading && user) {
            router.push('/chat');
        }
    }, [user, authLoading, router]);

    // Check if redirected due to limit
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            if (params.get('reason') === 'limit') {
                setError('You\'ve used all your free messages. Sign up to continue!');
            }
        }
    }, []);

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setError('');
        try {
            await signInWithGoogle();
        } catch {
            setError('Failed to sign in with Google. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleTryFree = () => {
        startTrial();
        router.push('/chat');
    };

    const handleEmailContinue = () => {
        if (!email.trim()) {
            setError('Please enter your email address');
            return;
        }
        if (!email.includes('@') || !email.includes('.')) {
            setError('Please enter a valid email address');
            return;
        }
        setError('');
        setStep('password');
    };

    const handlePasswordContinue = async () => {
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (isSignUp) {
            if (password !== confirmPassword) {
                setError('Passwords do not match');
                return;
            }
            // Create account
            setIsLoading(true);
            setError('');
            try {
                const { error: signUpError } = await signUpWithEmail(email, password);
                if (signUpError) {
                    if (signUpError.message.includes('already registered')) {
                        setError('This email is already registered. Please login instead.');
                    } else {
                        setError(signUpError.message);
                    }
                } else {
                    setSuccessMessage('Account created! Check your email to verify, or login now.');
                    setStep('complete');
                }
            } catch {
                setError('Failed to create account. Please try again.');
            } finally {
                setIsLoading(false);
            }
        } else {
            // Login
            setIsLoading(true);
            setError('');
            try {
                const { error: signInError } = await signInWithEmail(email, password);
                if (signInError) {
                    if (signInError.message.includes('Invalid login')) {
                        setError('Invalid email or password. Please try again.');
                    } else {
                        setError(signInError.message);
                    }
                } else {
                    router.push('/chat');
                }
            } catch {
                setError('Failed to sign in. Please try again.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const goBack = () => {
        setError('');
        setSuccessMessage('');
        switch (step) {
            case 'email':
                setStep('welcome');
                setIsSignUp(false);
                break;
            case 'password':
                setStep('email');
                break;
            case 'complete':
                setStep('welcome');
                setIsSignUp(false);
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                break;
            default:
                setStep('welcome');
        }
    };

    // Show loading while checking auth
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-500 mx-auto mb-4" />
                    <p className="text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <AnimatePresence mode="wait">
                    {/* Welcome Step */}
                    {step === 'welcome' && (
                        <motion.div
                            key="welcome"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="glass-card p-8"
                        >
                            {/* Logo */}
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/25">
                                    <GraduationCap className="w-9 h-9 text-white" />
                                </div>
                                <h1 className="text-2xl font-bold mb-2">Welcome to AskUni</h1>
                                <p className="text-gray-400 text-sm">Your AI-powered university assistant</p>
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* Try Free */}
                            <button
                                onClick={handleTryFree}
                                className="w-full mb-4 p-4 rounded-xl bg-gradient-to-r from-primary-500/20 to-accent-500/20 border border-primary-500/30 hover:border-primary-500/50 transition-all flex items-center justify-center gap-3 group"
                            >
                                <Clock className="w-5 h-5 text-primary-400 group-hover:scale-110 transition-transform" />
                                <span className="font-medium">Try Free for 10 Minutes</span>
                            </button>

                            <p className="text-center text-xs text-gray-500 mb-6">5 messages • No signup required</p>

                            {/* Divider */}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/10"></div>
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="px-4 bg-[#171717] text-gray-500 text-sm">or continue with</span>
                                </div>
                            </div>

                            {/* Google */}
                            <button
                                onClick={handleGoogleSignIn}
                                disabled={isLoading}
                                className="w-full mb-3 p-3.5 rounded-xl bg-white text-gray-900 font-medium hover:bg-gray-100 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                )}
                                Continue with Google
                            </button>

                            {/* Email */}
                            <button
                                onClick={() => { setStep('email'); setIsSignUp(false); setError(''); }}
                                className="w-full p-3.5 rounded-xl bg-white/10 hover:bg-white/15 transition-all flex items-center justify-center gap-3"
                            >
                                <Mail className="w-5 h-5" />
                                Continue with Email
                            </button>

                            {/* Signup Link */}
                            <p className="text-center text-gray-400 text-sm mt-6">
                                Don&apos;t have an account?{' '}
                                <button
                                    onClick={() => { setStep('email'); setIsSignUp(true); setError(''); }}
                                    className="text-primary-400 hover:underline font-medium"
                                >
                                    Sign up
                                </button>
                            </p>
                        </motion.div>
                    )}

                    {/* Email Step */}
                    {step === 'email' && (
                        <motion.div
                            key="email"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="glass-card p-8"
                        >
                            <button onClick={goBack} className="mb-6 text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
                                <ArrowLeft className="w-4 h-4" />
                                Back
                            </button>

                            <h2 className="text-xl font-bold mb-2">
                                {isSignUp ? 'Create your account' : 'Welcome back'}
                            </h2>
                            <p className="text-gray-400 text-sm mb-6">Enter your email to continue</p>

                            {error && (
                                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className="mb-4">
                                <label className="block text-sm text-gray-300 mb-2">Email address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleEmailContinue()}
                                        placeholder="you@university.edu"
                                        autoFocus
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleEmailContinue}
                                className="w-full btn-primary flex items-center justify-center gap-2"
                            >
                                Continue
                                <ArrowRight className="w-4 h-4" />
                            </button>

                            <p className="text-center text-gray-400 text-sm mt-6">
                                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                                <button
                                    onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
                                    className="text-primary-400 hover:underline font-medium"
                                >
                                    {isSignUp ? 'Log in' : 'Sign up'}
                                </button>
                            </p>
                        </motion.div>
                    )}

                    {/* Password Step */}
                    {step === 'password' && (
                        <motion.div
                            key="password"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="glass-card p-8"
                        >
                            <button onClick={goBack} className="mb-6 text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
                                <ArrowLeft className="w-4 h-4" />
                                Back
                            </button>

                            <h2 className="text-xl font-bold mb-2">
                                {isSignUp ? 'Create a password' : 'Enter your password'}
                            </h2>
                            <p className="text-gray-400 text-sm mb-6">{email}</p>

                            {error && (
                                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className="mb-4">
                                <label className="block text-sm text-gray-300 mb-2">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && !isSignUp && handlePasswordContinue()}
                                        placeholder="••••••••"
                                        autoFocus
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {isSignUp && (
                                <div className="mb-4">
                                    <label className="block text-sm text-gray-300 mb-2">Confirm Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handlePasswordContinue()}
                                            placeholder="••••••••"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
                                        />
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={handlePasswordContinue}
                                disabled={isLoading}
                                className="w-full btn-primary flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        {isSignUp ? 'Create Account' : 'Sign In'}
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>

                            {!isSignUp && (
                                <p className="text-center text-gray-400 text-sm mt-4">
                                    <button className="text-primary-400 hover:underline">
                                        Forgot password?
                                    </button>
                                </p>
                            )}
                        </motion.div>
                    )}

                    {/* Complete Step */}
                    {step === 'complete' && (
                        <motion.div
                            key="complete"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-card p-8 text-center"
                        >
                            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                                <Check className="w-8 h-8 text-green-400" />
                            </div>

                            <h2 className="text-xl font-bold mb-2">Account Created!</h2>
                            <p className="text-gray-400 text-sm mb-6">
                                {successMessage || 'You can now start chatting!'}
                            </p>

                            <button
                                onClick={() => { setStep('password'); setIsSignUp(false); }}
                                className="btn-primary inline-flex items-center gap-2 mb-3"
                            >
                                Login Now
                                <ArrowRight className="w-4 h-4" />
                            </button>

                            <p className="text-gray-500 text-sm">
                                or{' '}
                                <Link href="/chat" className="text-primary-400 hover:underline">
                                    continue as guest
                                </Link>
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Back to Home */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-center mt-6"
                >
                    <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                        ← Back to homepage
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
