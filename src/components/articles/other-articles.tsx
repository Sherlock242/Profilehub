import Image from 'next/image';
import { type Article } from '@/lib/definitions';
import { Separator } from '../ui/separator';
import { format } from 'date-fns';

export function OtherArticles({ articles }: { articles: Article[] }) {
    if (!articles || articles.length === 0) {
        return null;
    }

    return (
        <aside className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">More Articles</h2>
            <div className="space-y-6">
                {articles.map((article, index) => (
                    <div key={article.id}>
                        <a href={`/articles/${article.id}`} className="group block">
                            <article className="flex items-start gap-4">
                                {article.image_url && (
                                    <div className="relative flex-shrink-0 w-24 h-24 rounded-md overflow-hidden">
                                        <Image
                                            src={article.image_url}
                                            alt={article.title}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </div>
                                )}
                                <div className="flex-grow">
                                    <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
                                        {article.title}
                                    </h3>
                                    <p className="text-muted-foreground text-sm mt-1">
                                        {format(new Date(article.created_at), 'MMM d')}
                                    </p>
                                </div>
                            </article>
                        </a>
                        {index < articles.length - 1 && <Separator className="mt-6" />}
                    </div>
                ))}
            </div>
        </aside>
    );
}
