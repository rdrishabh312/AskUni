'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

    if (authLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-orange-50">
                <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <GraduationCap className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-gray-600">Loading AskUni...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-orange-50 relative overflow-hidden">
            {/* Sidebar */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                            onClick={() => setSidebarOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: -320 }}
                            animate={{ x: 0 }}
                            exit={{ x: -320 }}
                            className="fixed z-50 w-80 h-full bg-white/90 backdrop-blur-xl border-r border-gray-200 flex flex-col shadow-2xl"
                        >
                            <div className="p-4 border-b border-gray-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center">
                                        <GraduationCap className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="font-bold text-gray-900">AskUni</span>
                                </div>
                                <button
                                    onClick={startNewChat}
                                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-orange-400 to-orange-500 hover:opacity-90 text-white font-medium"
                                >
                                    + New Chat
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-3">
                                <p className="text-xs text-gray-500 px-2 mb-2 uppercase">Recent Chats</p>
                                {conversations.length > 0 ? (
                                    conversations.map(conv => (
                                        <button
                                            key={conv.id}
                                            onClick={() => loadConversation(conv)}
                                            className="w-full text-left p-3 rounded-xl hover:bg-gray-100 transition flex items-center gap-3 mb-1"
                                        >
                                            <MessageSquare className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-gray-900 truncate">{conv.title}</p>
                                                <p className="text-xs text-gray-500">{conv.messages.length} messages</p>
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-sm px-2 py-4">No previous chats</p>
                                )}
                            </div>

                            <div className="p-4 border-t border-gray-200">
                                {user && (
                                    <div className="mb-3 p-3 rounded-xl bg-green-50 border border-green-200">
                                        <p className="text-sm text-gray-900 truncate font-medium">{user.email}</p>
                                        <p className="text-xs text-green-600 mt-1">✓ Unlimited messages</p>
                                    </div>
                                )}
                                <button
                                    onClick={handleSignOut}
                                    className="w-full p-3 rounded-xl hover:bg-gray-100 flex items-center gap-3 text-gray-700"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 rounded-lg hover:bg-gray-100"
                        >
                            <Menu className="w-5 h-5 text-gray-700" />
                        </button>
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center">
                                <GraduationCap className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold text-gray-900">AskUni</span>
                        </Link>
                    </div>

                    {isTrial && (
                        <div className="flex items-center gap-3 text-sm text-gray-700">
                            <Clock className="w-4 h-4" />
                            <span>{formatTime(trialTimeLeft)}</span>
                            <span className="text-gray-400">|</span>
                            <Zap className="w-4 h-4" />
                            <span>{remainingMessages} left</span>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <div className="pt-16 min-h-screen flex flex-col">
                {messages.length === 0 ? (
                    /* Welcome Screen */
                    <div className="flex-1 flex items-center justify-center px-4 pb-32">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-3xl w-full text-center"
                        >
                            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
                                Let&apos;s make your dream a{' '}
                                <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                                    reality.
                                </span>
                                <br />
                                Right now.
                            </h1>

                            <p className="text-gray-600 text-lg mb-12">
                                AskUni helps you navigate university life with AI-powered assistance.
                                <br />
                                No complexity necessary.
                            </p>

                            {/* Input Box */}
                            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 mb-6">
                                <div className="relative">
                                    <textarea
                                        ref={inputRef}
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={handleKeyPress}
                                        placeholder="What do you want to know?"
                                        rows={1}
                                        className="w-full bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none resize-none pr-14 text-lg"
                                    />
                                    <button
                                        onClick={() => sendMessage()}
                                        disabled={!inputValue.trim() || isLoading}
                                        className="absolute right-0 top-0 w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 disabled:opacity-50 flex items-center justify-center text-white hover:shadow-lg transition"
                                    >
                                        <ArrowUp className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <p className="text-sm text-gray-600 mb-3">Not sure where to start? Try one of these:</p>
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {quickActions.map((action, i) => (
                                            <button
                                                key={i}
                                                onClick={() => sendMessage(action)}
                                                className="px-4 py-2 rounded-full border border-gray-300 hover:border-orange-400 hover:bg-orange-50 text-sm text-gray-700 transition"
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
                                        <div className="max-w-[80%] bg-gradient-to-br from-orange-400 to-orange-500 text-white rounded-3xl rounded-br-sm px-6 py-3 shadow-lg">
                                            <p>{message.content}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                                            <Sparkles className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="flex-1 bg-white/80 backdrop-blur-xl rounded-3xl rounded-tl-sm px-6 py-4 shadow-lg">
                                            {message.isStreaming && !message.content && (
                                                <div className="flex items-center gap-2 text-gray-500">
                                                    <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" />
                                                    <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                    <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                                    <span className="ml-2">Thinking...</span>
                                                </div>
                                            )}
                                            {message.content && (
                                                <div
                                                    className="prose prose-sm max-w-none prose-p:text-gray-800 prose-headings:text-gray-900 prose-strong:text-gray-900"
                                                    dangerouslySetInnerHTML={renderMarkdown(message.content)}
                                                />
                                            )}
                                            {message.isStreaming && message.content && (
                                                <span className="inline-block w-0.5 h-5 bg-orange-500 animate-pulse ml-1" />
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
                    <div className="sticky bottom-0 bg-gradient-to-t from-orange-50/50 to-transparent backdrop-blur-sm p-4">
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-4">
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
