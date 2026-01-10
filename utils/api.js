
import axios from 'axios';
import { NATIVE_PUBLIC_URL } from '../constants/Config';

console.log('API Base URL:', NATIVE_PUBLIC_URL);

// Create Axios Instance
const api = axios.create({
    baseURL: NATIVE_PUBLIC_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor (Optional: Add Token if needed later)
api.interceptors.request.use(
    async (config) => {
        // You can add logic here to inject the token from AsyncStorage
        // const token = await AsyncStorage.getItem('userToken');
        // if (token) {
        //     config.headers.Authorization = `Bearer ${token}`;
        // }
        console.log(`[API REQUEST] ${config.method.toUpperCase()} ${config.url}`, config.data);
        return config;
    },
    (error) => {
        console.error('[API REQUEST ERROR]', error);
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
        console.error('[API RESPONSE ERROR]', error.response?.status, error.response?.data);
        return Promise.reject(error);
    }
);

export const login = async (identifier, password) => {
    try {
        const isEmail = identifier.includes('@');
        const payload = {
            email: isEmail ? identifier : "",
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

export default api;
