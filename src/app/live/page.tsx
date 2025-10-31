
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

const NOTIFICATION_LIFETIME = 5 * 60 * 1000; // 5 minutes in milliseconds

export default function LiveFeedPage() {
    const [user, setUser] = useState<AppUser | null>(null);
    const [notifications, setNotifications] = useState<VoteNotification[]>([]);
    const [isClient, setIsClient] = useState(false);

    // Load notifications from session storage on initial render
    useEffect(() => {
        setIsClient(true);
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
                    This screen will update in real-time as other users vote for you. Notifications disappear after 5 minutes.
                </AlertDescription>
            </Alert>
            
            <div className="relative h-96 overflow-hidden">
                 {notifications.map((notif, index) => {
                    const age = Date.now() - notif.timestamp;
                    const opacity = 1.0 - Math.max(0, age - (NOTIFICATION_LIFETIME - 2000)) / 2000;
                    
                    return (
                        <Card 
                            key={notif.id}
                            className="absolute w-full p-4 flex items-center gap-4 transition-all duration-500 ease-out"
                            style={{ 
                                top: `${index * 70}px`,
                                opacity: opacity,
                                transform: `scale(${opacity})`
                            }}
                        >
                           <Heart className="h-6 w-6 text-red-500 fill-current"/>
                           <p className="font-semibold">{notif.voterName}</p>
                           <p>voted for you!</p>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
