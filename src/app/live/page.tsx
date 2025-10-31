
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
    timestamp: number;
};

const NOTIFICATION_LIFETIME = 10 * 60 * 1000; // 10 minutes in milliseconds

export default function LiveFeedPage() {
    const [user, setUser] = useState<AppUser | null>(null);
    const [notifications, setNotifications] = useState<VoteNotification[]>([]);
    const [isClient, setIsClient] = useState(false);

    // Initial setup on client
    useEffect(() => {
        setIsClient(true);
        // Clear the new vote indicator when the user visits the page
        sessionStorage.setItem('hasNewVotes', 'false');
        // Dispatch event to update header in the same tab
        window.dispatchEvent(new CustomEvent('new-vote-event'));

        try {
            const storedNotifications = sessionStorage.getItem('live-notifications');
            if (storedNotifications) {
                const parsed = JSON.parse(storedNotifications) as VoteNotification[];
                const now = Date.now();
                const validNotifications = parsed.filter(
                    (n) => now - n.timestamp < NOTIFICATION_LIFETIME
                );
                setNotifications(validNotifications);
                sessionStorage.setItem('live-notifications', JSON.stringify(validNotifications));
            }
        } catch (error) {
            console.error("Could not parse notifications from sessionStorage", error);
            sessionStorage.removeItem('live-notifications');
        }
    }, []);

    // Fetch user and set up cleanup interval
    useEffect(() => {
        if (!isClient) return;

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

        // Periodically check for and remove expired notifications
        const intervalId = setInterval(() => {
            setNotifications((current) => {
                 const now = Date.now();
                 const validNotifications = current.filter(
                    (n) => now - n.timestamp < NOTIFICATION_LIFETIME
                 );
                 // Also update session storage
                 try {
                    sessionStorage.setItem('live-notifications', JSON.stringify(validNotifications));
                 } catch (e) {
                    console.error("Failed to update sessionStorage", e);
                 }
                 return validNotifications;
            });
        }, 1000); // Check every second

        return () => clearInterval(intervalId);

    }, [isClient]);

    // Subscribe to Supabase realtime channel
    useEffect(() => {
        if (!user || !isClient) return;

        const supabase = createClient();
        const channel = supabase.channel(`votes-for-${user.id}`);

        channel
            .on('broadcast', { event: 'new-vote' }, (message) => {
                const newVote: VoteNotification = {
                    id: new Date().toISOString() + Math.random(), // unique key for react
                    voterName: message.payload.voterName,
                    timestamp: Date.now(),
                };

                setNotifications((current) => {
                    const updatedNotifications = [newVote, ...current];
                    try {
                        sessionStorage.setItem('live-notifications', JSON.stringify(updatedNotifications));
                        // Set flag for notification dot
                        sessionStorage.setItem('hasNewVotes', 'true');
                        // Dispatch custom event for same-tab header update
                        window.dispatchEvent(new CustomEvent('new-vote-event'));
                    } catch(e) {
                         console.error("Failed to write to sessionStorage", e);
                    }
                    return updatedNotifications;
                });
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
                    This screen will update in real-time as other users vote for you. Notifications disappear after 10 minutes.
                </AlertDescription>
            </Alert>
            
            <div className="space-y-3 relative overflow-y-auto h-96 pr-2">
                 {notifications.length > 0 ? notifications.map((notif) => {
                    return (
                        <Card 
                            key={notif.id}
                            className="p-4 flex items-center gap-4 animate-in fade-in-50 slide-in-from-bottom-2 duration-500"
                        >
                           <Heart className="h-6 w-6 text-red-500 fill-current"/>
                           <p><span className="font-semibold">{notif.voterName}</span> voted for you!</p>
                        </Card>
                    );
                }) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                        <p className="font-semibold">No new votes</p>
                        <p className="text-sm">When someone votes for you, it will appear here live.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
