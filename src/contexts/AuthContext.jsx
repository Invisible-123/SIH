import React, { createContext, useContext, useState, useEffect } from 'react';

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (credentials) => {
    // Admin login
    if (credentials.username === 'AY' && credentials.password === '12345') {
      const adminUser = {
        id: 'admin',
        username: 'AY',
        role: 'admin',
        name: 'Administrator'
      };
      setUser(adminUser);
      localStorage.setItem('user', JSON.stringify(adminUser));
      return { success: true, user: adminUser };
    }
    
    // Student login (any other username with password 'student')
    if (credentials.password === 'student') {
      const studentUser = {
        id: credentials.username,
        username: credentials.username,
        role: 'student',
        name: `Student ${credentials.username}`
      };
      setUser(studentUser);
      localStorage.setItem('user', JSON.stringify(studentUser));
      return { success: true, user: studentUser };
    }

    return { success: false, error: 'Invalid credentials' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
