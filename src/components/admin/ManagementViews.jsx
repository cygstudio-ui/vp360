import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Info, MapPin, Instagram, Mail, Phone, Calendar, User, Trophy, X, Users, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Base API URL
const API_URL = '/api';

// Reusable Modal Component
const Modal = ({ title, isOpen, onClose, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-slate-900 border border-white/10 rounded-[32px] w-full max-w-lg p-8 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white italic tracking-tight uppercase">{title}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400">
                        <X size={20} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

// Reusable Table Component
const DataTable = ({ title, columns, data, onEdit, onDelete, onAdd, loading }) => (
    <div className="bg-slate-900/50 rounded-[40px] border border-white/5 p-8 flex flex-col h-full min-h-[400px]">
        <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-white italic tracking-tight uppercase">GESTIÓN DE <span className="text-lime-400">{title}</span></h3>
            <button
                onClick={onAdd}
                className="bg-lime-400 text-slate-900 px-4 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 hover:bg-white transition-colors"
            >
                <Plus size={14} /> Nuevo {title.slice(0, -1)}
            </button>
        </div>

        {loading ? (
            <div className="flex-1 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-lime-400/20 border-t-lime-400 rounded-full animate-spin"></div>
            </div>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/5 text-slate-500 text-[10px] uppercase tracking-widest font-black">
                            {columns.map(col => <th key={col.key} className="pb-4 px-4">{col.label}</th>)}
                            <th className="pb-4 px-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {data.map((item, idx) => (
                            <tr key={item.id || idx} className="hover:bg-white/5 transition-colors group">
                                {columns.map(col => (
                                    <td key={col.key} className="py-4 px-4">
                                        {col.render ? col.render(item[col.key], item) : <span className="text-white text-sm font-medium">{item[col.key]}</span>}
                                    </td>
                                ))}
                                <td className="py-4 px-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => onEdit(item)} className="p-2 bg-slate-800 text-blue-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Edit2 size={14} />
                                        </button>
                                        <button onClick={() => onDelete(item.id)} className="p-2 bg-slate-800 text-red-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>
);

export const ClubsManagement = () => {
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClub, setEditingClub] = useState(null);
    const [formData, setFormData] = useState({ name: '', address: '', state: '', instagram: '', email: '', phone: '' });

    const fetchClubs = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/clubs`);
            const data = await res.json();
            setClubs(data);
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    useEffect(() => { fetchClubs(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = editingClub ? 'PUT' : 'POST';
        const url = editingClub ? `${API_URL}/clubs/${editingClub.id}` : `${API_URL}/clubs`;

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                toast.success(editingClub ? 'Club actualizado' : 'Club creado con éxito');
                setIsModalOpen(false);
                fetchClubs();
                setEditingClub(null);
                setFormData({ name: '', address: '', state: '', instagram: '', email: '', phone: '' });
            } else {
                const errData = await res.json();
                toast.error(errData.message || 'Error al guardar el club');
            }
        } catch (err) {
            toast.error('Error de conexión con el servidor');
        }
    };

    const columns = [
        {
            key: 'name', label: 'Club', render: (val) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-800 rounded-lg border border-white/10 flex items-center justify-center text-lime-400 font-bold text-[10px]">
                        {val?.charAt(0)}
                    </div>
                    <span className="text-white text-sm font-bold uppercase">{val}</span>
                </div>
            )
        },
        {
            key: 'address', label: 'Dirección', render: (val, item) => (
                <div className="flex flex-col gap-1 text-slate-400 text-xs">
                    <span className="flex items-center gap-2"><MapPin size={12} className="text-lime-400" /> {val}</span>
                    <span className="text-[10px] text-slate-600 uppercase font-black">{item.state}</span>
                </div>
            )
        },
        {
            key: 'contact', label: 'Contacto', render: (_, item) => (
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-slate-500 text-[10px]">
                        <Mail size={10} /> {item.email}
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-[10px]">
                        <Instagram size={10} /> {item.instagram}
                    </div>
                </div>
            )
        }
    ];

    return (
        <>
            <DataTable title="CLUBES" columns={columns} data={clubs} loading={loading}
                onAdd={() => { setEditingClub(null); setFormData({ name: '', address: '', state: '', instagram: '', email: '', phone: '' }); setIsModalOpen(true); }}
                onEdit={(club) => { setEditingClub(club); setFormData(club); setIsModalOpen(true); }}
                onDelete={async (id) => {
                    if (confirm('¿Eliminar club?')) {
                        try {
                            const res = await fetch(`${API_URL}/clubs/${id}`, {
                                method: 'DELETE',
                                headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
                            });
                            if (res.ok) {
                                toast.success('Club eliminado');
                                fetchClubs();
                            } else {
                                toast.error('No se pudo eliminar el club');
                            }
                        } catch (err) {
                            toast.error('Error al conectar con el servidor');
                        }
                    }
                }}
            />

            <Modal title={editingClub ? "Editar Club" : "Nuevo Club"} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Nombre del Club</label>
                        <input required className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:border-lime-400/50 outline-none transition-all" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Estado</label>
                            <input className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:border-lime-400/50 outline-none transition-all" value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Dirección</label>
                            <input className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:border-lime-400/50 outline-none transition-all" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Correo</label>
                            <input type="email" className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:border-lime-400/50 outline-none transition-all" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Teléfono</label>
                            <input className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:border-lime-400/50 outline-none transition-all" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Instagram (@)</label>
                        <input className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:border-lime-400/50 outline-none transition-all" value={formData.instagram} onChange={e => setFormData({ ...formData, instagram: e.target.value })} />
                    </div>
                    <button type="submit" className="w-full bg-lime-400 text-slate-900 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-white transition-colors mt-4">
                        {editingClub ? "Guardar Cambios" : "Crear Club"}
                    </button>
                </form>
            </Modal>
        </>
    );
};

export const AthletesManagement = () => {
    const [athletes, setAthletes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAthlete, setEditingAthlete] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', category: '', ranking: 0 });

    const fetchAthletes = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/athletes`);
            const data = await res.json();
            setAthletes(data);
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    useEffect(() => { fetchAthletes(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = editingAthlete ? 'PUT' : 'POST';
        const url = editingAthlete ? `${API_URL}/athletes/${editingAthlete.id}` : `${API_URL}/athletes`;

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                toast.success(editingAthlete ? 'Atleta actualizado' : 'Atleta registrado');
                setIsModalOpen(false);
                fetchAthletes();
                setEditingAthlete(null);
                setFormData({ name: '', email: '', phone: '', category: '', ranking: 0 });
            } else {
                toast.error('Error al guardar el atleta');
            }
        } catch (err) {
            toast.error('Error de conexión');
        }
    };

    const columns = [
        {
            key: 'name', label: 'Atleta', render: (val) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-800 rounded-full border border-white/10 flex items-center justify-center text-white font-bold text-[10px]">
                        {val?.charAt(0)}
                    </div>
                    <span className="text-white text-sm font-bold uppercase">{val}</span>
                </div>
            )
        },
        {
            key: 'category', label: 'Categoría', render: (val) => (
                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-[9px] font-black uppercase">
                    {val}
                </span>
            )
        },
        {
            key: 'ranking', label: 'Ranking', render: (val) => (
                <span className="text-lime-400 font-black font-mono text-xs italic">Pts. {val}</span>
            )
        }
    ];

    return (
        <>
            <DataTable title="ATLETAS" columns={columns} data={athletes} loading={loading}
                onAdd={() => { setEditingAthlete(null); setFormData({ name: '', email: '', phone: '', category: '', ranking: 0 }); setIsModalOpen(true); }}
                onEdit={(athlete) => { setEditingAthlete(athlete); setFormData(athlete); setIsModalOpen(true); }}
                onDelete={async (id) => {
                    if (confirm('¿Eliminar atleta?')) {
                        try {
                            const res = await fetch(`${API_URL}/athletes/${id}`, {
                                method: 'DELETE',
                                headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
                            });
                            if (res.ok) {
                                toast.success('Atleta eliminado');
                                fetchAthletes();
                            } else {
                                toast.error('Error al eliminar');
                            }
                        } catch (err) {
                            toast.error('Error de conexión');
                        }
                    }
                }}
            />

            <Modal title={editingAthlete ? "Editar Atleta" : "Nuevo Atleta"} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Nombre Completo</label>
                        <input required className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:border-lime-400/50 outline-none transition-all" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Categoría</label>
                            <select className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:border-lime-400/50 outline-none transition-all select-none" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                <option value="">Seleccionar...</option>
                                {['1', '2', '3', '4', '5', '6', '7', 'OPEN', 'MASTER', 'JUNIOR'].map(cat => (
                                    <option key={cat} value={cat}>{cat} Categoría</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Puntos Ranking</label>
                            <input type="number" className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:border-lime-400/50 outline-none transition-all" value={formData.ranking} onChange={e => setFormData({ ...formData, ranking: parseInt(e.target.value) })} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Correo</label>
                            <input type="email" className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:border-lime-400/50 outline-none transition-all" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Teléfono</label>
                            <input className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:border-lime-400/50 outline-none transition-all" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-lime-400 text-slate-900 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-white transition-colors mt-4">
                        {editingAthlete ? "Actualizar Datos" : "Registrar Atleta"}
                    </button>
                </form>
            </Modal>
        </>
    );
};

export const TournamentsManagement = () => {
    const [tournaments, setTournaments] = useState([]);
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTournament, setEditingTournament] = useState(null);
    const [formData, setFormData] = useState({ name: '', club_id: '', date: '' });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [tRes, cRes] = await Promise.all([
                fetch(`${API_URL}/tournaments`),
                fetch(`${API_URL}/clubs`)
            ]);
            setTournaments(await tRes.json());
            setClubs(await cRes.json());
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = editingTournament ? 'PUT' : 'POST';
        const url = editingTournament ? `${API_URL}/tournaments/${editingTournament.id}` : `${API_URL}/tournaments`;

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                toast.success(editingTournament ? 'Torneo actualizado' : 'Torneo creado con éxito');
                setIsModalOpen(false);
                fetchData();
                setEditingTournament(null);
                setFormData({ name: '', club_id: '', date: '' });
            } else {
                toast.error('Error al guardar el torneo');
            }
        } catch (err) {
            toast.error('Error de conexión');
        }
    };

    const columns = [
        {
            key: 'name', label: 'Torneo', render: (val) => (
                <span className="text-white text-sm font-black italic uppercase tracking-tighter">{val}</span>
            )
        },
        {
            key: 'club', label: 'Sede', render: (val) => (
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                    <MapPin size={12} className="text-lime-400" /> {val?.name}
                </div>
            )
        },
        {
            key: 'duplas', label: 'Participantes', render: (_, item) => (
                <button
                    onClick={() => window.setCurrentTournamentDuplas(item)}
                    className="flex items-center gap-2 text-lime-400 text-[10px] font-black uppercase hover:underline"
                >
                    <Users size={12} /> Gestionar Duplas
                </button>
            )
        }
    ];

    return (
        <>
            <DataTable title="TORNEOS" columns={columns} data={tournaments} loading={loading}
                onAdd={() => { setEditingTournament(null); setFormData({ name: '', club_id: '', date: '' }); setIsModalOpen(true); }}
                onEdit={(t) => { setEditingTournament(t); setFormData({ name: t.name, club_id: t.club_id, date: t.date }); setIsModalOpen(true); }}
                onDelete={async (id) => {
                    if (confirm('¿Eliminar torneo?')) {
                        try {
                            const res = await fetch(`${API_URL}/tournaments/${id}`, {
                                method: 'DELETE',
                                headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
                            });
                            if (res.ok) {
                                toast.success('Torneo eliminado');
                                fetchData();
                            } else {
                                toast.error('No se pudo eliminar');
                            }
                        } catch (err) {
                            toast.error('Error de conexión');
                        }
                    }
                }}
            />

            <Modal title={editingTournament ? "Editar Torneo" : "Nuevo Torneo"} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Nombre del Torneo</label>
                        <input required className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:border-lime-400/50 outline-none transition-all" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Club Sede</label>
                        <select required className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:border-lime-400/50 outline-none transition-all" value={formData.club_id} onChange={e => setFormData({ ...formData, club_id: e.target.value })}>
                            <option value="">Seleccionar Club...</option>
                            {clubs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Fecha</label>
                        <input type="date" required className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:border-lime-400/50 outline-none transition-all [color-scheme:dark]" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                    </div>
                    <button type="submit" className="w-full bg-lime-400 text-slate-900 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-white transition-colors mt-4">
                        {editingTournament ? "Guardar Cambios" : "Crear Torneo"}
                    </button>
                </form>
            </Modal>
        </>
    );
};

export const TeamsManagement = ({ tournament, onBack }) => {
    const [teams, setTeams] = useState([]);
    const [athletes, setAthletes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAthleteModalOpen, setIsAthleteModalOpen] = useState(false);
    const [formData, setFormData] = useState({ tournament_id: tournament.id, athlete1_id: '', athlete2_id: '', category: 'OPEN' });
    const [athleteFormData, setAthleteFormData] = useState({ name: '', category: 'OPEN', phone: '' });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [tRes, aRes] = await Promise.all([
                fetch(`${API_URL}/teams?tournament_id=${tournament.id}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
                }),
                fetch(`${API_URL}/athletes`)
            ]);
            setTeams(await tRes.json());
            setAthletes(await aRes.json());
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/teams`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                toast.success('Dupla registrada');
                setIsModalOpen(false);
                fetchData();
            } else {
                const data = await res.json();
                toast.error(data.message || 'Error al registrar dupla');
            }
        } catch (err) { toast.error('Error de conexión'); }
    };

    const handleAthleteSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/athletes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
                body: JSON.stringify(athleteFormData)
            });

            if (res.ok) {
                const newAthlete = await res.json();
                toast.success('Atleta registrado');
                setAthletes([...athletes, newAthlete]);
                setIsAthleteModalOpen(false);
                setAthleteFormData({ name: '', category: 'OPEN', phone: '' });
            }
        } catch (err) { toast.error('Error al registrar atleta'); }
    };

    const columns = [
        {
            key: 'team', label: 'Pareja', render: (_, item) => (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-white font-bold text-sm">
                        <User size={12} className="text-lime-400" /> {item.athlete1?.name}
                    </div>
                    <div className="flex items-center gap-2 text-white font-bold text-sm">
                        <User size={12} className="text-lime-400" /> {item.athlete2?.name}
                    </div>
                </div>
            )
        },
        {
            key: 'category', label: 'Categoría', render: (val) => (
                <span className="px-3 py-1 bg-lime-400/10 text-lime-400 border border-lime-400/20 rounded-full text-[9px] font-black">
                    {val} CATEGORÍA
                </span>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <button onClick={onBack} className="text-slate-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:text-white transition-colors mb-4">
                <ChevronRight size={14} className="rotate-180" /> Volver a Torneos
            </button>

            <DataTable
                title={`DUPLAS - ${tournament.name}`}
                columns={columns}
                data={teams}
                loading={loading}
                onAdd={() => setIsModalOpen(true)}
                onEdit={() => { }}
                onDelete={async (id) => {
                    if (confirm('¿Eliminar dupla?')) {
                        await fetch(`${API_URL}/teams/${id}`, {
                            method: 'DELETE',
                            headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
                        });
                        fetchData();
                    }
                }}
            />

            <Modal title="Registrar Nueva Dupla" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Atleta 1</label>
                        <div className="flex gap-2">
                            <select required className="flex-1 bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white text-sm outline-none"
                                value={formData.athlete1_id} onChange={e => setFormData({ ...formData, athlete1_id: e.target.value })}>
                                <option value="">Seleccionar Atleta...</option>
                                {athletes.map(a => <option key={a.id} value={a.id}>{a.name} ({a.category})</option>)}
                            </select>
                            <button type="button" onClick={() => setIsAthleteModalOpen(true)} className="p-3 bg-slate-800 text-lime-400 rounded-xl hover:bg-slate-700">
                                <Plus size={20} />
                            </button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Atleta 2</label>
                        <div className="flex gap-2">
                            <select required className="flex-1 bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white text-sm outline-none"
                                value={formData.athlete2_id} onChange={e => setFormData({ ...formData, athlete2_id: e.target.value })}>
                                <option value="">Seleccionar Atleta...</option>
                                {athletes.map(a => <option key={a.id} value={a.id}>{a.name} ({a.category})</option>)}
                            </select>
                            <button type="button" onClick={() => setIsAthleteModalOpen(true)} className="p-3 bg-slate-800 text-lime-400 rounded-xl hover:bg-slate-700">
                                <Plus size={20} />
                            </button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Categoría de la Dupla</label>
                        <select required className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white text-sm outline-none"
                            value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                            {['1', '2', '3', '4', '5', '6', '7', 'OPEN', 'MASTER', 'JUNIOR'].map(cat => (
                                <option key={cat} value={cat}>{cat} CATEGORÍA</option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="w-full bg-lime-400 text-slate-900 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-white transition-colors mt-4">
                        Registrar Dupla
                    </button>
                </form>
            </Modal>

            <Modal title="Registro Rápido de Atleta" isOpen={isAthleteModalOpen} onClose={() => setIsAthleteModalOpen(false)}>
                <form onSubmit={handleAthleteSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Nombre Completo</label>
                        <input required className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white text-sm outline-none"
                            value={athleteFormData.name} onChange={e => setAthleteFormData({ ...athleteFormData, name: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Categoría</label>
                            <select className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white text-sm outline-none"
                                value={athleteFormData.category} onChange={e => setAthleteFormData({ ...athleteFormData, category: e.target.value })}>
                                {['1', '2', '3', '4', '5', '6', '7', 'OPEN', 'MASTER', 'JUNIOR'].map(cat => (
                                    <option key={cat} value={cat}>{cat} CATEGORÍA</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Teléfono</label>
                            <input className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white text-sm outline-none"
                                value={athleteFormData.phone} onChange={e => setAthleteFormData({ ...athleteFormData, phone: e.target.value })} />
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-lime-400 text-slate-900 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-white transition-colors mt-4">
                        Registrar Atleta
                    </button>
                </form>
            </Modal>
        </div>
    );
};
