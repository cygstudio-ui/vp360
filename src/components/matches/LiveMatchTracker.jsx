import React from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

const LiveMatchTracker = ({ activeMatch, isAdmin, updateScore }) => {
    const bars = [40, 60, 30, 80, 50, 70, 90, 60, 40, 50, 70, 60, 80, 90, 70, 50];

    const DuoRow = ({ players, score, sets, isServing }) => (
        <div className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0 relative">
            <div className="flex items-center gap-3 flex-1">
                {/* Avatar con iniciales */}
                <div className="w-9 h-9 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-white font-bold text-[10px] shadow-inner shrink-0 relative">
                    {players[0].charAt(0)}{players[1].charAt(0)}
                    {isServing && (
                        <div className="absolute -right-0.5 -top-0.5 w-3 h-3 bg-lime-400 rounded-full border-2 border-slate-900 animate-pulse" />
                    )}
                </div>
                <div className="flex flex-col">
                    <span className="text-white font-bold text-[11px] leading-tight uppercase tracking-tighter">{players[0]}</span>
                    <span className="text-white font-bold text-[11px] leading-tight uppercase tracking-tighter">{players[1]}</span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Puntos actuales */}
                <div className="bg-slate-950/80 w-9 h-10 rounded-lg flex items-center justify-center border border-white/5 shadow-2xl">
                    <span className="text-xl font-black text-white font-mono tracking-tighter">{score}</span>
                </div>

                {/* Sets */}
                <div className="flex gap-2 pr-1">
                    {sets.map((val, i) => (
                        <div key={i} className="flex flex-col items-center min-w-[14px]">
                            <span className="text-slate-600 text-[7px] font-black mb-0.5 uppercase">S{i + 1}</span>
                            <span className={`text-sm font-black font-mono ${i === sets.length - 1 ? 'text-lime-400' : 'text-slate-500'}`}>
                                {val}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="w-full relative overflow-hidden rounded-[20px] bg-slate-900 border border-white/10 shadow-2xl">
            <div className="p-4 pb-2">
                {/* Header Tripartito Ultra-Compacto */}
                <div className="flex justify-between items-center mb-3 text-[8px] font-black uppercase tracking-tight text-white/40 whitespace-nowrap">
                    <span>Club: Casa Padel</span>
                    <div className="flex items-center gap-1.5 text-red-500">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                        VIVO • FINAL SET
                    </div>
                    <span>Pista Central</span>
                </div>

                {/* Duplas */}
                <div className="space-y-0.5">
                    <DuoRow
                        players={["Carlos Lopez", "Luis Castillo"]}
                        score="30"
                        sets={[6, 4, 2]}
                        isServing={activeMatch.server === 'p1'}
                    />
                    <DuoRow
                        players={["Pedro Perez", "Antonio Fernandez"]}
                        score="15"
                        sets={[6, 4, 2]}
                        isServing={activeMatch.server === 'p2'}
                    />
                </div>

                {/* Indicador de Saque Pill Reducido */}
                <div className="flex justify-center mt-3">
                    <div className="bg-lime-400/10 border border-lime-400/20 px-3 py-0.5 rounded-full flex items-center gap-1.5">
                        <Activity size={8} className="text-lime-400 animate-pulse" />
                        <span className="text-lime-400 text-[7px] font-black uppercase tracking-widest">
                            Saque: {activeMatch.server === 'p1' ? 'Galán/Lebrón' : 'Tapia/Coello'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Momentum Ultra-Reducido */}
            <div className="bg-slate-950/40 px-5 py-2 border-t border-white/5">
                <div className="flex justify-between text-[7px] text-slate-500 mb-1.5 font-bold uppercase tracking-widest">
                    <span>MOMENTUM</span>
                    <span>5 MIN</span>
                </div>
                <div className="flex items-end gap-0.5 h-4 justify-between">
                    {bars.map((height, i) => (
                        <div key={i}
                            style={{ height: `${height}%` }}
                            className={`flex-1 rounded-t-[0.5px] ${i > 12 ? 'bg-lime-400' : 'bg-slate-700'}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LiveMatchTracker;
