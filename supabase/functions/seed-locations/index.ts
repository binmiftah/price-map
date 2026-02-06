import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Nigerian states with their capitals and major markets
const NIGERIA_DATA: Record<string, { capital: string; cities: string[]; markets: Record<string, string[]> }> = {
  "Abia": {
    capital: "Umuahia",
    cities: ["Umuahia", "Aba", "Ohafia", "Arochukwu"],
    markets: {
      "Aba": ["Ariaria International Market", "Cemetery Market", "Eziukwu Market", "Ahia Ohuru Market"],
      "Umuahia": ["Ubani Market", "Orie Ugba Market", "Modern Market"],
      "Ohafia": ["Ohafia Market", "Abiriba Market"],
    }
  },
  "Adamawa": {
    capital: "Yola",
    cities: ["Yola", "Mubi", "Jimeta", "Numan", "Ganye"],
    markets: {
      "Yola": ["Jimeta Modern Market", "Yola Central Market"],
      "Mubi": ["Mubi Main Market", "Cattle Market"],
    }
  },
  "Akwa Ibom": {
    capital: "Uyo",
    cities: ["Uyo", "Eket", "Ikot Ekpene", "Oron", "Abak"],
    markets: {
      "Uyo": ["Itam Market", "Akpan Andem Market", "Uyo Main Market"],
      "Eket": ["Eket Market", "QIT Market"],
      "Ikot Ekpene": ["Ikot Ekpene Market", "Raffia Market"],
    }
  },
  "Anambra": {
    capital: "Awka",
    cities: ["Awka", "Onitsha", "Nnewi", "Ekwulobia", "Aguata"],
    markets: {
      "Onitsha": ["Onitsha Main Market", "Ochanja Market", "Ogbaru Market", "Relief Market", "Building Materials Market", "Head Bridge Market"],
      "Nnewi": ["Nkwo Nnewi Market", "Spare Parts Market"],
      "Awka": ["Aroma Market", "Eke Awka Market", "Nkwelle Market"],
    }
  },
  "Bauchi": {
    capital: "Bauchi",
    cities: ["Bauchi", "Azare", "Misau", "Jama'are"],
    markets: {
      "Bauchi": ["Wunti Market", "Central Market", "Monday Market"],
      "Azare": ["Azare Market"],
    }
  },
  "Bayelsa": {
    capital: "Yenagoa",
    cities: ["Yenagoa", "Brass", "Ogbia", "Sagbama"],
    markets: {
      "Yenagoa": ["Swali Market", "Tombia Market", "Opolo Market"],
    }
  },
  "Benue": {
    capital: "Makurdi",
    cities: ["Makurdi", "Gboko", "Otukpo", "Katsina-Ala"],
    markets: {
      "Makurdi": ["Wurukum Market", "Modern Market", "North Bank Market", "High Level Market"],
      "Gboko": ["Gboko Main Market"],
      "Otukpo": ["Otukpo Market"],
    }
  },
  "Borno": {
    capital: "Maiduguri",
    cities: ["Maiduguri", "Biu", "Damboa", "Gwoza"],
    markets: {
      "Maiduguri": ["Monday Market", "Custom Market", "Baga Fish Market", "Gamboru Market"],
    }
  },
  "Cross River": {
    capital: "Calabar",
    cities: ["Calabar", "Ikom", "Ogoja", "Obudu"],
    markets: {
      "Calabar": ["Watt Market", "Marian Market", "Bogobiri Market", "Akim Market"],
      "Ikom": ["Ikom Main Market"],
    }
  },
  "Delta": {
    capital: "Asaba",
    cities: ["Asaba", "Warri", "Sapele", "Ughelli", "Agbor"],
    markets: {
      "Asaba": ["Ogbogonogo Market", "Cable Point Market"],
      "Warri": ["Ogbe-Ijoh Market", "Main Market", "Pessu Market", "Effurun Market"],
      "Sapele": ["Sapele Market"],
    }
  },
  "Ebonyi": {
    capital: "Abakaliki",
    cities: ["Abakaliki", "Afikpo", "Onueke"],
    markets: {
      "Abakaliki": ["Abakpa Main Market", "Kpirikpiri Market", "International Market"],
      "Afikpo": ["Afikpo Market"],
    }
  },
  "Edo": {
    capital: "Benin City",
    cities: ["Benin City", "Auchi", "Ekpoma", "Uromi"],
    markets: {
      "Benin City": ["Oba Market", "New Benin Market", "Oliha Market", "Santana Market", "Uselu Market", "Ekiosa Market"],
      "Auchi": ["Auchi Market"],
    }
  },
  "Ekiti": {
    capital: "Ado-Ekiti",
    cities: ["Ado-Ekiti", "Ikere", "Ijero", "Efon-Alaaye"],
    markets: {
      "Ado-Ekiti": ["Oja Oba Market", "Bisi Market", "Erekesan Market"],
      "Ikere": ["Ikere Market"],
    }
  },
  "Enugu": {
    capital: "Enugu",
    cities: ["Enugu", "Nsukka", "Oji River", "Agbani"],
    markets: {
      "Enugu": ["Ogbete Main Market", "New Haven Market", "Aria Market", "Kenyatta Market", "Gariki Market"],
      "Nsukka": ["Ogige Market", "Nsukka Main Market"],
    }
  },
  "FCT": {
    capital: "Abuja",
    cities: ["Abuja", "Gwagwalada", "Kuje", "Bwari"],
    markets: {
      "Abuja": ["Wuse Market", "Garki Market", "Utako Market", "Jabi Market", "Maitama Market", "Nyanya Market", "Kubwa Market", "Dei-Dei Building Market", "Karmo Market"],
      "Gwagwalada": ["Gwagwalada Market"],
    }
  },
  "Gombe": {
    capital: "Gombe",
    cities: ["Gombe", "Kumo", "Billiri"],
    markets: {
      "Gombe": ["Gombe Main Market", "Monday Market", "Pantami Market"],
    }
  },
  "Imo": {
    capital: "Owerri",
    cities: ["Owerri", "Orlu", "Okigwe", "Mbaise"],
    markets: {
      "Owerri": ["Eke Ukwu Owerri", "Relief Market", "New Market", "Nkwo Orji Market"],
      "Orlu": ["Orlu Market"],
      "Okigwe": ["Okigwe Market"],
    }
  },
  "Jigawa": {
    capital: "Dutse",
    cities: ["Dutse", "Hadejia", "Kazaure", "Gumel"],
    markets: {
      "Dutse": ["Dutse Central Market"],
      "Hadejia": ["Hadejia Market"],
    }
  },
  "Kaduna": {
    capital: "Kaduna",
    cities: ["Kaduna", "Zaria", "Kafanchan", "Kagoro"],
    markets: {
      "Kaduna": ["Kaduna Central Market", "Kawo Market", "Kakuri Market", "Barnawa Market", "Television Market"],
      "Zaria": ["Sabon Gari Market", "Zaria City Market"],
    }
  },
  "Kano": {
    capital: "Kano",
    cities: ["Kano", "Wudil", "Gaya", "Rano"],
    markets: {
      "Kano": ["Kurmi Market", "Sabon Gari Market", "Kantin Kwari Market", "Singer Market", "Dawanau Grain Market", "Rimi Market", "Yankaba Market"],
    }
  },
  "Katsina": {
    capital: "Katsina",
    cities: ["Katsina", "Daura", "Funtua", "Malumfashi"],
    markets: {
      "Katsina": ["Katsina Central Market", "Kofar Marusa Market"],
      "Daura": ["Daura Market"],
    }
  },
  "Kebbi": {
    capital: "Birnin Kebbi",
    cities: ["Birnin Kebbi", "Argungu", "Yauri", "Zuru"],
    markets: {
      "Birnin Kebbi": ["Birnin Kebbi Central Market"],
      "Argungu": ["Argungu Market"],
    }
  },
  "Kogi": {
    capital: "Lokoja",
    cities: ["Lokoja", "Okene", "Kabba", "Idah"],
    markets: {
      "Lokoja": ["Lokoja Main Market", "International Market", "Ganaja Market"],
      "Okene": ["Okene Market"],
    }
  },
  "Kwara": {
    capital: "Ilorin",
    cities: ["Ilorin", "Offa", "Omu-Aran", "Jebba"],
    markets: {
      "Ilorin": ["Oja Oba Market", "Ipata Market", "Mandate Market", "Ago Market", "Baboko Market"],
      "Offa": ["Offa Market"],
    }
  },
  "Lagos": {
    capital: "Ikeja",
    cities: ["Ikeja", "Lagos Island", "Victoria Island", "Lekki", "Yaba", "Surulere", "Apapa", "Ikorodu", "Ojo", "Badagry", "Epe", "Ajah"],
    markets: {
      "Lagos Island": ["Balogun Market", "Idumota Market", "Jankara Market", "Ereko Market", "Oke Arin Market"],
      "Ikeja": ["Computer Village", "Ikeja Under Bridge Market", "Oregun Market"],
      "Yaba": ["Yaba Market", "Tejuosho Market", "Oyingbo Market"],
      "Surulere": ["Bode Thomas Market", "Kilo Market", "Surulere Market"],
      "Apapa": ["Mile 2 Market", "Trade Fair Complex"],
      "Ikorodu": ["Ikorodu Market", "Sabo Market"],
      "Ojo": ["Alaba International Market", "ASPAMDA Market"],
      "Lekki": ["Lekki Market", "Jakande Market", "Circle Mall"],
      "Ajah": ["Ajah Market", "Abraham Adesanya Market"],
      "Badagry": ["Badagry Market", "Seme Border Market"],
      "Epe": ["Epe Market", "Fish Market"],
    }
  },
  "Nasarawa": {
    capital: "Lafia",
    cities: ["Lafia", "Keffi", "Akwanga", "Nasarawa"],
    markets: {
      "Lafia": ["Lafia Main Market", "Shendam Road Market"],
      "Keffi": ["Keffi Market"],
    }
  },
  "Niger": {
    capital: "Minna",
    cities: ["Minna", "Bida", "Suleja", "Kontagora"],
    markets: {
      "Minna": ["Minna Central Market", "Kure Market", "Bosso Market"],
      "Suleja": ["Suleja Market"],
      "Bida": ["Bida Market"],
    }
  },
  "Ogun": {
    capital: "Abeokuta",
    cities: ["Abeokuta", "Sagamu", "Ijebu-Ode", "Ota", "Ilaro"],
    markets: {
      "Abeokuta": ["Kuto Market", "Itoku Market", "Lafenwa Market", "Adatan Market"],
      "Sagamu": ["Sagamu Market", "Sabo Market"],
      "Ijebu-Ode": ["Ijebu-Ode Market"],
      "Ota": ["Ota Market", "Sango Market"],
    }
  },
  "Ondo": {
    capital: "Akure",
    cities: ["Akure", "Ondo City", "Owo", "Ikare"],
    markets: {
      "Akure": ["Oja Oba Market", "Shasha Market", "NEPA Market", "Isikan Market"],
      "Ondo City": ["Ondo Market"],
    }
  },
  "Osun": {
    capital: "Osogbo",
    cities: ["Osogbo", "Ile-Ife", "Ilesa", "Ede"],
    markets: {
      "Osogbo": ["Oja Oba Market", "Igbona Market", "Old Garage Market", "Olaiya Market"],
      "Ile-Ife": ["Oja Ife", "Sabo Market"],
      "Ilesa": ["Ilesa Market"],
    }
  },
  "Oyo": {
    capital: "Ibadan",
    cities: ["Ibadan", "Ogbomoso", "Oyo", "Iseyin"],
    markets: {
      "Ibadan": ["Bodija Market", "Dugbe Market", "Gbagi Market", "Ogunpa Market", "Oje Market", "Mokola Market", "Agbowo Market", "Gate Market", "Aleshinloye Market", "New Gbagi International Market"],
      "Ogbomoso": ["Ogbomoso Market", "Takie Market"],
      "Oyo": ["Oyo Market"],
    }
  },
  "Plateau": {
    capital: "Jos",
    cities: ["Jos", "Bukuru", "Pankshin", "Shendam"],
    markets: {
      "Jos": ["Terminus Market", "Farin Gada Market", "Building Materials Market", "Bukuru Market", "Yan Lemo Market"],
    }
  },
  "Rivers": {
    capital: "Port Harcourt",
    cities: ["Port Harcourt", "Obio-Akpor", "Bonny", "Degema"],
    markets: {
      "Port Harcourt": ["Mile 1 Market", "Mile 3 Market", "Creek Road Market", "Fruit Garden Market", "Oil Mill Market", "Rumuokoro Market", "Town Market", "Slaughter Market"],
    }
  },
  "Sokoto": {
    capital: "Sokoto",
    cities: ["Sokoto", "Gwadabawa", "Illela", "Tambuwal"],
    markets: {
      "Sokoto": ["Sokoto Central Market", "Marina Market", "Kara Market"],
    }
  },
  "Taraba": {
    capital: "Jalingo",
    cities: ["Jalingo", "Wukari", "Takum", "Bali"],
    markets: {
      "Jalingo": ["Jalingo Main Market", "Mayo Gwoi Market"],
      "Wukari": ["Wukari Market"],
    }
  },
  "Yobe": {
    capital: "Damaturu",
    cities: ["Damaturu", "Potiskum", "Gashua", "Nguru"],
    markets: {
      "Damaturu": ["Damaturu Market"],
      "Potiskum": ["Potiskum Central Market"],
    }
  },
  "Zamfara": {
    capital: "Gusau",
    cities: ["Gusau", "Kaura Namoda", "Talata Mafara", "Anka"],
    markets: {
      "Gusau": ["Gusau Central Market", "Tudun Wada Market"],
    }
  }
};

