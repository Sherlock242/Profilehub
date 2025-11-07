
'use server';

import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { type Article } from './definitions';

export async function getArticlesForClient(): Promise<Article[]> {
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
