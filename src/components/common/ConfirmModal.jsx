import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, HelpCircle, Info, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, type = 'confirm' }) => {
    if (!isOpen) return null;

    const isAlert = type === 'alert';

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-slate-900 w-full max-w-sm rounded-[32px] border border-white/10 overflow-hidden shadow-2xl"
            >
                <div className="p-8">
                    <div className="flex justify-center mb-6">
                        <div className={`p-4 rounded-3xl ${isAlert ? 'bg-amber-400/10 text-amber-400' : 'bg-lime-400/10 text-lime-400'}`}>
                            {isAlert ? <AlertTriangle size={32} /> : <HelpCircle size={32} />}
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h3 className="text-xl font-black text-white italic tracking-tight uppercase mb-2">
                            {title}
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            {message}
                        </p>
                    </div>

                    <div className="flex gap-3">
                        {!isAlert && (
                            <button
                                onClick={onClose}
                                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-2xl transition-all active:scale-[0.98]"
                            >
                                CANCELAR
                            </button>
                        )}
                        <button
                            onClick={onConfirm}
                            className={`flex-1 ${isAlert ? 'bg-amber-400 text-slate-950' : 'bg-lime-400 text-slate-950'} font-black py-4 rounded-2xl transition-all shadow-lg active:scale-[0.98] uppercase`}
                        >
                            {isAlert ? 'ENTENDIDO' : 'CONTINUAR'}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ConfirmModal;
