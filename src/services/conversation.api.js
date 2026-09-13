import apiClient from './api';

export const conversationApi = {
  /**
   * Get all conversations
   * GET /api/conversations
   */
  async getConversations() {
    const response = await apiClient.get('/conversations');
    return response.data;
  },

  /**
   * Get messages for a specific conversation
   * GET /api/conversations/:id
   */
  async getConversationMessages(conversationId) {
    const response = await apiClient.get(`/conversations/${conversationId}`);
    return response.data;
  },

  /**
   * Create or backup conversation(s)
   * POST /api/conversations
   */
  async saveConversation(conversationData) {
    const response = await apiClient.post('/conversations', conversationData);
    return response.data;
  },

  /**
   * Update conversation metadata
   * PATCH /api/conversations/:id
   */
  async updateConversation(conversationId, updates) {
    const response = await apiClient.patch(`/conversations/${conversationId}`, updates);
    return response.data;
  },

  /**
   * Delete a conversation
   * DELETE /api/conversations/:id
   */
  async deleteConversation(conversationId) {
    const response = await apiClient.delete(`/conversations/${conversationId}`);
    return response.data;
  },
};

export default conversationApi;
