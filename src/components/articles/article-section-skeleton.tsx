
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ArticleSectionSkeleton() {
  const renderSkeletonCard = (key: number) => (
    <div key={key} className="p-1 h-full shrink-0 grow-0 basis-[85%] sm:basis-[45%] md:basis-[40%] lg:basis-[30%] xl:basis-[22%] pl-4 md:pl-6">
        <Card className="overflow-hidden flex flex-col h-full">
            <Skeleton className="w-full aspect-[16/9]" />
            <CardContent className="p-4 sm:p-6 flex-1 flex flex-col">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <Skeleton className="h-5 w-24 mt-4" />
            </CardContent>
        </Card>
    </div>
  );

  return (
    <div className="animate-pulse container mx-auto py-8 lg:py-12 space-y-12">
        <div className="text-center">
            <Skeleton className="h-10 w-1/2 md:w-1/3 mx-auto mb-2" />
            <Skeleton className="h-5 w-2/3 md:w-1/2 mx-auto" />
        </div>
        <section>
          <Skeleton className="h-8 w-1/4 mb-4 px-4 sm:px-0" />
          <div className="overflow-hidden -ml-2 md:-ml-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => renderSkeletonCard(i))}
            </div>
          </div>
        </section>
        <section>
          <Skeleton className="h-8 w-1/4 mb-4 px-4 sm:px-0" />
          <div className="overflow-hidden -ml-2 md:-ml-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => renderSkeletonCard(i + 5))}
            </div>
          </div>
        </section>
    </div>
  );
}
