import { getUserOnServer } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const user = await getUserOnServer();

  if (!user || user.role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="container max-w-4xl py-8 animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Admin Dashboard</h1>
      <p>Welcome, admin! This is where you will manage blog posts.</p>
    </div>
  );
}
