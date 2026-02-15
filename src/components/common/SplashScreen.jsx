import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import iconBrand from '../../assets/brand/icon.png';

const SplashScreen = ({ onFinish }) => {
    useEffect(() => {
        // Haptic Feedback
        if (navigator.vibrate) {
            // Vibración inicial
            try { navigator.vibrate(50); } catch (e) { }

            // Vibración sincronizada con la expansión (2s)
            setTimeout(() => {
                try { navigator.vibrate([100, 50, 100]); } catch (e) { }
            }, 2000);
        }

        const timer = setTimeout(onFinish, 4000); // Un poco más de tiempo para apreciar la animación
        return () => clearTimeout(timer);
    }, [onFinish]);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950 overflow-hidden"
        >
            {/* Capas de Fondo para Efecto Parallax / Expansión */}
            <motion.div
                initial={{ scale: 0, borderRadius: "100%" }}
                animate={{ scale: 4, borderRadius: "0%" }}
                transition={{
                    duration: 1.5,
                    delay: 2,
                    ease: [0.76, 0, 0.24, 1]
                }}
                className="absolute inset-0 bg-lime-400 z-10"
            />

            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                    duration: 1,
                    ease: "easeOut"
                }}
                className="relative z-20 flex flex-col items-center"
            >
                {/* Icono Central */}
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="relative"
                >
                    <div className="absolute inset-0 bg-lime-400/30 blur-2xl rounded-full scale-150 animate-pulse" />
                    <img
                        src={iconBrand}
                        alt="VP360 Icon"
                        className="w-32 h-32 md:w-48 md:h-48 relative drop-shadow-2xl"
                    />
                </motion.div>

                {/* Texto Reveal */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="mt-8 flex flex-col items-center gap-2"
                >
                    <h2 className="text-white text-4xl md:text-6xl font-black italic tracking-tighter uppercase">
                        <span className="text-lime-400">VP</span> 360
                    </h2>
                    <div className="h-[2px] w-12 bg-lime-400 mt-2" />
                </motion.div>
            </motion.div>

            {/* Efecto de partículas / brillo final */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ delay: 1.8, duration: 0.5 }}
                className="absolute inset-0 z-30 bg-white"
            />
        </motion.div>
    );
};

export default SplashScreen;
