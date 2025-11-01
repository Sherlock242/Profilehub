import { redirect } from "next/navigation";
import Link from "next/link";
import { getUserOnServer as getUser } from "@/lib/auth";
import { getLeaderboard } from "@/lib/versus-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, UserCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default async function LeaderboardPage() {
  const user = await getUser();
  if (!user) {
    redirect('/login');
  }

  const { leaderboard, error } = await getLeaderboard();

  if (error) {
    return (
      <div className="container max-w-4xl py-8 animate-fade-in">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8 animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <Trophy className="h-8 w-8 text-amber-400" />
        <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Top Voters</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Rank</TableHead>
                <TableHead>User</TableHead>
                <TableHead className="text-right">Votes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboard && leaderboard.length > 0 ? (
                leaderboard.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-bold text-lg">
                      {entry.rank}
                    </TableCell>
                    <TableCell>
                      <Link href={`/profile/${entry.id}`} className="flex items-center gap-4 group hover:cursor-pointer">
                        <Avatar>
                          <AvatarImage src={entry.avatarUrl} />
                          <AvatarFallback>
                            {entry.name?.charAt(0) || <UserCircle />}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium group-hover:underline">{entry.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="text-right font-mono text-lg font-bold">
                      {entry.votes}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    No results. Be the first to cast a vote!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
