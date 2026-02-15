import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from 'lucide-react';
import videoIntro from '../../assets/intro360.mp4';
import videoBg from '../../assets/videobg.mp4';
import logoCopa from '../../assets/logocopatoyogil.png';

const API_URL = '/api'; // Usa el proxy de Vite configurado en vite.config.js

export default function HomeView() {
    const [showIntro, setShowIntro] = useState(true);
    const [apparelData, setApparelData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const shirtId = params.get('ts');

        if (shirtId) {
            fetchApparelInfo(shirtId);
        }
    }, []);

    const fetchApparelInfo = async (shirtId) => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/apparel/check/${shirtId}`);
            const data = await res.json();
            setApparelData(data);
        } catch (err) {
            console.error('Error fetching apparel:', err);
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 overflow-hidden bg-slate-950">
            <AnimatePresence mode="wait">
                {showIntro ? (
                    <motion.div
                        key="intro-video"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        className="absolute inset-0 z-[60] bg-slate-950"
                    >
                        <video
                            autoPlay
                            muted
                            playsInline
                            onEnded={() => setShowIntro(false)}
                            className="w-full h-full object-cover"
                        >
                            <source src={videoIntro} type="video/mp4" />
                        </video>
                    </motion.div>
                ) : (
                    <motion.div
                        key="main-content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="absolute inset-0"
                    >
                        {/* Video de Fondo (Loop) */}
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute top-1/2 left-1/2 min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover opacity-20"
                        >
                            <source src={videoBg} type="video/mp4" />
                        </video>

                        {/* Gradiente Overlay para profundidad */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50" />

                        {/* Tarjetas Superiores (Dinámicas) */}
                        <div className="absolute top-20 left-0 right-0 z-50 px-6 space-y-3">
                            <AnimatePresence>
                                {apparelData && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                        className="w-full"
                                    >
                                        {/* Saludo Principal */}
                                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <h2 className="text-white text-xl font-black flex items-center gap-2">
                                                    Hola, <span className={apparelData.status === 'assigned' ? 'text-lime-400' : 'text-white'}>
                                                        {apparelData.status === 'assigned' ? apparelData.athlete.name : 'Campeón'}
                                                    </span>
                                                </h2>
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-lime-400/20 flex items-center justify-center border border-lime-400/30 text-lime-400">
                                                <User size={20} />
                                            </div>
                                        </div>

                                        {/* Información Dinámica */}
                                        <motion.div
                                            initial={{ opacity: 0, x: 50 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                                            className="mt-3 bg-lime-400/10 backdrop-blur-md border border-lime-400/20 rounded-2xl p-4"
                                        >
                                            {apparelData.status === 'assigned' ? (
                                                <p className="text-white/90 text-sm font-medium">
                                                    Tu próximo partido es el <span className="text-lime-400 font-bold">{apparelData.next_match?.day || 'próximamente'}</span> a las <span className="text-lime-400 font-bold">{apparelData.next_match?.time || '--:--'}</span>
                                                </p>
                                            ) : (
                                                <p className="text-white/90 text-sm font-medium">
                                                    <span className="text-lime-400 font-bold">Registra</span> tu armadura, accede al <span className="text-lime-400 font-bold text-lg">mundo VP</span>
                                                </p>
                                            )}
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Contenido Central */}
                        <div className="relative h-full flex flex-col items-center justify-center p-6 text-center">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{
                                    duration: 1.2,
                                    ease: [0.22, 1, 0.36, 1],
                                    delay: 0.2
                                }}
                                className="flex flex-col items-center gap-8"
                            >
                                <div className="relative">
                                    {/* Efecto de brillo detrás del logo */}
                                    <div className="absolute inset-0 bg-lime-400/20 blur-[100px] rounded-full" />

                                    <img
                                        src={logoCopa}
                                        alt="Copa Toyogil"
                                        className="h-32 md:h-44 w-auto relative drop-shadow-[0_0_30px_rgba(163,230,28,0.3)]"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <h1 className="text-white text-2xl md:text-3xl font-black italic tracking-tighter uppercase leading-none">
                                        Bienvenidos a la <br />
                                        <span className="text-lime-400 text-3xl md:text-5xl">Copa Toyogil</span>
                                    </h1>
                                    <p className="text-white/60 text-[10px] md:text-xs font-bold uppercase tracking-[0.4em]">
                                        El Padel en su Máxima Expresión
                                    </p>
                                </div>
                            </motion.div>

                            {/* Micro-animación en la parte inferior */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.5 }}
                                className="absolute bottom-32 flex flex-col items-center gap-2"
                            >
                                <div className="w-[1px] h-12 bg-gradient-to-b from-lime-400 to-transparent animate-pulse" />
                                <span className="text-[8px] text-lime-400 font-black uppercase tracking-widest">Desliza para ver más</span>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
