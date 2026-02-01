import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { AggregatedPrice, PriceSubmission, PriceFormData } from "@/types";

export function useAggregatedPrices(locationId?: string, categoryId?: string) {
  return useQuery({
    queryKey: ["aggregated-prices", locationId, categoryId],
    queryFn: async () => {
      let query = supabase
        .from("aggregated_prices")
        .select(`
          *,
          item:items(*, category:categories(*)),
          location:locations(*)
        `);
      
      if (locationId) {
        query = query.eq("location_id", locationId);
      }
      
      const { data, error } = await query.order("last_updated", { ascending: false });
      
      if (error) throw error;
      
      // Filter by category if specified
      let results = data as AggregatedPrice[];
      if (categoryId) {
        results = results.filter(p => (p.item as any)?.category_id === categoryId);
      }
      
      return results;
    },
    enabled: !!locationId,
  });
}

export function usePriceSubmissions(itemId?: string, locationId?: string, limit = 30) {
  return useQuery({
    queryKey: ["price-submissions", itemId, locationId, limit],
    queryFn: async () => {
      let query = supabase
        .from("price_submissions")
        .select("*")
        .eq("is_flagged", false);
      
      if (itemId) {
        query = query.eq("item_id", itemId);
      }
      
      if (locationId) {
        query = query.eq("location_id", locationId);
      }
      
      const { data, error } = await query
        .order("submission_date", { ascending: true })
        .limit(limit);
      
      if (error) throw error;
      return data as PriceSubmission[];
    },
    enabled: !!itemId || !!locationId,
  });
}

export function useSubmitPrice() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (formData: PriceFormData) => {
      // Validate price
      if (formData.price <= 0) {
        throw new Error("Price must be greater than 0");
      }
      
      if (formData.price > 100000000) {
        throw new Error("Price seems unrealistically high");
      }
      
      const { data, error } = await supabase
        .from("price_submissions")
        .insert({
          item_id: formData.item_id,
          location_id: formData.location_id,
          price: formData.price,
          submission_date: formData.submission_date || new Date().toISOString().split("T")[0],
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aggregated-prices"] });
      queryClient.invalidateQueries({ queryKey: ["price-submissions"] });
    },
  });
}

export function useRecentPrices(limit = 10) {
  return useQuery({
    queryKey: ["recent-prices", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("aggregated_prices")
        .select(`
          *,
          item:items(*, category:categories(*)),
          location:locations(*)
        `)
        .order("last_updated", { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data as AggregatedPrice[];
    },
  });
}
