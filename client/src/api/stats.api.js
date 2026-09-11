import api from './axiosInstance';
export const getDashboardStats = () => api.get('/stats/dashboard');
