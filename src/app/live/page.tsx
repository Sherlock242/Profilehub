
'use client';

import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-client';
import { type AppUser } from '@/lib/definitions';
import { RadioTower, Heart } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';

type VoteNotification = {
    id: string;
    voterName: string;
};

export default function LiveFeedPage() {
    const [user, setUser] = useState<AppUser | null>(null);
    const [notifications, setNotifications] = useState<VoteNotification[]>([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const supabase = createClient();
        
        const fetchUser = async () => {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (authUser) {
                 const { data: profile } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", authUser.id)
                    .single();
                
                if (profile) {
                    setUser({
                        id: profile.id,
                        name: profile.name,
                        email: authUser.email!,
                        avatarUrl: profile.avatar_url,
                    });
                } else {
                     setUser(null); // Or handle missing profile
                }
            } else {
                redirect('/login');
            }
        };

        fetchUser();

    }, []);

    useEffect(() => {
        if (!user || !isClient) return;

        const supabase = createClient();
        const channel = supabase.channel(`votes-for-${user.id}`);

        channel
            .on('broadcast', { event: 'new-vote' }, (message) => {
                const newVote: VoteNotification = {
                    id: new Date().toISOString() + Math.random(), // unique key for react
                    voterName: message.payload.voterName,
                };

                setNotifications((current) => [newVote, ...current]);
                
                // Remove the notification after a delay
                setTimeout(() => {
                    setNotifications((current) =>
                        current.filter((n) => n.id !== newVote.id)
                    );
                }, 5000);
            })
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    console.log('Connected to live feed!');
                }
            });
        
        return () => {
            supabase.removeChannel(channel);
        };

    }, [user, isClient]);
    
    if (!isClient) {
        return null; // Render nothing on the server
    }

    if (!user) {
        return ( // Show a loading or placeholder state while user is being fetched
            <div className="container max-w-2xl py-8 animate-fade-in text-center">
                <p>Loading user...</p>
            </div>
        )
    }

    return (
        <div className="container max-w-2xl py-8 animate-fade-in">
            <div className="flex items-center gap-4 mb-6">
                <RadioTower className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold tracking-tight">Live Vote Feed</h1>
            </div>

             <Alert className="mb-8">
                <AlertTitle>Listening for Votes!</AlertTitle>
                <AlertDescription>
                    This screen will update in real-time as other users vote for you.
                </AlertDescription>
            </Alert>
            
            <div className="relative h-96 overflow-hidden">
                {notifications.map((notif, index) => (
                    <Card 
                        key={notif.id}
                        className="absolute w-full p-4 flex items-center gap-4 animate-vote-in-out"
                        style={{ top: `${index * 70}px` }}
                    >
                       <Heart className="h-6 w-6 text-red-500 fill-current"/>
                       <p className="font-semibold">{notif.voterName}</p>
                       <p>voted for you!</p>
                    </Card>
                ))}
            </div>

            <style jsx>{`
                @keyframes vote-in-out {
                    0% {
                        opacity: 0;
                        transform: translateY(20px) scale(0.95);
                    }
                    20% {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                    80% {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                    100% {
                        opacity: 0;
                        transform: translateY(-20px) scale(0.95);
                    }
                }
                .animate-vote-in-out {
                    animation: vote-in-out 5s ease-in-out forwards;
                }
            `}</style>

        </div>
    );
}
