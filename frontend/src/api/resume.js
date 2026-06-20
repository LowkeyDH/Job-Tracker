import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

export const uploadResume = (file) => {
  const formData = new FormData();
  formData.append('resume', file);
  return API.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getAnalysis = (id) => API.get(`/resume/${id}/analysis`);
