
import { getArticleById } from '@/lib/article-actions';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const article = await getArticleById(params.id);

  if (!article) {
    notFound();
  }

  return (
    <article className="container max-w-3xl py-8 animate-fade-in">
        <div className="mb-6">
            <Button asChild variant="ghost" size="sm">
                <Link href="/">
                    <ArrowLeft className="mr-2" />
                    Back to Blog
                </Link>
            </Button>
        </div>
      <h1 className="text-4xl font-bold tracking-tight mb-4">{article.title}</h1>
      <p className="text-muted-foreground text-lg mb-6">
        Posted on {new Date(article.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>

      {article.image_url && (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-8 shadow-lg">
          <Image
            src={article.image_url}
            alt={article.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="prose dark:prose-invert max-w-none prose-lg">
        {article.content ? (
            <ReactMarkdown>{article.content}</ReactMarkdown>
        ): (
            <p>{article.excerpt}</p>
        )}
      </div>
    </article>
  );
}
