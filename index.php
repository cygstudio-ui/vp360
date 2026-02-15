import React, { useState, useEffect, useRef } from 'react';
import {
Trophy,
Calendar,
MapPin,
Utensils,
User,
Activity,
ChevronRight,
Clock,
Menu,
X,
Zap,
Award,
Settings,
Smartphone,
Sparkles,
Bot,
MessageCircle,
Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- GEMINI API CONFIG ---
const apiKey = ""; // La clave se inyectará en tiempo de ejecución

const callGemini = async (prompt) => {
try {
const response = await fetch(
`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
{
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
contents: [{ parts: [{ text: prompt }] }],
}),
}
);

if (!response.ok) throw new Error("API Error");
const data = await response.json();
return data.candidates[0].content.parts[0].text;
} catch (error) {
console.error("Gemini Error:", error);
return "Lo siento, la red neuronal de VP está saturada en este momento. Intenta de nuevo.";
}
};

// --- MOCK DATA ---

const PLAYERS = [
{ id: 1, name: "Ale Galán", rank: 1, country: "ESP", img: "AG", stats: { power: 98, speed: 95, defense: 90 } },
{ id: 2, name: "Juan Lebrón", rank: 1, country: "ESP", img: "JL", stats: { power: 99, speed: 92, defense: 88 } },
{ id: 3, name: "Agustín Tapia", rank: 2, country: "ARG", img: "AT", stats: { power: 96, speed: 99, defense: 94 } },
{ id: 4, name: "Arturo Coello", rank: 2, country: "ESP", img: "AC", stats: { power: 97, speed: 94, defense: 92 } },
];

const FOOD_MENU = [
{ id: 1, name: "Power Bowl VP", desc: "Quinoa, aguacate, pollo grillé", price: "$12", cat: "Saludable" },
{ id: 2, name: "Smash Burger", desc: "Doble carne, queso cheddar, salsa secreta", price: "$15", cat: "Grill" },
{ id: 3, name: "Isotónica Casera", desc: "Limón, miel, sal del himalaya", price: "$5", cat: "Bebidas" },
];

const SCHEDULE = [
{ id: 101, time: "09:00 AM", p1: "Navarro/Chingotto", p2: "Bela/Yanguas", court: "Cancha Central", status: "Finalizado",
score: "6-4, 6-3" },
{ id: 102, time: "11:30 AM", p1: "Galán/Lebrón", p2: "Tapia/Coello", court: "Cancha Central", status: "LIVE", score: "In
Progress" },
{ id: 103, time: "02:00 PM", p1: "Stupa/Di Nenno", p2: "Momo/Garrido", court: "Cancha 2", status: "Pendiente", score:
"-" },
];

// --- COMPONENTS ---

// 1. Splash Screen
const SplashScreen = ({ onFinish }) => {
useEffect(() => {
const timer = setTimeout(onFinish, 2500);
return () => clearTimeout(timer);
}, [onFinish]);

return (
<motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900 text-white">
    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8,
        ease: "easeOut" }} className="text-6xl font-black tracking-tighter italic">
        <span className="text-lime-400">VP</span> 360
    </motion.div>
    <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
        className="mt-4 text-sm font-medium tracking-widest uppercase text-slate-400">
        NO es Magia, es VP
    </motion.p>

    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        className="mt-12 w-12 h-12 border-4 border-lime-400 border-t-transparent rounded-full" />
</motion.div>
);
};

// 2. AI Analyst Modal
const AnalystModal = ({ match, onClose }) => {
const [analysis, setAnalysis] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
const fetchAnalysis = async () => {
// Find basic stats if players exist in our DB, else mock generically
const p1Data = PLAYERS.find(p => match.p1.includes(p.name.split(" ")[1])) || { stats: { power: 85, speed: 85 } };

const prompt = `Actúa como un analista experto de World Padel Tour. Analiza brevemente el partido de pádel entre
${match.p1} y ${match.p2}.
Considera que es un partido de alto nivel.
Genera una respuesta en formato JSON con los siguientes campos:
- "prediction": Quién tiene más probabilidad de ganar y porcentaje (ej: "Galán/Lebrón 55%").
- "keyFactor": Un factor clave técnico o táctico (máximo 15 palabras).
- "analysis": Un párrafo corto (máximo 40 palabras) emocionante sobre el choque de estilos.
Responde SOLO el JSON.`;

const result = await callGemini(prompt);
try {
// Clean markdown if present
const jsonStr = result.replace(/```json/g, '').replace(/```/g, '');
setAnalysis(JSON.parse(jsonStr));
} catch (e) {
setAnalysis({
prediction: "Análisis complejo...",
keyFactor: "Duelo de titanes en la red",
analysis: "Ambas parejas muestran un nivel excepcional. El partido se decidirá por pequeños detalles en los puntos de
oro."
});
}
setLoading(false);
};

if (match) fetchAnalysis();
}, [match]);

return (
<div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-sm">
    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-800 w-full max-w-sm rounded-3xl border border-lime-400/30 overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 relative">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2 text-lime-400">
                    <Sparkles size={18} />
                    <span className="font-bold text-sm tracking-wider uppercase">VP Analyst AI</span>
                </div>
                <button onClick={onClose}>
                    <X size={20} className="text-slate-400 hover:text-white" />
                </button>
            </div>

            <h3 className="text-xl font-bold text-white mb-1">{match.p1}</h3>
            <p className="text-slate-400 text-xs mb-2">VS</p>
            <h3 className="text-xl font-bold text-white">{match.p2}</h3>
        </div>

        <div className="p-6 space-y-6">
            {loading ? (
            <div className="flex flex-col items-center py-8 space-y-4">
                <div className="w-8 h-8 border-2 border-lime-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-400 text-xs animate-pulse">Procesando biometría y estadísticas...</p>
            </div>
            ) : (
            <>
                <div className="bg-slate-900/50 p-4 rounded-xl border border-lime-400/20">
                    <p className="text-slate-400 text-[10px] uppercase tracking-wider mb-1">Predicción IA</p>
                    <p className="text-2xl font-black text-white italic">{analysis?.prediction}</p>
                </div>

                <div>
                    <p className="text-lime-400 text-xs font-bold mb-1 flex items-center gap-1">
                        <Zap size={12} /> La Clave del Partido
                    </p>
                    <p className="text-white text-sm font-medium leading-relaxed">
                        "{analysis?.keyFactor}"
                    </p>
                </div>

                <div className="bg-slate-700/30 p-3 rounded-lg">
                    <p className="text-slate-300 text-xs italic leading-relaxed">
                        {analysis?.analysis}
                    </p>
                </div>
            </>
            )}
        </div>

        <div className="p-4 bg-slate-900 border-t border-slate-700 text-center">
            <p className="text-[10px] text-slate-500">Powered by Gemini AI • Datos en tiempo real</p>
        </div>
    </motion.div>
</div>
);
};

// 3. Chatbot Component
const ChatAssistant = ({ isOpen, onClose }) => {
const [messages, setMessages] = useState([
{ role: 'system', text: "¡Hola! Soy Coach VP. Pregúntame sobre reglas, estadísticas de jugadores o el menú del club." }
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

const context = `
Eres el asistente virtual del torneo de pádel VP 360.
Datos del evento:
- Jugadores top: Galán (Potencia 98), Lebrón (Potencia 99), Tapia, Coello.
- Comida: Power Bowl ($12), Smash Burger ($15).
- Lugar: Club Padel VZLA, Caracas.
Responde de forma corta, útil y con un tono deportivo y amigable. Usa emojis.
`;

const prompt = `${context}\nUsuario: ${userMsg}\nAsistente:`;
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
        <div key={i} className={`flex ${msg.role==='user' ? 'justify-end' : 'justify-start' }`}>
            <div className={`max-w-[80%] p-2 rounded-xl text-xs ${msg.role==='user'
                ? 'bg-lime-500/20 text-lime-400 border border-lime-500/30' : 'bg-slate-700 text-white' }`}>
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
        <input type="text" value={input} onChange={(e)=> setInput(e.target.value)}
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

// 4. Live Match Component (Updated)
const LiveMatchTracker = ({ activeMatch, isAdmin, updateScore }) => {
const bars = [40, 60, 30, 80, 50, 70, 90, 60, 40, 50, 70, 60, 80, 90, 70, 50];

return (
<div
    className="w-full relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-2xl">
    <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(#a3e635 1px, transparent 1px)' , backgroundSize: '20px 20px' }}></div>

    <div className="relative p-6">
        <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
                <span className="animate-pulse w-3 h-3 bg-red-500 rounded-full"></span>
                <span className="text-red-500 font-bold text-xs tracking-wider uppercase">En Vivo • Final Set</span>
            </div>
            <span className="text-slate-400 text-xs font-mono">Cancha Central</span>
        </div>

        <div className="flex justify-between items-center text-white">
            <div className="flex flex-col items-center flex-1">
                <div
                    className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center text-xl font-bold mb-2 border-2 border-slate-600">
                    GL</div>
                <span className="font-bold text-lg leading-none">Galán</span>
                <span className="text-xs text-slate-400">Lebrón</span>
            </div>

            <div className="flex flex-col items-center px-4">
                <div className="flex gap-4 text-3xl font-black font-mono mb-2">
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-slate-500 text-sm font-sans font-normal">S1</span>
                        <span className="opacity-50">6</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-slate-500 text-sm font-sans font-normal">S2</span>
                        <span className="opacity-50">4</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-lime-400 text-sm font-sans font-normal">S3</span>
                        <span className="text-lime-400 scale-110">{activeMatch.sets[2]}</span>
                    </div>
                </div>

                <div className="bg-slate-950 px-6 py-2 rounded-xl border border-slate-700/50 flex items-center gap-3">
                    <span className="text-4xl font-black text-white tracking-widest">{activeMatch.points}</span>
                </div>
            </div>

            <div className="flex flex-col items-center flex-1">
                <div
                    className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center text-xl font-bold mb-2 border-2 border-slate-600">
                    TC</div>
                <span className="font-bold text-lg leading-none">Tapia</span>
                <span className="text-xs text-slate-400">Coello</span>
            </div>
        </div>

        <div className="flex justify-center mt-4">
            {activeMatch.server === 'p1' ? (
            <motion.div layoutId="server-indicator"
                className="flex items-center gap-1 text-xs text-lime-400 bg-lime-400/10 px-3 py-1 rounded-full">
                <Activity size={12} /> Sirviendo: Galán/Lebrón
            </motion.div>
            ) : (
            <motion.div layoutId="server-indicator"
                className="flex items-center gap-1 text-xs text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full">
                <Activity size={12} /> Sirviendo: Tapia/Coello
            </motion.div>
            )}
        </div>
    </div>

    <div className="bg-slate-950/50 p-4 border-t border-slate-800">
        <div className="flex justify-between text-xs text-slate-400 mb-2 uppercase tracking-wide">
            <span>Momentum del Partido</span>
            <span>Últimos 5 min</span>
        </div>
        <div className="flex items-end gap-1 h-12 justify-between">
            {bars.map((height, i) => (
            <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${height}%` }} transition={{ duration: 0.5,
                delay: i * 0.05 }} className={`flex-1 rounded-t-sm ${i> 10 ? 'bg-lime-500' : 'bg-slate-700'}`}
                />
                ))}
        </div>
    </div>

    {isAdmin && (
    <div className="p-4 bg-slate-800 border-t border-slate-700 grid grid-cols-2 gap-2">
        <button onClick={()=> updateScore('p1')} className="bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg
            text-xs font-bold transition-colors">Punto P1 (G/L)</button>
        <button onClick={()=> updateScore('p2')} className="bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg
            text-xs font-bold transition-colors">Punto P2 (T/C)</button>
    </div>
    )}
