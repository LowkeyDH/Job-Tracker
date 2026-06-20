import client from './client';

export const uploadResume = (file) => {
  const formData = new FormData();
  formData.append('resume', file);
  return client.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getAnalysis = (id) => client.get(`/resume/${id}/analysis`);
