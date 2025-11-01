import { getUserOnServer } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getArticles } from '@/lib/article-actions';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DeleteArticleButton } from '@/components/admin/delete-article-button';

export default async function AdminPage() {
  const user = await getUserOnServer();

  if (!user || user.role !== 'admin') {
    redirect('/');
  }

  const articles = await getArticles();

  return (
    <div className="container max-w-4xl py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Blog Management</h1>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/admin/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Article
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden sm:table-cell">Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.length > 0 ? (
                articles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="font-medium">{article.title}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {new Date(article.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/edit/${article.id}`}>Edit</Link>
                          </DropdownMenuItem>
                          <DeleteArticleButton articleId={article.id} />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    No articles found. Get started by creating one!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
