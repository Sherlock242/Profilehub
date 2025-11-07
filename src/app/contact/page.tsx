
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="container max-w-4xl py-8 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p>
            Have questions or feedback? I'd love to hear from you. The best way to reach out is through email or by connecting with me on social media.
          </p>
          <ul>
            <li><strong>Email:</strong> You can send an email to <a href="mailto:kanojiyas780@gmail.com">kanojiyas780@gmail.com</a>.</li>
            <li><strong>YouTube:</strong> Check out the <a href="https://www.youtube.com/@xsoraedit" target="_blank" rel="noopener noreferrer">xsoraedit channel</a>. You can find links to all my other social media profiles in the channel's bio.</li>
          </ul>
          <div className="not-prose mt-6 flex gap-4">
              <Button asChild>
                <a href="mailto:kanojiyas780@gmail.com">
                    Email Me
                </a>
              </Button>
               <Button asChild variant="outline">
                <a href="https://www.youtube.com/@xsoraedit" target="_blank" rel="noopener noreferrer">
                    YouTube Channel
                    <ExternalLink className="ml-2" />
                </a>
              </Button>
          </div>
          <p className="mt-6">
            I appreciate your feedback and will get back to you as soon as I can.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
