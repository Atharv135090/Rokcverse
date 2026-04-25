import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  updateUser: (newName: string) => Promise<void>;
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

  const register = async (name: string, email: string, pass: string) => {
    try {
      const res = await axios.post('https://civictrack-backend-rjpa.onrender.com/api/auth/register', {
        name,
        email,
        password: btoa(pass)
      });
      const newUser: User = { 
        id: res.data.id.toString(), 
        name: res.data.name, 
        email: res.data.email,
        role: res.data.role 
      };
      setUser(newUser);
      localStorage.setItem('civic_current_user', JSON.stringify(newUser));
    } catch (err: any) {
      if (err.response?.status === 409) {
          throw new Error("Email already registered");
      }
      throw new Error("Registration failed");
    }
  };

  const login = async (email: string, pass: string) => {
    try {
      const res = await axios.post('https://civictrack-backend-rjpa.onrender.com/api/auth/login', {
          email,
          password: btoa(pass)
      });
      const newUser: User = { 
        id: res.data.id.toString(), 
        name: res.data.name, 
        email: res.data.email,
        role: res.data.role 
      };
      setUser(newUser);
      localStorage.setItem('civic_current_user', JSON.stringify(newUser));
    } catch (err) {
      throw new Error("Invalid credentials");
    }
  };

  const updateUser = async (newName: string) => {
    if (!user) return;
    try {
      const res = await axios.put('https://civictrack-backend-rjpa.onrender.com/api/auth/update', {
        id: user.id,
        name: newName
      });
      const updatedUser: User = { ...user, name: res.data.name };
      setUser(updatedUser);
      localStorage.setItem('civic_current_user', JSON.stringify(updatedUser));
    } catch (err) {
      throw new Error("Failed to update profile");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('civic_current_user');
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, login, register, updateUser, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
