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
    User,
    Building,
    BookOpen,
    AlertCircle,
    Check,
    Loader2
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

type Step = 'welcome' | 'details' | 'email' | 'password' | 'complete';

export default function LoginPage() {
    const router = useRouter();
    const { signInWithGoogle, signInWithEmail, signUpWithEmail, user, isLoading: authLoading } = useAuth();

    const [step, setStep] = useState<Step>('welcome');
    const [isSignUp, setIsSignUp] = useState(false);

    // Form Data
    const [formData, setFormData] = useState({
        name: '',
        college: '',
        semester: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

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
                setError('You&apos;ve used all your free messages. Sign up (it&apos;s free!) to continue.');
            }
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

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

    const handleDetailsContinue = () => {
        if (!formData.name.trim() || !formData.college.trim() || !formData.semester.trim()) {
            setError('Please fill in all fields');
            return;
        }
        setStep('email');
    };

    const handleEmailContinue = () => {
        if (!formData.email.trim()) {
            setError('Please enter your email address');
            return;
        }
        if (!formData.email.includes('@') || !formData.email.includes('.')) {
            setError('Please enter a valid email address');
            return;
        }
        setStep('password');
    };

    const handlePasswordContinue = async () => {
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (isSignUp) {
            if (formData.password !== formData.confirmPassword) {
                setError('Passwords do not match');
                return;
            }
            // Create account
            setIsLoading(true);
            setError('');
            try {
                const { error: signUpError } = await signUpWithEmail(
                    formData.email,
                    formData.password,
                    {
                        name: formData.name,
                        college: formData.college,
                        semester: formData.semester
                    }
                );

                if (signUpError) {
                    if (signUpError.message.includes('already registered')) {
                        setError('This email is already registered. Please login instead.');
                    } else {
                        setError(signUpError.message);
                    }
                } else {
                    setSuccessMessage('Account created! Check your email to verify.');
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
                const { error: signInError } = await signInWithEmail(formData.email, formData.password);
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
            case 'details':
                setStep('welcome');
                setIsSignUp(false);
                break;
            case 'email':
                if (isSignUp) {
                    setStep('details');
                } else {
                    setStep('welcome');
                    setIsSignUp(false);
                }
                break;
            case 'password':
                setStep('email');
                break;
            case 'complete':
                setStep('welcome');
                setIsSignUp(false);
                setFormData({
                    name: '',
                    college: '',
                    semester: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
                });
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
                    <Loader2 className="w-10 h-10 animate-spin text-primary-500 mx-auto mb-4" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 overflow-hidden relative">
            {/* Background Effects */}
            <div className="gradient-orb orb-1" />
            <div className="gradient-orb orb-2" />

            <div className="w-full max-w-md relative z-10 my-10">
                <AnimatePresence mode="wait">
                    {/* Welcome Step */}
                    {step === 'welcome' && (
                        <motion.div
                            key="welcome"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="glass-card p-8 md:p-10"
                        >
                            {/* Logo */}
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/30">
                                    <GraduationCap className="w-9 h-9 text-white" />
                                </div>
                                <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">AskUni</h1>
                                <p className="text-gray-400">Your AI-powered university assistant</p>
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* Sign Up Free */}
                            <button
                                onClick={() => { setStep('details'); setIsSignUp(true); setError(''); }}
                                className="w-full mb-4 p-4 rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 hover:opacity-90 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-primary-600/20"
                            >
                                <span className="font-bold text-lg">Sign Up Free</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>

                            {/* Login */}
                            <button
                                onClick={() => { setStep('email'); setIsSignUp(false); setError(''); }}
                                className="w-full mb-6 p-4 rounded-xl glass-input hover:bg-white/10 transition-all font-medium text-gray-300 hover:text-white"
                            >
                                Log in
                            </button>

                            {/* Divider */}
                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/10"></div>
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="px-4 bg-[#020617]/50 backdrop-blur-sm text-gray-500 text-sm rounded-full">or continue with</span>
                                </div>
                            </div>

                            {/* Google */}
                            <button
                                onClick={handleGoogleSignIn}
                                disabled={isLoading}
                                className="w-full p-3.5 rounded-xl bg-white text-gray-900 font-bold hover:bg-gray-100 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg transform active:scale-95 duration-200"
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
                                Google
                            </button>
                        </motion.div>
                    )}

                    {/* Step 1: Details (Sign Up Only) */}
                    {step === 'details' && (
                        <motion.div
                            key="details"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="glass-card p-8"
                        >
                            <button onClick={goBack} className="mb-6 text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
                                <ArrowLeft className="w-4 h-4" />
                                Back
                            </button>

                            <h2 className="text-2xl font-bold mb-2">Tell us about you</h2>
                            <p className="text-gray-400 text-sm mb-6">We&apos;ll personalize your experience</p>

                            {error && (
                                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-300 mb-2">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="John Doe"
                                            className="w-full glass-input rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none"
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-300 mb-2">College Name</label>
                                    <div className="relative">
                                        <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input
                                            name="college"
                                            value={formData.college}
                                            onChange={handleChange}
                                            placeholder="University of Technology"
                                            className="w-full glass-input rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-300 mb-2">Current Semester</label>
                                    <div className="relative">
                                        <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input
                                            name="semester"
                                            value={formData.semester}
                                            onChange={handleChange}
                                            placeholder="e.g. 4th Semester"
                                            className="w-full glass-input rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none"
                                            onKeyDown={(e) => e.key === 'Enter' && handleDetailsContinue()}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleDetailsContinue}
                                className="w-full btn-primary mt-8 flex items-center justify-center gap-2"
                            >
                                Continue
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </motion.div>
                    )}

                    {/* Step 2: Email */}
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

                            <h2 className="text-2xl font-bold mb-2">
                                {isSignUp ? 'Your Email' : 'Welcome back'}
                            </h2>
                            <p className="text-gray-400 text-sm mb-6">
                                {isSignUp ? 'Where should we send updates?' : 'Enter your email to login'}
                            </p>

                            {error && (
                                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm text-gray-300 mb-2">Email address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onKeyDown={(e) => e.key === 'Enter' && handleEmailContinue()}
                                        placeholder="you@university.edu"
                                        autoFocus
                                        className="w-full glass-input rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleEmailContinue}
                                className="w-full btn-primary mt-8 flex items-center justify-center gap-2"
                            >
                                Continue
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </motion.div>
                    )}

                    {/* Step 3: Password */}
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

                            <h2 className="text-2xl font-bold mb-2">
                                {isSignUp ? 'Secure your account' : 'Enter password'}
                            </h2>
                            <p className="text-gray-400 text-sm mb-6">{formData.email}</p>

                            {error && (
                                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-300 mb-2">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={formData.password}
                                            onChange={handleChange}
                                            onKeyDown={(e) => e.key === 'Enter' && !isSignUp && handlePasswordContinue()}
                                            placeholder="••••••••"
                                            autoFocus
                                            className="w-full glass-input rounded-xl py-3.5 pl-12 pr-12 text-white placeholder-gray-500 focus:outline-none"
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
                                    <div>
                                        <label className="block text-sm text-gray-300 mb-2">Confirm Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                            <input
                                                name="confirmPassword"
                                                type={showPassword ? 'text' : 'password'}
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                onKeyDown={(e) => e.key === 'Enter' && handlePasswordContinue()}
                                                placeholder="••••••••"
                                                className="w-full glass-input rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handlePasswordContinue}
                                disabled={isLoading}
                                className="w-full btn-primary mt-8 flex items-center justify-center gap-2"
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
                            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20">
                                <Check className="w-10 h-10 text-green-400" />
                            </div>

                            <h2 className="text-2xl font-bold mb-2">Welcome Aboard!</h2>
                            <p className="text-gray-400 mb-8">
                                {successMessage || 'Your account has been created successfully.'}
                            </p>

                            <button
                                onClick={() => { setStep('password'); setIsSignUp(false); }}
                                className="w-full btn-primary inline-flex items-center justify-center gap-2"
                            >
                                Login Now
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Back to Home */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-center mt-8"
                >
                    <Link href="/" className="text-gray-500 hover:text-white text-sm transition-colors flex items-center justify-center gap-2 group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to homepage
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
