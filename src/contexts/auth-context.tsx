
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User as AppUser } from '@/lib/definitions';
import { supabase } from '@/lib/supabase-client';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

type AuthContextType = {
  user: AppUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, pass: string) => Promise<boolean>;
  updateProfile: (data: {name?: string, avatar_url?: string}) => Promise<boolean>;
  changePassword: (newPass: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await handleAuthChange(session);
      } else {
        setLoading(false);
      }
    };
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN') {
          await handleAuthChange(session);
        }
        if (event === 'SIGNED_OUT') {
          setUser(null);
          router.push('/login');
        }
        if (event === 'USER_UPDATED') {
          await handleAuthChange(session);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  const handleAuthChange = async (session: Session | null) => {
    setLoading(true);
    if (session?.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if(profile) {
        setUser({
          id: profile.id,
          name: profile.name,
          email: session.user.email!,
          avatarUrl: profile.avatar_url,
        });
      }
    }
    setLoading(false);
  };

  const login = async (email: string, pass: string): Promise<boolean> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    return !error;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/login');
  };

  const register = async (name: string, email: string, pass: string): Promise<boolean> => {
    const { error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: {
          name,
        },
      },
    });
    return !error;
  };

  const updateProfile = async (data: {name?: string, avatar_url?: string}): Promise<boolean> => {
    if (!user) return false;
    
    const { error } = await supabase.from('profiles').update(data).eq('id', user.id);
    
    if (!error) {
      const { data: { session } } = await supabase.auth.getSession();
      await handleAuthChange(session);
      return true;
    }
    return false;
  };

  const changePassword = async (newPass: string): Promise<boolean> => {
     if (!user) return false;
    const { error } = await supabase.auth.updateUser({ password: newPass });
    return !error;
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
