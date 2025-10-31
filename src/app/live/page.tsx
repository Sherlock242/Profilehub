
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RadioTower } from "lucide-react";

export default async function LiveFeedPage() {
  const user = await getUser();
  if (!user) {
    redirect('/login');
  }

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

      <div className="mt-8 text-center text-muted-foreground">
        <p>No new votes</p>
        <p className="text-sm">When someone votes for you, it will appear here live.</p>
      </div>
    </div>
  );
}
