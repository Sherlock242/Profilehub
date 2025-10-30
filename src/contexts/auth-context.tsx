"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/definitions';
import { PlaceHolderImages } from '@/lib/placeholder-images';

// In-memory storage for users and passwords
const users = new Map<string, User>();
const passwords = new Map<string, string>();

const defaultAvatar = PlaceHolderImages.find(img => img.id === 'default-avatar')?.imageUrl;

// Pre-populate with a demo user
const demoUser: User = { id: '1', name: 'Demo User', email: 'demo@example.com', avatarUrl: defaultAvatar };
users.set(demoUser.email, demoUser);
passwords.set(demoUser.email, 'password123');

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, pass: string) => Promise<boolean>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  changePassword: (currentPass: string, newPass: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate checking for a logged-in user
    const loggedInUser = sessionStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
    setLoading(false);
  }, []);
  
  const login = async (email: string, pass: string): Promise<boolean> => {
    setLoading(true);
    const existingUser = users.get(email);
    const storedPassword = passwords.get(email);
    
    // Simulate network delay
    await new Promise(res => setTimeout(res, 500));

    if (existingUser && storedPassword === pass) {
      setUser(existingUser);
      sessionStorage.setItem('user', JSON.stringify(existingUser));
      setLoading(false);
      return true;
    }
    setLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('user');
    router.push('/login');
  };

  const register = async (name: string, email: string, pass: string): Promise<boolean> => {
    setLoading(true);
    // Simulate network delay
    await new Promise(res => setTimeout(res, 500));

    if (users.has(email)) {
      setLoading(false);
      return false; // User already exists
    }

    const newUser: User = {
      id: String(users.size + 1),
      name,
      email,
      avatarUrl: defaultAvatar
    };

    users.set(email, newUser);
    passwords.set(email, pass);
    setUser(newUser);
    sessionStorage.setItem('user', JSON.stringify(newUser));
    setLoading(false);
    return true;
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    users.set(user.email, updatedUser);
    sessionStorage.setItem('user', JSON.stringify(updatedUser));
    return true;
  };

  const changePassword = async (currentPass: string, newPass: string): Promise<boolean> => {
    if (!user) return false;
    
    const storedPassword = passwords.get(user.email);
    if (storedPassword !== currentPass) {
      return false;
    }

    passwords.set(user.email, newPass);
    return true;
  };

  const value = { user, loading, login, logout, register, updateProfile, changePassword };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
