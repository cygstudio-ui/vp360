import React from 'react';
import { MapPin, Utensils } from 'lucide-react';
import { FOOD_MENU } from '../../constants/data';

const VenueView = () => (
    <div className="pb-24 space-y-8">
        <div className="relative h-48 rounded-3xl overflow-hidden bg-slate-800 mb-6">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10"></div>
            <div className="absolute inset-0 flex items-center justify-center bg-slate-700 text-slate-500">[Imagen 360 del Club]</div>
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

export default VenueView;
