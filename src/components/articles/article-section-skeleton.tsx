
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ArticleSectionSkeleton() {
  const renderSkeletonCard = () => (
    <Card className="overflow-hidden flex flex-col">
      <Skeleton className="w-full h-48" />
      <CardContent className="p-6 flex-1 flex flex-col">
        <Skeleton className="h-6 w-3/4 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-4" />
        <Skeleton className="h-4 w-1/2 mb-4" />
        <Skeleton className="h-5 w-24 mt-auto" />
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 animate-pulse">
        <h1 className="text-3xl md:text-4xl font-headline font-bold tracking-tighter text-center mb-10">
            Welcome to <span className="text-accent">Pro</span>Hub
        </h1>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {renderSkeletonCard()}
            {renderSkeletonCard()}
            {renderSkeletonCard()}
        </div>
    </div>
  );
}
