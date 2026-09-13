import apiClient from './api';

export const settingsApi = {
  /**
   * Get app settings
   * GET /api/settings
   */
  async getSettings() {
    const response = await apiClient.get('/settings');
    return response.data;
  },

  /**
   * Update app settings
   * PATCH /api/settings
   */
  async updateSettings(settingsData) {
    const response = await apiClient.patch('/settings', settingsData);
    return response.data;
  },
};

export default settingsApi;
