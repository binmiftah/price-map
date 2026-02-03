// Rich mock data for showcasing the Local Price Checker features
import type { AggregatedPrice, Category, Location, Item } from "@/types";

export const mockCategories: Category[] = [
  { id: "cat-1", name: "Food & Groceries", icon: "utensils", created_at: "2024-01-01" },
  { id: "cat-2", name: "Electronics", icon: "smartphone", created_at: "2024-01-01" },
  { id: "cat-3", name: "Transport", icon: "car", created_at: "2024-01-01" },
  { id: "cat-4", name: "Services", icon: "wrench", created_at: "2024-01-01" },
  { id: "cat-5", name: "Home & Living", icon: "hammer", created_at: "2024-01-01" },
];

export const mockLocations: Location[] = [
  { id: "loc-1", name: "Lagos Island", type: "area", parent_id: null, created_at: "2024-01-01" },
  { id: "loc-2", name: "Ikeja", type: "area", parent_id: null, created_at: "2024-01-01" },
  { id: "loc-3", name: "Lekki", type: "area", parent_id: null, created_at: "2024-01-01" },
  { id: "loc-4", name: "Victoria Island", type: "area", parent_id: null, created_at: "2024-01-01" },
  { id: "loc-5", name: "Yaba", type: "area", parent_id: null, created_at: "2024-01-01" },
];

export const mockItems: Item[] = [
  { id: "item-1", name: "Bag of Rice (50kg)", category_id: "cat-1", unit: "bag", created_at: "2024-01-01" },
  { id: "item-2", name: "Cooking Gas Refill (12.5kg)", category_id: "cat-1", unit: "cylinder", created_at: "2024-01-01" },
  { id: "item-3", name: "Petrol/PMS", category_id: "cat-3", unit: "litre", created_at: "2024-01-01" },
  { id: "item-4", name: "iPhone 15 Pro Max", category_id: "cat-2", unit: "unit", created_at: "2024-01-01" },
  { id: "item-5", name: "Uber Ride (10km)", category_id: "cat-3", unit: "ride", created_at: "2024-01-01" },
  { id: "item-6", name: "Haircut (Men's)", category_id: "cat-4", unit: "service", created_at: "2024-01-01" },
  { id: "item-7", name: "Generator Fuel (Diesel)", category_id: "cat-5", unit: "litre", created_at: "2024-01-01" },
  { id: "item-8", name: "Chicken (Whole)", category_id: "cat-1", unit: "kg", created_at: "2024-01-01" },
  { id: "item-9", name: "Data Bundle (30GB)", category_id: "cat-2", unit: "bundle", created_at: "2024-01-01" },
];

// Generate mock aggregated prices with realistic Nigerian prices
export const mockPrices: AggregatedPrice[] = [
  {
    id: "price-1",
    item_id: "item-1",
    location_id: "loc-1",
    avg_price: 78500,
    min_price: 72000,
    max_price: 85000,
    median_price: 78000,
    submission_count: 47,
    last_updated: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
    item: { ...mockItems[0], category: mockCategories[0] },
    location: mockLocations[0],
  },
  {
    id: "price-2",
    item_id: "item-2",
    location_id: "loc-2",
    avg_price: 12800,
    min_price: 11500,
    max_price: 14000,
    median_price: 12500,
    submission_count: 89,
    last_updated: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    item: { ...mockItems[1], category: mockCategories[0] },
    location: mockLocations[1],
  },
  {
    id: "price-3",
    item_id: "item-3",
    location_id: "loc-3",
    avg_price: 855,
    min_price: 800,
    max_price: 950,
    median_price: 850,
    submission_count: 234,
    last_updated: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
    item: { ...mockItems[2], category: mockCategories[2] },
    location: mockLocations[2],
  },
  {
    id: "price-4",
    item_id: "item-4",
    location_id: "loc-4",
    avg_price: 2150000,
    min_price: 1950000,
    max_price: 2400000,
    median_price: 2100000,
    submission_count: 23,
    last_updated: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    item: { ...mockItems[3], category: mockCategories[1] },
    location: mockLocations[3],
  },
  {
    id: "price-5",
    item_id: "item-5",
    location_id: "loc-1",
    avg_price: 4500,
    min_price: 3800,
    max_price: 6200,
    median_price: 4200,
    submission_count: 156,
    last_updated: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
    item: { ...mockItems[4], category: mockCategories[2] },
    location: mockLocations[0],
  },
  {
    id: "price-6",
    item_id: "item-6",
    location_id: "loc-5",
    avg_price: 2500,
    min_price: 1500,
    max_price: 5000,
    median_price: 2000,
    submission_count: 78,
    last_updated: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    item: { ...mockItems[5], category: mockCategories[3] },
    location: mockLocations[4],
  },
  {
    id: "price-7",
    item_id: "item-7",
    location_id: "loc-2",
    avg_price: 1250,
    min_price: 1100,
    max_price: 1400,
    median_price: 1250,
    submission_count: 112,
    last_updated: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    item: { ...mockItems[6], category: mockCategories[4] },
    location: mockLocations[1],
  },
  {
    id: "price-8",
    item_id: "item-8",
    location_id: "loc-3",
    avg_price: 8500,
    min_price: 7000,
    max_price: 12000,
    median_price: 8000,
    submission_count: 65,
    last_updated: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    item: { ...mockItems[7], category: mockCategories[0] },
    location: mockLocations[2],
  },
  {
    id: "price-9",
    item_id: "item-9",
    location_id: "loc-4",
    avg_price: 12000,
    min_price: 10000,
    max_price: 15000,
    median_price: 12000,
    submission_count: 198,
    last_updated: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    item: { ...mockItems[8], category: mockCategories[1] },
    location: mockLocations[3],
  },
];

// Stats for the homepage
export const mockStats = {
  totalPrices: 12847,
  totalLocations: 156,
  totalItems: 423,
  totalContributors: 3892,
  pricesThisWeek: 847,
  accuracyRate: 94.7,
};

// Hot items - trending searches
export const hotItems = [
  { name: "Petrol", trend: "+12%", searches: 2341 },
  { name: "Rice", trend: "+8%", searches: 1892 },
  { name: "Cooking Gas", trend: "+15%", searches: 1654 },
  { name: "Uber/Bolt Rides", trend: "-3%", searches: 987 },
  { name: "Generator Fuel", trend: "+22%", searches: 876 },
];
