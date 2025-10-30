
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

type UpdateAvatarPayload = {
  file: string; // base64 string
  fileType: string;
  fileName: string;
};

export async function updateAvatar(payload: UpdateAvatarPayload): Promise<FormState> {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: "You must be logged in." };
    }

    const { file: base64String, fileName } = payload;

    if (!base64String) {
        return { error: "No file selected." };
    }
    
    // Convert base64 to buffer
    const fileBuffer = Buffer.from(base64String.split(',')[1], 'base64');
    
    const filePath = `${user.id}/${Date.now()}_${fileName}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, fileBuffer, {
          contentType: payload.fileType,
          upsert: true,
        });

    if (uploadError || !uploadData) {
        return { error: uploadError?.message || "Failed to upload avatar." };
    }
    
    const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: uploadData.path })
        .eq('id', user.id);

    if (updateError) {
        // If updating the profile fails, we should try to remove the uploaded file
        // to avoid orphaned files in storage.
        await supabase.storage.from("avatars").remove([filePath]);
        return { error: updateError.message };
    }
    
    revalidatePath('/profile');
    revalidatePath('/', 'layout'); // Revalidate root layout to update header
    return {};
}

export async function deleteAvatar(): Promise<FormState> {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
     
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: "You must be logged in." };
    }

    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .single();

    if (profileError || !profile) {
        return { error: "Could not find user profile." };
    }
    
    const oldPath = profile.avatar_url;

    // Update the profile to remove the avatar url
    const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('id', user.id);
        
    if (error) {
        return { error: error.message };
    }

    // If the profile update was successful, delete the old file from storage
    if (oldPath) {
        await supabase.storage.from('avatars').remove([oldPath]);
    }

    revalidatePath('/profile');
    revalidatePath('/', 'layout'); // Revalidate root layout to update header
    return {};
}
