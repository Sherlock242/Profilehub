import { createBrowserClient } from '@supabase/ssr';
import { type AppUser } from './definitions';

export function createClient() {
  // IMPORTANT: These are client-side environment variables.
  // They must be prefixed with NEXT_PUBLIC_.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// Client-side user retrieval
export async function getUserOnClient(): Promise<AppUser | null> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Fetch profile and unread notifications in parallel
  const { data: profile } = await supabase.from("profiles").select("id, name, avatar_url, role").eq("id", user.id).single();
  
  if (!profile) {
    // This could happen if the profile creation trigger failed
    return {
        id: user.id,
        name: user.user_metadata.name || 'No Name',
        email: user.email!,
        avatarUrl: undefined,
        role: 'user',
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
    role: profile.role,
  };
}
