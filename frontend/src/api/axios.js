import axios from 'axios';

const baseURL = 'http://127.0.0.1:8000/api';

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Add a request interceptor to add the auth token to headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle 401 errors (optional)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Handle unauthorized access (e.g., redirect to login or clear token)
            // localStorage.removeItem('token');
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
