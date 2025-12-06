'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    GraduationCap,
    Sparkles,
    ArrowUp,
    Menu,
    LogOut,
    MessageSquare,
    Clock,
    Zap,
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

const TRIAL_MESSAGE_LIMIT = 5;

const quickActions = [
    "Help me with course registration",
    "What are admission requirements?",
    "Tell me about campus events",
    "Explain university policies",
    "Academic calendar info"
];

export default function ChatPage() {
    const router = useRouter();
    const { user, isTrial, trialTimeLeft, signOut, isLoading: authLoading } = useAuth();

    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [messageCount, setMessageCount] = useState(0);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const hasMessageLimit = isTrial && !user;
    const remainingMessages = hasMessageLimit ? TRIAL_MESSAGE_LIMIT - messageCount : Infinity;

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        if (!authLoading && !user && !isTrial) {
            router.push('/login');
        }
    }, [user, isTrial, authLoading, router]);

    useEffect(() => {
        if (isTrial && trialTimeLeft <= 0) {
            router.push('/login');
        }
    }, [isTrial, trialTimeLeft, router]);

    useEffect(() => {
        const stored = localStorage.getItem('askuni_message_count');
        if (stored) setMessageCount(parseInt(stored));

        const savedMessages = localStorage.getItem('askuni_chat_messages');
        if (savedMessages) {
            try {
                const parsed = JSON.parse(savedMessages);
                const messagesWithDates = parsed.map((m: Message) => ({
                    ...m,
                    timestamp: new Date(m.timestamp),
                    isStreaming: false,
                }));
                setMessages(messagesWithDates);
            } catch (e) {
                console.error('Failed to load chat history:', e);
            }
        }

        const savedConversations = localStorage.getItem('askuni_conversations');
        if (savedConversations) {
            try {
                const parsed = JSON.parse(savedConversations);
                const convsWithDates = parsed.map((c: Conversation) => ({
                    ...c,
                    timestamp: new Date(c.timestamp),
                    messages: c.messages.map((m: Message) => ({
                        ...m,
                        timestamp: new Date(m.timestamp),
                    })),
                }));
                setConversations(convsWithDates);
            } catch (e) {
                console.error('Failed to load conversations:', e);
            }
        }
    }, []);

    useEffect(() => {
        if (messages.length > 0) {
            const isAnyStreaming = messages.some(m => m.isStreaming);
            if (!isAnyStreaming) {
                localStorage.setItem('askuni_chat_messages', JSON.stringify(messages));
            }
        }
    }, [messages]);

    useEffect(() => {
        if (conversations.length > 0) {
            localStorage.setItem('askuni_conversations', JSON.stringify(conversations));
        }
    }, [conversations]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async (text?: string) => {
        const messageText = text || inputValue.trim();
        if (!messageText || isLoading) return;

        if (hasMessageLimit && remainingMessages <= 0) {
            router.push('/login?reason=limit');
            return;
        }

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: messageText,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

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
            const contextMessages = [...messages, userMessage].slice(-6);

            const response = await fetch('http://localhost:8000/api/chat/stream', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
                                setMessages(prev => prev.map(m =>
                                    m.id === assistantId ? { ...m, content: accumulatedContent } : m
                                ));
                                setTimeout(() => scrollToBottom(), 10);
                            } else if (data.type === 'done') {
                                setMessages(prev => prev.map(m =>
                                    m.id === assistantId ? { ...m, isStreaming: false } : m
                                ));
                            }
                        } catch { }
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
    };

    const loadConversation = (conversation: Conversation) => {
        if (messages.length > 0) {
            const currentConv: Conversation = {
                id: Date.now().toString(),
                title: messages[0]?.content.slice(0, 30) + '...' || 'New Chat',
                timestamp: new Date(),
                messages: messages,
            };
            setConversations(prev => [currentConv, ...prev]);
        }
        setMessages(conversation.messages);
        setSidebarOpen(false);
        setTimeout(() => scrollToBottom(), 100);
    };

    const handleSignOut = async () => {
        await signOut();
        localStorage.removeItem('askuni_message_count');
        router.push('/');
    };

    const renderMarkdown = (content: string) => {
        return { __html: marked.parse(content) as string };
    };

    return (
        <div className="min-h-screen relative">
            {/* Animated Background */}
            <div className="gradient-bg" />
            <div className="gradient-orb orb-1" />
            <div className="gradient-orb orb-2" />

            {/* Sidebar - Hidden by default on mobile */}
            <div
                className={`fixed inset-y-0 left-0 z-40 w-64 sm:w-72 glass-card transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } border-r border-white/10 m-0 rounded-none backdrop-blur-2xl`}
            >
                {/* Header */}
                <div className="glass-card border-b border-white/10 p-4 sm:p-6 space-y-3 rounded-none">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
                                <GraduationCap className="w-6 h-6 text-white" />
                            </div>
                            <span className="font-bold text-xl">AskUni</span>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>

                    {/* User Status */}
                    {user ? (
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-500/20">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-semibold shadow-lg">
                                {user.email?.[0].toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-3 h-3 text-primary-400" />
                                    <span className="text-xs font-semibold text-primary-200">Unlimited</span>
                                </div>
                                <p className="text-xs text-gray-400 truncate">{user.email}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-accent-500/10 to-primary-500/10 border border-accent-500/20">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-500 to-primary-500 flex items-center justify-center">
                                <Clock className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold text-gray-200">Trial Mode</span>
                                    <span className="text-xs font-mono text-accent-300">{formatTime(trialTimeLeft)}</span>
                                </div>
                                <p className="text-xs text-gray-400">{remainingMessages} messages left</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={startNewChat}
                        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 hover:opacity-90 text-white font-medium shadow-lg shadow-primary-500/30 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
                    >
                        + New Chat
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-3 sm:p-4">
                    <p className="text-xs text-gray-400 px-2 mb-2 uppercase">Recent Chats</p>
                    {conversations.length > 0 ? (
                        conversations.map(conv => (
                            <button
                                key={conv.id}
                                onClick={() => loadConversation(conv)}
                                className="w-full text-left p-3 rounded-xl hover:bg-white/10 transition flex items-center gap-3 mb-1 group"
                            >
                                <MessageSquare className="w-4 h-4 text-gray-400 flex-shrink-0 group-hover:text-primary-300" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-200 truncate">{conv.title}</p>
                                    <p className="text-xs text-gray-500">{conv.messages.length} messages</p>
                                </div>
                            </button>
                        ))
                    ) : (
                        <p className="text-gray-500 text-sm px-2 py-4">No previous chats</p>
                    )}
                </div>

                <div className="p-4 sm:p-6 border-t border-white/10">
                    <button
                        onClick={handleSignOut}
                        className="w-full p-3 rounded-xl hover:bg-white/10 flex items-center gap-3 text-gray-300 group"
                    >
                        <LogOut className="w-5 h-5 group-hover:text-red-400" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>

            {/* Overlay for mobile sidebar */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 sm:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen relative z-10">
                {/* Header (when no messages) */}
                {messages.length === 0 && (
                    <div className="glass-card border-b border-white/10 p-4 sm:p-6 shadow-lg rounded-none">
                        <div className="max-w-4xl mx-auto flex items-center justify-between">
                            <div className="flex items-center gap-3 sm:gap-4">
                                <button
                                    onClick={() => setSidebarOpen(true)}
                                    className="p-2 rounded-lg hover:bg-white/10 sm:hidden"
                                >
                                    <Menu className="w-5 h-5 text-gray-300" />
                                </button>
                                <Link href="/" className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-md shadow-primary-500/30">
                                        <GraduationCap className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="font-bold text-gray-100 text-lg">AskUni</span>
                                </Link>
                            </div>

                            {isTrial && (
                                <div className="flex items-center gap-3 text-sm text-gray-300">
                                    <Clock className="w-4 h-4 text-accent-400" />
                                    <span>{formatTime(trialTimeLeft)}</span>
                                    <span className="text-gray-500">|</span>
                                    <Zap className="w-4 h-4 text-primary-400" />
                                    <span>{remainingMessages} left</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {messages.length === 0 ? (
                    /* Welcome Screen */
                    <div className="flex-1 flex items-center justify-center px-4 pb-32">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-3xl w-full text-center"
                        >
                            <h1 className="text-5xl md:text-6xl font-bold text-gray-100 mb-4">
                                Let&apos;s make your dream a{' '}
                                <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                                    reality.
                                </span>
                                <br />
                                Right now.
                            </h1>

                            <p className="text-gray-300 text-lg mb-12">
                                AskUni helps you navigate university life with AI-powered assistance.
                                <br />
                                No complexity necessary.
                            </p>

                            {/* Input Box */}
                            <div className="glass-card p-6 mb-6">
                                <div className="relative">
                                    <textarea
                                        ref={inputRef}
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={handleKeyPress}
                                        placeholder="What do you want to know?"
                                        rows={1}
                                        className="w-full bg-transparent text-gray-100 placeholder-gray-400 focus:outline-none resize-none pr-14 text-lg"
                                    />
                                    <button
                                        onClick={() => sendMessage()}
                                        disabled={!inputValue.trim() || isLoading}
                                        className="absolute right-0 top-0 w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 disabled:opacity-50 flex items-center justify-center text-white hover:shadow-lg transition shadow-primary-500/30"
                                    >
                                        <ArrowUp className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="mt-6 pt-6 border-t border-white/10">
                                    <p className="text-sm text-gray-300 mb-3">Not sure where to start? Try one of these:</p>
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {quickActions.map((action, i) => (
                                            <button
                                                key={i}
                                                onClick={() => sendMessage(action)}
                                                className="px-4 py-2 rounded-full border border-gray-600 hover:border-primary-400 hover:bg-white/10 text-sm text-gray-200 transition"
                                            >
                                                {action}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                ) : (
                    /* Chat Messages */
                    <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
                        {messages.map((message) => (
                            <motion.div
                                key={message.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6"
                            >
                                {message.role === 'user' ? (
                                    <div className="flex justify-end">
                                        <div className="max-w-[80%] bg-gradient-to-br from-primary-500 to-accent-500 text-white rounded-3xl rounded-br-sm px-6 py-3 shadow-lg shadow-primary-500/30">
                                            <p>{message.content}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-500/30">
                                            <Sparkles className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="flex-1 glass-card rounded-3xl rounded-tl-sm px-6 py-4 shadow-lg">
                                            {message.isStreaming && !message.content && (
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" />
                                                    <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                    <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                                    <span className="ml-2">Thinking...</span>
                                                </div>
                                            )}
                                            {message.content && (
                                                <div
                                                    className="prose prose-sm max-w-none prose-p:text-gray-100 prose-headings:text-gray-100 prose-strong:text-white prose-code:text-accent-300 prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-white/10 prose-pre:text-gray-100 prose-a:text-primary-400"
                                                    dangerouslySetInnerHTML={renderMarkdown(message.content)}
                                                />
                                            )}
                                            {message.isStreaming && message.content && (
                                                <span className="inline-block w-0.5 h-5 bg-primary-500 animate-pulse ml-1" />
                                            )}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                )}

                {/* Fixed Input (when in chat) */}
                {messages.length > 0 && (
                    <div className="sticky bottom-0 p-4 z-20">
                        <div className="max-w-4xl mx-auto">
                            <div className="glass-card p-4">
                                <div className="relative">
                                    <textarea
                                        ref={inputRef}
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={handleKeyPress}
                                        placeholder="Ask a follow-up..."
                                        rows={1}
                                        className="w-full bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none resize-none pr-14"
                                    />
                                    <button
                                        onClick={() => sendMessage()}
                                        disabled={!inputValue.trim() || isLoading}
                                        className="absolute right-0 top-0 w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 disabled:opacity-50 flex items-center justify-center text-white"
                                    >
                                        <ArrowUp className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
