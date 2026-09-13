/**
 * AegisAI Configuration Service
 * Centralizes all environment variables and API endpoints.
 */

export const CONFIG = {
  // REST API and WebSocket URLs from environment variables
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  SANDBOX_API_BASE_URL: import.meta.env.VITE_SANDBOX_API_BASE_URL || 'http://localhost:8001',
  WS_URL: import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws',
  
  // Feature flags
  ENABLE_SIMULATOR_FALLBACK: import.meta.env.VITE_ENABLE_SIMULATOR_FALLBACK !== 'false',
  
  // Default Application Settings
  DEFAULT_RUN_MODE: import.meta.env.VITE_DEFAULT_RUN_MODE || 'agent', // 'normal' | 'agent' | 'tool'
  DEFAULT_MODEL_MODE: import.meta.env.VITE_DEFAULT_MODEL_MODE || 'auto', // 'auto' | 'manual'
  ORGANIZATION_NAME: import.meta.env.VITE_APP_ORGANIZATION || 'Sovereign Air-Gapped Facility',
  
  // Reconnection and Timeout limits
  WS_RECONNECT_INTERVAL_MS: 3000,
  WS_MAX_RECONNECT_ATTEMPTS: 10,
  API_TIMEOUT_MS: 15000,
};

export default CONFIG;
