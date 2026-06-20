import client from './client';

export const getAllJobs = () => client.get('/jobs');
export const createJob = (data) => client.post('/jobs', data);
export const updateJob = (id, data) => client.put(`/jobs/${id}`, data);
export const deleteJob = (id) => client.delete(`/jobs/${id}`);
