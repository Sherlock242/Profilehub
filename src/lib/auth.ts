import { createClient } from "@/lib/supabase/server";
import { type AppUser } from "./definitions";
import { cookies } from "next/headers";

export async function getUser(): Promise<AppUser | null> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

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
        avatarUrl = `${publicUrlData.publicUrl}?t=${new Date().getTime()}`;
    }
  }
  
  return {
    id: profile.id,
    name: profile.name,
    email: user.email!,
    avatarUrl,
  };
}
