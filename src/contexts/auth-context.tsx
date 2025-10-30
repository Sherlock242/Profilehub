
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
  getSignedAvatarUrl: (avatarPath: string) => Promise<string | undefined>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getSignedAvatarUrl = async (avatarPath: string): Promise<string | undefined> => {
    if (!avatarPath) return undefined;
    
    const { data, error } = await supabase
      .storage
      .from('avatars')
      .createSignedUrl(avatarPath, 60 * 60); // 1 hour expiry

    if (error) {
      console.error('Error creating signed URL for avatar:', error);
      return undefined;
    }
    return data.signedUrl;
  }

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      await handleAuthChange(session);
      setLoading(false);
    };
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setLoading(true);
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') {
          await handleAuthChange(session);
        }
        if (event === 'SIGNED_OUT') {
          setUser(null);
          router.push('/login');
        }
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  const handleAuthChange = async (session: Session | null) => {
    if (session?.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if(profile) {
        const signedUrl = profile.avatar_url ? await getSignedAvatarUrl(profile.avatar_url) : undefined;
        setUser({
          id: profile.id,
          name: profile.name,
          email: session.user.email!,
          avatarUrl: signedUrl,
        });
      }
    } else {
      setUser(null);
    }
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
    
    // The profiles table stores the path, not the full URL
    const updateData = {
        name: data.name,
        avatar_url: data.avatar_url,
    };
    
    const { error } = await supabase.from('profiles').update(updateData).eq('id', user.id);
    
    if (!error) {
      // Refresh auth state to get new signed url
      const { data: { session } } = await supabase.auth.getSession();
      await handleAuthChange(session);
      return true;
    }
    console.error("Error updating profile:", error);
    return false;
  };

  const changePassword = async (newPass: string): Promise<boolean> => {
     if (!user) return false;
    const { error } = await supabase.auth.updateUser({ password: newPass });
    return !error;
  };
  
  const value = { user, loading, login, logout, register, updateProfile, changePassword, getSignedAvatarUrl };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
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
