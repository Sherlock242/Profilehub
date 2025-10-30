
'use client';

import { useState, useEffect } from 'react';
import { getInitialUsers, getNewOpponent } from '@/lib/versus-actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { VersusForm } from '@/components/versus/versus-form';
import { type ProfileForVote } from '@/lib/definitions';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const [users, setUsers] = useState<[ProfileForVote, ProfileForVote] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getInitialUsers()
      .then(({ users, error }) => {
        if (error) {
          setError(error);
        } else if (users) {
          setUsers(users);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleVoteCasted = async (winner: ProfileForVote, loser: ProfileForVote) => {
    const { user: newOpponent, error: newOpponentError } = await getNewOpponent(winner.id, loser.id);
    
    if (newOpponentError) {
      // If we can't get a new opponent, we show the error and stop the game.
      // A more robust solution might fetch two completely new users.
      setError(newOpponentError);
      setUsers(null); // Clear users to show error state
    } else if (newOpponent) {
      // Randomly decide if the winner is on the left or right for the next round
      if (Math.random() > 0.5) {
        setUsers([winner, newOpponent]);
      } else {
        setUsers([newOpponent, winner]);
      }
    } else {
        // This case happens if there are no other opponents left.
        setError("There are no more opponents to challenge. Invite more friends!");
        setUsers(null);
    }
  };
  
  if (isLoading) {
    return (
        <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
             <div className="w-full animate-fade-in-up">
                <Skeleton className="h-12 w-3/4 mx-auto mb-2" />
                <Skeleton className="h-6 w-1/2 mx-auto mb-12" />
                <div className="flex flex-row items-center justify-center gap-2 sm:gap-4 md:gap-8">
                    <Skeleton className="flex-1 w-full max-w-[calc(50%-1rem)] h-56 sm:h-64 md:h-96" />
                    <div className="text-xl sm:text-2xl md:text-4xl font-bold text-muted-foreground mx-1 sm:mx-2">VS</div>
                    <Skeleton className="flex-1 w-full max-w-[calc(50%-1rem)] h-56 sm:h-64 md:h-96" />
                </div>
            </div>
        </div>
    );
  }

  if (error) {
     return (
        <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
             <Alert variant="destructive" className="max-w-md animate-fade-in">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        </div>
     )
  }

  if (users) {
      return (
        <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
            <VersusForm users={users} onVoteCasted={handleVoteCasted} />
        </div>
      );
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
