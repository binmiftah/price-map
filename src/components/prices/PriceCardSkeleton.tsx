import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function PriceCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Skeleton className="h-6 w-6 rounded" />
              <Skeleton className="h-5 w-32" />
            </div>
            <Skeleton className="h-4 w-24 mb-2" />
            <div className="flex gap-2 mt-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-12" />
            </div>
          </div>
          <div className="text-right">
            <Skeleton className="h-6 w-20 mb-1" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16 mt-2" />
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-border">
          <Skeleton className="h-3 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}
