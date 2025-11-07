
'use client';

import { useState, useEffect } from 'react';
import { getInitialUsers, getArticlesForClient } from '@/lib/versus-actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { VersusForm } from '@/components/versus/versus-form';
import { type ProfileForVote, type Article, CATEGORIES } from '@/lib/definitions';
import { VersusFormSkeleton } from '@/components/versus/versus-form-skeleton';
import { getUserOnClient } from '@/lib/supabase-client';
import { AppUser } from '@/lib/definitions';
import { ArticleSectionSkeleton } from '@/components/articles/article-section-skeleton';
import { ArticleCarousel } from '@/components/articles/article-carousel';

// Force this page to be dynamic to prevent caching of the random users
export const dynamic = 'force-dynamic';

export default function HomePage() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [versusUsers, setVersusUsers] = useState<[ProfileForVote, ProfileForVote] | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [versusKey, setVersusKey] = useState(Date.now());


  useEffect(() => {
    async function checkAuth() {
        const currentUser = await getUserOnClient();
        setUser(currentUser);
        setIsAuthLoading(false);
    }
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthLoading) return;

    setIsDataLoading(true);
    // Always fetch articles for the new layout
    fetchArticles();

    if (user) {
        fetchVersusUsers();
    }
  }, [isAuthLoading, user]);

  const fetchArticles = () => {
    getArticlesForClient().then(data => {
        setArticles(data);
        setIsDataLoading(false);
    });
  }

  const fetchVersusUsers = () => {
    getInitialUsers()
      .then(({ users, error }) => {
        if (error) {
          setError(error);
          setVersusUsers(null);
        } else if (users) {
          setVersusUsers(users);
          setError(null);
          setVersusKey(Date.now()); 
        }
      })
      .finally(() => {
        // Data loading is already handled by article fetching
      });
  };

  const handleVoteCasted = () => {
    // Show loading state immediately while new users are fetched
    setIsDataLoading(true);
    fetchVersusUsers();
  };
  
  if (isAuthLoading) {
    return <ArticleSectionSkeleton />;
  }
  
  if (user) {
    // User is logged in, show voting UI
    if (isDataLoading) {
      return (
        <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
            <VersusFormSkeleton />
        </div>
      )
    }

    if (error) {
        return (
          <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
              <Alert className="max-w-md animate-fade-in">
                  <AlertTitle>Welcome!</AlertTitle>
                  <AlertDescription>{error} Invite some friends to join!</AlertDescription>
              </Alert>
          </div>
        )
    }

    if (versusUsers) {
        return (
          <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
              <VersusForm key={versusKey} users={versusUsers} onVoteCasted={handleVoteCasted} />
          </div>
        );
    }
  }

  // Logged-out user view (new blog layout)
  if (isDataLoading) {
    return <ArticleSectionSkeleton />;
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center text-muted-foreground py-16">
          <h2 className="text-2xl font-semibold">No Articles Found</h2>
          <p>Check back later for new content.</p>
        </div>
      </div>
    );
  }

  const articlesByCategory = CATEGORIES.reduce((acc, category) => {
    if (category) {
        const filteredArticles = articles.filter(article => article.category === category);
        if (filteredArticles.length > 0) {
            acc[category] = filteredArticles;
        }
    }
    return acc;
  }, {} as Record<string, Article[]>);

  const uncategorizedArticles = articles.filter(article => !article.category);
  if (uncategorizedArticles.length > 0) {
      articlesByCategory['Uncategorized'] = uncategorizedArticles;
  }

  return (
    <div className="animate-fade-in container mx-auto py-8 lg:py-12 space-y-12">
        <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-headline font-bold tracking-tighter mb-2">
            Welcome to <span className="text-accent">Pro</span>Hub
            </h1>
            <p className="text-muted-foreground">
                Explore our latest articles and insights.
            </p>
        </div>
      {Object.entries(articlesByCategory).map(([category, articles]) => (
        <section key={category}>
          <h2 className="text-2xl font-bold tracking-tight mb-4 px-4 sm:px-0">{category}</h2>
          <ArticleCarousel articles={articles} />
        </section>
      ))}
    </div>
  );
}
