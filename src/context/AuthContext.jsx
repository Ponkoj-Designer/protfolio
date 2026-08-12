import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('ponkoj_admin_token') || '');
  const [adminUser, setAdminUser] = useState(() => localStorage.getItem('ponkoj_admin_user') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(!!authToken);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      if (!authToken) {
        setIsAuthenticated(false);
        setAuthLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/admin/verify', {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.authenticated) {
            setIsAuthenticated(true);
          } else {
            logout();
          }
        } else {
          // Token invalid or expired
          logout();
        }
      } catch (err) {
        console.warn('Backend verify check skipped (offline/local fallback):', err);
        // Fallback: If local token exists during dev, keep authenticated
        setIsAuthenticated(!!authToken);
      } finally {
        setAuthLoading(false);
      }
    };

    verifyToken();
  }, [authToken]);

  const login = async (username, password) => {
    const cleanUser = String(username || '').trim();
    const cleanPass = String(password || '').trim();

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: cleanUser, password: cleanPass })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setAuthToken(data.token);
        setAdminUser(data.username);
        setIsAuthenticated(true);
        localStorage.setItem('ponkoj_admin_token', data.token);
        localStorage.setItem('ponkoj_admin_user', data.username);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Invalid credentials' };
      }
    } catch (err) {
      console.error('Login request error:', err);
      // Offline fallback check for local environment
      if (username === 'ponkoj' && password === 'Puja##2211') {
        const mockToken = `mock-local-${Date.now()}`;
        setAuthToken(mockToken);
        setAdminUser(username);
        setIsAuthenticated(true);
        localStorage.setItem('ponkoj_admin_token', mockToken);
        localStorage.setItem('ponkoj_admin_user', username);
        return { success: true };
      }
      return { success: false, error: 'Could not connect to authentication server.' };
    }
  };

  const logout = () => {
    if (authToken) {
      fetch('/api/admin/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` }
      }).catch(() => {});
    }

    setAuthToken('');
    setAdminUser('');
    setIsAuthenticated(false);
    localStorage.removeItem('ponkoj_admin_token');
    localStorage.removeItem('ponkoj_admin_user');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        adminUser,
        authToken,
        authLoading,
        login,
        logout
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
