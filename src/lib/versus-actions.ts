
'use server';

import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { type ProfileForVote, type LeaderboardEntry, type AppUser, type VoteNotification } from './definitions';
import { createAdminClient } from './supabase/admin';
import { subMinutes } from 'date-fns';

type VersusResult = {
  users?: [ProfileForVote, ProfileForVote];
  error?: string;
};

async function getPublicAvatarUrl(
  supabase: ReturnType<typeof createClient>,
  path: string | null
): Promise<string | undefined> {
  if (!path) return undefined;
  const { data } = supabase.storage.from('avatars').getPublicUrl(path);
  // No longer bust the cache with a timestamp
  return data?.publicUrl;
}

// Renamed from getTwoRandomUsers
export async function getInitialUsers(): Promise<VersusResult> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Return nothing if user is not logged in, the frontend will show a generic welcome message.
    return {};
  }

  // Fetch all profiles other than the current user
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, name, avatar_url, votes')
    .not('id', 'eq', user.id);


  if (profilesError) {
    return { error: 'Could not fetch users.' };
  }

  // We need at least 2 other users in the system to start a vote.
  if (profiles.length < 2) {
    return { error: "There are not enough other users to start a vote." };
  }

  // Get two random, distinct indices
  let index1 = Math.floor(Math.random() * profiles.length);
  let index2 = Math.floor(Math.random() * profiles.length);
  while (index1 === index2) {
    index2 = Math.floor(Math.random() * profiles.length);
  }

  const profile1 = profiles[index1];
  const profile2 = profiles[index2];

  const user1: ProfileForVote = {
    id: profile1.id,
    name: profile1.name,
    avatarUrl: await getPublicAvatarUrl(supabase, profile1.avatar_url),
    votes: profile1.votes,
  };

  const user2: ProfileForVote = {
    id: profile2.id,
    name: profile2.name,
    avatarUrl: await getPublicAvatarUrl(supabase, profile2.avatar_url),
    votes: profile2.votes,
  };

  return { users: [user1, user2] };
}

export async function recordVote(votedForId: string): Promise<{ error?: string }> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user: voter },
  } = await supabase.auth.getUser();

  if (!voter) {
    return { error: 'You must be logged in to vote.' };
  }

  if (voter.id === votedForId) {
      return { error: "You cannot vote for yourself." };
  }
  
  // The database trigger 'on_new_vote' now handles inserting into notifications
  // and incrementing the vote count. We just need to insert the vote itself.
  const { error } = await supabase.from('votes').insert({
    voter_id: voter.id,
    voted_for_id: votedForId,
  });


  if (error) {
    console.error("Vote recording error:", error.message);
    if (error.message.includes('duplicate key value violates unique constraint "votes_voter_id_voted_for_id_key"')) {
        return { error: 'You have already voted for this user.' };
    }
    return { error: 'An error occurred while casting your vote.' };
  }

  // Revalidate paths to reflect updated vote counts
  revalidatePath('/leaderboard');
  revalidatePath(`/profile/${votedForId}`);

  return {};
}


export async function getLeaderboard(): Promise<{
  leaderboard?: LeaderboardEntry[];
  error?: string;
}> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, avatar_url, votes')
    .order('votes', { ascending: false });

  if (error) {
    return { error: 'Could not fetch leaderboard.' };
  }

  const leaderboard = await Promise.all(
    data.map(async (profile, index) => ({
      rank: index + 1,
      id: profile.id,
      name: profile.name,
      votes: profile.votes,
      avatarUrl: await getPublicAvatarUrl(supabase, profile.avatar_url),
    }))
  );

  return { leaderboard };
}

export async function markNotificationsAsRead(): Promise<{ error?: string }> {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

    if (error) {
        console.error("Error marking notifications as read:", error);
        return { error: error.message };
    }

    // Revalidate the root layout to re-run `getUser` and update the dot
    revalidatePath('/', 'layout');
    return {};
}

export async function getRecentNotifications(): Promise<{ notifications?: VoteNotification[], error?: string }> {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    // Fetch notifications from the last 10 minutes
    const tenMinutesAgo = subMinutes(new Date(), 10).toISOString();

    const { data, error } = await supabase
        .from('notifications')
        .select('id, created_at, actor_name')
        .eq('user_id', user.id)
        .gte('created_at', tenMinutesAgo)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching recent notifications:", error);
        return { error: error.message };
    }

    const notifications: VoteNotification[] = data.map(n => ({
        id: n.id.toString(),
        message: `${n.actor_name || 'Someone'} voted for you!`,
        timestamp: n.created_at,
    }));
    
    return { notifications };
}
