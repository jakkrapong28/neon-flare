"use client";

import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { MessageCircle, X, Send, Zap, Minimize2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import axios from "axios";

export interface NeonChatWidgetRef {
    openChat: () => void;
    analyze: () => void;
}

const NeonChatWidget = forwardRef<NeonChatWidgetRef, any>((props, ref) => {
    const t = useTranslations('Chat');
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
        { role: 'ai', text: t('welcome') }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    useImperativeHandle(ref, () => ({
        openChat: () => setIsOpen(true),
        analyze: () => handleAnalyze()
    }));

    const handleAnalyze = async () => {
        setIsOpen(true);
        // Add a hidden system trigger or just a user-facing message
        // For visual effect, we simulate the user asking for analysis
        const userMsg = t('analyze_request');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        await sendMessageToAI(userMsg, true);
    };

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMsg = input;
        setInput("");
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        await sendMessageToAI(userMsg);
    };

    const sendMessageToAI = async (msg: string, isAnalysis = false) => {
        setIsTyping(true);
        try {
            const token = localStorage.getItem("authToken");
            // Determine endpoint based on intent (Analysis vs Chat) - using same for simplicity but context differs
            // For now, we use a single chat endpoint that handles context
            const res = await axios.post("http://localhost:3005/api/ai/chat", {
                message: msg,
                isAnalysis
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessages(prev => [...prev, { role: 'ai', text: res.data.response }]);
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { role: 'ai', text: t('error') }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            {/* Floating Toggle Button */}
            {!isOpen && !props.hideTrigger && (
                <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-black/60 backdrop-blur-md border border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.5)] flex items-center justify-center text-cyan-400 overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <MessageCircle className="w-7 h-7 relative z-10" />
                    {/* Notification Dot (Optional Logic) */}
                    <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border border-black code-font" />
                </motion.button>
            )}

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed bottom-6 right-6 z-50 w-[380px] h-[600px] max-h-[80vh] flex flex-col rounded-2xl overflow-hidden border border-white/10 shadow-2xl backdrop-blur-xl bg-black/40"
                    >
                        {/* Header */}
                        <div className="h-16 bg-white/5 border-b border-white/5 flex items-center justify-between px-4 backdrop-blur-md">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 p-[1px] shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                                        <Sparkles className="w-5 h-5 text-cyan-400" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white tracking-wide text-sm flex items-center gap-2">
                                        NEON AI <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-500/20">ONLINE</span>
                                    </h3>
                                    <p className="text-[10px] text-zinc-400">LifeOS Assistant</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-white hover:bg-white/5 rounded-full">
                                <Minimize2 className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-lg ${msg.role === 'user'
                                        ? 'bg-gradient-to-br from-cyan-600 to-blue-700 text-white rounded-br-none border border-cyan-500/20'
                                        : 'bg-zinc-900/80 text-zinc-200 rounded-bl-none border border-white/10'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}

                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-zinc-900/50 p-3 rounded-2xl rounded-bl-none border border-white/5 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce"></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white/5 border-t border-white/5 backdrop-blur-md">
                            <div className="relative flex items-center gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder={t('placeholder')}
                                    disabled={isTyping}
                                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all disabled:opacity-50"
                                />
                                <Button
                                    onClick={handleSend}
                                    disabled={isTyping || !input.trim()}
                                    size="icon"
                                    className="bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl w-11 h-11 shrink-0 shadow-[0_0_15px_rgba(8,145,178,0.4)]"
                                >
                                    <Send className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
});

NeonChatWidget.displayName = "NeonChatWidget";

export { NeonChatWidget };
