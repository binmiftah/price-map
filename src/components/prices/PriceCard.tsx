import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, Users, MapPin, Clock } from "lucide-react";
import type { AggregatedPrice } from "@/types";
import { formatPrice, formatPriceRange, formatRelativeTime, getCategoryIcon } from "@/lib/format";
import { cn } from "@/lib/utils";

interface PriceCardProps {
  price: AggregatedPrice;
  onClick?: () => void;
  showLocation?: boolean;
  variant?: "default" | "compact" | "featured";
}

export function PriceCard({ price, onClick, showLocation = true, variant = "default" }: PriceCardProps) {
  const item = price.item as any;
  const location = price.location as any;
  const category = item?.category;
  
  // Calculate price trend (mock based on price range variance)
  const variance = (price.max_price - price.min_price) / price.avg_price;
  const trend = variance > 0.15 ? "volatile" : price.submission_count > 50 ? "stable" : "up";
  
  if (variant === "featured") {
    return (
      <Card 
        className={cn(
          "group relative overflow-hidden transition-all duration-300 hover-lift",
          "bg-gradient-to-br from-primary/5 via-card to-card border-primary/20",
          onClick && "cursor-pointer"
        )}
        onClick={onClick}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
        
        <CardContent className="relative p-5">
          <div className="flex items-start justify-between gap-4">
            {/* Left side - Item info */}
            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getCategoryIcon(category?.icon)}</span>
                <div className="min-w-0">
                  <h3 className="font-bold font-display text-foreground truncate">
                    {item?.name || "Unknown Item"}
                  </h3>
                  {category && (
                    <p className="text-xs text-muted-foreground">{category.name}</p>
                  )}
                </div>
              </div>
              
              {showLocation && location && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  <span>{location.name}</span>
                </div>
              )}
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  <span className="font-medium">{price.submission_count}</span> reports
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{formatRelativeTime(price.last_updated)}</span>
                </div>
              </div>
            </div>
            
            {/* Right side - Price */}
            <div className="flex flex-col items-end gap-2">
              <div className="price-tag text-lg">
                {formatPrice(price.avg_price)}
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                {formatPriceRange(price.min_price, price.max_price)}
              </p>
              {item?.unit && (
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  per {item.unit}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card 
      className={cn(
        "group relative overflow-hidden transition-all duration-300",
        "hover:border-primary/30 hover:shadow-md",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      {/* Subtle accent stripe */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/50 to-transparent" />
      
      <CardContent className="p-4 pl-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{getCategoryIcon(category?.icon)}</span>
              <h3 className="font-semibold font-display text-foreground truncate text-sm">
                {item?.name || "Unknown Item"}
              </h3>
            </div>
            
            {showLocation && location && (
              <p className="text-xs text-muted-foreground truncate mb-2 flex items-center gap-1">
                <MapPin className="h-3 w-3 text-primary/70" />
                {location.name}
              </p>
            )}
            
            <div className="flex items-center gap-2 flex-wrap">
              {category && (
                <span className="text-[10px] uppercase tracking-wider text-secondary-foreground bg-secondary px-2 py-0.5 rounded-md">
                  {category.name}
                </span>
              )}
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Users className="h-3 w-3" />
                {price.submission_count}
              </span>
            </div>
          </div>
          
          <div className="text-right flex-shrink-0">
            <div className="flex items-center gap-1 justify-end mb-1">
              {trend === "up" && <TrendingUp className="h-3.5 w-3.5 text-destructive" />}
              {trend === "stable" && <Minus className="h-3.5 w-3.5 text-success" />}
              {trend === "volatile" && <TrendingDown className="h-3.5 w-3.5 text-warning" />}
              <span className="text-base font-bold text-primary font-display">
                {formatPrice(price.avg_price)}
              </span>
            </div>
            
            <p className="text-[10px] text-muted-foreground font-mono">
              {formatPriceRange(price.min_price, price.max_price)}
            </p>
            
            {item?.unit && (
              <p className="text-[10px] text-muted-foreground mt-1">
                per {item.unit}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
