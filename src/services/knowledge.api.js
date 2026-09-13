import apiClient from './api';

export const knowledgeApi = {
  /**
   * Get all vector database knowledge sources
   * GET /api/kb/sources
   */
  async getSources() {
    const response = await apiClient.get('/kb/sources');
    return response.data;
  },

  /**
   * Add a new knowledge base source
   * POST /api/kb/sources
   */
  async addSource(sourceData) {
    const response = await apiClient.post('/kb/sources', sourceData);
    return response.data;
  },

  /**
   * Trigger indexing on a knowledge source
   * POST /api/kb/sources/:id/sync
   */
  async syncSource(sourceId) {
    const response = await apiClient.post(`/kb/sources/${sourceId}/sync`);
    return response.data;
  },

  /**
   * Delete a knowledge source
   * DELETE /api/kb/sources/:id
   */
  async deleteSource(sourceId) {
    const response = await apiClient.delete(`/kb/sources/${sourceId}`);
    return response.data;
  },
};

export default knowledgeApi;
