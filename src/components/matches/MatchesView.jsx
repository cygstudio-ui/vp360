import React from 'react';
import { Clock, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; // Import motion and AnimatePresence
import LiveMatchTracker from './LiveMatchTracker';
import { SCHEDULE } from '../../constants/data';
import bannerToyogil from '../../assets/bannertoyogil.jpg';

const MatchesView = ({ activeMatch, isAdmin, updateScore, onAnalyze }) => {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const matches = [
        { ...activeMatch, id: 1 },
        { ...activeMatch, id: 2, server: 'p2', points: '15-15' }
    ];

    React.useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % matches.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [matches.length]);

    return (
        <div className="space-y-4 pb-20">
            <div className="flex items-center justify-between px-1">
                <h2 className="text-xl font-black text-white italic tracking-tighter uppercase">Torneo <span className="text-lime-400 text-sm">en curso</span></h2>
                <button className="text-lime-400 text-[10px] font-bold uppercase tracking-widest border-b border-lime-400/30">Ver Cuadro</button>
            </div>

            {/* Slider de Partidos en Vivo */}
            <div className="relative overflow-hidden group rounded-[20px]">
                <div className="relative h-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ x: 300, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -300, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="w-full"
                        >
                            <LiveMatchTracker
                                activeMatch={matches[currentIndex]}
                                isAdmin={isAdmin}
                                updateScore={updateScore}
                            />
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Indicadores de Slider (Manual click supported) */}
                <div className="flex justify-center gap-1.5 mt-2">
                    {matches.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`h-1 rounded-full transition-all duration-300 ${currentIndex === idx ? 'w-4 bg-lime-400' : 'w-1 bg-slate-700 hover:bg-slate-600'
                                }`}
                        />
                    ))}
                </div>
            </div>

            <div className="mt-2">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-black italic text-xs uppercase tracking-tight">Próximos Partidos</h3>
                    <div className="h-px bg-white/5 flex-1 ml-3" />
                </div>

                <div className="space-y-2">
                    {SCHEDULE.filter(m => m.status !== 'LIVE').slice(0, 2).map((match) => (
                        <div key={match.id}
                            className="bg-slate-900/50 p-3.5 rounded-[16px] border border-white/5 backdrop-blur-md flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="text-slate-400 text-[9px] font-black uppercase flex flex-col items-center leading-none border-r border-white/10 pr-3">
                                    <Clock size={10} className="text-lime-400 mb-1" />
                                    {match.time.split(' ')[0]}
                                </div>
                                <div>
                                    <div className="text-white font-black text-sm italic leading-none uppercase tracking-tighter">{match.p1}</div>
                                    <div className="text-slate-500 text-[9px] font-bold mt-1">VS <span className="text-slate-400">{match.p2}</span></div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <span className={`px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest ${match.status === 'Finalizado'
                                    ? 'bg-slate-800 text-slate-500' : 'bg-blue-500/10 text-blue-400'}`}>
                                    {match.status}
                                </span>
                                {match.status === 'Finalizado' && (
                                    <div className="text-[10px] text-lime-400 font-black font-mono italic">{match.score}</div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sección de Promociones / Eventos Ultra-Compacto */}
            <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-4 rounded-[24px] border border-white/5 h-24 flex flex-col justify-end relative overflow-hidden">
                    <div className="absolute top-2 right-2 w-6 h-6 bg-lime-400/5 rounded-full flex items-center justify-center text-lime-400 text-[7px] font-black border border-lime-400/10">AD</div>
                    <h4 className="text-white font-black text-sm italic leading-tight uppercase tracking-tighter">BULL PADEL</h4>
                    <p className="text-lime-400 text-[8px] font-bold">Nuevas Palas 2026</p>
                </div>

                <div className="bg-gradient-to-br from-lime-400/5 to-transparent p-4 rounded-[24px] border border-lime-400/10 h-24 flex flex-col justify-end relative overflow-hidden">
                    <h4 className="text-white font-black text-sm italic leading-tight uppercase tracking-tighter">STRETCHING</h4>
                    <p className="text-slate-400 text-[8px] font-bold leading-tight">Hoy 4:00 PM</p>
                </div>
            </div>

            {/* Banner Patrocinante Toyogil */}
            <div className="mt-4 rounded-[24px] overflow-hidden border border-white/5 shadow-2xl">
                <img
                    src={bannerToyogil}
                    alt="Toyota Patrocinador"
                    className="w-full h-auto object-cover hover:scale-[1.02] transition-transform duration-500 cursor-pointer"
                />
            </div>
        </div>
    );
};

export default MatchesView;
