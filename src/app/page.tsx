
'use client';

import { useState, useEffect } from 'react';
import { getArticlesForClient } from '@/lib/versus-actions';
import { type Article, CATEGORIES } from '@/lib/definitions';
import { ArticleSectionSkeleton } from '@/components/articles/article-section-skeleton';
import { ArticleCarousel } from '@/components/articles/article-carousel';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

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

  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-yoga');

  const renderContent = () => {
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
        <>
            {Object.entries(articlesByCategory).map(([category, articles]) => (
            <section key={category}>
                <h2 className="text-2xl font-bold tracking-tight mb-4 px-4 sm:px-0">{category}</h2>
                <ArticleCarousel articles={articles} />
            </section>
            ))}
        </>
    );
  }

  return (
    <div className="animate-fade-in">
        <div className="relative h-[300px] md:h-[400px] w-full text-white">
            {heroImage && (
                 <Image
                    src={heroImage.imageUrl}
                    alt={heroImage.description}
                    fill
                    className="object-cover"
                    data-ai-hint={heroImage.imageHint}
                    priority
                />
            )}
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-4">
                <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tighter mb-2 drop-shadow-md">
                    Welcome to <span className="text-primary">Pro</span>Hub
                </h1>
                <p className="text-lg md:text-xl text-primary-foreground/90 drop-shadow-md">
                    Explore our latest articles and insights.
                </p>
            </div>
        </div>
      <div className="container mx-auto py-8 lg:py-12 space-y-12">
        {renderContent()}
      </div>
    </div>
  );
}
