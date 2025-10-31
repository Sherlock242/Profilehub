
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
  return data?.publicUrl;
}

export async function getInitialUsers(): Promise<VersusResult> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {};
  }

  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, name, avatar_url, votes')
    .not('id', 'eq', user.id);


  if (profilesError) {
    return { error: 'Could not fetch users.' };
  }

  if (profiles.length < 2) {
    return { error: "There are not enough other users to start a vote." };
  }

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

export async function recordVote({ votedForId, votedAgainstId }: { votedForId: string, votedAgainstId: string }): Promise<{ error?: string }> {
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

  const { data: profile, error: fetchError } = await supabase
    .from('profiles')
    .select('votes')
    .eq('id', votedForId)
    .single();

  if (fetchError || !profile) {
      return { error: 'Could not find the user to vote for.' };
  }

  const { error } = await supabase
    .from('profiles')
    .update({ votes: profile.votes + 1 })
    .eq('id', votedForId);


  if (error) {
    console.error("Vote recording error:", error.message);
    return { error: 'An error occurred while casting your vote.' };
  }

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
