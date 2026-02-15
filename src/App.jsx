import React, { useState } from 'react';
import { Trophy, MapPin, User, Settings, MessageCircle, Home, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

// Componentes
import SplashScreen from './components/common/SplashScreen';
import HomeView from './components/home/HomeView';
import AnalystModal from './components/ai/AnalystModal';
import ChatAssistant from './components/ai/ChatAssistant';
import Login from './components/auth/Login';
import MatchesView from './components/matches/MatchesView';
import PlayersView from './components/players/PlayersView';
import VenueView from './components/venue/VenueView';
import ConfirmModal from './components/common/ConfirmModal';
import ManagerDashboard from './components/admin/ManagerDashboard';
import MomentoVP from './components/momento/MomentoVP';
import { authService } from './services/api';
import { Toaster } from 'react-hot-toast';

// Assets
import logoFull from './assets/brand/logo_full.png';
import logoMain from './assets/brand/logo_main.png';
import iconBrand from './assets/brand/icon.png';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, title: '', message: '', onConfirm: () => { } });
  const [activeMatch, setActiveMatch] = useState({ sets: [6, 4, 2], points: "15 - 30", server: "p1" });

  // AI States
  const [analyzingMatch, setAnalyzingMatch] = useState(null);
  const [showChat, setShowChat] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Verificar sesión al cargar
  React.useEffect(() => {
    const checkSession = async () => {
      if (localStorage.getItem('auth_token')) {
        try {
          const userData = await authService.me();
          setUser(userData);
        } catch (err) {
          localStorage.removeItem('auth_token');
        }
      }
      setLoading(false);
    };
    checkSession();
  }, []);

  const handleAdminClick = () => {
    if (user) {
      if (location.pathname === '/manager') {
        setConfirmConfig({
          isOpen: true,
          title: 'Cerrar Sesión',
          message: '¿Estás seguro de que deseas salir del panel administrativo?',
          onConfirm: async () => {
            await authService.logout();
            setUser(null);
            setConfirmConfig(prev => ({ ...prev, isOpen: false }));
            navigate('/');
          }
        });
      } else {
        navigate('/manager');
      }
    } else {
      setShowLogin(true);
    }
  };

  const updateScore = (winner) => {
    let currentP1 = activeMatch.points.split(" - ")[0].trim();
    let currentP2 = activeMatch.points.split(" - ")[1].trim();
    let newScore;
    if (winner === 'p1') {
      if (currentP1 === "30") newScore = "40 - " + currentP2;
      else if (currentP1 === "15") newScore = "30 - " + currentP2;
      else if (currentP1 === "0") newScore = "15 - " + currentP2;
      else newScore = "AD - 40";
    } else {
      if (currentP2 === "30") newScore = currentP1 + " - 40";
      else if (currentP2 === "15") newScore = currentP1 + " - 30";
      else if (currentP2 === "0") newScore = currentP1 + " - 15";
      else newScore = "40 - AD";
    }
    setActiveMatch(prev => ({ ...prev, points: newScore, server: Math.random() > 0.5 ? 'p1' : 'p2' }));
  };

  if (loading) return <SplashScreen onFinish={() => setLoading(false)} />;

  return (
    <>
      <Toaster position="top-right" toastOptions={{
        duration: 4000,
        style: {
          background: '#0f172a',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          fontSize: '14px',
          fontWeight: 'bold',
        },
      }} />
      <Routes>
        {/* VISTA PÚBLICA */}
        <Route path="/" element={
          <div className="min-h-screen bg-slate-900 font-sans selection:bg-lime-400 selection:text-slate-900 relative">
            <header
              className="fixed top-0 w-full z-40 bg-slate-900/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <img src={iconBrand} alt="VP360 Icon" className="h-8 w-auto transform transition-transform hover:scale-105" />
              </div>

              {/* Logo Marca Centro - Restaurado */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <img src={logoMain} alt="Brand Logo" className="h-6 w-auto opacity-100" />
              </div>


              <div className="flex items-center gap-4">
                <button
                  onClick={handleAdminClick}
                  className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${user ? 'bg-lime-400 text-slate-900 shadow-lg shadow-lime-400/20' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                >
                  <Settings size={20} />
                </button>
              </div>
            </header>

            <main className={`${activeTab === 'home' ? '' : 'pt-24 px-6'} min-h-screen overflow-y-auto`}>
              <AnimatePresence mode='wait'>
                {activeTab === 'home' && (
                  <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <HomeView />
                  </motion.div>
                )}
                {activeTab === 'matches' && (
                  <motion.div key="matches" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{
                    opacity: 0, y: -10
                  }}>
                    <MatchesView activeMatch={activeMatch} isAdmin={!!user} updateScore={updateScore}
                      onAnalyze={setAnalyzingMatch} />
                  </motion.div>
                )}
                {activeTab === 'momento' && (
                  <motion.div key="momento" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black">
                    <MomentoVP user={user} onClose={() => setActiveTab('home')} />
                  </motion.div>
                )}
                {activeTab === 'players' && <motion.div key="players" initial={{ opacity: 0, y: 10 }} animate={{
                  opacity: 1, y: 0
                }} exit={{ opacity: 0, y: -10 }}>
                  <PlayersView />
                </motion.div>}
                {activeTab === 'venue' && <motion.div key="venue" initial={{ opacity: 0, y: 10 }} animate={{
                  opacity: 1,
                  y: 0
                }} exit={{ opacity: 0, y: -10 }}>
                  <VenueView />
                </motion.div>}
              </AnimatePresence>
            </main>

            {/* Floating AI Chat Button */}
            {!showChat && (
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setShowChat(true)}
                className="fixed bottom-24 right-6 z-50 bg-lime-400 text-slate-900 p-4 rounded-full shadow-lg
                shadow-lime-400/20"
              >
                <MessageCircle size={24} />
              </motion.button>
            )}

            {/* AI Components */}
            <AnimatePresence>
              {analyzingMatch && <AnalystModal match={analyzingMatch} onClose={() => setAnalyzingMatch(null)} />}
              {showChat && <ChatAssistant isOpen={showChat} onClose={() => setShowChat(false)} />}
              <Login
                isOpen={showLogin}
                onClose={() => setShowLogin(false)}
                onLoginSuccess={(userData) => {
                  setUser(userData);
                  setConfirmConfig({
                    isOpen: true,
                    title: '¡Acceso Concedido!',
                    message: `Bienvenido, ${userData.name}. Serás redirigido al panel administrativo.`,
                    type: 'alert',
                    onConfirm: () => {
                      setConfirmConfig(prev => ({ ...prev, isOpen: false }));
                      navigate('/manager');
                    }
                  });
                }}
              />
              <ConfirmModal
                {...confirmConfig}
                onClose={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
              />
            </AnimatePresence>

            <nav className="fixed bottom-0 w-full z-40 bg-slate-900/90 backdrop-blur-lg border-t border-white/5 pb-safe">
              <div className="flex justify-around items-center h-16 px-2">
                <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={
                  <Home size={20} />} label="Inicio" />
                <NavButton active={activeTab === 'matches'} onClick={() => setActiveTab('matches')} icon={
                  <Trophy size={20} />} label="Partidos" />

                {/* Momento VP Button - Central & Featured */}
                <div className="relative -top-5 mx-6">
                  <button
                    onClick={() => setActiveTab('momento')}
                    className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-lime-400/30 transition-all duration-300 ${activeTab === 'momento' ? 'bg-lime-400 text-slate-900 scale-110' : 'bg-slate-800 text-lime-400 border border-lime-400/30'}`}
                  >
                    <Camera size={24} />
                  </button>
                  <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-lime-400 w-max tracking-wide">MOMENTO VP</span>
                </div>

                <NavButton active={activeTab === 'players'} onClick={() => setActiveTab('players')} icon={
                  <User size={20} />} label="Jugadores" />
                <NavButton active={activeTab === 'venue'} onClick={() => setActiveTab('venue')} icon={
                  <MapPin size={20} />} label="Club & VP" />
              </div>
            </nav>

            <div className="fixed bottom-20 left-0 w-full text-center pointer-events-none opacity-20 z-0">
              <span className="text-[10px] uppercase tracking-[0.3em] text-white">No es magia, es VP</span>
            </div>
          </div>
        } />

        {/* VISTA ADMINISTRATIVA */}
        <Route path="/manager" element={
          user ? <ManagerDashboard user={user} onLogout={() => setUser(null)} /> : <Navigate to="/" replace />
        } />
        {/* Catch all - Redirect to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

const NavButton = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center w-full h-full space-y-1
        transition-all duration-300 ${active ? 'text-lime-400' : 'text-slate-500 hover:text-slate-300'}`}>
    <div className={`p-1 rounded-xl transition-all ${active ? 'bg-lime-400/10 scale-110' : ''}`}>{icon}</div>
    <span className="text-[10px] font-medium tracking-wide">{label}</span>
  </button>
);
