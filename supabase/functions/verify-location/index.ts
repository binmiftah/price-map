import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VerifyLocationRequest {
  name: string;
  cityId: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { name, cityId }: VerifyLocationRequest = await req.json();

    if (!name || !cityId) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Name and cityId are required' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Verifying location: ${name} in city ${cityId}`);

    // Get city details for context
    const { data: city, error: cityError } = await supabase
      .from('locations')
      .select('name, parent_id')
      .eq('id', cityId)
      .single();

    if (cityError || !city) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'City not found' 
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get state name
    const { data: state } = await supabase
      .from('locations')
      .select('name')
      .eq('id', city.parent_id)
      .single();

    const searchQuery = `${name} market ${city.name} ${state?.name || ''} Nigeria`;
    console.log('Search query:', searchQuery);

    // Use OpenStreetMap Nominatim API for verification (free, no API key needed)
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=5&countrycodes=ng`;
    
    const response = await fetch(nominatimUrl, {
      headers: {
        'User-Agent': 'LocalPriceChecker/1.0'
      }
    });

    const results = await response.json();
    console.log('Nominatim results:', JSON.stringify(results));

    // Check if we found relevant results
    const isVerified = results.length > 0;
    const confidence = results.length > 0 ? 
      (results[0].importance ? Math.min(results[0].importance * 100, 95) : 50) : 0;

    // Store the pending location
    const { data: pendingLocation, error: insertError } = await supabase
      .from('pending_locations')
      .insert({
        name: name.trim(),
        type: 'market',
        parent_id: cityId,
        status: isVerified && confidence > 30 ? 'approved' : 'pending',
        verification_result: {
          verified: isVerified,
          confidence: Math.round(confidence),
          results: results.slice(0, 3).map((r: any) => ({
            display_name: r.display_name,
            lat: r.lat,
            lon: r.lon,
            type: r.type,
            importance: r.importance
          })),
          searchQuery,
          verifiedAt: new Date().toISOString()
        }
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      throw insertError;
    }

    // If auto-approved, also add to locations table
    if (isVerified && confidence > 30) {
      const { data: newLocation, error: locationError } = await supabase
        .from('locations')
        .insert({
          name: name.trim(),
          type: 'market',
          parent_id: cityId
        })
        .select()
        .single();

      if (locationError) {
        console.error('Location insert error:', locationError);
      }

      return new Response(JSON.stringify({
        success: true,
        verified: true,
        autoApproved: true,
        location: newLocation,
        message: `"${name}" has been verified and added to our database!`,
        confidence: Math.round(confidence)
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // If not auto-approved, it goes to pending review
    return new Response(JSON.stringify({
      success: true,
      verified: isVerified,
      autoApproved: false,
      pendingId: pendingLocation.id,
      message: isVerified 
        ? `"${name}" was found but needs manual review before being added.`
        : `"${name}" could not be automatically verified. It has been submitted for manual review.`,
      confidence: Math.round(confidence)
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Verification error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});