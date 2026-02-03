import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface PriceCardSkeletonProps {
  variant?: "default" | "featured";
}

export function PriceCardSkeleton({ variant = "default" }: PriceCardSkeletonProps) {
  if (variant === "featured") {
    return (
      <Card className="overflow-hidden bg-gradient-to-br from-muted/30 to-card">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <div className="space-y-1.5">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-4 w-24" />
              <div className="flex gap-3">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
            <div className="space-y-2 text-right">
              <Skeleton className="h-8 w-24 rounded-full ml-auto" />
              <Skeleton className="h-3 w-20 ml-auto" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="overflow-hidden relative">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-muted" />
      <CardContent className="p-4 pl-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-4 w-28" />
            </div>
            <Skeleton className="h-3 w-20" />
            <div className="flex gap-2">
              <Skeleton className="h-4 w-16 rounded-md" />
              <Skeleton className="h-4 w-10" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
