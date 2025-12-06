'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    GraduationCap,
    Sparkles,
    ArrowUp,
    Menu,
    LogOut,
    User,
    Settings,
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

const TRIAL_MESSAGE_LIMIT = 5; // 5 conversations for trial

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
    const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const hasMessageLimit = isTrial && !user;
    const remainingMessages = hasMessageLimit ? TRIAL_MESSAGE_LIMIT - conversations.length : Infinity;



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
            // Check conversation limit instead of message count
            if (conversations.length >= TRIAL_MESSAGE_LIMIT && !currentConversationId) {
                // This would be a new conversation, limit reached
                router.push('/login?reason=limit');
                return;
            }
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
        if (messages.length > 0 && !currentConversationId) {
            const newConv: Conversation = {
                id: Date.now().toString(),
                title: messages[0]?.content.slice(0, 30) + '...' || 'New Chat',
                timestamp: new Date(),
                messages: messages,
            };
            setConversations(prev => [newConv, ...prev]);
        }
        setMessages([]);
        setCurrentConversationId(null);
        setSidebarOpen(false);
    };

    const loadConversation = (conversation: Conversation) => {
        // Only save current if it's a NEW conversation (not already in history)
        if (messages.length > 0 && !currentConversationId) {
            const newConv: Conversation = {
                id: Date.now().toString(),
                title: messages[0]?.content.slice(0, 30) + '...' || 'New Chat',
                timestamp: new Date(),
                messages: messages,
            };
            // Check if this conversation already exists
            const exists = conversations.some(c =>
                c.messages.length === messages.length &&
                c.messages[0]?.content === messages[0]?.content
            );
            if (!exists) {
                setConversations(prev => [newConv, ...prev]);
            }
        }
        setMessages(conversation.messages);
        setCurrentConversationId(conversation.id);
        setSidebarOpen(false);
        setTimeout(() => scrollToBottom(), 100);
    };

    const handleSignOut = async () => {
        await signOut();
        router.push('/');
    };

    const renderMarkdown = (content: string) => {
        return { __html: marked.parse(content) as string };
    };

    return (
        <div className="flex h-screen bg-[#020617] text-white overflow-hidden relative font-sans">

            {/* Desktop Sidebar */}
            <div className="hidden md:flex w-[280px] flex-col border-r border-white/5 bg-[#020617]/50 backdrop-blur-xl shrink-0 z-20">
                <div className="p-4">
                    <button
                        onClick={startNewChat}
                        className="w-full py-3 px-4 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-medium shadow-lg shadow-primary-500/20 transition-all flex items-center justify-center gap-2 group border border-white/10 hover:border-primary-400/50"
                    >
                        <span className="text-xl font-light leading-none">+</span>
                        <span>New Chat</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-2 space-y-1">
                    <p className="text-xs text-gray-500 font-medium px-3 py-2 uppercase tracking-wider">Recent Chats</p>
                    {conversations.length > 0 ? (
                        conversations.map(conv => (
                            <button
                                key={conv.id}
                                onClick={() => loadConversation(conv)}
                                className="w-full text-left p-3 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white transition-colors text-sm truncate group border border-transparent hover:border-white/5"
                            >
                                <span className="block truncate opacity-90">{conv.title}</span>
                                <span className="text-xs text-gray-500 mt-1 block">{new Date(conv.timestamp).toLocaleDateString()}</span>
                            </button>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-600 text-xs">No chat history yet</div>
                    )}
                </div>

                {/* User Profile - Bottom */}
                <div className="p-4 border-t border-white/5 bg-[#020617]/30">
                    {user ? (
                        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-semibold text-sm shadow-inner shrink-0">
                                {user.email?.[0].toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-200 truncate group-hover:text-white transition-colors">
                                    {user.user_metadata?.name || 'Student'}
                                </p>
                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                            </div>
                            <Settings className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5">
                            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
                                <User className="w-5 h-5 text-gray-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-300">Guest User</p>
                                <Link href="/login" className="text-xs text-primary-400 hover:text-primary-300 hover:underline">Sign In to Save</Link>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleSignOut}
                        className="mt-2 w-full p-2 rounded-lg hover:bg-red-500/10 flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-red-400 transition-colors"
                    >
                        <LogOut className="w-3 h-3" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={() => setSidebarOpen(false)} />
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                        className="absolute inset-y-0 left-0 w-[80%] max-w-[300px] bg-[#020617] border-r border-white/10 flex flex-col shadow-2xl"
                    >
                        <div className="p-4 border-b border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                                    <GraduationCap className="w-5 h-5 text-white" />
                                </div>
                                <span className="font-bold text-lg">AskUni</span>
                            </div>
                            <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-white/10 rounded-lg"><Menu className="w-5 h-5" /></button>
                        </div>
                        <div className="p-4">
                            <button onClick={() => { startNewChat(); setSidebarOpen(false); }} className="btn-primary w-full flex items-center justify-center gap-2 py-3 shadow-lg shadow-primary-500/20 active:scale-95 transition-transform">
                                <span>+ New Chat</span>
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto px-4 pb-4">
                            <p className="text-xs text-gray-500 font-medium py-2 uppercase tracking-wider">History</p>
                            {conversations.map(conv => (
                                <button key={conv.id} onClick={() => loadConversation(conv)} className="block w-full text-left p-4 text-gray-300 hover:bg-white/5 rounded-xl mb-2 truncate border border-white/5">
                                    {conv.title}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </div>
            )}


            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full min-w-0 relative bg-gradient-to-br from-[#020617] to-[#0b1221]">
                {/* Mobile Header */}
                <header className="md:hidden p-4 border-b border-white/5 flex items-center gap-4 bg-[#020617]/80 backdrop-blur z-30 sticky top-0">
                    <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-gray-400 hover:text-white"><Menu className="w-6 h-6" /></button>
                    <span className="font-bold text-lg">AskUni</span>
                    {isTrial && <span className="ml-auto text-xs px-2 py-1 rounded-full bg-primary-500/10 text-primary-300 border border-primary-500/20">{remainingMessages} left</span>}
                </header>

                {/* Messages Area - SCROLLABLE */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-0 scroll-smooth">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center p-4 min-h-[500px]">
                            {/* Welcome Content */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="max-w-2xl w-full text-center space-y-10"
                            >
                                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto shadow-2xl shadow-primary-500/20 rotate-3">
                                    <GraduationCap className="w-10 h-10 text-white" />
                                </div>

                                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400 pb-2">
                                    How can I help you succeed today?
                                </h1>

                                {/* Quick Actions Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left px-4">
                                    {quickActions.map((action, i) => (
                                        <button
                                            key={i}
                                            onClick={() => sendMessage(action)}
                                            className="p-4 rounded-2xl glass-card hover:bg-white/10 transition-all text-sm text-gray-300 hover:text-white border border-white/5 hover:border-primary-500/30 shadow-lg hover:shadow-xl group"
                                        >
                                            <span className="group-hover:translate-x-1 transition-transform inline-block">{action}</span>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    ) : (
                        <div className="max-w-3xl mx-auto w-full px-4 py-8 space-y-8">
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {message.role === 'assistant' && (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shrink-0 mr-4 shadow-lg shadow-primary-500/20 mt-2">
                                            <Sparkles className="w-4 h-4 text-white" />
                                        </div>
                                    )}

                                    <div className={`max-w-[85%] ${message.role === 'user'
                                        ? 'bg-[#1e293b] text-white rounded-3xl rounded-br-sm border border-white/5'
                                        : 'bg-transparent'
                                        } px-6 py-4 shadow-sm`}>
                                        {message.role === 'user' ? (
                                            <p className="text-base leading-relaxed">{message.content}</p>
                                        ) : (
                                            <div className="space-y-4">
                                                <div
                                                    className="prose prose-invert prose-p:text-gray-300 prose-headings:text-gray-100 prose-strong:text-white prose-li:text-gray-300 max-w-none leading-relaxed"
                                                    dangerouslySetInnerHTML={renderMarkdown(message.content || '')}
                                                />
                                                {/* Streaming Indicator */}
                                                {message.isStreaming && !message.content && (
                                                    <div className="flex items-center gap-1 h-6">
                                                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                                                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
                                                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {message.role === 'user' && (
                                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center shrink-0 ml-4 mt-2">
                                            <User className="w-4 h-4 text-gray-300" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                            <div ref={messagesEndRef} className="h-4" />
                        </div>
                    )}
                </div>

                {/* Fixed Input Area - OUTSIDE SCROLL */}
                <div className="p-4 md:p-6 bg-[#020617]/95 backdrop-blur-xl border-t border-white/5 z-20 shrink-0">
                    <div className="max-w-3xl mx-auto">
                        <div className="relative glass-card p-1.5 rounded-[26px] border-white/10 bg-[#0f172a] shadow-2xl transition-all focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500/30">
                            <textarea
                                ref={inputRef}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder={isTrial && !user ? `Ask a question (${remainingMessages} free left)...` : "Message AskUni..."}
                                rows={1}
                                className="w-full bg-transparent border-0 focus:ring-0 resize-none py-3.5 pl-5 pr-14 text-white placeholder-gray-500 min-h-[56px] max-h-[200px]"
                                style={{ height: 'auto', minHeight: '56px' }}
                            />
                            <button
                                onClick={() => sendMessage()}
                                disabled={!inputValue.trim() || isLoading}
                                className="absolute right-2 bottom-2 w-10 h-10 rounded-full bg-white text-black disabled:opacity-30 disabled:bg-gray-600 hover:bg-gray-200 transition-colors flex items-center justify-center shadow-lg"
                            >
                                <ArrowUp className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="text-center mt-3 space-y-2">
                            <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 font-medium">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <span>AI can make mistakes. Please verify important information.</span>
                            </div>

                            {isTrial && (
                                <div className="flex items-center justify-center text-[10px] text-gray-500">
                                    <span className="px-2 py-0.5 rounded-full bg-primary-900/20 border border-primary-500/20 text-primary-400">
                                        {remainingMessages} free conversations
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
