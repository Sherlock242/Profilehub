
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { ArticleSectionSkeleton } from './article-section-skeleton';
import { type Article } from '@/lib/definitions';
import ReactMarkdown from 'react-markdown';

function ArticleList({ articles }: { articles: Article[] }) {

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <section className="animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-headline font-bold tracking-tighter text-center mb-10">
          Welcome to <span className="text-accent">Pro</span>Hub
        </h1>
        {articles.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
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
            <h2 className="text-2xl font-semibold">No Articles Yet</h2>
            <p>Check back later for new content!</p>
          </div>
        )}
      </section>
    </div>
  );
}

ArticleList.Skeleton = ArticleSectionSkeleton;

export { ArticleList };
