import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:3000/api' });

export const searchJobs = ({ what, where, country = 'us', level = '', internship = false, page = 1 }) =>
  API.get('/search', { params: { what, where, country, level, internship, page } });
