import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('team_builder_user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('team_builder_token'));
  const [loading, setLoading] = useState(true);

  // Sync / Verify current user profile on load
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('team_builder_token');
      if (savedToken) {
        try {
          const res = await authService.getMe();
          if (res.data?.user) {
            setUser(res.data.user);
            localStorage.setItem('team_builder_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Session expired or invalid:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    const { user: loggedUser, accessToken, refreshToken } = res.data;

    localStorage.setItem('team_builder_token', accessToken);
    localStorage.setItem('team_builder_refresh_token', refreshToken);
    localStorage.setItem('team_builder_user', JSON.stringify(loggedUser));

    setToken(accessToken);
    setUser(loggedUser);
    return loggedUser;
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    const { user: registeredUser, accessToken, refreshToken } = res.data;

    localStorage.setItem('team_builder_token', accessToken);
    localStorage.setItem('team_builder_refresh_token', refreshToken);
    localStorage.setItem('team_builder_user', JSON.stringify(registeredUser));

    setToken(accessToken);
    setUser(registeredUser);
    return registeredUser;
  };

  const demoLogin = async (roleOrEmail) => {
    const res = await authService.demoLogin(roleOrEmail);
    const { user: demoUser, accessToken, refreshToken } = res.data;

    localStorage.setItem('team_builder_token', accessToken);
    localStorage.setItem('team_builder_refresh_token', refreshToken);
    localStorage.setItem('team_builder_user', JSON.stringify(demoUser));

    setToken(accessToken);
    setUser(demoUser);
    return demoUser;
  };

  const logout = () => {
    localStorage.removeItem('team_builder_token');
    localStorage.removeItem('team_builder_refresh_token');
    localStorage.removeItem('team_builder_user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('team_builder_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user && !!token,
        isClient: user?.role === 'client',
        isFreelancer: user?.role === 'freelancer',
        isAdmin: user?.role === 'admin',
        login,
        register,
        demoLogin,
        logout,
        updateUser,
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
