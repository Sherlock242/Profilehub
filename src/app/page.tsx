
'use client';

import { useState, useEffect } from 'react';
import { getInitialUsers } from '@/lib/versus-actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { VersusForm } from '@/components/versus/versus-form';
import { type ProfileForVote } from '@/lib/definitions';
import { VersusFormSkeleton } from '@/components/versus/versus-form-skeleton';
import { getUserOnClient } from '@/lib/supabase-client';
import { AppUser } from '@/lib/definitions';
import { ArticleSectionSkeleton } from '@/components/articles/article-section-skeleton';
import { ArticleList } from '@/components/articles/article-list';

// Force this page to be dynamic to prevent caching of the random users
export const dynamic = 'force-dynamic';

export default function HomePage() {
  const [user, setUser] = useState<AppUser | null | undefined>(undefined);
  const [users, setUsers] = useState<[ProfileForVote, ProfileForVote] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [versusKey, setVersusKey] = useState(Date.now());


  useEffect(() => {
    // First, check if there's a user.
    async function checkUser() {
        const currentUser = await getUserOnClient();
        setUser(currentUser);
        if (currentUser) {
            // If user exists, fetch profiles for voting.
            fetchUsers();
        } else {
            // If no user, stop loading and show public content.
            setIsLoading(false);
        }
    }
    checkUser();
  }, []);

  const fetchUsers = () => {
    setIsLoading(true);
    getInitialUsers()
      .then(({ users, error }) => {
        if (error) {
          setError(error);
          setUsers(null);
        } else if (users) {
          setUsers(users);
          setError(null);
          setVersusKey(Date.now()); 
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleVoteCasted = () => {
    fetchUsers();
  };
  
  if (user === undefined) {
    // Still checking for user, show the article skeleton
    return <ArticleList.Skeleton />;
  }
  
  if (!user) {
    // User is not logged in, show the articles
    return <ArticleList />;
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

  if (users) {
      return (
        <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
            <VersusForm key={versusKey} users={users} onVoteCasted={handleVoteCasted} />
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
