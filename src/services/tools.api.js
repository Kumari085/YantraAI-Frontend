import apiClient from './api';

export const toolsApi = {
  /**
   * Get all registered sandbox tools
   * GET /api/tools
   */
  async getTools() {
    const response = await apiClient.get('/tools');
    return response.data;
  },

  /**
   * Register a new tool definition
   * POST /api/tools
   */
  async registerTool(toolDefinition) {
    const response = await apiClient.post('/tools', toolDefinition);
    return response.data;
  },
};

export default toolsApi;
