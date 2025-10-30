
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
  updateProfile: (data: {name?: string, avatar_url?: string | null}) => Promise<boolean>;
  changePassword: (newPass: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getPublicAvatarUrl = (avatarPath: string | null): string | undefined => {
    if (!avatarPath) return undefined;
    
    const { data } = supabase
      .storage
      .from('avatars')
      .getPublicUrl(avatarPath);

    // Add a cache-busting parameter to the URL
    return data?.publicUrl ? `${data.publicUrl}?t=${new Date().getTime()}`: undefined;
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
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
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
        const publicUrl = getPublicAvatarUrl(profile.avatar_url);
        setUser({
          id: profile.id,
          name: profile.name,
          email: session.user.email!,
          avatarUrl: publicUrl,
        });
      } else {
         // This handles the case where a user exists in auth but not in profiles yet.
        const { data: newUserProfile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        if (newUserProfile) {
           const publicUrl = getPublicAvatarUrl(newUserProfile.avatar_url);
           setUser({
            id: newUserProfile.id,
            name: newUserProfile.name,
            email: session.user.email!,
            avatarUrl: publicUrl,
          });
        }
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
    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: {
          name,
        },
      },
    });
    // The trigger will create the profile, so we manually refresh the session
    if (authData.session) {
      await handleAuthChange(authData.session);
    }
    return !error;
  };

  const updateProfile = async (data: {name?: string, avatar_url?: string | null}): Promise<boolean> => {
    if (!user) return false;
    
    const { error } = await supabase.from('profiles').update(data).eq('id', user.id);
    
    if (!error) {
      // Manually trigger a refresh of the user state
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
