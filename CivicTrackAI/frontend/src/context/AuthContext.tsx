import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../api/config';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
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

  // Helper to safely encode strings to Base64 (handling UTF-8 characters)
  const safeBtoa = (str: string) => {
    try {
      return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => {
        return String.fromCharCode(parseInt(p1, 16));
      }));
    } catch (e) {
      console.warn("safeBtoa fallback for:", str);
      return btoa(str);
    }
  };

  const register = async (name: string, email: string, pass: string) => {
    try {
      const res = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password: safeBtoa(pass)
      });
// ... rest of method ...
      const newUser: User = { 
        id: res.data.id.toString(), 
        name: res.data.name, 
        email: res.data.email,
        role: res.data.role 
      };
      setUser(newUser);
      localStorage.setItem('civic_current_user', JSON.stringify(newUser));
    } catch (err: any) {
      console.error("Registration error:", err);
      const backendError = err.response?.data?.error || err.response?.data?.message || (typeof err.response?.data === 'string' ? err.response.data : null);
      throw new Error(backendError || "Registration failed");
    }
  };

  const login = async (email: string, pass: string) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
          email,
          password: safeBtoa(pass)
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
      console.error("Login error:", err);
      const backendError = err.response?.data?.error || err.response?.data?.message || (typeof err.response?.data === 'string' ? err.response.data : null);
      throw new Error(backendError || "Invalid credentials");
    }
  };

  const updateUser = async (newName: string) => {
    if (!user) return;
    try {
      const res = await axios.put(`${API_URL}/auth/update`, {
        id: user.id,
        name: newName
      });
      const updatedUser: User = { ...user, name: res.data.name };
      setUser(updatedUser);
      localStorage.setItem('civic_current_user', JSON.stringify(updatedUser));
    } catch (err: any) {
      console.error("Update error:", err);
      const backendError = err.response?.data?.error || "Failed to update profile";
      throw new Error(backendError);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('civic_current_user');
  };

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'ROLE_ADMIN' || user?.email === 'projectedit@gov.in';

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
