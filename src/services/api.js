import axios from 'axios';
import { CONFIG } from './config';

/**
 * Axios instance configured with base URL, headers, and interceptors
 */
export const apiClient = axios.create({
  baseURL: CONFIG.API_BASE_URL,
  timeout: CONFIG.API_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
    'X-Client-Origin': 'AegisAI-Sovereign-Workbench',
    'X-Airgap-Enforced': 'true',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth headers or session tokens if present in localStorage
    const sessionToken = localStorage.getItem('aegis_session_token');
    if (sessionToken) {
      config.headers['Authorization'] = `Bearer ${sessionToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error formatting
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Format error response for clean UI feedback
    const formattedError = {
      status: error.response?.status || 500,
      message: error.response?.data?.message || error.message || 'Network error occurred',
      isOffline: !error.response && error.code === 'ERR_NETWORK',
      code: error.code || 'UNKNOWN_ERROR',
      details: error.response?.data || null,
    };
    return Promise.reject(formattedError);
  }
);

export default apiClient;
