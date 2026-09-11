import api from './axiosInstance';
export const getAlerts = (resolved) => api.get('/emergency', { params: resolved !== undefined ? { resolved } : {} });
export const createAlert = (data) => api.post('/emergency', data);
export const resolveAlert = (id, resolution_notes) => api.patch(`/emergency/${id}/resolve`, { resolution_notes });
export const deleteAlert = (id) => api.delete(`/emergency/${id}`);
