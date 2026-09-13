import apiClient from './api';
import { CONFIG } from './config';
import { MOCK_MODELS } from './mockData';

// Local cache for mock state during demo sessions
let localMockModels = [...MOCK_MODELS];

export const modelsApi = {
  /**
   * Get all available local models
   * Attempts real FastAPI backend GET /api/models first.
   * Falls back to isolated MOCK_MODELS only if backend is offline and fallback is enabled.
   */
  async getModels() {
    try {
      const response = await apiClient.get('/models');
      return {
        models: response.data,
        isFromBackend: true,
      };
    } catch (error) {
      if (CONFIG.ENABLE_SIMULATOR_FALLBACK) {
        return {
          models: localMockModels,
          isFromBackend: false,
          error: error.message,
        };
      }
      throw error;
    }
  },

  /**
   * Register or deploy a local model
   * POST /api/models
   */
  async registerModel(modelData) {
    try {
      const response = await apiClient.post('/models', modelData);
      return response.data;
    } catch (error) {
      if (CONFIG.ENABLE_SIMULATOR_FALLBACK) {
        const newModel = {
          id: `model-${Date.now()}`,
          ...modelData,
          status: 'standby',
        };
        localMockModels.push(newModel);
        return newModel;
      }
      throw error;
    }
  },

  /**
   * Load model to VRAM
   * POST /api/models/:id/load
   */
  async loadModel(modelId) {
    try {
      const response = await apiClient.post(`/models/${modelId}/load`);
      return response.data;
    } catch (error) {
      if (CONFIG.ENABLE_SIMULATOR_FALLBACK) {
        localMockModels = localMockModels.map((m) =>
          m.id === modelId ? { ...m, status: 'loaded' } : m
        );
        return { status: 'loaded', model_id: modelId };
      }
      throw error;
    }
  },

  /**
   * Unload model from VRAM
   * POST /api/models/:id/unload
   */
  async unloadModel(modelId) {
    try {
      const response = await apiClient.post(`/models/${modelId}/unload`);
      return response.data;
    } catch (error) {
      if (CONFIG.ENABLE_SIMULATOR_FALLBACK) {
        localMockModels = localMockModels.map((m) =>
          m.id === modelId ? { ...m, status: 'standby' } : m
        );
        return { status: 'standby', model_id: modelId };
      }
      throw error;
    }
  },

  /**
   * Delete / unregister a local model (Admin)
   * DELETE /api/models/:id
   */
  async deleteModel(modelId) {
    try {
      const response = await apiClient.delete(`/models/${modelId}`);
      return response.data;
    } catch (error) {
      if (CONFIG.ENABLE_SIMULATOR_FALLBACK) {
        localMockModels = localMockModels.filter((m) => m.id !== modelId);
        return { success: true, model_id: modelId };
      }
      throw error;
    }
  },
};

export default modelsApi;
