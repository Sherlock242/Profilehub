
'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { ArticleSectionSkeleton } from './article-section-skeleton';
import { type Article } from '@/lib/definitions';
import ReactMarkdown from 'react-markdown';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

function ArticleList({ articles }: { articles: Article[] }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredArticles =
    articles?.filter((article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <section className="animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-headline font-bold tracking-tighter text-center mb-2">
          Welcome to <span className="text-accent">Pro</span>Hub
        </h1>
        <p className="text-muted-foreground text-center mb-8">
            Explore our latest articles and insights.
        </p>

        <div className="relative mb-8 max-w-lg mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search articles by title..."
            className="w-full pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredArticles.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="overflow-hidden flex flex-col group">
                <Link href={`/articles/${article.id}`} className="block overflow-hidden">
                  {article.image_url && (
                    <Image
                      src={article.image_url}
                      alt={article.title}
                      width={600}
                      height={400}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                </Link>
                <CardContent className="p-6 flex-1 flex flex-col">
                  <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    <Link href={`/articles/${article.id}`}>{article.title}</Link>
                  </h2>
                  <div className="text-muted-foreground mb-4 flex-grow prose dark:prose-invert prose-sm">
                    {article.excerpt ? (
                        <ReactMarkdown
                            components={{
                                p: ({node, ...props}) => <p className="text-muted-foreground" {...props} />
                            }}
                        >{article.excerpt}</ReactMarkdown>
                    ) : null}
                  </div>
                  <Link href={`/articles/${article.id}`} className="text-sm font-semibold text-primary hover:underline mt-auto">
                    Read More &rarr;
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-16">
            <h2 className="text-2xl font-semibold">No Articles Found</h2>
            <p>Try a different search term or check back later.</p>
          </div>
        )}
      </section>
    </div>
  );
}

ArticleList.Skeleton = ArticleSectionSkeleton;

export { ArticleList };
