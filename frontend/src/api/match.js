import client from './client';

export const matchResume = (resumeId, jobId) => client.post('/match', { resumeId, jobId });
