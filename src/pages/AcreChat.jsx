import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Home, LayoutGrid, ChevronLeft } from 'lucide-react';
import ChatInterface from '@/components/chat/ChatInterface';

export default function AcreChat() {
    const [conversationId, setConversationId] = useState(null);
    const navigate = useNavigate();

    // Check for existing conversation in URL
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
                            <div className="w-10 h-10 bg-[#295646] rounded-full flex items-center justify-center">
                                <span className="text-white font-bold">A</span>
                            </div>
                            <div>
                                <h1 className="font-semibold text-stone-900">Acre</h1>
                                <p className="text-xs text-stone-500">Your property finder</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <Link to={createPageUrl('PropertyBoard')}>
                            <Button variant="outline" size="sm" className="rounded-full">
                                <LayoutGrid className="w-4 h-4 mr-2" />
                                My Board
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Chat Area */}
            <div className="flex-1 overflow-hidden">
                <div className="h-full max-w-3xl mx-auto">
                    <ChatInterface 
                        agentType="acre" 
                        conversationId={conversationId}
                        onConversationCreated={handleConversationCreated}
                    />
                </div>
            </div>
        </div>
    );
}