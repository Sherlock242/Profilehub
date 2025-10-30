'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Loader2, UserCircle } from 'lucide-react';
import { type ProfileForVote } from '@/lib/definitions';
import { recordVote } from '@/lib/versus-actions';
import { useToast } from '@/hooks/use-toast';

export function VersusForm({ users }: { users: [ProfileForVote, ProfileForVote] }) {
  const [user1, user2] = users;
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const handleVote = async (votedForId: string) => {
    setIsLoading(votedForId);
    const { error } = await recordVote(votedForId);
    
    if (error) {
        toast({
            variant: 'destructive',
            title: 'Vote failed',
            description: error,
        });
        setIsLoading(null);
    } else {
        toast({
            title: 'Vote cast!',
            description: 'Your vote has been recorded.',
        });
        // A page refresh will be triggered by revalidation, so no need to setIsLoading(null)
    }
  };
  
  const renderUserCard = (user: ProfileForVote) => (
    <Card
      key={user.id}
      className="w-full max-w-sm cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 group"
      onClick={() => !isLoading && handleVote(user.id)}
    >
      <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <Avatar className="h-48 w-48 border-4 border-transparent group-hover:border-primary transition-all">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback className="text-6xl">
              <UserCircle />
            </AvatarFallback>
          </Avatar>
           {isLoading === user.id && (
             <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full">
               <Loader2 className="w-16 h-16 animate-spin text-primary" />
             </div>
           )}
        </div>
        <h2 className="text-2xl font-bold text-center">{user.name}</h2>
        <Button
          variant="outline"
          className="w-full"
          disabled={!!isLoading}
        >
          {isLoading === user.id ? "Voting..." : "Vote"}
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full animate-fade-in-up">
       <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-center mb-2">Who would you vote for?</h1>
       <p className="text-muted-foreground text-center mb-12 text-lg">Click on a profile to cast your vote.</p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            {renderUserCard(user1)}
            <div className="text-4xl font-bold text-muted-foreground my-4 md:my-0">VS</div>
            {renderUserCard(user2)}
        </div>
    </div>
  );
}
