'use server';

import { cookies } from "next/headers";
import { createClient } from "./supabase/server";
import { revalidatePath } from "next/cache";

type FormState = {
    error?: string;
}

export async function updateProfile({ name }: { name: string }): Promise<FormState> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'You must be logged in to update your profile.' };
  }

  const { error } = await supabase.from('profiles').update({ name }).eq('id', user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/profile');
  return {};
}

export async function changePassword(newPassword: string): Promise<FormState> {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
        return { error: error.message };
    }
    return {};
}

export async function updateAvatar(formData: FormData): Promise<FormState> {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: "You must be logged in." };
    }

    const file = formData.get("avatar") as File;
    if (!file || file.size === 0) {
        return { error: "No file selected." };
    }

    const filePath = `${user.id}/${Date.now()}_${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

    if (uploadError || !uploadData) {
        return { error: uploadError?.message || "Failed to upload avatar." };
    }
    
    const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: uploadData.path })
        .eq('id', user.id);

    if (updateError) {
        return { error: updateError.message };
    }
    
    revalidatePath('/profile');
    return {};
}

export async function deleteAvatar(): Promise<FormState> {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
     
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: "You must be logged in." };
    }

    // We don't need to delete the file from storage, just nullify the URL in the profile.
    // Storage can be cleaned up periodically if needed.
    const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('id', user.id);
        
    if (error) {
        return { error: error.message };
    }

    revalidatePath('/profile');
    return {};
}
