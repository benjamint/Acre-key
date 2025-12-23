import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { ChevronLeft, Building2 } from 'lucide-react';
import ChatInterface from '@/components/chat/ChatInterface';

export default function KeyChat() {
    const [conversationId, setConversationId] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const convId = params.get('conversation');
        if (convId) {
            setConversationId(convId);
        }
    }, []);

    const handleConversationCreated = (id) => {
        setConversationId(id);
        window.history.replaceState({}, '', `${window.location.pathname}?conversation=${id}`);
    };

    return (
        <div className="h-screen flex flex-col bg-stone-50" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
            {/* Header */}
            <header className="bg-white border-b border-stone-200 px-4 py-3">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to={createPageUrl('Home')}>
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <ChevronLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold">K</span>
                            </div>
                            <div>
                                <h1 className="font-semibold text-stone-900">Key</h1>
                                <p className="text-xs text-stone-500">Your listing assistant</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Chat Area */}
            <div className="flex-1 overflow-hidden">
                <div className="h-full max-w-3xl mx-auto">
                    <ChatInterface 
                        agentType="key" 
                        conversationId={conversationId}
                        onConversationCreated={handleConversationCreated}
                    />
                </div>
            </div>
        </div>
    );
}