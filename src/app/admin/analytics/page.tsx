import { getUserOnServer } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink } from 'lucide-react';

export default async function AnalyticsPage() {
  const user = await getUserOnServer();

  if (!user || user.role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="container max-w-4xl py-8 animate-fade-in">
        <div className="mb-6">
            <Button asChild variant="ghost" size="sm">
                <a href="/admin">
                    <ArrowLeft className="mr-2" />
                    Back to Dashboard
                </a>
            </Button>
        </div>
      <Card>
        <CardHeader>
          <CardTitle>Site Analytics</CardTitle>
          <CardDescription>
            Your website is now tracking visitor data using Google Analytics. It may take up to 48 hours for data to begin appearing in your dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
                You can view detailed reports about your site's traffic, user engagement, and more by visiting your official Google Analytics dashboard.
            </p>
          <Button asChild>
            <a href="https://analytics.google.com/" target="_blank" rel="noopener noreferrer">
              Go to Google Analytics
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
