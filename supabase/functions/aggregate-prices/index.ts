import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Calculate median of an array
function calculateMedian(arr: number[]): number {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

// Calculate trimmed mean (remove top and bottom 10%)
function calculateTrimmedMean(arr: number[]): number {
  if (arr.length === 0) return 0;
  if (arr.length < 5) {
    // Not enough data to trim, use regular mean
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  }
  
  const sorted = [...arr].sort((a, b) => a - b);
  const trimCount = Math.floor(sorted.length * 0.1);
  const trimmed = sorted.slice(trimCount, sorted.length - trimCount);
  
  return trimmed.reduce((a, b) => a + b, 0) / trimmed.length;
}

// Detect if a price is an outlier using IQR method
function isOutlier(price: number, allPrices: number[]): boolean {
  if (allPrices.length < 4) return false;
  
  const sorted = [...allPrices].sort((a, b) => a - b);
  const q1Index = Math.floor(sorted.length * 0.25);
  const q3Index = Math.floor(sorted.length * 0.75);
  
  const q1 = sorted[q1Index];
  const q3 = sorted[q3Index];
  const iqr = q3 - q1;
  
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;
  
  return price < lowerBound || price > upperBound;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting price aggregation...');

    // Get all unique item+location combinations from submissions
    const { data: submissions, error: fetchError } = await supabase
      .from('price_submissions')
      .select('item_id, location_id, price, is_flagged')
      .eq('is_flagged', false);

    if (fetchError) {
      console.error('Error fetching submissions:', fetchError);
      throw fetchError;
    }

    console.log(`Found ${submissions?.length || 0} unflagged submissions`);

    // Group submissions by item+location
    const groups: Record<string, { item_id: string; location_id: string; prices: number[] }> = {};

    submissions?.forEach((sub) => {
      const key = `${sub.item_id}|${sub.location_id}`;
      if (!groups[key]) {
        groups[key] = {
          item_id: sub.item_id,
          location_id: sub.location_id,
          prices: [],
        };
      }
      groups[key].prices.push(Number(sub.price));
    });

    console.log(`Grouped into ${Object.keys(groups).length} unique item-location pairs`);

    // Calculate aggregates for each group
    const aggregates = Object.values(groups).map((group) => {
      const prices = group.prices;
      
      return {
        item_id: group.item_id,
        location_id: group.location_id,
        avg_price: calculateTrimmedMean(prices),
        min_price: Math.min(...prices),
        max_price: Math.max(...prices),
        median_price: calculateMedian(prices),
        submission_count: prices.length,
        last_updated: new Date().toISOString(),
      };
    });

    console.log(`Calculated ${aggregates.length} aggregates`);

    // Upsert aggregated prices
    for (const agg of aggregates) {
      const { error: upsertError } = await supabase
        .from('aggregated_prices')
        .upsert(agg, {
          onConflict: 'item_id,location_id',
        });

      if (upsertError) {
        console.error('Error upserting aggregate:', upsertError);
      }
    }

    console.log('Price aggregation completed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        message: `Aggregated ${aggregates.length} price groups`,
        count: aggregates.length,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: unknown) {
    console.error('Aggregation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred during aggregation';
    
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
