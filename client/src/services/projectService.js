import api from './api';

export const projectService = {
  createProject: async (projectData) => {
    const response = await api.post('/projects', projectData);
    return response.data;
  },

  getProjects: async (params) => {
    const response = await api.get('/projects', { params });
    return response.data;
  },

  getProjectById: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  updateProject: async (id, data) => {
    const response = await api.put(`/projects/${id}`, data);
    return response.data;
  },

  deleteProject: async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },

  inviteTeam: async (projectId, { members, message }) => {
    const response = await api.post(`/projects/${projectId}/invite-team`, { members, message });
    return response.data;
  },

  removeMember: async (projectId, memberId) => {
    const response = await api.delete(`/projects/${projectId}/members/${memberId}`);
    return response.data;
  },

  getMyInvitations: async () => {
    const response = await api.get('/invitations/my-invitations');
    return response.data;
  },

  respondToInvitation: async (invitationId, action) => {
    const response = await api.post(`/invitations/${invitationId}/respond`, { action });
    return response.data;
  }
};
