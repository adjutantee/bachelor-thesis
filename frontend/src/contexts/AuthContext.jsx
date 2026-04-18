import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';
import { decodeJWT, getUserRoles, isAdmin, isTokenExpired } from '../utils/jwtUtils';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('authToken');
      console.log('Auth Debug: Checking auth status, token exists:', !!token);
      
      if (token && !isTokenExpired(token)) {
        // Decode token to get user info and roles
        const decoded = decodeJWT(token);
        const roles = getUserRoles(token);
        const adminStatus = isAdmin(token);
        
        console.log('Auth Debug: Token decoded successfully');
        console.log('Auth Debug: User roles:', roles);
        console.log('Auth Debug: Is admin:', adminStatus);
        
        try {
          // Try to get current user info from API
          const response = await authApi.getCurrentUser();
          console.log('Auth Debug: API user data:', response.data);
          
          setUser({
            ...response.data,
            roles: roles,
            isAdmin: adminStatus
          });
        } catch (apiError) {
          console.log('Auth Debug: API call failed, using token data:', apiError.message);
          // If API call fails, use token data
          setUser({
            name: decoded.name || decoded.unique_name || decoded.sub || 'User',
            email: decoded.email || decoded.unique_name || '',
            roles: roles,
            isAdmin: adminStatus
          });
        }
      } else {
        console.log('Auth Debug: Token is expired or doesn\'t exist');
        // Token is expired or doesn't exist
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
      }
    } catch (err) {
      console.error('Auth Debug: Error in checkAuthStatus:', err);
      // If token is invalid, clear it
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setError('');
      console.log('Auth Debug: Starting login process');
      
      const response = await authApi.login(credentials);
      console.log('Auth Debug: Login response:', response.data);
      
      // Handle different possible response structures
      const data = response.data;
      let token, refreshToken, userData;

      if (data.token) {
        // Standard response structure
        token = data.token;
        refreshToken = data.refreshToken;
        userData = data.user || data;
      } else if (data.accessToken) {
        // Alternative response structure
        token = data.accessToken;
        refreshToken = data.refreshToken;
        userData = data.user || data;
      } else {
        // If no token in response, assume the whole response is user data
        // and token might be in headers or we need to extract it differently
        token = response.headers?.authorization?.replace('Bearer ', '') || data.accessToken || data.token;
        userData = data;
      }

      console.log('Auth Debug: Extracted token:', !!token);
      console.log('Auth Debug: Token preview:', token ? token.substring(0, 50) + '...' : 'none');

      if (token) {
        localStorage.setItem('authToken', token);
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
        
        // Decode token to get roles
        const roles = getUserRoles(token);
        const adminStatus = isAdmin(token);
        
        console.log('Auth Debug: Login - extracted roles:', roles);
        console.log('Auth Debug: Login - admin status:', adminStatus);
        
        // Set user data with role information
        const userToSet = userData || {
          name: `${credentials.loginEmail}`,
          email: credentials.loginEmail
        };
        
        const finalUser = {
          ...userToSet,
          roles: roles,
          isAdmin: adminStatus
        };
        
        console.log('Auth Debug: Final user object:', finalUser);
        setUser(finalUser);
        
        return { success: true };
      } else {
        throw new Error('No authentication token received');
      }
    } catch (err) {
      console.error('Auth Debug: Login error:', err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Ошибка входа в систему';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      setError('');
      console.log('Auth Debug: Starting registration process');
      
      const response = await authApi.register(userData);
      console.log('Auth Debug: Registration response:', response.data);
      
      // Handle different possible response structures
      const data = response.data;
      let token, refreshToken, newUser;

      if (data.token) {
        token = data.token;
        refreshToken = data.refreshToken;
        newUser = data.user || data;
      } else if (data.accessToken) {
        token = data.accessToken;
        refreshToken = data.refreshToken;
        newUser = data.user || data;
      } else {
        token = response.headers?.authorization?.replace('Bearer ', '') || data.accessToken || data.token;
        newUser = data;
      }

      console.log('Auth Debug: Registration - extracted token:', !!token);

      if (token) {
        localStorage.setItem('authToken', token);
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
        
        // Decode token to get roles
        const roles = getUserRoles(token);
        const adminStatus = isAdmin(token);
        
        console.log('Auth Debug: Registration - extracted roles:', roles);
        console.log('Auth Debug: Registration - admin status:', adminStatus);
        
        // Set user data with role information
        const userToSet = newUser || {
          name: `${userData.registerFirstName} ${userData.registerLastName}`,
          email: userData.registerEmail,
          userName: userData.registerUserName
        };
        
        setUser({
          ...userToSet,
          roles: roles,
          isAdmin: adminStatus
        });
        
        return { success: true };
      } else {
        throw new Error('No authentication token received');
      }
    } catch (err) {
      console.error('Auth Debug: Registration error:', err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Ошибка регистрации';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error('Auth Debug: Logout error:', err);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
    userRoles: user?.roles || []
  };

  console.log('Auth Debug: Current auth state:', {
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
    userRoles: user?.roles || [],
    user: user ? { ...user, roles: user.roles } : null
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};