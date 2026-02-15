import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Pencil, Trash2, Search, Shirt, X, Save, User } from 'lucide-react';
import { apparelService, athleteService } from '../../services/api';

export default function ApparelsManagement() {
    const [apparels, setApparels] = useState([]);
    const [athletes, setAthletes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentApparel, setCurrentApparel] = useState(null);
    const [formData, setFormData] = useState({
        shirt_id: '',
        athlete_id: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [apparelsData, athletesData] = await Promise.all([
                apparelService.getAll(),
                athleteService.getAll()
            ]);
            setApparels(apparelsData);
            setAthletes(athletesData);
        } catch (error) {
            console.error("Error loading data:", error);
            alert("Error al cargar los datos.");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (apparel = null) => {
        if (apparel) {
            setCurrentApparel(apparel);
            setFormData({
                shirt_id: apparel.shirt_id,
                athlete_id: apparel.athlete_id || ''
            });
        } else {
            setCurrentApparel(null);
            setFormData({
                shirt_id: '',
                athlete_id: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSend = {
                shirt_id: formData.shirt_id,
                athlete_id: formData.athlete_id || null
            };

            if (currentApparel) {
                await apparelService.update(currentApparel.id, dataToSend);
            } else {
                await apparelService.create(dataToSend);
            }
            setIsModalOpen(false);
            loadData();
        } catch (error) {
            console.error("Error saving apparel:", error);
            alert("Error al guardar. Verifica que el ID de la franela no esté duplicado.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar esta franela?')) {
            try {
                await apparelService.delete(id);
                loadData();
            } catch (error) {
                console.error("Error deleting apparel:", error);
                alert("Error al eliminar.");
            }
        }
    };

    const filteredApparels = apparels.filter(apparel =>
        apparel.shirt_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (apparel.athlete?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter flex items-center gap-2">
                    <Shirt className="text-lime-600" />
                    Gestión de Indumentaria
                </h2>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-slate-800 transition-colors flex items-center gap-2"
                >
                    <Plus size={20} />
                    Nueva Franela
                </button>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar por ID o Atleta..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-200 text-slate-500 text-sm uppercase tracking-wider">
                                <th className="pb-3 pl-2">ID Franela</th>
                                <th className="pb-3">Atleta Asignado</th>
                                <th className="pb-3 text-right pr-2">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="3" className="py-8 text-center text-slate-400">Cargando...</td>
                                </tr>
                            ) : filteredApparels.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="py-8 text-center text-slate-400">No hay franelas registradas.</td>
                                </tr>
                            ) : (
                                filteredApparels.map((apparel) => (
                                    <tr key={apparel.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="py-3 pl-2 font-mono font-bold text-slate-700">
                                            {apparel.shirt_id}
                                        </td>
                                        <td className="py-3">
                                            {apparel.athlete ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-lime-100 flex items-center justify-center text-lime-700 font-bold text-xs">
                                                        {apparel.athlete.name.charAt(0)}
                                                    </div>
                                                    <span className="font-medium text-slate-700">{apparel.athlete.name}</span>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 text-sm italic flex items-center gap-1">
                                                    <User size={14} /> Sin Asignar
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3 text-right pr-2">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleOpenModal(apparel)}
                                                    className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(apparel.id)}
                                                    className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-lg text-slate-800">
                                {currentApparel ? 'Editar Franela' : 'Nueva Franela'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">ID de Franela (Único)</label>
                                <input
                                    type="text"
                                    required
                                    autoFocus
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 text-slate-900"
                                    placeholder="Ej. 0102"
                                    value={formData.shirt_id}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setFormData(prev => ({ ...prev, shirt_id: val }));
                                    }}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Atleta Asignado (Opcional)</label>
                                <select
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 text-slate-900"
                                    value={formData.athlete_id || ''}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setFormData(prev => ({ ...prev, athlete_id: val }));
                                    }}
                                >
                                    <option value="">-- Sin Asignar --</option>
                                    {athletes.map(athlete => (
                                        <option key={athlete.id} value={athlete.id}>
                                            {athlete.name} (Ranking: {athlete.ranking || 'N/A'})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-2 text-slate-600 font-bold hover:bg-slate-50 rounded-lg transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2 bg-gradient-to-r from-lime-400 to-lime-500 text-slate-900 font-bold rounded-lg shadow-lg shadow-lime-400/20 hover:shadow-lime-400/30 transition-all flex items-center justify-center gap-2"
                                >
                                    <Save size={18} />
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
