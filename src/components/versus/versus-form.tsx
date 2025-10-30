
'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Loader2, UserCircle, Trophy } from 'lucide-react';
import { type ProfileForVote } from '@/lib/definitions';
import { recordVote } from '@/lib/versus-actions';
import { useToast } from '@/hooks/use-toast';

interface VersusFormProps {
    users: [ProfileForVote, ProfileForVote];
    onVoteCasted: () => void;
}

export function VersusForm({ users, onVoteCasted }: VersusFormProps) {
  const [user1, user2] = users;
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const handleVote = async (winnerId: string) => {
    setIsLoading(winnerId);
    const { error } = await recordVote(winnerId);
    
    if (error) {
        toast({
            variant: 'destructive',
            title: 'Vote failed',
            description: error,
        });
        setIsLoading(null);
    } else {
        // Let the parent component handle fetching the next round and showing the toast
        onVoteCasted();
        // We don't setIsLoading(null) here because the component will re-render with new users
    }
  };
  
  const renderUserCard = (user: ProfileForVote) => {
    return (
        <Card
            key={user.id}
            className="flex-1 w-full max-w-[calc(50%-0.5rem)] sm:max-w-[calc(50%-1rem)] cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 group"
            onClick={() => !isLoading && handleVote(user.id)}
        >
            <CardContent className="p-2 sm:p-4 flex flex-col items-center justify-center space-y-2 sm:space-y-3">
                <div className="relative">
                    <Avatar className="h-20 w-20 sm:h-28 sm:w-28 border-4 border-transparent group-hover:border-primary transition-all md:h-48 md:w-48">
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback className="text-4xl md:text-6xl">
                        <UserCircle />
                        </AvatarFallback>
                    </Avatar>
                    {isLoading === user.id && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full">
                        <Loader2 className="w-8 h-8 sm:w-12 sm:h-12 animate-spin text-primary" />
                        </div>
                    )}
                </div>
                <h2 className="text-sm sm:text-lg md:text-2xl font-bold text-center truncate w-full">{user.name}</h2>
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-sm">{user.votes}</span>
                </div>
                <Button
                variant="outline"
                className="w-full"
                size="sm"
                disabled={!!isLoading}
                >
                {isLoading === user.id ? "Voting..." : "Vote"}
                </Button>
            </CardContent>
        </Card>
    );
    }

  return (
    <div className="w-full animate-fade-in-up">
       <h1 className="text-2xl md:text-5xl font-bold tracking-tighter text-center mb-2">Who would you vote for?</h1>
       <p className="text-muted-foreground text-center mb-8 md:mb-12 text-base">Click on a profile to cast your vote.</p>
        <div className="flex flex-row items-stretch justify-center gap-2 sm:gap-4 md:gap-8">
            {renderUserCard(user1)}
            <div className="flex items-center justify-center text-xl sm:text-2xl md:text-4xl font-bold text-muted-foreground mx-1 sm:mx-2">VS</div>
            {renderUserCard(user2)}
        </div>
    </div>
  );
}
