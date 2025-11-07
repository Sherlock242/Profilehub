
'use client';

import { useState, useEffect } from 'react';
import { getArticlesForClient } from '@/lib/versus-actions';
import { type Article, CATEGORIES } from '@/lib/definitions';
import { ArticleSectionSkeleton } from '@/components/articles/article-section-skeleton';
import { ArticleCarousel } from '@/components/articles/article-carousel';

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = () => {
    setIsDataLoading(true);
    getArticlesForClient().then(data => {
        setArticles(data);
        setIsDataLoading(false);
    });
  }
  
  if (isDataLoading) {
    return <ArticleSectionSkeleton />;
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center text-muted-foreground py-16">
          <h2 className="text-2xl font-semibold">No Articles Found</h2>
          <p>Check back later for new content.</p>
        </div>
      </div>
    );
  }

  const articlesByCategory = CATEGORIES.reduce((acc, category) => {
    if (category) {
        // Treat uncategorized articles as 'Gym' articles
        const filteredArticles = articles.filter(article => 
            article.category === category || (category === 'Gym' && !article.category)
        );
        if (filteredArticles.length > 0) {
            acc[category] = filteredArticles;
        }
    }
    return acc;
  }, {} as Record<string, Article[]>);


  return (
    <div className="animate-fade-in container mx-auto py-8 lg:py-12 space-y-12">
        <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-headline font-bold tracking-tighter mb-2">
            Welcome to <span className="text-accent">Pro</span>Hub
            </h1>
            <p className="text-muted-foreground">
                Explore our latest articles and insights.
            </p>
        </div>
      {Object.entries(articlesByCategory).map(([category, articles]) => (
        <section key={category}>
          <h2 className="text-2xl font-bold tracking-tight mb-4 px-4 sm:px-0">{category}</h2>
          <ArticleCarousel articles={articles} />
        </section>
      ))}
    </div>
  );
}
