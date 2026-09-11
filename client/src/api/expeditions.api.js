import api from './axiosInstance';
export const getExpeditions = () => api.get('/expeditions');
export const getExpedition = (id) => api.get(`/expeditions/${id}`);
export const createExpedition = (data) => api.post('/expeditions', data);
export const updateExpedition = (id, data) => api.put(`/expeditions/${id}`, data);
export const deleteExpedition = (id) => api.delete(`/expeditions/${id}`);
