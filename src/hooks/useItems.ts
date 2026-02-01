import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Item } from "@/types";

export function useItems(categoryId?: string) {
  return useQuery({
    queryKey: ["items", categoryId],
    queryFn: async () => {
      let query = supabase.from("items").select("*, category:categories(*)");
      
      if (categoryId) {
        query = query.eq("category_id", categoryId);
      }
      
      const { data, error } = await query.order("name");
      
      if (error) throw error;
      return data as Item[];
    },
  });
}

export function useItem(itemId?: string) {
  return useQuery({
    queryKey: ["item", itemId],
    queryFn: async () => {
      if (!itemId) return null;
      
      const { data, error } = await supabase
        .from("items")
        .select("*, category:categories(*)")
        .eq("id", itemId)
        .single();
      
      if (error) throw error;
      return data as Item;
    },
    enabled: !!itemId,
  });
}
