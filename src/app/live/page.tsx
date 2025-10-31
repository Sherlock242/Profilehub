
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-client';
import { type AppUser } from '@/lib/definitions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RadioTower, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { getRecentNotifications, markNotificationsAsRead } from '@/lib/versus-actions';

type VoteNotification = {
  id: string;
  message: string;
  timestamp: string;
};

export default function LiveFeedPage() {
  const [notifications, setNotifications] = useState<VoteNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Mark notifications as read and notify header to update
    markNotificationsAsRead().then(() => {
        window.dispatchEvent(new Event('storage'));
    });
    
    // 2. Fetch initial recent notifications
    getRecentNotifications().then(({ notifications, error }) => {
        if (notifications) {
            setNotifications(notifications);
        }
        setIsLoading(false);
    });

    // 3. Set up real-time listener for new notifications
    const supabase = createClient();
    const channel = supabase
      .channel('realtime-notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        (payload) => {
           const newNotification = payload.new as { id: number; actor_name: string; created_at: string };
           const newVote: VoteNotification = {
               id: newNotification.id.toString(),
               message: `${newNotification.actor_name || 'Someone'} voted for you!`,
               timestamp: newNotification.created_at,
           };
           
           // Add to view and notify header
           setNotifications((current) => [newVote, ...current]);
           window.dispatchEvent(new Event('storage'));

           // Remove from view after 10 minutes
           setTimeout(() => {
               setNotifications((current) => current.filter((n) => n.id !== newVote.id));
           }, 10 * 60 * 1000); // 10 minutes
        }
      )
      .subscribe();

    // Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="container max-w-4xl py-8 animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <RadioTower className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Live Vote Feed</h1>
      </div>

      <Alert>
        <AlertTitle>Listening for Votes!</AlertTitle>
        <AlertDescription>
          This screen updates in real-time as other users vote for you. Notifications disappear after 10 minutes.
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
            <p>{isLoading ? "Loading votes..." : "No new votes from the last 10 minutes."}</p>
            <p className="text-sm">When someone votes for you, it will appear here live.</p>
        </div>
      )}
    </div>
  );
}
