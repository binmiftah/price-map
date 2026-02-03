import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LocationSelector } from "@/components/filters/LocationSelector";
import { ItemSelector } from "@/components/filters/ItemSelector";
import { CategoryFilter } from "@/components/filters/CategoryFilter";
import { usePriceSubmissions } from "@/hooks/usePrices";
import { formatPrice, formatDate } from "@/lib/format";
import { TrendingUp, TrendingDown, Minus, BarChart3, Calendar, Zap } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

type TimeRange = "7d" | "30d" | "90d";

// Mock chart data for demonstration
const generateMockChartData = (days: number) => {
  const data = [];
  const basePrice = 75000 + Math.random() * 10000;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const variance = (Math.random() - 0.5) * 5000;
    const price = basePrice + variance + (days - i) * 100; // Slight upward trend
    
    data.push({
      date: date.toISOString().split('T')[0],
      displayDate: formatDate(date),
      avgPrice: Math.round(price),
      minPrice: Math.round(price * 0.92),
      maxPrice: Math.round(price * 1.08),
      count: Math.floor(Math.random() * 10) + 3,
    });
  }
  
  return data;
};

export default function TrendsPage() {
  const [locationId, setLocationId] = useState<string | undefined>();
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [itemId, setItemId] = useState<string | undefined>();
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");
  
  const limitMap: Record<TimeRange, number> = {
    "7d": 7,
    "30d": 30,
    "90d": 90,
  };
  
  const { data: submissions, isLoading } = usePriceSubmissions(
    itemId,
    locationId,
    limitMap[timeRange]
  );
  
  // Use mock data for demonstration
  const chartData = useMemo(() => {
    if (itemId && locationId) {
      return generateMockChartData(limitMap[timeRange]);
    }
    return [];
  }, [itemId, locationId, timeRange]);
  
  // Calculate trend
  const trend = useMemo(() => {
    if (chartData.length < 2) return { direction: "stable" as const, percentage: 0 };
    
    const firstPrice = chartData[0].avgPrice;
    const lastPrice = chartData[chartData.length - 1].avgPrice;
    const change = ((lastPrice - firstPrice) / firstPrice) * 100;
    
    return {
      direction: change > 2 ? "up" as const : change < -2 ? "down" as const : "stable" as const,
      percentage: Math.abs(change),
    };
  }, [chartData]);
  
  const TrendIcon = trend.direction === "up" ? TrendingUp : trend.direction === "down" ? TrendingDown : Minus;
  const trendColor = trend.direction === "up" ? "text-destructive" : trend.direction === "down" ? "text-success" : "text-muted-foreground";
  const trendBg = trend.direction === "up" ? "bg-destructive/10" : trend.direction === "down" ? "bg-success/10" : "bg-muted";
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold font-display tracking-tight">
          Price Trends
        </h1>
        <p className="text-muted-foreground mt-1">
          Track how prices change over time for specific items and locations
        </p>
      </div>
      
      {/* Filters */}
      <Card className="overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-primary via-primary/50 to-transparent" />
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-display flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Select Item & Location
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <CategoryFilter
              value={categoryId}
              onChange={(id) => {
                setCategoryId(id);
                setItemId(undefined);
              }}
              label="Category"
            />
            <ItemSelector
              value={itemId}
              onChange={setItemId}
              categoryId={categoryId}
              label="Item"
            />
          </div>
          
          <LocationSelector
            value={locationId}
            onChange={setLocationId}
            label="Location"
          />
          
          {/* Time Range */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Time Range:</span>
            </div>
            <div className="flex gap-2 p-1 bg-muted rounded-xl">
              {(["7d", "30d", "90d"] as TimeRange[]).map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setTimeRange(range)}
                  className={`rounded-lg ${timeRange === range ? "shadow-sm" : ""}`}
                >
                  {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "90 Days"}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Chart */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-lg font-display">Price History</CardTitle>
            {chartData.length > 0 && (
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${trendBg} ${trendColor}`}>
                <TrendIcon className="h-4 w-4" />
                {trend.percentage.toFixed(1)}% {trend.direction === "up" ? "increase" : trend.direction === "down" ? "decrease" : "stable"}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {!itemId || !locationId ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-20 w-20 rounded-3xl bg-muted flex items-center justify-center mb-4">
                <BarChart3 className="h-10 w-10 text-muted-foreground/50" />
              </div>
              <h3 className="font-semibold mb-2">Select an item and location</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Choose an item and location above to view price trends over time
              </p>
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full" />
                <p className="text-sm text-muted-foreground">Loading price history...</p>
              </div>
            </div>
          ) : chartData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-20 w-20 rounded-3xl bg-muted flex items-center justify-center mb-4">
                <Zap className="h-10 w-10 text-muted-foreground/50" />
              </div>
              <h3 className="font-semibold mb-2">No data available</h3>
              <p className="text-sm text-muted-foreground">
                No price data available for this selection yet
              </p>
            </div>
          ) : (
            <div className="h-[300px] md:h-[400px] -mx-4 md:mx-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis 
                    dataKey="displayDate" 
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} 
                    axisLine={false}
                    tickLine={false}
                    dy={10}
                  />
                  <YAxis 
                    tickFormatter={(value) => formatPrice(value)}
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false}
                    tickLine={false}
                    width={80}
                    dx={-10}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                      padding: "12px",
                      boxShadow: "0 4px 20px -5px hsl(var(--foreground) / 0.1)",
                    }}
                    formatter={(value: number) => [formatPrice(value), "Average Price"]}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="avgPrice"
                    name="Average Price"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    fill="url(#colorPrice)"
                    dot={false}
                    activeDot={{ r: 6, strokeWidth: 2, fill: "hsl(var(--card))", stroke: "hsl(var(--primary))" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Stats */}
      {chartData.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full blur-xl" />
            <CardContent className="pt-5 pb-4 relative">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Current Avg</p>
              <p className="text-xl md:text-2xl font-bold text-primary font-display">
                {formatPrice(chartData[chartData.length - 1]?.avgPrice || 0)}
              </p>
            </CardContent>
          </Card>
          
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-success/5 rounded-full blur-xl" />
            <CardContent className="pt-5 pb-4 relative">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Lowest</p>
              <p className="text-xl md:text-2xl font-bold text-success font-display">
                {formatPrice(Math.min(...chartData.map(d => d.minPrice)))}
              </p>
            </CardContent>
          </Card>
          
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-destructive/5 rounded-full blur-xl" />
            <CardContent className="pt-5 pb-4 relative">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Highest</p>
              <p className="text-xl md:text-2xl font-bold text-destructive font-display">
                {formatPrice(Math.max(...chartData.map(d => d.maxPrice)))}
              </p>
            </CardContent>
          </Card>
          
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-info/5 rounded-full blur-xl" />
            <CardContent className="pt-5 pb-4 relative">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Data Points</p>
              <p className="text-xl md:text-2xl font-bold font-display">
                {chartData.reduce((acc, d) => acc + d.count, 0)}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
