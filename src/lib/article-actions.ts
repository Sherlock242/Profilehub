
'use server';

import { cookies } from 'next/headers';
import { createClient } from './supabase/server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { type Article } from './definitions';

const ArticleSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required.'),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  image_url: z.string().url().optional().or(z.literal('')),
});

export type ArticleFormState = {
  errors?: {
    title?: string[];
    excerpt?: string[];
    content?: string[];
    image_url?: string[];
    _form?: string[];
  };
  message?: string;
};


async function checkAdmin() {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    return profile?.role === 'admin';
}


export async function getArticles(): Promise<Article[]> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
  return data;
}

export async function getArticleById(id: string): Promise<Article | null> {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase.from('articles').select('*').eq('id', id).single();
    if (error) {
        console.error('Error fetching article:', error);
        return null;
    }
    return data;
}

export async function upsertArticle(prevState: ArticleFormState, formData: FormData): Promise<ArticleFormState> {
  const isAdmin = await checkAdmin();
  if (!isAdmin) {
    return { errors: { _form: ['You are not authorized to perform this action.'] } };
  }

  const validatedFields = ArticleSchema.safeParse({
    id: formData.get('id'),
    title: formData.get('title'),
    excerpt: formData.get('excerpt'),
    content: formData.get('content'),
    image_url: formData.get('image_url'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const { id, ...articleData } = validatedFields.data;

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  
  const { data: { user } } = await supabase.auth.getUser();

  if (id) {
    // Update existing article
    const { error } = await supabase.from('articles').update(articleData).eq('id', id);
    if (error) {
        return { errors: { _form: ['Database Error: Failed to update article.'] } };
    }
  } else {
    // Create new article
    const { error } = await supabase.from('articles').insert({ ...articleData, author_id: user!.id });
    if (error) {
      return { errors: { _form: ['Database Error: Failed to create article.'] } };
    }
  }

  revalidatePath('/admin');
  revalidatePath('/'); // Also revalidate home page
  redirect('/admin');
}

export async function deleteArticle(articleId: string): Promise<{ error?: string }> {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
        return { error: 'You are not authorized to perform this action.' };
    }

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase.from('articles').delete().eq('id', articleId);
    if (error) {
        return { error: 'Database Error: Failed to delete article.' };
    }

    revalidatePath('/admin');
    revalidatePath('/');
    return {};
}
