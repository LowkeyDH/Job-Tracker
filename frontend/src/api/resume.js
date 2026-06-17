import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:3000/api' });

export const uploadResume = (file) => {
  const formData = new FormData();
  formData.append('resume', file);
  return API.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getAnalysis = (id) => API.get(`/resume/${id}/analysis`);
