
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
  // For file upload
  current_image_url: z.string().optional(),
  image_file: z.string().optional(),
  image_file_type: z.string().optional(),
  image_file_name: z.string().optional(),
  remove_image: z.string().optional(),
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

  const validatedFields = ArticleSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const { 
    id, 
    title, 
    excerpt, 
    content, 
    image_file, 
    image_file_type, 
    image_file_name,
    current_image_url,
    remove_image 
  } = validatedFields.data;

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { errors: { _form: ['You must be logged in.'] } };
  }

  let imageUrl: string | null | undefined = current_image_url;
  const oldImagePath = current_image_url ? new URL(current_image_url).pathname.split('/article_images/')[1] : null;

  // Handle image removal
  if (remove_image === 'true' && oldImagePath) {
      const { error: deleteError } = await supabase.storage.from('article_images').remove([oldImagePath]);
      if (deleteError) {
          console.error("Error deleting old image:", deleteError.message);
      }
      imageUrl = null;
  }
  
  // Handle new image upload
  if (image_file && image_file_type && image_file_name) {
    // If there was an old image, remove it first
    if (oldImagePath) {
      const { error: deleteError } = await supabase.storage.from('article_images').remove([oldImagePath]);
      if (deleteError) {
          console.error("Error deleting old image during replacement:", deleteError.message);
      }
    }

    const fileBuffer = Buffer.from(image_file.split(',')[1], 'base64');
    const newPath = `${user.id}/${Date.now()}_${image_file_name}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from("article_images")
        .upload(newPath, fileBuffer, {
          contentType: image_file_type,
          upsert: false,
        });

    if (uploadError || !uploadData) {
        return { errors: { _form: [uploadError?.message || 'Failed to upload image.'] } };
    }

    const { data: publicUrlData } = supabase.storage.from('article_images').getPublicUrl(uploadData.path);
    imageUrl = publicUrlData.publicUrl;
  }

  const articleData = { title, excerpt, content, image_url: imageUrl };

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

    // First, get the article to find its image url
    const { data: article, error: fetchError } = await supabase
        .from('articles')
        .select('image_url')
        .eq('id', articleId)
        .single();
    
    if (fetchError) {
        return { error: 'Database Error: Could not find article to delete.' };
    }

    // Delete from database
    const { error } = await supabase.from('articles').delete().eq('id', articleId);
    if (error) {
        return { error: 'Database Error: Failed to delete article.' };
    }
    
    // If there was an image, delete it from storage
    if (article.image_url) {
        const imagePath = new URL(article.image_url).pathname.split('/article_images/')[1];
        if (imagePath) {
            await supabase.storage.from('article_images').remove([imagePath]);
        }
    }


    revalidatePath('/admin');
    revalidatePath('/');
    return {};
}
