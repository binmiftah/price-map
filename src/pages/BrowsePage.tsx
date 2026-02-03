import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LocationSelector } from "@/components/filters/LocationSelector";
import { CategoryFilter } from "@/components/filters/CategoryFilter";
import { PriceList } from "@/components/prices";
import { useAggregatedPrices } from "@/hooks/usePrices";
import { mockPrices, mockLocations } from "@/data/mockData";
import { Search, SlidersHorizontal, MapPin, X } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function BrowsePage() {
  const [locationId, setLocationId] = useState<string | undefined>();
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  
  const { data: dbPrices, isLoading } = useAggregatedPrices(locationId, categoryId);
  
  // Use mock data when no location selected, otherwise use real data
  const prices = locationId ? (dbPrices || []) : mockPrices;
  
  // Filter by search query
  const filteredPrices = searchQuery 
    ? prices.filter(p => {
        const item = p.item as any;
        return item?.name?.toLowerCase().includes(searchQuery.toLowerCase());
      })
    : prices;
  
  const selectedLocation = mockLocations.find(l => l.id === locationId);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-display tracking-tight">
            Browse Prices
          </h1>
          <p className="text-muted-foreground mt-1">
            Find average prices for goods and services in your area
          </p>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          className="self-start md:self-auto rounded-xl gap-2"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
      </div>
      
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search for rice, petrol, airtime..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 h-14 text-base rounded-2xl border-2 focus-visible:ring-0 focus-visible:border-primary"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl"
            onClick={() => setSearchQuery("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {/* Filters */}
      {showFilters && (
        <Card className="overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-primary via-primary/50 to-transparent" />
          <CardContent className="p-4 md:p-6">
            <div className="grid md:grid-cols-2 gap-4">
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
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Active Filters */}
      {(locationId || categoryId || searchQuery) && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          
          {selectedLocation && (
            <Button
              variant="secondary"
              size="sm"
              className="h-7 rounded-full gap-1.5 text-xs"
              onClick={() => setLocationId(undefined)}
            >
              <MapPin className="h-3 w-3" />
              {selectedLocation.name}
              <X className="h-3 w-3 ml-1" />
            </Button>
          )}
          
          {searchQuery && (
            <Button
              variant="secondary"
              size="sm"
              className="h-7 rounded-full gap-1.5 text-xs"
              onClick={() => setSearchQuery("")}
            >
              <Search className="h-3 w-3" />
              "{searchQuery}"
              <X className="h-3 w-3 ml-1" />
            </Button>
          )}
        </div>
      )}
      
      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold font-display">
            {locationId ? "Prices in Selected Location" : "All Locations"}
          </h2>
          {filteredPrices.length > 0 && (
            <span className="text-sm text-muted-foreground px-3 py-1 bg-muted rounded-full">
              {filteredPrices.length} {filteredPrices.length === 1 ? "result" : "results"}
            </span>
          )}
        </div>
        
        {!locationId && !searchQuery ? (
          <div className="space-y-6">
            <Card className="border-dashed bg-muted/30">
              <CardContent className="py-12 text-center">
                <div className="relative inline-block mb-4">
                  <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                    <MapPin className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold mb-2">Select a location for accurate prices</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Or browse all locations below to get a general overview of prices across Nigeria
                </p>
              </CardContent>
            </Card>
            
            {/* Show all prices when no location selected */}
            <PriceList
              prices={filteredPrices}
              isLoading={false}
              showLocation={true}
              emptyMessage="No prices found. Try a different search."
            />
          </div>
        ) : (
          <PriceList
            prices={filteredPrices}
            isLoading={locationId ? isLoading : false}
            showLocation={!locationId}
            emptyMessage="No prices found for this selection. Be the first to submit!"
          />
        )}
      </div>
    </div>
  );
}
