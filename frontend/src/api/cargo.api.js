import api from './axiosInstance';
export const getCargo = (expeditionId) => api.get('/cargo', { params: expeditionId ? { expedition_id: expeditionId } : {} });
export const getCargoById = (id) => api.get(`/cargo/${id}`);
export const getCargoByCode = (code) => api.get(`/cargo/track/${code}`);
export const createCargo = (data) => api.post('/cargo', data);
export const updateCargo = (id, data) => api.put(`/cargo/${id}`, data);
export const confirmCargoReceived = (id, data) => api.patch(`/cargo/${id}/receive`, data);
export const deleteCargo = (id) => api.delete(`/cargo/${id}`);
