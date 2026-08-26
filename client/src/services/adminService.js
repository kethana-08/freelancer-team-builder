import api from './api';

export const adminService = {
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  getUsers: async (params) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  toggleUserStatus: async (userId) => {
    const response = await api.patch(`/admin/users/${userId}/toggle-status`);
    return response.data;
  },

  getProjects: async (params) => {
    const response = await api.get('/admin/projects', { params });
    return response.data;
  },

  getSkills: async () => {
    const response = await api.get('/admin/skills');
    return response.data;
  },

  createSkill: async (skillData) => {
    const response = await api.post('/admin/skills', skillData);
    return response.data;
  },

  deleteSkill: async (skillId) => {
    const response = await api.delete(`/admin/skills/${skillId}`);
    return response.data;
  }
};
