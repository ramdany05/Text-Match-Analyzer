import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function HistoryCardSkeleton() {
  return (
    <Card className="overflow-hidden border border-border/60">
      <div className="flex flex-col md:flex-row">
        {/* Score box skeleton */}
        <div className="flex-none p-6 bg-muted/30 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-border min-w-[150px] space-y-2">
          <Skeleton className="h-10 w-16" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-5 w-20 rounded-full mt-2" />
        </div>

        {/* Text detail skeleton */}
        <div className="flex-1 p-6 flex flex-col justify-between space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
          <div className="flex items-center justify-between pt-2">
            <Skeleton className="h-3 w-28" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function StatsCardSkeleton() {
  return (
    <Card className="border border-border/60">
      <div className="p-4 flex flex-col items-center text-center justify-center space-y-2">
        <Skeleton className="h-5 w-5 rounded-full mb-1" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-7 w-12" />
      </div>
    </Card>
  );
}
