
'use client';

import { useState, useEffect } from 'react';
import { getInitialUsers } from '@/lib/versus-actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { VersusForm } from '@/components/versus/versus-form';
import { type ProfileForVote } from '@/lib/definitions';
import { VersusFormSkeleton } from '@/components/versus/versus-form-skeleton';


export default function HomePage() {
  const [users, setUsers] = useState<[ProfileForVote, ProfileForVote] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
        } else {
          // No error, but no users (logged out)
          setUsers(null);
          setError(null);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleVoteCasted = async () => {
    fetchUsers();
  };
  
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

  // Always render the main structure, and show skeletons inside the form when loading.
  if (!isLoading && users) {
      return (
        <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
            <VersusForm users={users} onVoteCasted={handleVoteCasted} />
        </div>
      );
  }
  
  if (isLoading) {
    return (
       <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
          <VersusFormSkeleton />
       </div>
    )
  }


  // Fallback for non-logged-in users or initial state
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 text-center animate-fade-in">
      <section className="max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Welcome to Profile Hub
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Who will win? Vote for your favorite profiles and climb the leaderboard. Log in or sign up to get started.
        </p>
      </section>
    </div>
  );
}
