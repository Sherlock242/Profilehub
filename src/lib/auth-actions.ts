'use server';

import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const signupSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function signup(
  data: z.infer<typeof signupSchema>
): Promise<string | null> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        name: data.name,
      },
    },
  });

  return error ? error.message : null;
}

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export async function login(data: z.infer<typeof loginSchema>): Promise<string | null> {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
    });
    
    if (error) {
        return error.message;
    }

    revalidatePath('/', 'layout');
    return null;
}

export async function logout(): Promise<void> {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    await supabase.auth.signOut();
    revalidatePath('/', 'layout');
}
