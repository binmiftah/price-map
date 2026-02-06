import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCountries, useStates, useCities, useMarkets } from "@/hooks/useLocations";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Loader2, MapPin, CheckCircle2, AlertCircle, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface LocationSelectorProps {
  value?: string;
  onChange: (locationId: string) => void;
  label?: string;
  required?: boolean;
}

export function LocationSelector({
  value,
  onChange,
  label = "Location",
  required = false,
}: LocationSelectorProps) {
  const [countryId, setCountryId] = useState<string | undefined>();
  const [stateId, setStateId] = useState<string | undefined>();
  const [cityId, setCityId] = useState<string | undefined>();
  const [stateSearch, setStateSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [marketSearch, setMarketSearch] = useState("");
  
  // Add market dialog state
  const [showAddMarket, setShowAddMarket] = useState(false);
  const [newMarketName, setNewMarketName] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean;
    verified: boolean;
    autoApproved: boolean;
    message: string;
    locationId?: string;
  } | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: countries, isLoading: loadingCountries } = useCountries();
  const { data: states, isLoading: loadingStates } = useStates(countryId);
  const { data: cities, isLoading: loadingCities } = useCities(stateId);
  const { data: markets, isLoading: loadingMarkets } = useMarkets(cityId);

  // Auto-select Nigeria if it's the only country
  useEffect(() => {
    if (countries?.length === 1 && !countryId) {
      setCountryId(countries[0].id);
    }
  }, [countries, countryId]);

  // Filter states by search
  const filteredStates = states?.filter(s => 
    s.name.toLowerCase().includes(stateSearch.toLowerCase())
  ) || [];

  // Filter cities by search
  const filteredCities = cities?.filter(c => 
    c.name.toLowerCase().includes(citySearch.toLowerCase())
  ) || [];

  // Filter markets by search
  const filteredMarkets = markets?.filter(m => 
    m.name.toLowerCase().includes(marketSearch.toLowerCase())
  ) || [];
  
  const handleCountryChange = (id: string) => {
    setCountryId(id);
    setStateId(undefined);
    setCityId(undefined);
    setStateSearch("");
    setCitySearch("");
    setMarketSearch("");
  };
  
  const handleStateChange = (id: string) => {
    setStateId(id);
    setCityId(undefined);
    setCitySearch("");
    setMarketSearch("");
    // Don't call onChange yet - need city and market
  };
  
  const handleCityChange = (id: string) => {
    setCityId(id);
    setMarketSearch("");
    // Don't call onChange yet - need market
  };
  
  const handleMarketChange = (id: string) => {
    onChange(id);
  };

  const handleAddMarket = async () => {
    if (!newMarketName.trim() || !cityId) return;

    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('verify-location', {
        body: { name: newMarketName, cityId }
      });

      if (error) throw error;

      setVerificationResult(data);

      if (data.autoApproved && data.location) {
        // Refresh markets list
        queryClient.invalidateQueries({ queryKey: ['markets', cityId] });
        
        toast({
          title: "Market Added!",
          description: data.message,
        });

        // Auto-select the new market
        setTimeout(() => {
          onChange(data.location.id);
          setShowAddMarket(false);
          setNewMarketName("");
          setVerificationResult(null);
        }, 1500);
      } else {
        toast({
          title: data.verified ? "Submitted for Review" : "Verification Needed",
          description: data.message,
          variant: data.verified ? "default" : "destructive",
        });
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      toast({
        title: "Error",
        description: "Failed to verify location. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };
  
  return (
    <div className="space-y-4">
      {label && (
        <Label className="text-sm font-medium flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Country - Usually just Nigeria */}
        {countries && countries.length > 1 && (
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Country</Label>
            {loadingCountries ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select value={countryId} onValueChange={handleCountryChange}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries?.map((country) => (
                    <SelectItem key={country.id} value={country.id}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        )}
        
        {/* State */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">State</Label>
          {loadingStates ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select 
              value={stateId} 
              onValueChange={handleStateChange}
              disabled={!countryId && countries?.length !== 1}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                <div className="px-2 pb-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search states..."
                      value={stateSearch}
                      onChange={(e) => setStateSearch(e.target.value)}
                      className="pl-8 h-8 text-sm"
                    />
                  </div>
                </div>
                {filteredStates.length === 0 ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    No states found
                  </div>
                ) : (
                  filteredStates.map((state) => (
                    <SelectItem key={state.id} value={state.id}>
                      {state.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          )}
        </div>
        
        {/* City */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">City/LGA</Label>
          {loadingCities ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select 
              value={cityId} 
              onValueChange={handleCityChange}
              disabled={!stateId}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                <div className="px-2 pb-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search cities..."
                      value={citySearch}
                      onChange={(e) => setCitySearch(e.target.value)}
                      className="pl-8 h-8 text-sm"
                    />
                  </div>
                </div>
                {filteredCities.length === 0 ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    No cities found
                  </div>
                ) : (
                  filteredCities.map((city) => (
                    <SelectItem key={city.id} value={city.id}>
                      {city.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          )}
        </div>
        
        {/* Market */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Market</Label>
          {loadingMarkets ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <div className="flex gap-2">
              <Select 
                value={value} 
                onValueChange={handleMarketChange}
                disabled={!cityId}
              >
                <SelectTrigger className="rounded-xl flex-1">
                  <SelectValue placeholder="Select market" />
                </SelectTrigger>
                <SelectContent>
                  <div className="px-2 pb-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search markets..."
                        value={marketSearch}
                        onChange={(e) => setMarketSearch(e.target.value)}
                        className="pl-8 h-8 text-sm"
                      />
                    </div>
                  </div>
                  {filteredMarkets.length === 0 ? (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                      {markets?.length === 0 ? "No markets yet" : "No markets found"}
                    </div>
                  ) : (
                    filteredMarkets.map((market) => (
                      <SelectItem key={market.id} value={market.id}>
                        {market.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              
              {/* Add Market Button */}
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="rounded-xl flex-shrink-0"
                disabled={!cityId}
                onClick={() => setShowAddMarket(true)}
                title="Add new market"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Add Market Dialog */}
      <Dialog open={showAddMarket} onOpenChange={setShowAddMarket}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Add New Market
            </DialogTitle>
            <DialogDescription>
              Can't find your market? Add it here. We'll verify the location before adding it.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="marketName">Market Name</Label>
              <Input
                id="marketName"
                placeholder="e.g., Oke Arin Market, Mile 12 Market"
                value={newMarketName}
                onChange={(e) => setNewMarketName(e.target.value)}
                className="rounded-xl"
              />
            </div>

            {verificationResult && (
              <div className={`p-4 rounded-xl flex items-start gap-3 ${
                verificationResult.autoApproved 
                  ? 'bg-success/10 text-success' 
                  : verificationResult.verified 
                    ? 'bg-highlight/10 text-highlight-foreground'
                    : 'bg-muted text-muted-foreground'
              }`}>
                {verificationResult.autoApproved ? (
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                )}
                <div className="text-sm">
                  <p className="font-medium">{verificationResult.message}</p>
                  {!verificationResult.autoApproved && (
                    <p className="mt-1 opacity-80">
                      Our team will review your submission and add it if valid.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowAddMarket(false);
                setNewMarketName("");
                setVerificationResult(null);
              }}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleAddMarket}
              disabled={!newMarketName.trim() || isVerifying || verificationResult?.autoApproved}
              className="rounded-xl"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Market
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}