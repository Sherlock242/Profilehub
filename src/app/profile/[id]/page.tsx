import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

async function getPublicProfile(id: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, name, avatar_url, votes")
    .eq("id", id)
    .single();

  if (!profile) {
    return null;
  }
  
  let avatarUrl: string | undefined = undefined;
  if (profile.avatar_url) {
    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(profile.avatar_url);
    
    if (publicUrlData) {
        avatarUrl = publicUrlData.publicUrl;
    }
  }

  return {
    id: profile.id,
    name: profile.name,
    avatarUrl,
    votes: profile.votes,
  };
}


export default async function PublicProfilePage({ params }: { params: { id: string } }) {
  const profile = await getPublicProfile(params.id);

  if (!profile) {
    notFound();
  }

  return (
    <div className="container max-w-2xl py-8 animate-fade-in">
        <div className="mb-6">
            <Button asChild variant="ghost" size="sm">
                <Link href="/leaderboard">
                    <ArrowLeft className="mr-2" />
                    Back to Leaderboard
                </Link>
            </Button>
        </div>
      <Card>
        <CardHeader className="items-center text-center">
            <Avatar className="h-24 w-24 border-2 border-primary">
              <AvatarImage src={profile.avatarUrl} alt={profile.name} />
              <AvatarFallback className="text-3xl">
                {profile.name ? profile.name.charAt(0).toUpperCase() : <UserCircle/>}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="mt-4">{profile.name}</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="flex items-center justify-center gap-4 text-center p-4 rounded-lg bg-muted">
                <Trophy className="h-6 w-6 text-amber-400"/>
                <div className="text-lg">
                    <p className="font-bold text-2xl">{profile.votes}</p>
                    <p className="text-sm text-muted-foreground">Total Votes</p>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
