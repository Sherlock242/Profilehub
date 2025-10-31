
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-client';
import { getUser } from '@/lib/auth';
import { type AppUser } from '@/lib/definitions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RadioTower, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';

type VoteNotification = {
  id: string;
  message: string;
  voterName: string;
  timestamp: string;
};

export default function LiveFeedPage() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [notifications, setNotifications] = useState<VoteNotification[]>([]);

  useEffect(() => {
    // On visiting the live page, mark new votes as seen
    sessionStorage.setItem('hasNewVotes', 'false');
    window.dispatchEvent(new Event('storage')); // Notify header to update

    const initializePage = async () => {
        const supabase = createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (authUser) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('id, name')
                .eq('id', authUser.id)
                .single();
            
            if (profile) {
                 const appUser: AppUser = {
                    id: authUser.id,
                    email: authUser.email!,
                    name: profile.name,
                 };
                 setUser(appUser);
            }
        }
    };
    
    initializePage();

  }, []);


  useEffect(() => {
    if (!user) return;

    const supabase = createClient();
    const channel = supabase.channel(`votes:${user.id}`);

    channel
      .on('broadcast', { event: 'new_vote' }, (response) => {
        const newNotification: VoteNotification = {
          id: `${response.payload.voterName}-${response.payload.timestamp}`,
          ...response.payload,
        };
        setNotifications((current) => [newNotification, ...current]);
        
        // Indicate that there is a new vote
        sessionStorage.setItem('hasNewVotes', 'true');
        window.dispatchEvent(new Event('storage')); // Notify header to update

        // Remove the notification from view after 10 minutes
        setTimeout(() => {
          setNotifications((current) =>
            current.filter((n) => n.id !== newNotification.id)
          );
        }, 10 * 60 * 1000); // 10 minutes
      })
      .subscribe();

    // Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return (
    <div className="container max-w-4xl py-8 animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <RadioTower className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Live Vote Feed</h1>
      </div>

      <Alert>
        <AlertTitle>Listening for Votes!</AlertTitle>
        <AlertDescription>
          This screen will update in real-time as other users vote for you. Notifications disappear after 10 minutes.
        </AlertDescription>
      </Alert>

      {notifications.length > 0 ? (
        <div className="mt-8 space-y-4">
          {notifications.map((note) => (
            <Card key={note.id} className="animate-fade-in-up">
              <CardContent className="p-4 flex items-center gap-4">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <div className="flex-1">
                  <p className="font-semibold">{note.message}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(note.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="mt-8 text-center text-muted-foreground">
            <p>No new votes</p>
            <p className="text-sm">When someone votes for you, it will appear here live.</p>
        </div>
      )}
    </div>
  );
}
