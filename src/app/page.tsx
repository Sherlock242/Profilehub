import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth';
import { getTwoRandomUsers } from '@/lib/versus-actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { VersusForm } from '@/components/versus/versus-form';

export default async function HomePage() {
  const user = await getUser();
  if (!user) {
    // If user is not logged in, show a welcome message instead of redirecting.
    // The VersusForm and related logic requires an authenticated user.
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 text-center animate-fade-in">
        <section className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Welcome to Profile Hub
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Who will win? Vote for your favorite profiles and climb the leaderboard. Log in or sign up to get started.
          </p>
        </section>
      </div>
    );
  }

  const { users, error } = await getTwoRandomUsers();

  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      {error ? (
        <Alert variant="destructive" className="max-w-md animate-fade-in">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : users ? (
        <VersusForm users={users} />
      ) : (
         <Alert className="max-w-md animate-fade-in">
          <AlertTitle>All Clear!</AlertTitle>
          <AlertDescription>Looks like there are no other users to compare right now.</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
