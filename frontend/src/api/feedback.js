import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

export const submitFeedback = (rating, message) =>
  API.post('/feedback', { rating, message });

export const getFeedback = () => API.get('/feedback');
