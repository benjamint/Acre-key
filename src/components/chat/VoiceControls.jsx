import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Phone, PhoneOff, Volume2 } from 'lucide-react';
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from 'framer-motion';

export default function VoiceControls({ onTranscript, onVoiceStart, onVoiceEnd, disabled }) {
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isCallActive, setIsCallActive] = useState(false);
    const recognitionRef = useRef(null);
    const synthRef = useRef(window.speechSynthesis);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[event.results.length - 1][0].transcript;
                if (transcript.trim()) {
                    onTranscript(transcript);
                }
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                if (event.error === 'no-speech' || event.error === 'aborted') {
                    // Restart if it was just a pause
                    if (isCallActive) {
                        setTimeout(() => {
                            try {
                                recognitionRef.current?.start();
                            } catch (e) {
                                // Already started
                            }
                        }, 100);
                    }
                }
            };

            recognitionRef.current.onend = () => {
                if (isCallActive && isListening) {
                    // Restart recognition if call is still active
                    try {
                        recognitionRef.current?.start();
                    } catch (e) {
                        // Already started
                    }
                } else {
                    setIsListening(false);
                }
            };
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            synthRef.current?.cancel();
        };
    }, [isCallActive, isListening, onTranscript]);

    const startCall = () => {
        setIsCallActive(true);
        setIsListening(true);
        onVoiceStart?.();
        
        // Start listening
        try {
            recognitionRef.current?.start();
        } catch (e) {
            console.error('Error starting recognition:', e);
        }
    };

    const endCall = () => {
        setIsCallActive(false);
        setIsListening(false);
        onVoiceEnd?.();
        
        try {
            recognitionRef.current?.stop();
        } catch (e) {
            // Already stopped
        }
        synthRef.current?.cancel();
        setIsSpeaking(false);
    };

    const toggleMute = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            try {
                recognitionRef.current?.start();
                setIsListening(true);
            } catch (e) {
                console.error('Error toggling mic:', e);
            }
        }
    };

    // Expose speak function via ref
    useEffect(() => {
        window.acreSpeak = (text) => {
            if (!isCallActive) return;
            
            synthRef.current?.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;
            
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            
            synthRef.current?.speak(utterance);
        };

        return () => {
            delete window.acreSpeak;
        };
    }, [isCallActive]);

    const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    
    if (!isSupported) {
        return (
            <div className="text-center py-2">
                <p className="text-xs text-stone-500">
                    Voice chat requires Chrome, Edge, or Safari browser
                </p>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3">
            <AnimatePresence>
                {isCallActive ? (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="flex items-center gap-3"
                    >
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={toggleMute}
                            disabled={disabled}
                            className={cn(
                                "rounded-full w-12 h-12",
                                !isListening && "bg-red-50 border-red-300"
                            )}
                        >
                            {isListening ? (
                                <Mic className="w-5 h-5 text-[#295646]" />
                            ) : (
                                <MicOff className="w-5 h-5 text-red-500" />
                            )}
                        </Button>

                        {isSpeaking && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full border border-blue-200">
                                <Volume2 className="w-4 h-4 text-blue-600 animate-pulse" />
                                <span className="text-xs text-blue-700 font-medium">Acre speaking...</span>
                            </div>
                        )}

                        <Button
                            onClick={endCall}
                            disabled={disabled}
                            className="rounded-full w-12 h-12 bg-red-500 hover:bg-red-600"
                        >
                            <PhoneOff className="w-5 h-5" />
                        </Button>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                    >
                        <Button
                            onClick={startCall}
                            disabled={disabled}
                            className="rounded-full bg-[#295646] hover:bg-[#1f4035] px-6 h-12"
                        >
                            <Phone className="w-5 h-5 mr-2" />
                            Start Voice Call
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {isCallActive && isListening && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#295646]/10 rounded-full border border-[#295646]/20">
                    <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-2 h-2 bg-[#295646] rounded-full"
                    />
                    <span className="text-xs text-[#295646] font-medium">Listening...</span>
                </div>
            )}
        </div>
    );
}