import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LocationSelector } from "@/components/filters/LocationSelector";
import { ItemSelector } from "@/components/filters/ItemSelector";
import { CategoryFilter } from "@/components/filters/CategoryFilter";
import { usePriceSubmissions } from "@/hooks/usePrices";
import { formatPrice, formatDate } from "@/lib/format";
import { TrendingUp, TrendingDown, Minus, BarChart3 } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type TimeRange = "7d" | "30d" | "90d";

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
  
  // Process data for chart
  const chartData = useMemo(() => {
    if (!submissions?.length) return [];
    
    // Group by date and calculate daily averages
    const groupedByDate: Record<string, number[]> = {};
    
    submissions.forEach((sub) => {
      const date = sub.submission_date;
      if (!groupedByDate[date]) {
        groupedByDate[date] = [];
      }
      groupedByDate[date].push(sub.price);
    });
    
    return Object.entries(groupedByDate)
      .map(([date, prices]) => ({
        date,
        displayDate: formatDate(date),
        avgPrice: prices.reduce((a, b) => a + b, 0) / prices.length,
        minPrice: Math.min(...prices),
        maxPrice: Math.max(...prices),
        count: prices.length,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [submissions]);
  
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
  
  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Price Trends</h1>
        <p className="text-muted-foreground">
          Track how prices change over time for specific items and locations
        </p>
      </div>
      
      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
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
          <div className="flex gap-2">
            <span className="text-sm text-muted-foreground self-center">Time Range:</span>
            {(["7d", "30d", "90d"] as TimeRange[]).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(range)}
              >
                {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "90 Days"}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Price History</CardTitle>
            {chartData.length > 0 && (
              <Badge variant="secondary" className={trendColor}>
                <TrendIcon className="h-3 w-3 mr-1" />
                {trend.percentage.toFixed(1)}% {trend.direction === "up" ? "increase" : trend.direction === "down" ? "decrease" : "stable"}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!itemId || !locationId ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-4xl mb-3">📊</div>
              <p className="text-muted-foreground">
                Select an item and location to view price trends
              </p>
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : chartData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-muted-foreground">
                No price data available for this selection
              </p>
            </div>
          ) : (
            <div className="h-[300px] md:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="displayDate" 
                    tick={{ fontSize: 12 }} 
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis 
                    tickFormatter={(value) => formatPrice(value)}
                    tick={{ fontSize: 12 }}
                    stroke="hsl(var(--muted-foreground))"
                    width={80}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [formatPrice(value), "Average Price"]}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="avgPrice"
                    name="Average Price"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Stats */}
      {chartData.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-sm text-muted-foreground mb-1">Current Avg</p>
              <p className="text-xl font-bold text-primary">
                {formatPrice(chartData[chartData.length - 1]?.avgPrice || 0)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-sm text-muted-foreground mb-1">Lowest</p>
              <p className="text-xl font-bold text-success">
                {formatPrice(Math.min(...chartData.map(d => d.minPrice)))}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-sm text-muted-foreground mb-1">Highest</p>
              <p className="text-xl font-bold text-destructive">
                {formatPrice(Math.max(...chartData.map(d => d.maxPrice)))}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-sm text-muted-foreground mb-1">Data Points</p>
              <p className="text-xl font-bold">
                {chartData.reduce((acc, d) => acc + d.count, 0)}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
