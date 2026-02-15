import axios from 'axios';

const API_URL = 'http://localhost:8889/api'; // Ajustado al puerto de MAMP MySQL pero servido por Apache en realidad? 
// Espera, MAMP por defecto usa 8888 para Apache y 8889 para MySQL. 
// Para acceder a Laravel vía Apache sería http://localhost:8888/vp360/api/public/api? 
// O si usamos php artisan serve sería 8000.
// Asumiremos que el usuario accede a través de la carpeta de MAMP.

const api = axios.create({
    baseURL: '/vp360/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    transformResponse: [function (data) {
        if (typeof data === 'string') {
            try {
                const jsonStart = data.indexOf('{');
                const arrayStart = data.indexOf('[');
                let start = -1;

                if (jsonStart !== -1 && arrayStart !== -1) start = Math.min(jsonStart, arrayStart);
                else if (jsonStart !== -1) start = jsonStart;
                else if (arrayStart !== -1) start = arrayStart;

                if (start > 0) {
                    const cleanData = data.substring(start);
                    return JSON.parse(cleanData);
                }
                return JSON.parse(data);
            } catch (e) {
                return data;
            }
        }
        return data;
    }]
});

// Interceptor para añadir el token en cada petición
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    login: async (email, password) => {
        const response = await api.post('/login', { email, password });
        if (response.data.access_token) {
            localStorage.setItem('auth_token', response.data.access_token);
        }
        return response.data;
    },
    register: async (data) => {
        const response = await api.post('/register', data);
        return response.data;
    },
    logout: async () => {
        await api.post('/logout');
        localStorage.removeItem('auth_token');
    },
    me: async () => {
        const response = await api.get('/me');
        return response.data;
    }
};

export const tournamentService = {
    getAll: async () => {
        const response = await api.get('/tournaments');
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/tournaments/${id}`);
        return response.data;
    }
};

export const gameService = {
    getAll: async () => {
        const response = await api.get('/matches');
        return response.data;
    },
    updateScore: async (id, data) => {
        const response = await api.patch(`/matches/${id}/score`, data);
        return response.data;
    }
};

export const apparelService = {
    getAll: async () => {
        const response = await api.get('/apparels');
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/apparels', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.put(`/apparels/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        await api.delete(`/apparels/${id}`);
    }
};

export const athleteService = {
    getAll: async () => {
        const response = await api.get('/athletes');
        return response.data;
    }
};

export default api;
