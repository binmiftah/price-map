import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LocationSelector } from "@/components/filters/LocationSelector";
import { CategoryFilter } from "@/components/filters/CategoryFilter";
import { PriceList } from "@/components/prices";
import { useAggregatedPrices } from "@/hooks/usePrices";
import { Filter } from "lucide-react";

export default function BrowsePage() {
  const [locationId, setLocationId] = useState<string | undefined>();
  const [categoryId, setCategoryId] = useState<string | undefined>();
  
  const { data: prices, isLoading } = useAggregatedPrices(locationId, categoryId);
  
  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Browse Prices</h1>
        <p className="text-muted-foreground">
          Find average prices for goods and services in your area
        </p>
      </div>
      
      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <LocationSelector
            value={locationId}
            onChange={setLocationId}
            label="Select Location"
          />
          
          <CategoryFilter
            value={categoryId}
            onChange={setCategoryId}
            label="Category"
          />
        </CardContent>
      </Card>
      
      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">
            {locationId ? "Prices in Selected Location" : "Select a Location to View Prices"}
          </h2>
          {prices && prices.length > 0 && (
            <span className="text-sm text-muted-foreground">
              {prices.length} {prices.length === 1 ? "result" : "results"}
            </span>
          )}
        </div>
        
        {locationId ? (
          <PriceList
            prices={prices || []}
            isLoading={isLoading}
            showLocation={false}
            emptyMessage="No prices found for this location. Be the first to submit!"
          />
        ) : (
          <Card className="py-12">
            <CardContent className="text-center">
              <div className="text-4xl mb-3">📍</div>
              <p className="text-muted-foreground">
                Select a location above to browse prices
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