async function getOrCreateLocation(
  supabase: any, 
  name: string, 
  type: string, 
  parentId: string | null
): Promise<string> {
  // First try to find existing
  let query = supabase
    .from('locations')
    .select('id')
    .eq('name', name)
    .eq('type', type);
  
  if (parentId === null) {
    query = query.is('parent_id', null);
  } else {
    query = query.eq('parent_id', parentId);
  }
  
  const { data: existing } = await query.maybeSingle();
  
  if (existing) {
    return existing.id;
  }
  
  // Create new
  const { data: created, error } = await supabase
    .from('locations')
    .insert({ name, type, parent_id: parentId })
    .select('id')
    .single();
  
  if (error) {
    console.error(`Error creating ${type} ${name}:`, error);
    throw error;
  }
  
  return created.id;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting Nigerian location seeding...');

    // First, get or create Nigeria as a country
    const nigeriaId = await getOrCreateLocation(supabase, 'Nigeria', 'country', null);
    console.log('Nigeria ID:', nigeriaId);

    let statesCreated = 0;
    let citiesCreated = 0;
    let marketsCreated = 0;

    // Process each state
    for (const [stateName, stateData] of Object.entries(NIGERIA_DATA)) {
      try {
        // Get or create state
        const stateId = await getOrCreateLocation(supabase, stateName, 'state', nigeriaId);
        statesCreated++;
        console.log(`Processing state: ${stateName}`);

        // Create cities
        for (const cityName of stateData.cities) {
          try {
            const cityId = await getOrCreateLocation(supabase, cityName, 'city', stateId);
            citiesCreated++;

            // Create markets for this city
            const markets = stateData.markets[cityName] || [];
            for (const marketName of markets) {
              try {
                await getOrCreateLocation(supabase, marketName, 'market', cityId);
                marketsCreated++;
              } catch (e) {
                console.error(`Error creating market ${marketName}:`, e);
              }
            }
          } catch (e) {
            console.error(`Error processing city ${cityName}:`, e);
          }
        }
      } catch (e) {
        console.error(`Error processing state ${stateName}:`, e);
      }
    }

    console.log(`Seeding complete: ${statesCreated} states, ${citiesCreated} cities, ${marketsCreated} markets`);

    return new Response(JSON.stringify({
      success: true,
      message: 'Nigerian locations seeded successfully',
      stats: {
        states: statesCreated,
        cities: citiesCreated,
        markets: marketsCreated
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Seeding error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});