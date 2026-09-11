import api from './axiosInstance';
export const getPersonnel = () => api.get('/personnel');
export const getPersonnelByExpedition = (expeditionId) => api.get(`/personnel/expedition/${expeditionId}`);
export const createPersonnel = (data) => api.post('/personnel', data);
export const updatePersonnel = (id, data) => api.put(`/personnel/${id}`, data);
export const deletePersonnel = (id) => api.delete(`/personnel/${id}`);
export const checkInPersonnel = (data) => api.post('/personnel/checkin', data);
