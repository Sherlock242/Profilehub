
import { searchArticles } from '@/lib/article-actions';
import { ArticleList } from '@/components/articles/article-list';
import { Suspense } from 'react';
import { ArticleSectionSkeleton } from '@/components/articles/article-section-skeleton';

function SearchResults({ query }: { query: string }) {
  return (
    <Suspense key={query} fallback={<ArticleList.Skeleton />}>
      <SearchContent query={query} />
    </Suspense>
  );
}

async function SearchContent({ query }: { query: string }) {
  const articles = await searchArticles(query);
  const title = `Search Results for "${query}"`;
  const description = `${articles.length} article${articles.length === 1 ? '' : 's'} found.`;
  
  return <ArticleList articles={articles} title={title} description={description} />;
}

export default function SearchPage({
  searchParams,
}: {
  searchParams?: {
    q?: string;
  };
}) {
  const query = searchParams?.q || '';

  return <SearchResults query={query} />;
}
