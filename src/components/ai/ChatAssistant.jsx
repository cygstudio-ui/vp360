import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Bot, X, Send } from 'lucide-react';
import { callGemini } from '../../services/gemini';

import { tournamentContext } from '../../data/tournamentContext';

const ChatAssistant = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState([
        { role: 'system', text: "¡Hola! Soy Coach VP. Pregúntame sobre el torneo en Puerto Ordaz, reglas de pádel o tips de juego." }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput("");
        setIsTyping(true);

        const prompt = `${tournamentContext}\n\nHistorial:\n${messages.map(m => `${m.role}: ${m.text}`).join('\n')}\nUsuario: ${userMsg}\nAsistente:`;
        const reply = await callGemini(prompt);

        setMessages(prev => [...prev, { role: 'system', text: reply }]);
        setIsTyping(false);
    };

    if (!isOpen) return null;

    return (
        <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-20 right-4 left-4 md:left-auto md:w-80 h-96 bg-slate-800 rounded-2xl shadow-2xl border border-slate-600 z-50 flex flex-col overflow-hidden">
            <div className="bg-lime-500 p-3 flex justify-between items-center text-slate-900">
                <div className="flex items-center gap-2">
                    <Bot size={20} />
                    <span className="font-bold text-sm">Coach VP</span>
                </div>
                <button onClick={onClose}>
                    <X size={18} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-900/50">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-2 rounded-xl text-xs ${msg.role === 'user'
                            ? 'bg-lime-500/20 text-lime-400 border border-lime-500/30' : 'bg-slate-700 text-white'}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-slate-700 px-3 py-2 rounded-xl">
                            <div className="flex gap-1">
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-3 bg-slate-800 border-t border-slate-700 flex gap-2">
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Pregunta sobre el torneo..."
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-full px-3 text-xs text-white focus:outline-none
        focus:border-lime-400"
                />
                <button onClick={handleSend} className="bg-lime-400 text-slate-900 p-2 rounded-full hover:bg-lime-300">
                    <Send size={16} />
                </button>
            </div>
        </motion.div>
    );
};

export default ChatAssistant;
