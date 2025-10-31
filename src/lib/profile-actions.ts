
'use server';

import { cookies } from "next/headers";
import { createClient } from "./supabase/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "./supabase/admin";

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
    
    // 1. Get the path of the old avatar before uploading the new one
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .single();

    if (profileError) {
        return { error: "Could not find user profile." };
    }
    const oldPath = profile?.avatar_url;

    // 2. Upload the new avatar
    const { file: base64String, fileName, fileType } = payload;
    if (!base64String) {
        return { error: "No file selected." };
    }
    
    const fileBuffer = Buffer.from(base64String.split(',')[1], 'base64');
    const newPath = `${user.id}/${Date.now()}_${fileName}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(newPath, fileBuffer, {
          contentType: fileType,
          upsert: false, // Important: don't upsert, as we want a unique path
        });

    if (uploadError || !uploadData) {
        return { error: uploadError?.message || "Failed to upload avatar." };
    }
    
    // 3. Update the profile with the new avatar path
    const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: uploadData.path })
        .eq('id', user.id);

    if (updateError) {
        // If updating the profile fails, remove the newly uploaded file.
        await supabase.storage.from("avatars").remove([newPath]);
        return { error: updateError.message };
    }

    // 4. If everything was successful, delete the old avatar file
    if (oldPath) {
        await supabase.storage.from('avatars').remove([oldPath]);
    }
    
    // Revalidate paths to reflect the new avatar everywhere
    revalidatePath('/profile');
    revalidatePath('/', 'layout'); 
    revalidatePath('/');
    revalidatePath('/leaderboard');
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

    // Revalidate paths to reflect the avatar removal everywhere
    revalidatePath('/profile');
    revalidatePath('/', 'layout');
    revalidatePath('/');
    revalidatePath('/leaderboard');
    return {};
}

export async function deleteAccount(): Promise<{ error?: string }> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const supabaseAdmin = createAdminClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: 'Could not authenticate user.' };
  }

  const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
  
  if (deleteError) {
    console.error('Account Deletion Error:', deleteError);
    return { error: `Failed to delete account: ${deleteError.message}` };
  }
  
  // Sign the user out on the client by clearing the cookies.
  cookieStore.getAll().forEach(cookie => {
    cookieStore.delete(cookie.name);
  });

  return {};
}
