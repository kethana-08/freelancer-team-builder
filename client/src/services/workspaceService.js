import api from './api';

export const workspaceService = {
  // Tasks
  getTasks: async (projectId) => {
    const response = await api.get(`/tasks/project/${projectId}`);
    return response.data;
  },

  createTask: async (projectId, taskData) => {
    const response = await api.post(`/tasks/project/${projectId}`, taskData);
    return response.data;
  },

  updateTask: async (taskId, updates) => {
    const response = await api.put(`/tasks/${taskId}`, updates);
    return response.data;
  },

  deleteTask: async (taskId) => {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data;
  },

  addTaskComment: async (taskId, text) => {
    const response = await api.post(`/tasks/${taskId}/comments`, { text });
    return response.data;
  },

  // Chat
  getMessages: async (projectId) => {
    const response = await api.get(`/chat/project/${projectId}`);
    return response.data;
  },

  sendMessage: async (projectId, { text, attachments }) => {
    const response = await api.post(`/chat/project/${projectId}`, { text, attachments });
    return response.data;
  },

  // Milestones
  getMilestones: async (projectId) => {
    const response = await api.get(`/milestones/project/${projectId}`);
    return response.data;
  },

  createMilestone: async (projectId, milestoneData) => {
    const response = await api.post(`/milestones/project/${projectId}`, milestoneData);
    return response.data;
  },

  submitDeliverable: async (milestoneId, data) => {
    const response = await api.post(`/milestones/${milestoneId}/submit`, data);
    return response.data;
  },

  approveMilestone: async (milestoneId) => {
    const response = await api.post(`/milestones/${milestoneId}/approve`);
    return response.data;
  },

  // Files
  getFiles: async (projectId) => {
    const response = await api.get(`/files/project/${projectId}`);
    return response.data;
  },

  uploadFile: async (projectId, formData) => {
    const response = await api.post(`/files/project/${projectId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  deleteFile: async (fileId) => {
    const response = await api.delete(`/files/${fileId}`);
    return response.data;
  },

  // Activity
  getActivities: async (projectId) => {
    const response = await api.get(`/activity/project/${projectId}`);
    return response.data;
  }
};
