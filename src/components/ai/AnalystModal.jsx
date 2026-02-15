import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles, Zap } from 'lucide-react';
import { callGemini } from '../../services/gemini';
import { PLAYERS } from '../../constants/data';

const AnalystModal = ({ match, onClose }) => {
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalysis = async () => {
            const prompt = `Actúa como un analista experto de World Padel Tour. Analiza brevemente el partido de pádel entre
${match.p1} y ${match.p2}.
Considera que es un partido de alto nivel.
Genera una respuesta en formato JSON con los siguientes campos:
- "prediction": Quién tiene más probabilidad de ganar y porcentaje (ej: "Galán/Lebrón 55%").
- "keyFactor": Un factor clave técnico o táctico (máximo 15 palabras).
- "analysis": Un párrafo corto (máximo 40 words) emocionante sobre el choque de estilos.
Responde SOLO el JSON.`;

            const result = await callGemini(prompt);
            try {
                const jsonStr = result.replace(/```json/g, '').replace(/```/g, '');
                setAnalysis(JSON.parse(jsonStr));
            } catch (e) {
                setAnalysis({
                    prediction: "Análisis complejo...",
                    keyFactor: "Duelo de titanes en la red",
                    analysis: "Ambas parejas muestran un nivel excepcional. El partido se decidirá por pequeños detalles en los puntos de oro."
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

export default AnalystModal;
