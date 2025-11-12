

import { getArticleById, getArticles } from '@/lib/article-actions';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { OtherArticles } from '@/components/articles/other-articles';
import { Separator } from '@/components/ui/separator';
import { ShareButton } from '@/components/articles/share-button';
import { AdsterraNativeBanner } from '@/components/ads/adsterra-native-banner';
import { AdsterraBanner300x250 } from '@/components/ads/adsterra-banner-300x250';

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const article = await getArticleById(params.id);
  
  if (!article) {
    notFound();
  }

  // Fetch all articles and filter out the current one
  const allArticles = await getArticles();
  const otherArticles = allArticles.filter(a => a.id !== article.id);

  return (
    <div className="animate-fade-in">
        <article className="container max-w-3xl py-8 px-4">
            <div className="mb-6">
                <Button asChild variant="ghost" size="sm">
                    <Link href="/">
                        <ArrowLeft className="mr-2" />
                        Back to Blog
                    </Link>
                </Button>
            </div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{article.title}</h1>
              <ShareButton title={article.title} url={`/articles/${article.id}`} />
            </div>
          <p className="text-muted-foreground text-base sm:text-lg mb-6">
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
        
        <div className="container max-w-3xl py-8 px-4">
            <AdsterraBanner300x250 />
            <AdsterraNativeBanner />
            {otherArticles.length > 0 && (
            <>
                <Separator className="my-8" />
                <div className="mt-8">
                <OtherArticles articles={otherArticles} />
                </div>
            </>
            )}
        </div>
    </div>
  );
}
