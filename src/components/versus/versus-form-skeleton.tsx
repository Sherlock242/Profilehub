
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function VersusFormSkeleton() {

  const renderSkeletonCard = () => {
    return (
        <Card
            className="flex-1 w-full max-w-[calc(50%-0.5rem)] sm:max-w-none sm:w-0"
        >
            <CardContent className="p-2 sm:p-4 flex flex-col items-center justify-center space-y-2 sm:space-y-3 h-full">
                <Skeleton className="h-20 w-20 sm:h-28 sm:w-28 md:h-40 lg:h-48 md:w-40 lg:w-48 rounded-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-9 w-full mt-auto" />
            </CardContent>
        </Card>
    );
  }

  return (
    <div className="w-full animate-pulse max-w-4xl mx-auto">
       <h1 className="text-xl md:text-3xl font-bold tracking-tighter text-center mb-2">Who would you vote for?</h1>
       <p className="text-muted-foreground text-center mb-6 md:mb-10 text-base">Click on a profile to cast your vote.</p>
        <div className="flex flex-row items-stretch justify-center gap-2 sm:gap-4 md:gap-8">
            {renderSkeletonCard()}
            <div className="flex items-center justify-center text-xl sm:text-2xl md:text-4xl font-bold text-muted-foreground mx-1 sm:mx-2">VS</div>
            {renderSkeletonCard()}
        </div>
    </div>
  );
}
