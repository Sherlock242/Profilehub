
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
        <div className="text-center mb-8">
            <Skeleton className="h-10 w-3/4 mx-auto mb-2" />
            <Skeleton className="h-5 w-1/2 mx-auto" />
        </div>
        <div className="relative mb-8 max-w-lg mx-auto">
            <Skeleton className="h-10 w-full" />
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {renderSkeletonCard()}
            {renderSkeletonCard()}
            {renderSkeletonCard()}
        </div>
    </div>
  );
}
