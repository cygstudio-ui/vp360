import React from 'react';
import { motion } from 'framer-motion';
import { PLAYERS } from '../../constants/data';

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

export default PlayersView;
