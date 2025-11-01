import { createClient as createClientOnClient } from "@/lib/supabase-client";
import { type AppUser } from "./definitions";
import { createClient as createClientOnServer } from "./supabase/server";
import { cookies } from 'next/headers';

// Client-side user retrieval
export async function getUserOnClient(): Promise<AppUser | null> {
  const supabase = createClientOnClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Fetch profile and unread notifications in parallel
  const { data: profile } = await supabase.from("profiles").select("id, name, avatar_url").eq("id", user.id).single();
  
  if (!profile) {
    // This could happen if the profile creation trigger failed
    return {
        id: user.id,
        name: user.user_metadata.name || 'No Name',
        email: user.email!,
        avatarUrl: undefined,
    }
  }

  let avatarUrl: string | undefined = undefined;
  if (profile.avatar_url) {
    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(profile.avatar_url);
    
    if (publicUrlData) {
        avatarUrl = publicUrlData.publicUrl;
    }
  }
  
  return {
    id: profile.id,
    name: profile.name,
    email: user.email!,
    avatarUrl,
  };
}

// Server-side user retrieval
export async function getUserOnServer(): Promise<AppUser | null> {
  const cookieStore = cookies();
  const supabase = createClientOnServer(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase.from("profiles").select("id, name, avatar_url").eq("id", user.id).single();
  
  if (!profile) {
    return {
        id: user.id,
        name: user.user_metadata.name || 'No Name',
        email: user.email!,
        avatarUrl: undefined,
    }
  }

  let avatarUrl: string | undefined = undefined;
  if (profile.avatar_url) {
    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(profile.avatar_url);
    
    if (publicUrlData) {
        avatarUrl = publicUrlData.publicUrl;
    }
  }
  
  return {
    id: profile.id,
    name: profile.name,
    email: user.email!,
    avatarUrl,
  };
}
