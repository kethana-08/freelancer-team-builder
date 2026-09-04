import api from './api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  demoLogin: async (roleOrEmail) => {
    const payload = typeof roleOrEmail === 'string' && roleOrEmail.includes('@')
      ? { email: roleOrEmail }
      : { role: roleOrEmail || 'client' };
    const response = await api.post('/auth/demo-login', payload);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  uploadAvatar: async (formData) => {
    const response = await api.post('/users/avatar', formData);
    return response.data;
  },

  getFreelancers: async (params) => {
    const response = await api.get('/users/freelancers', { params });
    return response.data;
  },

  getFreelancerById: async (id) => {
    const response = await api.get(`/users/freelancers/${id}`);
    return response.data;
  }
};
