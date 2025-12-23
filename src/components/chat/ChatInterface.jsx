import { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, Sparkles } from 'lucide-react';
import { cn } from "@/lib/utils";
import MessageBubble from './MessageBubble';
import VoiceControls from './VoiceControls';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatInterface({ agentType = 'acre', conversationId, onConversationCreated }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [conversation, setConversation] = useState(null);
    const [isVoiceMode, setIsVoiceMode] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const lastMessageRef = useRef(null);

    const agentName = agentType === 'acre' ? 'acre' : 'key';
    const agentDisplayName = agentType === 'acre' ? 'Acre' : 'Key';
    const agentColor = agentType === 'acre' ? 'emerald' : 'amber';

    useEffect(() => {
        const initConversation = async () => {
            if (conversationId) {
                try {
                    const conv = await base44.agents.getConversation(conversationId);
                    setConversation(conv);
                    setMessages(conv.messages || []);
                } catch (error) {
                    console.error('Error loading conversation:', error);
                }
            }
        };
        initConversation();
    }, [conversationId]);

    useEffect(() => {
        if (conversation?.id) {
            try {
                const unsubscribe = base44.agents.subscribeToConversation(conversation.id, (data) => {
                    setMessages(data.messages || []);
                    setIsLoading(false);
                });
                return () => {
                    if (unsubscribe && typeof unsubscribe === 'function') {
                        unsubscribe();
                    }
                };
            } catch (error) {
                console.error('Subscription error:', error);
                setIsLoading(false);
            }
        }
    }, [conversation?.id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Handle pre-filled neighborhood query from URL
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const neighborhood = params.get('neighborhood');
        if (neighborhood && !conversation && agentType === 'acre') {
            setInput(`Tell me about the ${neighborhood} neighborhood - I'd like a deep dive into crime rates, school ratings, noise levels, and what it's like to live there.`);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [agentType]);

    // Auto-speak new messages in voice mode
    useEffect(() => {
        if (isVoiceMode && messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.role === 'assistant' && lastMessage !== lastMessageRef.current) {
                lastMessageRef.current = lastMessage;
                if (lastMessage.content && window.acreSpeak) {
                    window.acreSpeak(lastMessage.content);
                }
            }
        }
    }, [messages, isVoiceMode]);

    const handleVoiceTranscript = (transcript) => {
        setInput(transcript);
        setTimeout(() => sendMessage(), 100);
    };

    const handleVoiceStart = () => {
        setIsVoiceMode(true);
        if (!conversation) {
            // Auto-start conversation with a greeting
            setTimeout(() => {
                setInput("Hi, I'd like to find a place to live. Can you help me?");
                sendMessage();
            }, 500);
        }
    };

    const handleVoiceEnd = () => {
        setIsVoiceMode(false);
    };

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;
        
        const userMessage = input.trim();
        setInput('');
        setIsLoading(true);

        try {
            let conv = conversation;
            if (!conv) {
                conv = await base44.agents.createConversation({
                    agent_name: agentName,
                    metadata: { name: `${agentDisplayName} Chat` }
                });
                setConversation(conv);
                onConversationCreated?.(conv.id);
            }

            await base44.agents.addMessage(conv, {
                role: 'user',
                content: userMessage
            });
        } catch (error) {
            console.error('Error sending message:', error);
            setIsLoading(false);
        }
    };

    const greetings = {
        acre: "Hi there! I'm Acre, your personal property-finding assistant. Instead of making you fill out forms or click through endless filters, I'd love to just chat about what you're looking for. Tell me a bit about your ideal place - what matters most to you?",
        key: "Hello! I'm Key, your listing assistant. I help property owners and agents get their listings in front of qualified, pre-vetted seekers. Would you like to list a property today?"
    };

    return (
        <div className="flex flex-col h-full bg-stone-50">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
                {messages.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center h-full text-center px-4"
                    >
                        <div className={cn(
                            "w-16 h-16 rounded-full flex items-center justify-center mb-4",
                            agentType === 'acre' ? 'bg-[#295646]/10' : 'bg-amber-100'
                        )}>
                            <Sparkles className={cn(
                                "w-8 h-8",
                                agentType === 'acre' ? 'text-[#295646]' : 'text-amber-600'
                            )} />
                        </div>
                        <h2 className="text-xl font-semibold text-stone-800 mb-2">
                            Meet {agentDisplayName}
                        </h2>
                        <p className="text-stone-600 max-w-md mb-8">
                            {greetings[agentType]}
                        </p>

                        <div className="mb-8">
                            <VoiceControls
                                onTranscript={handleVoiceTranscript}
                                onVoiceStart={handleVoiceStart}
                                onVoiceEnd={handleVoiceEnd}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex-1 h-px bg-stone-200" />
                            <span className="text-xs text-stone-400 uppercase tracking-wide">or type</span>
                            <div className="flex-1 h-px bg-stone-200" />
                        </div>

                        <div className="flex flex-wrap gap-2 justify-center">
                            {agentType === 'acre' ? (
                                <>
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        className="rounded-full"
                                        onClick={() => setInput("I'm looking for a place to rent in NYC")}
                                    >
                                        Looking to rent
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        className="rounded-full"
                                        onClick={() => setInput("I want to buy my first home")}
                                    >
                                        Ready to buy
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        className="rounded-full"
                                        onClick={() => setInput("I have an apartment to list")}
                                    >
                                        List a rental
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        className="rounded-full"
                                        onClick={() => setInput("I'm selling my property")}
                                    >
                                        List for sale
                                    </Button>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
                
                <AnimatePresence>
                    {messages.map((msg, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <MessageBubble message={msg} agentType={agentType} />
                        </motion.div>
                    ))}
                </AnimatePresence>
                
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-3"
                    >
                        <div className={cn(
                            "h-8 w-8 rounded-full flex items-center justify-center text-white font-semibold text-sm",
                            agentType === 'acre' ? 'bg-[#295646]' : 'bg-amber-600'
                        )}>
                            {agentType === 'acre' ? 'A' : 'K'}
                        </div>
                        <div className="bg-white border border-stone-200 rounded-2xl px-4 py-3 shadow-sm">
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-stone-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-2 h-2 bg-stone-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-2 h-2 bg-stone-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-stone-200 bg-white p-4">
                <div className="max-w-3xl mx-auto space-y-3">
                    {/* Voice Controls - Show only when in voice mode or when there are messages */}
                    {(isVoiceMode || messages.length > 0) && (
                        <div className="flex justify-center">
                            <VoiceControls
                                onTranscript={handleVoiceTranscript}
                                onVoiceStart={handleVoiceStart}
                                onVoiceEnd={handleVoiceEnd}
                                disabled={isLoading}
                            />
                        </div>
                    )}

                    {/* Text Input */}
                    {!isVoiceMode && messages.length > 0 && (
                        <form 
                            onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                            className="flex gap-3"
                        >
                            <Input
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={`Message ${agentDisplayName}...`}
                                className="flex-1 rounded-full border-stone-300 focus:border-stone-400 focus:ring-stone-400"
                                disabled={isLoading}
                            />
                            <Button 
                                type="submit" 
                                disabled={!input.trim() || isLoading}
                                className={cn(
                                    "rounded-full px-4",
                                    agentType === 'acre' 
                                        ? 'bg-[#295646] hover:bg-[#1f4035]' 
                                        : 'bg-amber-600 hover:bg-amber-700'
                                )}
                            >
                                {isLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Send className="w-4 h-4" />
                                )}
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}