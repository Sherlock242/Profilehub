
import { getArticlesByCategory } from '@/lib/article-actions';
import { ArticleList } from '@/components/articles/article-list';
import { notFound } from 'next/navigation';
import { CATEGORIES } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

// Make sure category names are URL-friendly
function toTitleCase(str: string) {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

export default async function CategoryPage({ params }: { params: { categoryName: string } }) {
  const categoryName = decodeURIComponent(params.categoryName);
  
  // Validate category
  const isValidCategory = CATEGORIES.map(c => c?.toLowerCase()).includes(categoryName.toLowerCase());
  if (!isValidCategory) {
    notFound();
  }

  const articles = await getArticlesByCategory(categoryName);
  const title = `${toTitleCase(categoryName)} Articles`;
  const description = `Browse all articles in the ${toTitleCase(categoryName)} category.`;

  return (
    <div>
        <div className="container max-w-7xl pt-8">
             <Button asChild variant="ghost" size="sm">
                <a href="/">
                    <ArrowLeft className="mr-2" />
                    Back to Blog
                </a>
            </Button>
        </div>
        <ArticleList articles={articles} title={title} description={description} />
    </div>
  );
}

export async function generateStaticParams() {
    return CATEGORIES.filter(c => c !== null).map(category => ({
        categoryName: category!.toLowerCase(),
    }));
}
