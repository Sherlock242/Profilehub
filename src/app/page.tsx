
'use client';

import { useState, useEffect } from 'react';
import { getInitialUsers, getArticlesForClient } from '@/lib/versus-actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { VersusForm } from '@/components/versus/versus-form';
import { type ProfileForVote, type Article } from '@/lib/definitions';
import { VersusFormSkeleton } from '@/components/versus/versus-form-skeleton';
import { getUserOnClient } from '@/lib/supabase-client';
import { AppUser } from '@/lib/definitions';
import { ArticleSectionSkeleton } from '@/components/articles/article-section-skeleton';
import { ArticleList } from '@/components/articles/article-list';

// Force this page to be dynamic to prevent caching of the random users
export const dynamic = 'force-dynamic';

export default function HomePage() {
  const [user, setUser] = useState<AppUser | null | undefined>(undefined);
  const [versusUsers, setVersusUsers] = useState<[ProfileForVote, ProfileForVote] | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [versusKey, setVersusKey] = useState(Date.now());


  useEffect(() => {
    async function initializePage() {
        const currentUser = await getUserOnClient();
        setUser(currentUser);
        if (currentUser) {
            fetchVersusUsers();
        } else {
            fetchArticles();
        }
    }
    initializePage();
  }, []);

  const fetchArticles = () => {
    setIsLoading(true);
    getArticlesForClient().then(data => {
        setArticles(data);
        setIsLoading(false);
    });
  }

  const fetchVersusUsers = () => {
    setIsLoading(true);
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
        setIsLoading(false);
      });
  };

  const handleVoteCasted = () => {
    fetchVersusUsers();
  };
  
  if (user === undefined) {
    return <ArticleSectionSkeleton />;
  }
  
  if (!user) {
    if (isLoading) return <ArticleSectionSkeleton />;
    return <ArticleList articles={articles} />;
  }

  // User is logged in, manage voting UI
  if (isLoading) {
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

  // Fallback content if something goes wrong after login
  return (
      <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
         <Alert className="max-w-md animate-fade-in">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Could not load voting session. Please try again later.</AlertDescription>
        </Alert>
    </div>
  )
}
