import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, TrendingUp, MapPin, ShieldCheck, Users } from "lucide-react";
import { PriceList } from "@/components/prices";
import { useRecentPrices } from "@/hooks/usePrices";
import { useCategories } from "@/hooks/useCategories";
import { getCategoryIcon } from "@/lib/format";

const features = [
  {
    icon: MapPin,
    title: "Location-Based",
    description: "Find prices specific to your area",
  },
  {
    icon: Users,
    title: "Crowd-Sourced",
    description: "Real prices from real people",
  },
  {
    icon: ShieldCheck,
    title: "Verified Data",
    description: "Outliers are automatically flagged",
  },
  {
    icon: TrendingUp,
    title: "Price Trends",
    description: "Track how prices change over time",
  },
];

export default function HomePage() {
  const { data: recentPrices, isLoading: loadingPrices } = useRecentPrices(6);
  const { data: categories } = useCategories();
  
  return (
    <div className="animate-fade-in space-y-8">
      {/* Hero Section */}
      <section className="text-center py-8 md:py-12">
        <div className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-1.5 rounded-full text-sm font-medium mb-4">
          <span>🇳🇬</span>
          <span>Nigeria's Price Transparency Platform</span>
        </div>
        
        <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 text-balance">
          Know the <span className="text-primary">Real Price</span> Before You Pay
        </h1>
        
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Stop overpaying! Check average prices for goods and services in your area, 
          and help others by sharing the prices you find.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg" className="gap-2">
            <Link to="/browse">
              <Search className="h-5 w-5" />
              Browse Prices
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="gap-2">
            <Link to="/submit">
              <Plus className="h-5 w-5" />
              Submit a Price
            </Link>
          </Button>
        </div>
      </section>
      
      {/* Features */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {features.map((feature) => (
          <Card key={feature.title} className="text-center">
            <CardContent className="pt-6">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-accent text-accent-foreground mb-3">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
              <p className="text-xs text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>
      
      {/* Categories */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Browse by Category</h2>
          <Button asChild variant="ghost" size="sm">
            <Link to="/browse">View All</Link>
          </Button>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {categories?.map((category) => (
            <Link key={category.id} to={`/browse?category=${category.id}`}>
              <Badge 
                variant="secondary" 
                className="flex items-center gap-2 px-4 py-2 text-sm whitespace-nowrap hover:bg-accent cursor-pointer transition-colors"
              >
                <span className="text-lg">{getCategoryIcon(category.icon)}</span>
                {category.name}
              </Badge>
            </Link>
          ))}
        </div>
      </section>
      
      {/* Recent Prices */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recently Updated Prices</h2>
          <Button asChild variant="ghost" size="sm">
            <Link to="/browse">See More</Link>
          </Button>
        </div>
        
        <PriceList 
          prices={recentPrices || []} 
          isLoading={loadingPrices}
          emptyMessage="No prices yet. Be the first to submit!"
        />
      </section>
      
      {/* CTA */}
      <section className="text-center py-8 bg-accent rounded-2xl px-6">
        <h2 className="text-2xl font-bold mb-3">Help Build Price Transparency</h2>
        <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
          Every price you submit helps someone avoid being overcharged. 
          It only takes 30 seconds!
        </p>
        <Button asChild size="lg">
          <Link to="/submit">Submit a Price Now</Link>
        </Button>
      </section>
    </div>
  );
}
