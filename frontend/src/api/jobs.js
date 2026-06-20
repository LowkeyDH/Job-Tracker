import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

export const getAllJobs = () => API.get('/jobs');
export const createJob = (data) => API.post('/jobs', data);
export const updateJob = (id, data) => API.put(`/jobs/${id}`, data);
export const deleteJob = (id) => API.delete(`/jobs/${id}`);
