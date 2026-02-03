import type { AggregatedPrice } from "@/types";
import { PriceCard } from "./PriceCard";
import { PriceCardSkeleton } from "./PriceCardSkeleton";
import { PackageOpen } from "lucide-react";

interface PriceListProps {
  prices: AggregatedPrice[];
  isLoading?: boolean;
  onPriceClick?: (price: AggregatedPrice) => void;
  showLocation?: boolean;
  emptyMessage?: string;
  variant?: "default" | "grid" | "featured";
}

export function PriceList({
  prices,
  isLoading,
  onPriceClick,
  showLocation = true,
  emptyMessage = "No prices found",
  variant = "default",
}: PriceListProps) {
  if (isLoading) {
    return (
      <div className={
        variant === "featured" 
          ? "space-y-4"
          : "grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
      }>
        {Array.from({ length: variant === "featured" ? 3 : 6 }).map((_, i) => (
          <div key={i} className="opacity-0 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
            <PriceCardSkeleton variant={variant === "featured" ? "featured" : "default"} />
          </div>
        ))}
      </div>
    );
  }
  
  if (!prices.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="relative mb-4">
          <div className="h-20 w-20 rounded-3xl bg-muted flex items-center justify-center">
            <PackageOpen className="h-10 w-10 text-muted-foreground/50" />
          </div>
          <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-xs">?</span>
          </div>
        </div>
        <p className="text-muted-foreground text-sm max-w-xs">{emptyMessage}</p>
      </div>
    );
  }
  
  if (variant === "featured") {
    return (
      <div className="space-y-4">
        {prices.map((price, i) => (
          <div 
            key={price.id} 
            className="opacity-0 animate-fade-in" 
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <PriceCard
              price={price}
              onClick={onPriceClick ? () => onPriceClick(price) : undefined}
              showLocation={showLocation}
              variant="featured"
            />
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {prices.map((price, i) => (
        <div 
          key={price.id} 
          className="opacity-0 animate-fade-in" 
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          <PriceCard
            price={price}
            onClick={onPriceClick ? () => onPriceClick(price) : undefined}
            showLocation={showLocation}
          />
        </div>
      ))}
    </div>
  );
}
