'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    GraduationCap,
    Sparkles,
    Plus,
    MessageSquare,
    LogOut,
    ExternalLink,
    Menu,
    X,
    Clock,
    ArrowUp,
    Copy,
    Check,
    RefreshCw,
    Zap,
    BookOpen,
    Users,
    Calendar,
    Globe
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { marked } from 'marked';
import { useAuth } from '@/lib/auth-context';

interface Source {
    title: string;
    url: string;
    snippet: string;
}

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    sources?: Source[];
    isStreaming?: boolean;
    timestamp: Date;
}

interface Conversation {
    id: string;
    title: string;
    timestamp: Date;
    messages: Message[];
}

// Message limits
const TRIAL_MESSAGE_LIMIT = 5;

export default function ChatPage() {
    const router = useRouter();
    const { user, isTrial, trialTimeLeft, signOut, isLoading: authLoading } = useAuth();

    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [messageCount, setMessageCount] = useState(0);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // For trial users: 5 messages, for logged in users: unlimited
    const hasMessageLimit = isTrial && !user;
    const remainingMessages = hasMessageLimit ? TRIAL_MESSAGE_LIMIT - messageCount : Infinity;

    // Format time remaining
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Check access
    useEffect(() => {
        if (!authLoading && !user && !isTrial) {
            router.push('/login');
        }
    }, [user, isTrial, authLoading, router]);

    // Redirect when trial expires
    useEffect(() => {
        if (isTrial && trialTimeLeft <= 0) {
            router.push('/login');
        }
    }, [isTrial, trialTimeLeft, router]);

    // Load message count from storage
    useEffect(() => {
        const stored = localStorage.getItem('askuni_message_count');
        if (stored) {
            setMessageCount(parseInt(stored));
        }
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Auto-resize textarea
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
            inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 150) + 'px';
        }
    }, [inputValue]);

    const copyToClipboard = async (text: string, id: string) => {
        await navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const sendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        // Check message limit for trial users
        if (hasMessageLimit && remainingMessages <= 0) {
            router.push('/login?reason=limit');
            return;
        }

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue.trim(),
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        // Increment message count only for trial users
        if (hasMessageLimit) {
            const newCount = messageCount + 1;
            setMessageCount(newCount);
            localStorage.setItem('askuni_message_count', newCount.toString());
        }

        const assistantId = (Date.now() + 1).toString();
        setMessages(prev => [...prev, {
            id: assistantId,
            role: 'assistant',
            content: '',
            isStreaming: true,
            timestamp: new Date(),
        }]);

        try {
            // Only send last few messages for context (memory window)
            const contextMessages = [...messages, userMessage].slice(-6);

            const response = await fetch('http://localhost:8000/api/chat/stream', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: contextMessages.map(m => ({
                        role: m.role,
                        content: m.content,
                    })),
                    enable_web_search: false,
                }),
            });

            if (!response.ok) throw new Error('Failed to get response');

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let accumulatedContent = '';
            let sources: Source[] = [];

            while (reader) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));

                            if (data.type === 'sources') {
                                sources = data.data;
                                setMessages(prev => prev.map(m =>
                                    m.id === assistantId ? { ...m, sources } : m
                                ));
                            } else if (data.type === 'content') {
                                accumulatedContent += data.data;
                                // Update message with each chunk for real-time streaming
                                setMessages(prev => prev.map(m =>
                                    m.id === assistantId ? { ...m, content: accumulatedContent } : m
                                ));
                                // Scroll to bottom as content streams in
                                scrollToBottom();
                            } else if (data.type === 'done') {
                                setMessages(prev => prev.map(m =>
                                    m.id === assistantId ? { ...m, isStreaming: false } : m
                                ));
                            }
                        } catch {
                            // Skip invalid JSON
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => prev.map(m =>
                m.id === assistantId
                    ? { ...m, content: 'Sorry, I encountered an error. Please make sure the backend server is running on port 8000.', isStreaming: false }
                    : m
            ));
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const startNewChat = () => {
        if (messages.length > 0) {
            const newConv: Conversation = {
                id: Date.now().toString(),
                title: messages[0]?.content.slice(0, 30) + '...' || 'New Chat',
                timestamp: new Date(),
                messages: messages,
            };
            setConversations(prev => [newConv, ...prev]);
        }
        setMessages([]);
        setSidebarOpen(false);
        inputRef.current?.focus();
    };

    const handleSignOut = async () => {
        await signOut();
        localStorage.removeItem('askuni_message_count');
        router.push('/');
    };

    const renderMarkdown = (content: string) => {
        return { __html: marked.parse(content) as string };
    };

    // Show loading while checking auth
    if (authLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#0a0a0a]">
                <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <GraduationCap className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-gray-400">Loading AskUni...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#0a0a0a] overflow-hidden">
            {/* Sidebar Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
                            onClick={() => setSidebarOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: -320 }}
                            animate={{ x: 0 }}
                            exit={{ x: -320 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed z-50 w-80 h-full bg-[#111111] border-r border-white/5 flex flex-col shadow-2xl"
                        >
                            {/* Sidebar Header */}
                            <div className="p-4 border-b border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                                        <GraduationCap className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="font-semibold">AskUni</span>
                                </div>
                                <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg hover:bg-white/5">
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            {/* New Chat Button */}
                            <div className="p-4">
                                <button
                                    onClick={startNewChat}
                                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 hover:opacity-90 transition-all flex items-center justify-center gap-2 font-medium"
                                >
                                    <Plus className="w-5 h-5" />
                                    New Chat
                                </button>
                            </div>

                            {/* Conversations */}
                            <div className="flex-1 overflow-y-auto px-3">
                                <p className="text-xs text-gray-500 px-2 mb-2 uppercase tracking-wider">Recent Chats</p>
                                {conversations.length > 0 ? (
                                    conversations.map(conv => (
                                        <button
                                            key={conv.id}
                                            className="w-full text-left p-3 rounded-xl hover:bg-white/5 transition-colors flex items-center gap-3 text-sm text-gray-300 mb-1"
                                        >
                                            <MessageSquare className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                            <span className="truncate">{conv.title}</span>
                                        </button>
                                    ))
                                ) : (
                                    <p className="text-gray-600 text-sm px-2 py-4">No previous chats</p>
                                )}
                            </div>

                            {/* User Info */}
                            <div className="p-4 border-t border-white/5">
                                {user && (
                                    <div className="mb-3 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                                        <p className="text-sm text-gray-300 truncate font-medium">{user.email}</p>
                                        <p className="text-xs text-green-400 mt-1">✓ Unlimited messages</p>
                                    </div>
                                )}
                                {isTrial && !user && (
                                    <div className="mb-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                        <p className="text-sm text-amber-300 font-medium">Free Trial</p>
                                        <p className="text-xs text-amber-400 mt-1">{remainingMessages} of 5 messages left</p>
                                    </div>
                                )}
                                <button
                                    onClick={handleSignOut}
                                    className="w-full p-3 rounded-xl hover:bg-white/5 transition-colors flex items-center gap-3 text-gray-400"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span>{isTrial ? 'End Trial' : 'Sign Out'}</span>
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                {/* Trial Banner */}
                {isTrial && (
                    <div className="bg-gradient-to-r from-primary-600 to-accent-600 px-4 py-2">
                        <div className="max-w-4xl mx-auto flex items-center justify-between text-sm">
                            <div className="flex items-center gap-4 text-white/90">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span className="font-medium">{formatTime(trialTimeLeft)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Zap className="w-4 h-4" />
                                    <span>{remainingMessages === Infinity ? '∞' : remainingMessages} left</span>
                                </div>
                            </div>
                            <Link href="/login" className="bg-white/20 hover:bg-white/30 px-4 py-1 rounded-full text-white font-medium transition-all text-xs">
                                Sign Up Free
                            </Link>
                        </div>
                    </div>
                )}

                {/* Header */}
                <header className="h-14 flex items-center justify-between px-4 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                        >
                            <Menu className="w-5 h-5 text-gray-400" />
                        </button>
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                                <GraduationCap className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-semibold hidden sm:inline">AskUni</span>
                        </Link>
                    </div>

                    {user && (
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                            <div className="w-2 h-2 rounded-full bg-green-400" />
                            <span className="text-xs text-green-400 font-medium">Pro</span>
                        </div>
                    )}
                </header>

                {/* Chat Content */}
                <div className="flex-1 overflow-y-auto">
                    {messages.length === 0 ? (
                        /* Welcome Screen */
                        <div className="h-full flex flex-col items-center justify-center px-4 py-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="max-w-xl w-full text-center"
                            >
                                {/* Logo */}
                                <div className="mb-6">
                                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto shadow-xl shadow-primary-500/20">
                                        <GraduationCap className="w-10 h-10 text-white" />
                                    </div>
                                </div>

                                <h1 className="text-2xl md:text-3xl font-bold mb-3">
                                    Hi! I&apos;m <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">AskUni</span>
                                </h1>
                                <p className="text-gray-400 mb-8">
                                    Your AI university assistant. Ask me anything!
                                </p>

                                {/* Quick Actions */}
                                <div className="grid grid-cols-2 gap-3 mb-8">
                                    {[
                                        { icon: BookOpen, label: "Courses", query: "Tell me about available courses" },
                                        { icon: Users, label: "Admissions", query: "What are admission requirements?" },
                                        { icon: Calendar, label: "Deadlines", query: "What are upcoming deadlines?" },
                                        { icon: Sparkles, label: "Events", query: "What events are happening?" },
                                    ].map((item, i) => (
                                        <motion.button
                                            key={i}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 * i }}
                                            onClick={() => setInputValue(item.query)}
                                            className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary-500/30 transition-all group text-left"
                                        >
                                            <item.icon className="w-5 h-5 text-primary-400 mb-2" />
                                            <span className="text-sm text-gray-300 group-hover:text-white">{item.label}</span>
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    ) : (
                        /* Messages */
                        <div className="max-w-3xl mx-auto py-6 px-4">
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-6"
                                >
                                    {message.role === 'user' ? (
                                        /* User Message */
                                        <div className="flex justify-end">
                                            <div className="max-w-[85%] bg-primary-500/20 border border-primary-500/30 rounded-2xl rounded-br-sm px-4 py-3">
                                                <p className="text-white">{message.content}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        /* AI Message */
                                        <div className="flex gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
                                                <Sparkles className="w-4 h-4 text-white" />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                {/* Sources */}
                                                {message.sources && message.sources.length > 0 && (
                                                    <div className="mb-3 flex gap-2 overflow-x-auto pb-2">
                                                        {message.sources.slice(0, 3).map((source, i) => (
                                                            <a
                                                                key={i}
                                                                href={source.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex-shrink-0 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs flex items-center gap-2"
                                                            >
                                                                <Globe className="w-3 h-3 text-primary-400" />
                                                                <span className="truncate max-w-[100px]">{source.title}</span>
                                                                <ExternalLink className="w-3 h-3 text-gray-500" />
                                                            </a>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Thinking indicator */}
                                                {message.isStreaming && !message.content && (
                                                    <div className="flex items-center gap-2 text-gray-400">
                                                        <div className="flex gap-1">
                                                            <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                            <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                            <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                                        </div>
                                                        <span className="text-sm">Thinking...</span>
                                                    </div>
                                                )}

                                                {/* Message content */}
                                                {message.content && (
                                                    <div className="relative">
                                                        <div
                                                            className="prose prose-invert prose-sm max-w-none prose-p:text-gray-300 prose-headings:text-white prose-strong:text-white prose-code:text-primary-300 prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-[#1a1a1a] prose-pre:border prose-pre:border-white/10"
                                                            dangerouslySetInnerHTML={renderMarkdown(message.content)}
                                                        />
                                                        {/* Blinking cursor while streaming */}
                                                        {message.isStreaming && (
                                                            <span className="inline-block w-0.5 h-4 bg-primary-400 animate-pulse ml-0.5" />
                                                        )}
                                                    </div>
                                                )}

                                                {/* Actions */}
                                                {!message.isStreaming && message.content && (
                                                    <div className="flex items-center gap-1 mt-3">
                                                        <button
                                                            onClick={() => copyToClipboard(message.content, message.id)}
                                                            className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-gray-300 transition-all"
                                                        >
                                                            {copiedId === message.id ? (
                                                                <Check className="w-4 h-4 text-green-400" />
                                                            ) : (
                                                                <Copy className="w-4 h-4" />
                                                            )}
                                                        </button>
                                                        <button className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-gray-300 transition-all">
                                                            <RefreshCw className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Input Area - Clean Design */}
                <div className="p-4 border-t border-white/5">
                    <div className="max-w-3xl mx-auto">
                        <div className="relative bg-[#1a1a1a] rounded-2xl border border-white/10 focus-within:border-primary-500/50 transition-colors">
                            <textarea
                                ref={inputRef}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder={hasMessageLimit && remainingMessages <= 0 ? "Message limit reached" : "Ask me anything..."}
                                disabled={hasMessageLimit && remainingMessages <= 0}
                                rows={1}
                                className="w-full bg-transparent py-4 px-4 pr-14 text-white placeholder-gray-500 focus:outline-none resize-none max-h-32 disabled:opacity-50"
                            />
                            <button
                                onClick={sendMessage}
                                disabled={!inputValue.trim() || isLoading || (hasMessageLimit && remainingMessages <= 0)}
                                className={`absolute right-3 bottom-3 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${inputValue.trim() && !isLoading && (!hasMessageLimit || remainingMessages > 0)
                                        ? 'bg-primary-500 hover:bg-primary-400 text-white'
                                        : 'bg-white/10 text-gray-500'
                                    }`}
                            >
                                <ArrowUp className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-center text-xs text-gray-600 mt-2">
                            AskUni can make mistakes. Verify important information.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
