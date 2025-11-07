export type AppUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: string;
};

export type Article = {
  id: string;
  created_at: string;
  title: string;
  excerpt: string | null;
  image_url: string | null;
  content: string | null;
  author_id: string | null;
  category: 'Gym' | 'Exercises' | 'Yoga' | 'Nutrition' | null;
};

export const CATEGORIES: Article['category'][] = ['Gym', 'Exercises', 'Yoga', 'Nutrition'];
