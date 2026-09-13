import apiClient from './api';

export const uploadApi = {
  /**
   * Upload confidential file to local workbench
   * POST /api/upload
   */
  async uploadFile(file, onProgress) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });
    return response.data;
  },

  /**
   * Get deliverable file preview HTML
   * GET /api/files/:id/preview
   */
  async getFilePreview(fileId) {
    const response = await apiClient.get(`/files/${fileId}/preview`);
    return response.data;
  },

  /**
   * Download generated artifact file url
   */
  getFileDownloadUrl(fileId) {
    return `${apiClient.defaults.baseURL}/files/${fileId}`;
  },
};

export default uploadApi;
