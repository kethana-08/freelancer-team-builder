import api from './api';

export const matchingService = {
  runMatch: async (payload) => {
    // payload can contain { projectId } OR { requiredSkills, budget, targetTeamSize, timeline }
    const response = await api.post('/matching/match', payload);
    return response.data;
  }
};
