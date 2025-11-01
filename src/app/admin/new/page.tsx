import { getUserOnServer } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ArticleForm } from '@/components/admin/article-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default async function NewArticlePage() {
  const user = await getUserOnServer();

  if (!user || user.role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="container max-w-4xl py-8 animate-fade-in">
        <div className="mb-6">
            <Button asChild variant="ghost" size="sm">
                <Link href="/admin">
                    <ArrowLeft className="mr-2" />
                    Back to All Articles
                </Link>
            </Button>
        </div>
      <Card>
        <CardHeader>
          <CardTitle>Create New Article</CardTitle>
        </CardHeader>
        <CardContent>
          <ArticleForm />
        </CardContent>
      </Card>
    </div>
  );
}
