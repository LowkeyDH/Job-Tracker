import client from './client';

export const searchJobs = ({ what, where, country = 'us', level = '', internship = false, page = 1 }) =>
  client.get('/search', { params: { what, where, country, level, internship, page } });
