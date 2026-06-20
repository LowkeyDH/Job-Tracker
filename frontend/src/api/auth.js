import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

export const register = (email, password) => API.post('/auth/register', { email, password });
export const login = (email, password) => API.post('/auth/login', { email, password });
