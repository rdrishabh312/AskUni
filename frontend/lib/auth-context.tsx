'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createClient } from '@supabase/supabase-js';
import type { User, AuthError } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isTrial: boolean;
    trialTimeLeft: number;
    signInWithGoogle: () => Promise<void>;
    signInWithEmail: (email: string, password: string) => Promise<{ error: AuthError | null }>;
    signUpWithEmail: (email: string, password: string, userData?: { name: string; college: string; semester: string; phone?: string }) => Promise<{ error: AuthError | null }>;
    signOut: () => Promise<void>;
    signInWithOtp: (phone: string) => Promise<{ error: AuthError | null }>;
    verifyOtp: (phone: string, token: string) => Promise<{ error: AuthError | null }>;
    updatePhone: (phone: string) => Promise<{ error: AuthError | null }>;
    startTrial: () => void;
    endTrial: () => void;
    signInAsDev: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TRIAL_DURATION = 10 * 60; // 10 minutes in seconds

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isTrial, setIsTrial] = useState(false);
    const [trialTimeLeft, setTrialTimeLeft] = useState(0);

    // Check for existing session on mount
    useEffect(() => {
        const checkSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();

                // Check if mock user exists
                const mockUserStr = localStorage.getItem('askuni_mock_user');
                if (mockUserStr) {
                    setUser(JSON.parse(mockUserStr));
                } else {
                    setUser(session?.user ?? null);
                }
            } catch (error) {
                console.error('Session check error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        checkSession();

        // Failsafe: stop loading after 3 seconds even if auth hangs
        const timeout = setTimeout(() => {
            setIsLoading(false);
        }, 3000);

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            // Respect mock session if active
            const mockUser = localStorage.getItem('askuni_mock_user');
            if (mockUser) {
                return;
            }
            setUser(session?.user ?? null);
            if (session?.user) {
                // End trial when user logs in
                setIsTrial(false);
                localStorage.removeItem('askuni_trial_start');
            }
        });

        return () => {
            subscription.unsubscribe();
            clearTimeout(timeout);
        };
    }, []);

    // Check for existing trial on mount
    useEffect(() => {
        const trialStart = localStorage.getItem('askuni_trial_start');
        if (trialStart && !user) {
            const elapsed = Math.floor((Date.now() - parseInt(trialStart)) / 1000);
            if (elapsed < TRIAL_DURATION) {
                setIsTrial(true);
                setTrialTimeLeft(TRIAL_DURATION - elapsed);
            } else {
                localStorage.removeItem('askuni_trial_start');
                localStorage.removeItem('askuni_message_count');
            }
        }
    }, [user]);

    // Trial countdown timer
    useEffect(() => {
        if (!isTrial || trialTimeLeft <= 0) return;

        const timer = setInterval(() => {
            setTrialTimeLeft(prev => {
                if (prev <= 1) {
                    setIsTrial(false);
                    localStorage.removeItem('askuni_trial_start');
                    localStorage.removeItem('askuni_message_count');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isTrial, trialTimeLeft]);

    const getRedirectUrl = () => {
        const isProd = window.location.hostname !== 'localhost';
        return `${window.location.origin}${isProd ? '/AskUni' : ''}/chat`;
    };

    const signInWithGoogle = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: getRedirectUrl(),
            },
        });
    };

    const signInWithEmail = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { error };
    };

    const signUpWithEmail = async (email: string, password: string, userData?: { name: string; college: string; semester: string; phone?: string }) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: getRedirectUrl(),
                data: userData,
            },
        });
        return { error };
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        localStorage.removeItem('askuni_mock_user'); // Clear mock session
        setUser(null);
        setIsTrial(false);
        localStorage.removeItem('askuni_trial_start');
        localStorage.removeItem('askuni_message_count');
    };

    const signInWithOtp = async (phone: string) => {
        const { error } = await supabase.auth.signInWithOtp({
            phone,
        });
        return { error };
    };

    const verifyOtp = async (phone: string, token: string) => {
        const { error } = await supabase.auth.verifyOtp({
            phone,
            token,
            type: 'sms',
        });
        if (!error) {
            // refresh user session to get updated phone
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
        }
        return { error };
    };

    const updatePhone = async (phone: string) => {
        const { error } = await supabase.auth.updateUser({
            phone: phone
        });
        return { error };
    };

    const startTrial = () => {
        const now = Date.now();
        localStorage.setItem('askuni_trial_start', now.toString());
        localStorage.setItem('askuni_message_count', '0');
        setIsTrial(true);
        setTrialTimeLeft(TRIAL_DURATION);
    };

    const endTrial = () => {
        setIsTrial(false);
        localStorage.removeItem('askuni_trial_start');
        localStorage.removeItem('askuni_message_count');
    };

    const signInAsDev = async () => {
        const mockUser: User = {
            id: 'dev-bypass-id',
            app_metadata: { provider: 'email' },
            user_metadata: { name: 'Developer', email: 'rdrishabh312@gmail.com' },
            aud: 'authenticated',
            created_at: new Date().toISOString(),
            email: 'rdrishabh312@gmail.com',
            phone: '',
            role: 'authenticated',
            updated_at: new Date().toISOString()
        };
        localStorage.setItem('askuni_mock_user', JSON.stringify(mockUser));
        setUser(mockUser);
        setIsTrial(false);
        localStorage.removeItem('askuni_trial_start');
    };

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            isTrial,
            trialTimeLeft,
            signInWithGoogle,
            signInWithEmail,
            signUpWithEmail,
            signOut,
            signInWithOtp,
            verifyOtp,
            updatePhone,
            startTrial,
            endTrial,
            signInAsDev,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

// Export supabase client for admin use
export { supabase };
