import apiClient from './api';
import { CONFIG } from './config';

// Mock credentials catalog for local demo & offline testing
export const DEMO_ACCOUNTS = {
  admin: {
    email: 'admin@aegis.local',
    password: 'password123',
    user: {
      id: 'usr_admin_001',
      name: 'Dr. Evelyn Vance (CSO)',
      email: 'admin@aegis.local',
      role: 'admin',
      department: 'Operations & Security',
      clearanceLevel: 'LEVEL-5 // TS-SCI',
    },
  },
  operator: {
    email: 'operator@aegis.local',
    password: 'password123',
    user: {
      id: 'usr_operator_002',
      name: 'Marcus Chen (Staff)',
      email: 'operator@aegis.local',
      role: 'user',
      department: 'Quality Engineering',
      clearanceLevel: 'LEVEL-3 // RESTRICTED',
    },
  },
};

export const authApi = {
  /**
   * Authenticate user with FastAPI backend
   * POST /api/auth/login
   * Fallbacks to offline demo verification if backend is unreachable
   */
  async login({ email, password }) {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      if (CONFIG.ENABLE_SIMULATOR_FALLBACK) {
        // Find matching demo account or create standard user session
        let matched = Object.values(DEMO_ACCOUNTS).find(
          (acc) => acc.email.toLowerCase() === email.toLowerCase() && acc.password === password
        );

        if (!matched && email.trim() && password.trim()) {
          // Allow custom user login in mock mode
          matched = {
            user: {
              id: `usr_${Date.now()}`,
              name: email.split('@')[0],
              email: email.trim(),
              role: email.toLowerCase().includes('admin') ? 'admin' : 'user',
              department: 'Quality Engineering',
              clearanceLevel: 'LEVEL-3 // RESTRICTED',
            },
          };
        }

        if (!matched) {
          throw new Error('Invalid email or passphrase. Check credentials.');
        }

        const token = `aegis_jwt_${btoa(JSON.stringify({ sub: matched.user.id, role: matched.user.role, exp: Date.now() + 86400000 }))}`;

        return {
          access_token: token,
          token_type: 'bearer',
          user: matched.user,
        };
      }
      throw error;
    }
  },

  /**
   * Terminate user session
   * POST /api/auth/logout
   */
  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Graceful offline fallback
      console.warn('Backend logout skipped or offline:', error.message);
    }
  },

  /**
   * Fetch currently authenticated user profile
   * GET /api/auth/me
   */
  async getMe() {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error) {
      if (CONFIG.ENABLE_SIMULATOR_FALLBACK) {
        const storedUser = localStorage.getItem('aegis_user_profile');
        if (storedUser) {
          return JSON.parse(storedUser);
        }
      }
      throw error;
    }
  },
};

export default authApi;
