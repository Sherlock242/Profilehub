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

  // Fetch profile and unread notifications in parallel
  const [profileRes, notificationRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("notifications").select("id", { count: 'exact', head: true }).eq("user_id", user.id).eq("is_read", false)
  ]);

  const { data: profile } = profileRes;
  const { count: unreadCount } = notificationRes;
  
  if (!profile) {
    // This could happen if the profile creation trigger failed
    return {
        id: user.id,
        name: user.user_metadata.name || 'No Name',
        email: user.email!,
        avatarUrl: undefined,
        hasUnreadNotifications: (unreadCount || 0) > 0,
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
    hasUnreadNotifications: (unreadCount || 0) > 0,
  };
}
