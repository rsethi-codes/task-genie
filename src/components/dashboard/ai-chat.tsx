"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, User, Brain, Bot, Minus, Maximize2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/core";
import { cn } from "@/lib/utils";

interface Message {
    id: string;
    role: "user" | "ai";
    content: string;
}

export function AIChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        { id: "1", role: "ai", content: "Hello! I'm Genie. I've analyzed your current focus and tasks. How can I help you optimize your flow today?" },
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            setIsTyping(false);
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "ai",
                content: "I've updated your schedule based on that. I've also broken down the 'Database' task into 4 subtasks to make it more manageable. Check your focus view!"
            };
            setMessages((prev) => [...prev, aiMsg]);
        }, 1500);
    };

    return (
        <>
            <div className="fixed bottom-8 right-8 z-[100]">
                <AnimatePresence>
                    {!isOpen && (
                        <motion.button
                            initial={{ scale: 0, rotate: -20 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 20 }}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsOpen(true)}
                            className="w-16 h-16 rounded-2xl ai-gradient flex items-center justify-center text-white ai-glow shadow-2xl relative group"
                        >
                            <Sparkles className="w-8 h-8" />
                            <div className="absolute -top-12 right-0 bg-surface border border-border px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                <p className="text-xs font-bold">Ask Genie</p>
                            </div>
                        </motion.button>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 100, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 100, scale: 0.9 }}
                            className={cn(
                                "glass border border-white/10 rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden backdrop-blur-3xl",
                                isMinimized ? "h-20 w-80" : "h-[600px] w-[400px]"
                            )}
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-border flex items-center justify-between bg-surface/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 ai-gradient rounded-xl flex items-center justify-center">
                                        <Sparkles className="text-white w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-display font-bold">Genie AI</h3>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                                            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Thinking Mode</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setIsMinimized(!isMinimized)} className="p-2 hover:bg-surface rounded-lg transition-colors">
                                        {isMinimized ? <Maximize2 size={16} /> : <Minus size={16} />}
                                    </button>
                                    <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-surface rounded-lg transition-colors">
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>

                            {!isMinimized && (
                                <>
                                    {/* Messages */}
                                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                                        {messages.map((msg) => (
                                            <motion.div
                                                initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                key={msg.id}
                                                className={cn("flex gap-3 max-w-[85%]", msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto")}
                                            >
                                                <div className={cn(
                                                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                                                    msg.role === "user" ? "bg-primary/20 text-primary" : "ai-gradient text-white"
                                                )}>
                                                    {msg.role === "user" ? <User size={14} /> : <Bot size={14} />}
                                                </div>
                                                <div className={cn(
                                                    "p-4 rounded-2xl text-sm font-medium leading-relaxed",
                                                    msg.role === "user" ? "bg-primary text-background rounded-tr-none" : "bg-surface border border-border rounded-tl-none"
                                                )}>
                                                    {msg.content}
                                                </div>
                                            </motion.div>
                                        ))}
                                        {isTyping && (
                                            <div className="flex gap-3 items-center mr-auto">
                                                <div className="w-8 h-8 rounded-lg ai-gradient flex items-center justify-center text-white">
                                                    <Bot size={14} />
                                                </div>
                                                <div className="bg-surface border border-border p-4 rounded-2xl rounded-tl-none flex gap-1">
                                                    <span className="w-1.5 h-1.5 bg-text/30 rounded-full animate-bounce" />
                                                    <span className="w-1.5 h-1.5 bg-text/30 rounded-full animate-bounce [animation-delay:0.2s]" />
                                                    <span className="w-1.5 h-1.5 bg-text/30 rounded-full animate-bounce [animation-delay:0.4s]" />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Input */}
                                    <div className="p-6 border-t border-border bg-surface/30">
                                        <div className="relative">
                                            <textarea
                                                rows={1}
                                                value={input}
                                                onChange={(e) => setInput(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter" && !e.shiftKey) {
                                                        e.preventDefault();
                                                        handleSend();
                                                    }
                                                }}
                                                placeholder="Command Genie..."
                                                className="w-full bg-surface border border-border rounded-2xl py-3 pl-4 pr-12 text-sm focus:border-primary transition-all outline-none resize-none max-h-32"
                                            />
                                            <button
                                                onClick={handleSend}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:scale-110 transition-transform"
                                            >
                                                <Send size={18} />
                                            </button>
                                        </div>
                                        <p className="text-[10px] text-center mt-4 font-bold text-text-secondary uppercase tracking-[0.2em] opacity-40">Genie Intelligence · v2.4.0</p>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}
