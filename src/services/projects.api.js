import apiClient from './api';

export const projectsApi = {
  /**
   * Get all projects / workspaces
   * GET /api/projects
   */
  async getProjects() {
    const response = await apiClient.get('/projects');
    return response.data;
  },

  /**
   * Create a new project workspace
   * POST /api/projects
   */
  async createProject(projectData) {
    const response = await apiClient.post('/projects', projectData);
    return response.data;
  },
};

export default projectsApi;
