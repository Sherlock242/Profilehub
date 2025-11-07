import Link from 'next/link';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { type Article } from '@/lib/definitions';
import { Badge } from '../ui/badge';
import { Calendar } from 'lucide-react';

export function LatestArticle({ article }: { article: Article }) {
    if (!article) return null;

    return (
        <article className="space-y-6">
            <Badge variant="outline" className="text-sm">
                <Calendar className="mr-2 h-4 w-4" />
                Latest Article
            </Badge>

            <Link href={`/articles/${article.id}`}>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight hover:text-primary transition-colors">
                    {article.title}
                </h1>
            </Link>

            <p className="text-muted-foreground text-lg">
                Posted on {new Date(article.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            {article.image_url && (
                <Link href={`/articles/${article.id}`} className="block">
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg">
                    <Image
                        src={article.image_url}
                        alt={article.title}
                        fill
                        className="object-cover"
                    />
                    </div>
                </Link>
            )}

            <div className="prose dark:prose-invert max-w-none prose-lg">
                {article.content ? (
                    <ReactMarkdown>{article.content}</ReactMarkdown>
                ): (
                    <p>{article.excerpt}</p>
                )}
            </div>

             <Link href={`/articles/${article.id}`} className="inline-block text-lg font-semibold text-primary hover:underline mt-4">
                Continue Reading &rarr;
            </Link>
        </article>
    );
}
