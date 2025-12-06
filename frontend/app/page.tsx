'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap } from 'lucide-react';

export default function HomePage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to chat page after a brief moment
        const timer = setTimeout(() => {
            router.push('/chat');
        }, 100);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
            <div className="text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary-500/20">
                    <GraduationCap className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-2xl font-bold mb-2">
                    <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                        AskUni
                    </span>
                </h1>
                <p className="text-gray-400">Loading...</p>
            </div>
        </div>
    );
}