</div>
);
};

// 5. Matches View (Updated with Analyze Button)
const MatchesView = ({ activeMatch, isAdmin, updateScore, onAnalyze }) => (
<div className="space-y-6 pb-24">
    <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-white">Torneo en curso</h2>
        <button className="text-lime-400 text-sm font-medium">Ver Cuadro</button>
    </div>

    <LiveMatchTracker activeMatch={activeMatch} isAdmin={isAdmin} updateScore={updateScore} />

    <div className="mt-8">
        <h3 className="text-slate-400 uppercase text-xs font-bold tracking-wider mb-4">Próximos Partidos</h3>
        <div className="space-y-3">
            {SCHEDULE.filter(m => m.status !== 'LIVE').map((match) => (
            <div key={match.id}
                className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 backdrop-blur-sm relative group">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                        <Clock size={14} className="text-lime-400" /> {match.time}
                    </div>
                    {match.status === 'Pendiente' && (
                    <button onClick={()=> onAnalyze(match)}
                        className="flex items-center gap-1 text-[10px] bg-slate-700 hover:bg-lime-500
                        hover:text-slate-900 text-white px-2 py-1 rounded-full transition-all border border-lime-400/30"
                        >
                        <Sparkles size={10} /> Análisis IA ✨
                    </button>
                    )}
                </div>

                <div className="flex justify-between items-center">
                    <div>
                        <div className="text-white font-bold text-lg">{match.p1}</div>
                        <div className="text-slate-400 text-sm">vs {match.p2}</div>
                    </div>
                    <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${match.status==='Finalizado'
                            ? 'bg-slate-700 text-slate-300' : 'bg-blue-500/20 text-blue-400' }`}>
                            {match.status}
                        </span>
                        {match.status === 'Finalizado' && (
                        <div className="mt-1 text-xs text-slate-300 font-mono">{match.score}</div>
                        )}
                    </div>
                </div>
            </div>
            ))}
        </div>
    </div>
</div>
);

// ... (PlayersView and VenueView remain largely the same, included for completeness in single file)
const PlayersView = () => (
<div className="pb-24">
    <h2 className="text-2xl font-bold text-white mb-6">Jugadores Top</h2>
    <div className="grid grid-cols-2 gap-4">
        {PLAYERS.map(player => (
        <motion.div whileTap={{ scale: 0.98 }} key={player.id}
            className="bg-slate-800 rounded-2xl overflow-hidden relative group">
            <div className="h-32 bg-slate-700 relative overflow-hidden">
                <div
                    className="absolute inset-0 flex items-center justify-center text-4xl font-black text-slate-600 opacity-30 select-none">
                    {player.img}</div>
                <div className="absolute top-2 right-2 bg-lime-400 text-slate-900 text-xs font-bold px-2 py-1 rounded">
                    #{player.rank}</div>
            </div>
            <div className="p-4">
                <h3 className="text-white font-bold leading-tight">{player.name}</h3>
                <p className="text-slate-400 text-xs mb-3">{player.country}</p>
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-300"><span>Potencia</span><span
                            className="text-lime-400">{player.stats.power}</span></div>
                    <div className="w-full bg-slate-700 h-1 rounded-full overflow-hidden">
                        <div className="bg-lime-400 h-full" style={{ width: `${player.stats.power}%` }}></div>
                    </div>
                </div>
            </div>
        </motion.div>
        ))}
    </div>
</div>
);

const VenueView = () => (
<div className="pb-24 space-y-8">
    <div className="relative h-48 rounded-3xl overflow-hidden bg-slate-800 mb-6">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10"></div>
        <div className="absolute inset-0 flex items-center justify-center bg-slate-700 text-slate-500">[Imagen 360 del
            Club]</div>
        <div className="absolute bottom-4 left-4 z-20">
            <h2 className="text-2xl font-bold text-white">Club Padel VZLA</h2>
            <p className="text-slate-300 text-sm flex items-center gap-1">
                <MapPin size={14} className="text-lime-400" /> Av. Principal, Caracas
            </p>
        </div>
    </div>
    <div>
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Utensils size={20} className="text-lime-400" /> Gastronomía VP
            </h3>
        </div>
        <div className="space-y-4">
            {FOOD_MENU.map(item => (
            <div key={item.id} className="flex gap-4 p-4 bg-slate-800/40 rounded-xl border border-slate-700/50">
                <div className="w-16 h-16 bg-slate-700 rounded-lg flex-shrink-0"></div>
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <h4 className="text-white font-bold">{item.name}</h4><span
                            className="text-lime-400 font-bold">{item.price}</span>
                    </div>
                    <p className="text-slate-400 text-xs mt-1">{item.desc}</p>
                </div>
            </div>
            ))}
        </div>
    </div>
</div>
);

// 6. Main App Container
export default function VP360App() {
const [loading, setLoading] = useState(true);
const [activeTab, setActiveTab] = useState('matches');
const [isAdmin, setIsAdmin] = useState(false);
const [activeMatch, setActiveMatch] = useState({ sets: [6, 4, 2], points: "15 - 30", server: "p1" });

// AI States
const [analyzingMatch, setAnalyzingMatch] = useState(null);
const [showChat, setShowChat] = useState(false);

const updateScore = (winner) => {
const pointsArr = ["0", "15", "30", "40", "AD"];
let currentP1 = activeMatch.points.split(" - ")[0].trim();
let currentP2 = activeMatch.points.split(" - ")[1].trim();
let newScore;
if (winner === 'p1') {
if(currentP1 === "30") newScore = "40 - " + currentP2;
else if(currentP1 === "15") newScore = "30 - " + currentP2;
else if(currentP1 === "0") newScore = "15 - " + currentP2;
else newScore = "AD - 40";
} else {
if(currentP2 === "30") newScore = currentP1 + " - 40";
else if(currentP2 === "15") newScore = currentP1 + " - 30";
else if(currentP2 === "0") newScore = currentP1 + " - 15";
else newScore = "40 - AD";
}
setActiveMatch(prev => ({ ...prev, points: newScore, server: Math.random() > 0.5 ? 'p1' : 'p2' }));
};

if (loading) return <SplashScreen onFinish={()=> setLoading(false)} />;

    return (
    <div className="min-h-screen bg-slate-900 font-sans selection:bg-lime-400 selection:text-slate-900 relative">

        <header
            className="fixed top-0 w-full z-40 bg-slate-900/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-lime-400 rounded-lg flex items-center justify-center transform -rotate-12">
                    <span className="font-black text-slate-900 text-xs italic">VP</span>
                </div>
                <h1 className="text-white font-bold italic tracking-tighter text-xl">VP<span
                        className="text-lime-400">360</span></h1>
            </div>
            <button onClick={()=> setIsAdmin(!isAdmin)} className={`p-2 rounded-full transition-colors ${isAdmin ?
                'bg-lime-400 text-slate-900' : 'bg-slate-800 text-slate-400'}`}>
                <Settings size={18} />
            </button>
        </header>

        <main className="pt-24 px-6 min-h-screen overflow-y-auto">
            <AnimatePresence mode='wait'>
                {activeTab === 'matches' && (
                <motion.div key="matches" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{
                    opacity: 0, y: -10 }}>
                    <MatchesView activeMatch={activeMatch} isAdmin={isAdmin} updateScore={updateScore}
                        onAnalyze={setAnalyzingMatch} />
                </motion.div>
                )}
                {activeTab === 'players' && <motion.div key="players" initial={{ opacity: 0, y: 10 }} animate={{
                    opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <PlayersView />
                </motion.div>}
                {activeTab === 'venue' && <motion.div key="venue" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1,
                    y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <VenueView />
                </motion.div>}
            </AnimatePresence>
        </main>

        {/* Floating AI Chat Button */}
        {!showChat && (
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={()=> setShowChat(true)}
            className="fixed bottom-24 right-6 z-50 bg-lime-400 text-slate-900 p-4 rounded-full shadow-lg
            shadow-lime-400/20"
            >
            <MessageCircle size={24} />
        </motion.button>
        )}

        {/* AI Components */}
        <AnimatePresence>
            {analyzingMatch && <AnalystModal match={analyzingMatch} onClose={()=> setAnalyzingMatch(null)} />}
                {showChat && <ChatAssistant isOpen={showChat} onClose={()=> setShowChat(false)} />}
        </AnimatePresence>

        <nav className="fixed bottom-0 w-full z-40 bg-slate-900/90 backdrop-blur-lg border-t border-white/5 pb-safe">
            <div className="flex justify-around items-center h-16 px-2">
                <NavButton active={activeTab==='matches' } onClick={()=> setActiveTab('matches')} icon={
                    <Trophy size={20} />} label="Partidos" />
                    <NavButton active={activeTab==='players' } onClick={()=> setActiveTab('players')} icon={
                        <User size={20} />} label="Jugadores" />
                        <NavButton active={activeTab==='venue' } onClick={()=> setActiveTab('venue')} icon={
                            <MapPin size={20} />} label="Club & VP" />
            </div>
        </nav>

        <div className="fixed bottom-20 left-0 w-full text-center pointer-events-none opacity-20 z-0">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white">No es magia, es VP</span>
        </div>
    </div>
    );
    }

    const NavButton = ({ active, onClick, icon, label }) => (
    <button onClick={onClick} className={`flex flex-col items-center justify-center w-full h-full space-y-1
        transition-all duration-300 ${active ? 'text-lime-400' : 'text-slate-500 hover:text-slate-300' }`}>
        <div className={`p-1 rounded-xl transition-all ${active ? 'bg-lime-400/10 scale-110' : '' }`}>{icon}</div>
        <span className="text-[10px] font-medium tracking-wide">{label}</span>
    </button>
    );