import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, Trophy, Settings, LogOut, ChevronRight, Activity, MapPin } from 'lucide-react';
import { authService } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { ClubsManagement, AthletesManagement, TournamentsManagement, TeamsManagement } from './ManagementViews';
import ApparelsManagement from './ApparelsManagement';

const ManagerDashboard = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const [currentView, setCurrentView] = React.useState('dashboard');
    const [currentTournament, setCurrentTournament] = React.useState(null);

    // Exponer función para que ManagementViews pueda cambiar el estado local
    window.setCurrentTournamentDuplas = (tournament) => {
        setCurrentTournament(tournament);
        setCurrentView('tournaments');
    };

    const handleLogout = async () => {
        await authService.logout();
        onLogout();
        navigate('/');
    };

    const stats = [
        { label: 'Torneos Activos', value: '3', icon: <Trophy className="text-lime-400" /> },
        { label: 'Atletas Registrados', value: '48', icon: <Users className="text-blue-400" /> },
        { label: 'Partidos hoy', value: '12', icon: <Activity className="text-amber-400" /> },
    ];

    const renderContent = () => {
        switch (currentView) {
            case 'clubs': return <ClubsManagement />;
            case 'athletes': return <AthletesManagement />;
            case 'apparels': return <ApparelsManagement />;
            case 'tournaments':
                return currentTournament ? (
                    <TeamsManagement
                        tournament={currentTournament}
                        onBack={() => { setCurrentTournament(null); setCurrentView('tournaments'); }}
                    />
                ) : <TournamentsManagement />;
            default: return (
                <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        {stats.map((stat, i) => (
                            <div key={i} className="bg-slate-900/50 p-6 rounded-[32px] border border-white/5 flex items-center gap-6 hover:bg-slate-900 transition-colors">
                                <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-lime-400">
                                    {stat.icon}
                                </div>
                                <div>
                                    <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-bold mb-1">{stat.label}</p>
                                    <p className="text-3xl font-black text-white italic">{stat.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Content Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-slate-900/50 rounded-[40px] border border-white/5 p-8 flex flex-col h-full">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-xl font-bold text-white italic tracking-tight">TORNEOS <span className="text-lime-400">RECIENTES</span></h3>
                                <button onClick={() => setCurrentView('tournaments')} className="text-lime-400 text-[10px] font-bold flex items-center gap-1 uppercase tracking-widest hover:underline">
                                    Ver todos <ChevronRight size={14} />
                                </button>
                            </div>
                            <div className="space-y-4 flex-1">
                                {[1, 2].map(i => (
                                    <div key={i} className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-2xl border border-white/5 hover:border-lime-400/30 transition-all cursor-pointer">
                                        <div className="w-12 h-12 bg-lime-400/10 rounded-xl flex items-center justify-center text-lime-400">
                                            <Trophy size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-white font-bold text-sm tracking-tight">OPEN VENEZUELA PADEL</h4>
                                            <p className="text-slate-500 text-[10px] italic">Finaliza en 3 días • Cancha Central</p>
                                        </div>
                                        <span className="bg-lime-400/10 text-lime-400 text-[9px] font-black px-3 py-1.5 rounded-full uppercase">ACTIVO</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-slate-900/50 rounded-[40px] border border-white/5 p-8 flex flex-col h-full">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-xl font-bold text-white italic tracking-tight">ATLETAS <span className="text-lime-400">DESTACADOS</span></h3>
                                <button onClick={() => setCurrentView('athletes')} className="text-lime-400 text-[10px] font-bold flex items-center gap-1 uppercase tracking-widest hover:underline">
                                    Gestionar <ChevronRight size={14} />
                                </button>
                            </div>
                            <div className="space-y-4 flex-1">
                                {['Ale Galán', 'Juan Lebrón'].map(name => (
                                    <div key={name} className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-2xl border border-white/5 hover:border-lime-400/30 transition-all cursor-pointer">
                                        <div className="w-12 h-12 bg-slate-800 rounded-xl border border-white/5 flex items-center justify-center text-white font-bold">
                                            {name.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-white font-bold text-sm tracking-tight">{name}</h4>
                                            <p className="text-slate-500 text-[10px] italic tracking-wide">Puntuación: 95/100 • Pro Level</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lime-400 text-[10px] font-black font-mono">RANK #1</p>
                                            <div className="flex gap-0.5 mt-1">
                                                {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 bg-lime-400 rounded-full"></div>)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            );
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex transition-all">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 border-r border-white/5 flex flex-col pt-8">
                <div className="px-6 mb-10 flex items-center gap-3">
                    <div className="w-8 h-8 bg-lime-400 rounded-lg flex items-center justify-center transform -rotate-12">
                        <span className="font-black text-slate-900 text-xs italic">VP</span>
                    </div>
                    <h1 className="text-white font-bold italic tracking-tighter text-xl">MANAGER<span className="text-lime-400">360</span></h1>
                </div>

                <nav className="flex-1 px-4 space-y-2 text-left">
                    <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} />
                    <SidebarItem icon={<MapPin size={20} />} label="Clubes" active={currentView === 'clubs'} onClick={() => setCurrentView('clubs')} />
                    <SidebarItem icon={<Trophy size={20} />} label="Torneos" active={currentView === 'tournaments'} onClick={() => setCurrentView('tournaments')} />
                    <SidebarItem icon={<Users size={20} />} label="Atletas" active={currentView === 'athletes'} onClick={() => setCurrentView('athletes')} />
                    <SidebarItem icon={<Settings size={20} />} label="Indumentaria" active={currentView === 'apparels'} onClick={() => setCurrentView('apparels')} />
                    <SidebarItem icon={<Settings size={20} />} label="Configuración" active={currentView === 'settings'} onClick={() => setCurrentView('settings')} />
                </nav>

                <div className="p-4 border-t border-white/5 space-y-4">
                    <div className="px-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-lime-400/30 flex items-center justify-center text-lime-400 font-bold">
                            {user?.name?.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-white text-sm font-bold truncate">{user?.name}</p>
                            <p className="text-slate-500 text-[10px] uppercase tracking-wider">{user?.role?.name}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all font-bold text-sm"
                    >
                        <LogOut size={20} /> CERRAR SESIÓN
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto bg-slate-950">
                <header className="mb-10 flex justify-between items-end border-b border-white/5 pb-8">
                    <div>
                        <p className="text-lime-400 text-[10px] font-bold uppercase tracking-[0.4em] mb-2">SISTEMA INTEGRAL DE GESTIÓN</p>
                        <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">BIENVENIDO, <span className="text-lime-400">MANAGER</span></h2>
                    </div>
                    <div className="text-right">
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Estado del Servidor</p>
                        <p className="text-lime-400 text-xs font-mono font-bold flex items-center justify-end gap-2 mt-1">
                            <span className="w-2 h-2 bg-lime-400 rounded-full animate-pulse"></span> ONLINE
                        </p>
                    </div>
                </header>

                <motion.div
                    key={currentView}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {renderContent()}
                </motion.div>
            </main>
        </div>
    );
};

const SidebarItem = ({ icon, label, active, onClick }) => (
    <button onClick={onClick} className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all font-bold text-sm ${active ? 'bg-lime-400 text-slate-900 shadow-lg shadow-lime-400/20' : 'text-slate-500 hover:bg-white/5 hover:text-white'
        }`}>
        {icon}
        <span className="uppercase tracking-widest text-[11px]">{label}</span>
    </button>
);

export default ManagerDashboard;
