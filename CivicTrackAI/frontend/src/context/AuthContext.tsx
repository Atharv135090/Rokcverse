import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  role: 'USER' | 'ADMIN';
}

interface AuthContextType {
  user: User | null;
  login: (username: string) => void;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('civic_current_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const register = (username: string, pass: string) => {
    const users = JSON.parse(localStorage.getItem('civic_users') || '[]');
    if (users.find((u: any) => u.username === username)) {
       throw new Error("User already exists");
    }
    const newUser = { username, password: btoa(pass), role: username.toLowerCase().includes('admin') ? 'ADMIN' : 'USER' };
    users.push(newUser);
    localStorage.setItem('civic_users', JSON.stringify(users));
  };

  const login = (username: string, pass: string) => {
    const users = JSON.parse(localStorage.getItem('civic_users') || '[]');
    const found = users.find((u: any) => u.username === username && u.password === btoa(pass));
    
    if (found) {
      const newUser: User = { id: Math.random().toString(), username: found.username, role: found.role };
      setUser(newUser);
      localStorage.setItem('civic_current_user', JSON.stringify(newUser));
    } else {
      throw new Error("Invalid credentials");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('civic_current_user');
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, register } as any}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
