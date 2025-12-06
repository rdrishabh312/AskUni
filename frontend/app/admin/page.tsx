'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Server,
    Cpu,
    Activity,
    RefreshCw,
    Play,
    ArrowLeft,
    CheckCircle,
    XCircle,
    MessageSquare,
    Shield,
    Save,
    Users,
    Mail,
    Clock,
    FileText,
    Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, supabase } from '@/lib/auth-context';

// Developer email - only this user can access admin panel
const DEVELOPER_EMAIL = 'rdrishabh312@gmail.com';

interface UserData {
    id: string;
    email: string;
    created_at: string;
    last_sign_in_at: string;
}

interface Stats {
    status: string;
    current_model: string;
    ollama_host: string;
    available_models: number;
}

export default function AdminPage() {
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();

    const [stats, setStats] = useState<Stats | null>(null);
    const [testPrompt, setTestPrompt] = useState('');
    const [testResponse, setTestResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isTesting, setIsTesting] = useState(false);
    const [systemPrompt, setSystemPrompt] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [users, setUsers] = useState<UserData[]>([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'ai'>('overview');

    const API_URL = 'http://localhost:8000';

    // Check if user is developer
    useEffect(() => {
        if (!authLoading && (!user || user.email !== DEVELOPER_EMAIL)) {
            router.push('/chat');
        }
    }, [user, authLoading, router]);

    const fetchStats = async () => {
        try {
            const res = await fetch(`${API_URL}/api/admin/stats`);
            const data = await res.json();
            setStats(data);
        } catch {
            console.error('Failed to fetch stats');
        }
    };

    const fetchConfig = async () => {
        try {
            const res = await fetch(`${API_URL}/api/admin/config`);
            const data = await res.json();
            setSystemPrompt(data.system_prompt || '');
        } catch {
            console.error('Failed to fetch config');
        }
    };

    const fetchUsers = async () => {
        setUsersLoading(true);
        try {
            // Note: In production, you'd need a backend endpoint for this
            // This is a simplified version for demo
            const { data, error } = await supabase.auth.admin.listUsers();
            if (!error && data) {
                setUsers(data.users.map(u => ({
                    id: u.id,
                    email: u.email || 'No email',
                    created_at: u.created_at,
                    last_sign_in_at: u.last_sign_in_at || 'Never',
                })));
            }
        } catch {
            // Fallback: show current user info if admin API not available
            if (user) {
                setUsers([{
                    id: user.id,
                    email: user.email || 'No email',
                    created_at: user.created_at || new Date().toISOString(),
                    last_sign_in_at: new Date().toISOString(),
                }]);
            }
            console.error('Admin API not available - showing limited data');
        } finally {
            setUsersLoading(false);
        }
    };

    const testModel = async () => {
        if (!testPrompt.trim()) return;
        setIsTesting(true);
        setTestResponse('');

        try {
            const res = await fetch(`${API_URL}/api/admin/test`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: testPrompt }),
            });
            const data = await res.json();
            setTestResponse(data.response || 'No response');
        } catch {
            setTestResponse('Error: Failed to test model. Make sure the backend is running.');
        } finally {
            setIsTesting(false);
        }
    };

    const saveSystemPrompt = async () => {
        setIsSaving(true);
        try {
            const res = await fetch(`${API_URL}/api/admin/config/system-prompt`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ system_prompt: systemPrompt }),
            });
            const data = await res.json();
            if (data.success) {
                alert('AI instructions updated successfully!');
            }
        } catch {
            alert('Failed to update AI instructions. Make sure the backend is running.');
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        if (user?.email === DEVELOPER_EMAIL) {
            fetchStats();
            fetchConfig();
            fetchUsers();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const refreshAll = () => {
        setIsLoading(true);
        Promise.all([fetchStats(), fetchConfig(), fetchUsers()]).finally(() => {
            setIsLoading(false);
        });
    };

    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleString();
        } catch {
            return dateStr;
        }
    };

    // Loading or unauthorized
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
        );
    }

    if (!user || user.email !== DEVELOPER_EMAIL) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
                    <p className="text-gray-400 mb-4">Admin panel is restricted to developers only.</p>
                    <Link href="/chat" className="btn-primary">
                        Go to Chat
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative">

            <div className="relative z-10 p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/chat" className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
                                <Shield className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
                                <p className="text-gray-400 text-sm">Developer: {user.email}</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={refreshAll}
                        disabled={isLoading}
                        className="btn-secondary flex items-center gap-2"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    {(['overview', 'users', 'ai'] as const).map(tabId => {
                        const tab = {
                            overview: { label: 'Overview', icon: Activity },
                            users: { label: 'Users', icon: Users },
                            ai: { label: 'AI Instructions', icon: FileText },
                        }[tabId];
                        return (
                            <button
                                key={tabId}
                                onClick={() => setActiveTab(tabId)}
                                className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${activeTab === tabId
                                    ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/30'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass-card p-4"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stats?.status === 'healthy' ? 'bg-green-500/20' : 'bg-red-500/20'
                                        }`}>
                                        {stats?.status === 'healthy' ? (
                                            <CheckCircle className="w-5 h-5 text-green-400" />
                                        ) : (
                                            <XCircle className="w-5 h-5 text-red-400" />
                                        )}
                                    </div>
                                    <span className="text-gray-400">Service Status</span>
                                </div>
                                <p className="text-2xl font-bold capitalize">{stats?.status || 'Unknown'}</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="glass-card p-4"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                                        <Cpu className="w-5 h-5 text-primary-400" />
                                    </div>
                                    <span className="text-gray-400">Active Model</span>
                                </div>
                                <p className="text-xl font-bold truncate">{stats?.current_model || 'N/A'}</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="glass-card p-4"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-lg bg-accent-500/20 flex items-center justify-center">
                                        <Users className="w-5 h-5 text-accent-400" />
                                    </div>
                                    <span className="text-gray-400">Total Users</span>
                                </div>
                                <p className="text-2xl font-bold">{users.length}</p>
                            </motion.div>
                        </div>

                        {/* Test AI */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="glass-card p-6"
                        >
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-accent-400" />
                                Test AI Response
                            </h2>

                            <div className="space-y-4">
                                <textarea
                                    value={testPrompt}
                                    onChange={(e) => setTestPrompt(e.target.value)}
                                    placeholder="Enter a test prompt..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 resize-none h-24"
                                />

                                <button
                                    onClick={testModel}
                                    disabled={!testPrompt.trim() || isTesting}
                                    className="btn-primary flex items-center gap-2"
                                >
                                    {isTesting ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Play className="w-4 h-4" />
                                    )}
                                    Test Model
                                </button>

                                {testResponse && (
                                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 max-h-48 overflow-y-auto">
                                        <p className="text-sm whitespace-pre-wrap">{testResponse}</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-6"
                    >
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary-400" />
                            Registered Users
                        </h2>

                        <p className="text-gray-400 text-sm mb-4">
                            View all users who have signed up. For full user management, visit your{' '}
                            <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline">
                                Supabase Dashboard
                            </a>.
                        </p>

                        {usersLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                            </div>
                        ) : users.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-white/10">
                                            <th className="text-left py-3 px-4 text-gray-400 font-medium">Email</th>
                                            <th className="text-left py-3 px-4 text-gray-400 font-medium">Created</th>
                                            <th className="text-left py-3 px-4 text-gray-400 font-medium">Last Sign In</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(u => (
                                            <tr key={u.id} className="border-b border-white/5 hover:bg-white/5">
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="w-4 h-4 text-gray-500" />
                                                        <span>{u.email}</span>
                                                        {u.email === DEVELOPER_EMAIL && (
                                                            <span className="px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-400 text-xs">Admin</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-gray-400">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4" />
                                                        {formatDate(u.created_at)}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-gray-400">{formatDate(u.last_sign_in_at)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-400">
                                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>No users found</p>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* AI Instructions Tab */}
                {activeTab === 'ai' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-6"
                    >
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-yellow-400" />
                            AI Instructions & Guidelines
                        </h2>

                        <p className="text-gray-400 text-sm mb-4">
                            Configure how the AI responds to users. These instructions tell the AI what information to provide, how to behave, and what topics to focus on.
                        </p>

                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
                            <h3 className="font-medium mb-2 text-primary-400">Tips for good instructions:</h3>
                            <ul className="text-sm text-gray-400 space-y-1">
                                <li>• Define the AI&apos;s name and personality</li>
                                <li>• Specify what topics it should help with</li>
                                <li>• Set boundaries on what information to share</li>
                                <li>• Include specific university details if needed</li>
                                <li>• Define the response format and tone</li>
                            </ul>
                        </div>

                        <textarea
                            value={systemPrompt}
                            onChange={(e) => setSystemPrompt(e.target.value)}
                            placeholder="Enter AI instructions and guidelines here..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 resize-none font-mono text-sm"
                            style={{ minHeight: '300px' }}
                        />

                        <div className="flex items-center justify-between mt-4">
                            <p className="text-xs text-gray-500">{systemPrompt.length} characters</p>
                            <button
                                onClick={saveSystemPrompt}
                                disabled={isSaving || !systemPrompt.trim()}
                                className="btn-primary flex items-center gap-2"
                            >
                                {isSaving ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                Save Instructions
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Quick Links */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-6 glass-card p-6"
                >
                    <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link href="/chat" className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-3">
                            <MessageSquare className="w-5 h-5 text-primary-400" />
                            <span>Open Chat</span>
                        </Link>

                        <a
                            href="http://localhost:8000/docs"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-3"
                        >
                            <Server className="w-5 h-5 text-green-400" />
                            <span>API Documentation</span>
                        </a>

                        <a
                            href="https://supabase.com/dashboard"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-3"
                        >
                            <Users className="w-5 h-5 text-accent-400" />
                            <span>Supabase Dashboard</span>
                        </a>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
