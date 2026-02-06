import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Location } from "@/types";

export function useLocations(parentId?: string | null, type?: string) {
  return useQuery({
    queryKey: ["locations", parentId, type],
    queryFn: async () => {
      let query = supabase.from("locations").select("*");
      
      if (type) {
        query = query.eq("type", type);
      }
      
      if (parentId !== undefined) {
        if (parentId === null) {
          query = query.is("parent_id", null);
        } else {
          query = query.eq("parent_id", parentId);
        }
      }
      
      const { data, error } = await query.order("name");
      
      if (error) throw error;
      return data as Location[];
    },
  });
}

export function useLocationHierarchy(locationId?: string) {
  return useQuery({
    queryKey: ["location-hierarchy", locationId],
    queryFn: async () => {
      if (!locationId) return null;
      
      const hierarchy: Location[] = [];
      let currentId: string | null = locationId;
      
      while (currentId) {
        const { data, error } = await supabase
          .from("locations")
          .select("*")
          .eq("id", currentId)
          .single();
        
        if (error || !data) break;
        
        hierarchy.unshift(data as Location);
        currentId = data.parent_id;
      }
      
      return hierarchy;
    },
    enabled: !!locationId,
  });
}

export function useCountries() {
  return useLocations(null, "country");
}

export function useStates(countryId?: string) {
  return useQuery({
    queryKey: ["states", countryId],
    queryFn: async () => {
      if (!countryId) return [];
      
      const { data, error } = await supabase
        .from("locations")
        .select("*")
        .eq("parent_id", countryId)
        .eq("type", "state")
        .order("name");
      
      if (error) throw error;
      return data as Location[];
    },
    enabled: !!countryId,
  });
}

export function useCities(stateId?: string) {
  return useQuery({
    queryKey: ["cities", stateId],
    queryFn: async () => {
      if (!stateId) return [];
      
      const { data, error } = await supabase
        .from("locations")
        .select("*")
        .eq("parent_id", stateId)
        .eq("type", "city")
        .order("name");
      
      if (error) throw error;
      return data as Location[];
    },
    enabled: !!stateId,
  });
}

export function useMarkets(cityId?: string) {
  return useQuery({
    queryKey: ["markets", cityId],
    queryFn: async () => {
      if (!cityId) return [];
      
      const { data, error } = await supabase
        .from("locations")
        .select("*")
        .eq("parent_id", cityId)
        .eq("type", "market")
        .order("name");
      
      if (error) throw error;
      return data as Location[];
    },
    enabled: !!cityId,
  });
}

// Legacy - kept for backwards compatibility
export function useAreas(cityId?: string) {
  return useMarkets(cityId);
}