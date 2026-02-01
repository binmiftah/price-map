import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useCountries, useStates, useCities, useAreas } from "@/hooks/useLocations";
import { Skeleton } from "@/components/ui/skeleton";

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
  
  const { data: countries, isLoading: loadingCountries } = useCountries();
  const { data: states, isLoading: loadingStates } = useStates(countryId);
  const { data: cities, isLoading: loadingCities } = useCities(stateId);
  const { data: areas, isLoading: loadingAreas } = useAreas(cityId);
  
  const handleCountryChange = (id: string) => {
    setCountryId(id);
    setStateId(undefined);
    setCityId(undefined);
    onChange(id);
  };
  
  const handleStateChange = (id: string) => {
    setStateId(id);
    setCityId(undefined);
    onChange(id);
  };
  
  const handleCityChange = (id: string) => {
    setCityId(id);
    onChange(id);
  };
  
  const handleAreaChange = (id: string) => {
    onChange(id);
  };
  
  return (
    <div className="space-y-4">
      {label && (
        <Label className="text-sm font-medium">
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Country */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Country</Label>
          {loadingCountries ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select value={countryId} onValueChange={handleCountryChange}>
              <SelectTrigger>
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
        
        {/* State */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">State</Label>
          {loadingStates ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select 
              value={stateId} 
              onValueChange={handleStateChange}
              disabled={!countryId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {states?.map((state) => (
                  <SelectItem key={state.id} value={state.id}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        
        {/* City */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">City</Label>
          {loadingCities ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select 
              value={cityId} 
              onValueChange={handleCityChange}
              disabled={!stateId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                {cities?.map((city) => (
                  <SelectItem key={city.id} value={city.id}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        
        {/* Area/Market */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Area/Market</Label>
          {loadingAreas ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select 
              value={value} 
              onValueChange={handleAreaChange}
              disabled={!cityId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select area" />
              </SelectTrigger>
              <SelectContent>
                {areas?.map((area) => (
                  <SelectItem key={area.id} value={area.id}>
                    {area.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
    </div>
  );
}
