import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, Users } from "lucide-react";
import type { AggregatedPrice } from "@/types";
import { formatPrice, formatPriceRange, formatRelativeTime, getCategoryIcon } from "@/lib/format";
import { cn } from "@/lib/utils";

interface PriceCardProps {
  price: AggregatedPrice;
  onClick?: () => void;
  showLocation?: boolean;
}

export function PriceCard({ price, onClick, showLocation = true }: PriceCardProps) {
  const item = price.item as any;
  const location = price.location as any;
  const category = item?.category;
  
  // Calculate price change indicator (mock for now)
  const trend = Math.random() > 0.5 ? "up" : Math.random() > 0.5 ? "down" : "stable";
  
  return (
    <Card 
      className={cn(
        "group overflow-hidden transition-all hover:shadow-md",
        onClick && "cursor-pointer hover:border-primary/50"
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{getCategoryIcon(category?.icon)}</span>
              <h3 className="font-semibold text-foreground truncate">
                {item?.name || "Unknown Item"}
              </h3>
            </div>
            
            {showLocation && location && (
              <p className="text-sm text-muted-foreground truncate mb-2">
                📍 {location.name}
              </p>
            )}
            
            <div className="flex flex-wrap gap-2 mt-2">
              {category && (
                <Badge variant="secondary" className="text-xs">
                  {category.name}
                </Badge>
              )}
              {item?.unit && (
                <Badge variant="outline" className="text-xs">
                  per {item.unit}
                </Badge>
              )}
            </div>
          </div>
          
          <div className="text-right flex-shrink-0">
            <div className="flex items-center gap-1 justify-end mb-1">
              {trend === "up" && <TrendingUp className="h-4 w-4 text-destructive" />}
              {trend === "down" && <TrendingDown className="h-4 w-4 text-success" />}
              {trend === "stable" && <Minus className="h-4 w-4 text-muted-foreground" />}
              <span className="text-lg font-bold text-primary">
                {formatPrice(price.avg_price)}
              </span>
            </div>
            
            <p className="text-xs text-muted-foreground">
              {formatPriceRange(price.min_price, price.max_price)}
            </p>
            
            <div className="flex items-center gap-1 justify-end mt-2 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              <span>{price.submission_count} reports</span>
            </div>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Updated {formatRelativeTime(price.last_updated)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
