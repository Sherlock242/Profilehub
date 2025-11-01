export type AppUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: string;
};

export type ProfileForVote = Pick<AppUser, "id" | "name" | "avatarUrl"> & {
  votes: number;
  localVote?: boolean;
};

export type LeaderboardEntry = {
  rank: number;
  id: string;
  name: string;
  avatarUrl?: string;
  votes: number;
};

export type VoteNotification = {
    id: string;
    message: string;
    timestamp: string;
};
