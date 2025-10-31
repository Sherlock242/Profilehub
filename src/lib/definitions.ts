export type AppUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  hasUnreadNotifications: boolean;
};

export type ProfileForVote = Pick<AppUser, "id" | "name" | "avatarUrl"> & {
  votes: number;
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
