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

export async function getTwoRandomUsers(): Promise<VersusResult> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in to vote.' };
  }

  // Fetch all profile IDs except the current user's
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, name, avatar_url')
    .neq('id', user.id);

  if (profilesError) {
    return { error: 'Could not fetch users.' };
  }

  if (profiles.length < 2) {
    // Return no users and no error to render the "not enough users" state
    return {};
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
  
  // Use upsert to handle potential unique constraint violations gracefully.
  // If the user has already voted for this person, nothing happens.
  // If not, a new vote is inserted.
  const { error } = await supabase.from('votes').upsert({
    voter_id: user.id,
    voted_for_id: votedForId,
  }, { onConflict: 'voter_id, voted_for_id' });

  if (error) {
    // We don't return the trigger-based vote count error to the client
    if (error.message.includes('vote for themselves')) {
       return { error: "You cannot vote for yourself." };
    }
    // For other errors, log them but don't expose details to the client
    console.error("Vote recording error:", error.message);
    return { error: 'An error occurred while casting your vote.' };
  }

  // The trigger handles the vote count, so we just need to revalidate
  // to show the next pair of users and update the leaderboard.
  revalidatePath('/');
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
    .order('votes', { ascending: false })
    .limit(10); // Get top 10

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
