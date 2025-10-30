
'use server';

import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { type ProfileForVote, type LeaderboardEntry } from './definitions';

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
  // Add a timestamp to bust the cache
  return data?.publicUrl ? `${data.publicUrl}?t=${new Date().getTime()}` : undefined;
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
    .select('id, name, avatar_url')
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
  };

  const user2: ProfileForVote = {
    id: profile2.id,
    name: profile2.name,
    avatarUrl: await getPublicAvatarUrl(supabase, profile2.avatar_url),
  };

  return { users: [user1, user2] };
}

export async function recordVote(votedForId: string): Promise<{ error?: string }> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in to vote.' };
  }

  if (user.id === votedForId) {
      return { error: "You cannot vote for yourself." };
  }
  
  // Insert a record of the vote.
  const { error } = await supabase.from('votes').insert({
    voter_id: user.id,
    voted_for_id: votedForId,
  });

  if (error) {
    console.error("Vote recording error:", error.message);
    return { error: 'An error occurred while casting your vote.' };
  }

  // The database trigger 'increment_vote_count' handles updating the profiles table.
  // We revalidate the leaderboard path to ensure it shows the new counts.
  revalidatePath('/leaderboard');

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
