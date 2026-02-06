export interface Location {
  id: string;
  name: string;
  type: 'country' | 'state' | 'city' | 'area' | 'lga' | 'market';
  parent_id: string | null;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string | null;
  created_at: string;
}

export interface Item {
  id: string;
  name: string;
  category_id: string;
  unit: string | null;
  created_at: string;
  category?: Category;
}

export interface PriceSubmission {
  id: string;
  item_id: string;
  location_id: string;
  price: number;
  submission_date: string;
  ip_hash: string | null;
  is_flagged: boolean;
  flag_reason: string | null;
  created_at: string;
  item?: Item;
  location?: Location;
}

export interface AggregatedPrice {
  id: string;
  item_id: string;
  location_id: string;
  avg_price: number;
  min_price: number;
  max_price: number;
  median_price: number | null;
  submission_count: number;
  last_updated: string;
  item?: Item;
  location?: Location;
}

export interface LocationHierarchy {
  country: Location | null;
  state: Location | null;
  city: Location | null;
  area: Location | null;
}

export interface PriceFormData {
  item_id: string;
  location_id: string;
  price: number;
  submission_date?: string;
}
