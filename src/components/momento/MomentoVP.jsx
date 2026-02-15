import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { Camera, RefreshCw, Share2, Download, X, User, Users, Image as ImageIcon } from 'lucide-react';

// Assets (Using generated placeholders for now)
import frameAthlete from '../../assets/frames/frame_athlete.png';
import frameFan from '../../assets/frames/frame_fan.png';

export default function MomentoVP({ user, onClose }) {
    const [mode, setMode] = useState(null); // 'athlete' | 'fan' | null
    const [image, setImage] = useState(null); // Captured image
    const [processedImage, setProcessedImage] = useState(null); // Image with frame
    const webcamRef = useRef(null);
    const fileInputRef = useRef(null);
    const [facingMode, setFacingMode] = useState('user'); // 'user' | 'environment'

    const videoConstraints = {
        width: 1080,
        height: 1920,
        facingMode: facingMode
    };

    const capture = React.useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImage(imageSrc);
        processImage(imageSrc, true); // true = from camera (needs mirror if front)
    }, [webcamRef, mode]);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImage(e.target.result);
                processImage(e.target.result, false); // false = from file (no mirror)
            };
            reader.readAsDataURL(file);
        }
    };

    const processImage = (imageSrc, isCamera) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        const frame = new Image();

        canvas.width = 1080;
        canvas.height = 1920;

        img.src = imageSrc;
        frame.src = mode === 'athlete' ? frameAthlete : frameFan;

        // Esperar a que ambas imágenes carguen
        Promise.all([
            new Promise(resolve => img.onload = resolve),
            new Promise(resolve => frame.onload = resolve)
        ]).then(() => {
            // 1. Dibujar Foto con Filtro
            ctx.filter = 'contrast(1.1) saturate(0.9)'; // Filtro "Pro"

            // Calcular aspect ratio para "object-cover"
            const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
            const x = (canvas.width / 2) - (img.width / 2) * scale;
            const y = (canvas.height / 2) - (img.height / 2) * scale;

            ctx.save();
            // Mirror SOLO si es cámara frontal Y viene de la cámara
            if (isCamera && facingMode === 'user') {
                ctx.translate(canvas.width, 0);
                ctx.scale(-1, 1);
                ctx.drawImage(img, -x - (img.width * scale), y, img.width * scale, img.height * scale);
            } else {
                ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
            }
            ctx.restore();

            // 2. Dibujar Marco
            ctx.filter = 'none';
            ctx.drawImage(frame, 0, 0, 1080, 1920);

            // 3. Texto Dinámico (ELIMINADO POR SOLICITUD)
            // if (mode === 'athlete' && user) { ... }

            setProcessedImage(canvas.toDataURL('image/png'));
        });
    };

    const handleShare = async () => {
        if (navigator.share) {
            const blob = await (await fetch(processedImage)).blob();
            const file = new File([blob], 'momento_vp.png', { type: 'image/png' });
            try {
                await navigator.share({
                    files: [file],
                    title: 'Mi Momento VP',
                    text: '¡Viviendo la experiencia VP360! 🎾🔥'
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            // Fallback descarga manual
            const link = document.createElement('a');
            link.href = processedImage;
            link.download = 'momento_vp.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const flipCamera = () => {
        setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    };

    if (!mode) {
        return (
            <div className="h-full flex flex-col items-center justify-center gap-8 p-6 bg-slate-900 relative">
                {/* Close Button needed here */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 bg-slate-800 text-white rounded-full hover:bg-slate-700 transition-colors"
                >
                    <X size={24} />
                </button>

                <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter text-center">
                    Elige tu <span className="text-lime-400">Momento</span>
                </h1>

                <div className="grid grid-cols-1 gap-6 w-full max-w-sm">
                    <button
                        onClick={() => setMode('athlete')}
                        className="relative group overflow-hidden bg-slate-800 p-8 rounded-3xl border border-slate-700 hover:border-lime-400 transition-all"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-lime-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <User className="text-lime-400 w-12 h-12 mb-4 mx-auto" />
                        <h3 className="text-xl font-bold text-white text-center">Soy Atleta</h3>
                        <p className="text-slate-400 text-sm text-center mt-2">Marco oficial con tu ranking y nombre</p>
                    </button>

                    <button
                        onClick={() => setMode('fan')}
                        className="relative group overflow-hidden bg-slate-800 p-8 rounded-3xl border border-slate-700 hover:border-blue-400 transition-all"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Users className="text-blue-400 w-12 h-12 mb-4 mx-auto" />
                        <h3 className="text-xl font-bold text-white text-center">Soy Fan</h3>
                        <p className="text-slate-400 text-sm text-center mt-2">Marco exclusivo para la mejor hinchada</p>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
            {/* Header / Actions */}
            <div className="absolute top-0 left-0 right-0 p-4 z-10 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
                <button onClick={() => { setImage(null); setMode(null); }} className="text-white p-2 bg-black/20 backdrop-blur-md rounded-full">
                    <X />
                </button>

                {!image && (
                    <button onClick={flipCamera} className="text-white p-2 bg-black/20 backdrop-blur-md rounded-full">
                        <RefreshCw />
                    </button>
                )}
            </div>

            {/* Main Area */}
            <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
                {!image ? (
                    <>
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={videoConstraints}
                            className="w-full h-full object-cover"
                            forceScreenshotSourceSize={true}
                        />
                        {/* Overlay Frame Preview (Optional - maybe too cluttered) */}
                        <div className="absolute inset-0 pointer-events-none opacity-50 border-[20px] border-lime-400/20"></div>
                    </>
                ) : (
                    <img src={processedImage} alt="Captured" className="w-full h-full object-contain" />
                )}
            </div>

            {/* Footer Controls */}
            <div className="bg-slate-900 p-8 pb-32 flex justify-center items-center gap-8">
                {!image ? (
                    <>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                        />
                        <button
                            onClick={() => fileInputRef.current.click()}
                            className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-white"
                        >
                            <ImageIcon size={20} />
                        </button>

                        <button
                            onClick={capture}
                            className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center hover:scale-105 transition-transform"
                        >
                            <div className="w-16 h-16 bg-white rounded-full" />
                        </button>

                        <div className="w-12 h-12" /> {/* Spacer for balance */}
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => setImage(null)}
                            className="flex-1 py-4 bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center gap-2"
                        >
                            <RefreshCw size={20} /> Repetir
                        </button>
                        <button
                            onClick={handleShare}
                            className="flex-1 py-4 bg-lime-400 text-slate-900 rounded-xl font-bold flex items-center justify-center gap-2"
                        >
                            {navigator.share ? <Share2 size={20} /> : <Download size={20} />}
                            {navigator.share ? 'Compartir' : 'Descargar'}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
