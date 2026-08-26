import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
// Attach Authorization Bearer token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('team_builder_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Intercept responses for auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('team_builder_refresh_token');
      if (refreshToken) {
        try {
          const res = await api.post('/auth/refresh', { refreshToken });
          if (res.data.success) {
            localStorage.setItem('team_builder_token', res.data.data.accessToken);
            localStorage.setItem('team_builder_refresh_token', res.data.data.refreshToken);
            originalRequest.headers.Authorization = `Bearer ${res.data.data.accessToken}`;
            return api(originalRequest);
          }
        } catch (refreshErr) {
          localStorage.removeItem('team_builder_token');
          localStorage.removeItem('team_builder_refresh_token');
          localStorage.removeItem('team_builder_user');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
