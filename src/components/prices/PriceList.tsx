import type { AggregatedPrice } from "@/types";
import { PriceCard } from "./PriceCard";
import { PriceCardSkeleton } from "./PriceCardSkeleton";

interface PriceListProps {
  prices: AggregatedPrice[];
  isLoading?: boolean;
  onPriceClick?: (price: AggregatedPrice) => void;
  showLocation?: boolean;
  emptyMessage?: string;
}

export function PriceList({
  prices,
  isLoading,
  onPriceClick,
  showLocation = true,
  emptyMessage = "No prices found",
}: PriceListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <PriceCardSkeleton key={i} />
        ))}
      </div>
    );
  }
  
  if (!prices.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-4xl mb-3">📭</div>
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }
  
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {prices.map((price) => (
        <PriceCard
          key={price.id}
          price={price}
          onClick={onPriceClick ? () => onPriceClick(price) : undefined}
          showLocation={showLocation}
        />
      ))}
    </div>
  );
}
