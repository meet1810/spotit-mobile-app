
import axios from 'axios';
import { NATIVE_PUBLIC_URL } from '../constants/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';

console.log('API Base URL:', NATIVE_PUBLIC_URL);

// Create Axios Instance
const api = axios.create({
    baseURL: NATIVE_PUBLIC_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor (Add Token)
api.interceptors.request.use(
    async (config) => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.log('Error retrieving token', error);
        }

        console.log(`[API REQUEST] ${config.method.toUpperCase()} ${config.url}`, config.data instanceof FormData ? 'FormData' : config.data);
        return config;
    },
    (error) => {
        console.log('[API REQUEST ERROR]', error);
        return Promise.reject(error);
    }
);

// Response Interceptor
api.interceptors.response.use(
    (response) => {
        console.log(`[API RESPONSE] ${response.status} ${response.config.url}`, response.data);
        return response;
    },
    (error) => {
        console.log('[API RESPONSE ERROR]', error.response?.status, error.response?.data);
        return Promise.reject(error);
    }
);

export const login = async (identifier, password) => {
    try {
        const isEmail = identifier.includes('@');
        const payload = {
            email: isEmail ? identifier : "",
            phone: !isEmail ? identifier : "",
            password
        };
        const response = await api.post('/api/auth/login', payload);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const register = async (userData) => {
    try {
        const response = await api.post('/api/auth/register', userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const reportIssue = async (formData) => {
    try {
        const response = await api.post('/api/report', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getReports = async () => {
    try {
        const response = await api.get('/api/report/list');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export default api;
