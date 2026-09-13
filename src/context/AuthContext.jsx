import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authApi from '../services/auth.api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('aegis_session_token') || null);
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('aegis_user_profile');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session verification on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('aegis_session_token');
      if (storedToken) {
        try {
          const profile = await authApi.getMe();
          if (profile) {
            setUser(profile);
            localStorage.setItem('aegis_user_profile', JSON.stringify(profile));
          }
        } catch (err) {
          console.warn('Session verification note:', err.message);
          // If token exists and stored user exists, keep session alive in offline mode
          const storedUser = localStorage.getItem('aegis_user_profile');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else {
            // Invalid session
            localStorage.removeItem('aegis_session_token');
            setToken(null);
            setUser(null);
          }
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      const response = await authApi.login({ email, password });
      const authToken = response.access_token;
      const userProfile = response.user;

      localStorage.setItem('aegis_session_token', authToken);
      localStorage.setItem('aegis_user_profile', JSON.stringify(userProfile));

      setToken(authToken);
      setUser(userProfile);
      return userProfile;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      localStorage.removeItem('aegis_session_token');
      localStorage.removeItem('aegis_user_profile');
      setToken(null);
      setUser(null);
    }
  }, []);

  const hasRole = useCallback(
    (requiredRole) => {
      if (!user) return false;
      if (user.role === 'admin') return true; // Admin has superuser access
      return user.role === requiredRole;
    },
    [user]
  );

  const hasAnyRole = useCallback(
    (roles = []) => {
      if (!user) return false;
      if (user.role === 'admin') return true;
      return roles.includes(user.role);
    },
    [user]
  );

  const canAccessDepartment = useCallback(
    (deptName) => {
      if (!user) return false;
      if (user.role === 'admin') return true;
      if (!deptName || deptName === 'All' || deptName === 'General') return true;
      return user.department?.toLowerCase() === deptName.toLowerCase();
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: Boolean(token && user),
        isLoading,
        login,
        logout,
        hasRole,
        hasAnyRole,
        canAccessDepartment,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
