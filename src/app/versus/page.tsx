import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth';
import { getTwoRandomUsers } from '@/lib/versus-actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { VersusForm } from '@/components/versus/versus-form';

export default async function VersusPage() {
  const user = await getUser();
  if (!user) {
    redirect('/login');
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
          <AlertDescription>Looks like there are no users to compare right now.</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
