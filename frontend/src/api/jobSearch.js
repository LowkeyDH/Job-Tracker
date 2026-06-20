import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

export const searchJobs = ({ what, where, country = 'us', level = '', internship = false, page = 1 }) =>
  API.get('/search', { params: { what, where, country, level, internship, page } });
