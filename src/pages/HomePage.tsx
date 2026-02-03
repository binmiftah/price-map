import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Plus, TrendingUp, MapPin, ShieldCheck, Users, Flame, ArrowRight, Sparkles } from "lucide-react";
import { PriceList } from "@/components/prices";
import { mockPrices, mockStats, hotItems, mockCategories } from "@/data/mockData";
import { getCategoryIcon, formatPrice } from "@/lib/format";

export default function HomePage() {
  // Use mock data for now
  const recentPrices = mockPrices.slice(0, 6);
  const featuredPrices = mockPrices.slice(0, 3);
  
  return (
    <div className="space-y-12 pb-8">
      {/* Hero Section - Asymmetric, bold design */}
      <section className="relative overflow-hidden -mx-4 px-4 pt-8 pb-12 md:pt-12 md:pb-16">
        {/* Background decorations */}
        <div className="absolute inset-0 dot-pattern opacity-40" />
        <div className="absolute top-20 right-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/30 rounded-full blur-3xl -translate-x-1/2" />
        
        <div className="relative max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-card border border-border px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-success animate-pulse" />
            <span className="text-muted-foreground">Live prices from</span>
            <span className="font-bold text-foreground">{mockStats.totalLocations} locations</span>
          </div>
          
          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-display tracking-tight mb-6">
            <span className="block text-foreground">Know the</span>
            <span className="relative inline-block">
              <span className="relative z-10 text-primary">Real Price</span>
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-highlight/50" viewBox="0 0 200 12" preserveAspectRatio="none">
                <path d="M0,8 Q50,0 100,8 T200,8" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
              </svg>
            </span>
            <span className="block text-foreground">Before You Pay</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8 leading-relaxed">
            Nigeria's crowd-sourced price checker. Stop overpaying — check what others are paying for goods and services in your area.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="group rounded-xl h-14 px-8 text-base font-semibold shadow-glow hover:shadow-glow-lg transition-all">
              <Link to="/browse">
                <Search className="h-5 w-5 mr-2" />
                Browse Prices
                <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-xl h-14 px-8 text-base font-semibold border-2 hover:bg-accent">
              <Link to="/submit">
                <Plus className="h-5 w-5 mr-2" />
                Submit a Price
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Live Stats Bar */}
      <section className="-mx-4 px-4">
        <div className="bg-card border border-border rounded-2xl p-4 md:p-6 overflow-x-auto">
          <div className="flex items-center justify-between gap-8 min-w-max">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary font-display">{(mockStats.totalPrices / 1000).toFixed(1)}k</span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Prices Tracked</p>
                <p className="font-semibold">Live Database</p>
              </div>
            </div>
            
            <div className="h-10 w-px bg-border" />
            
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Contributors</p>
                <p className="font-semibold">{mockStats.totalContributors.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="h-10 w-px bg-border" />
            
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-highlight/10 flex items-center justify-center">
                <Flame className="h-6 w-6 text-highlight" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">This Week</p>
                <p className="font-semibold">+{mockStats.pricesThisWeek} new</p>
              </div>
            </div>
            
            <div className="h-10 w-px bg-border" />
            
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-info/10 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-info" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Accuracy Rate</p>
                <p className="font-semibold">{mockStats.accuracyRate}%</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Hot Searches + Categories Row */}
      <section className="grid md:grid-cols-5 gap-6">
        {/* Hot Searches */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-highlight" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Trending Searches</h2>
          </div>
          
          <div className="space-y-2">
            {hotItems.map((item, i) => (
              <Link
                key={item.name}
                to={`/browse?search=${item.name}`}
                className="flex items-center justify-between p-3 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-muted-foreground/50 font-mono w-6">{String(i + 1).padStart(2, '0')}</span>
                  <span className="font-medium group-hover:text-primary transition-colors">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    item.trend.startsWith('+') ? 'bg-destructive/10 text-destructive' : 'bg-success/10 text-success'
                  }`}>
                    {item.trend}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Categories */}
        <div className="md:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Categories</h2>
            <Button asChild variant="ghost" size="sm" className="text-primary">
              <Link to="/browse">View All</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {mockCategories.map((category) => (
              <Link 
                key={category.id} 
                to={`/browse?category=${category.id}`}
                className="group relative overflow-hidden"
              >
                <Card className="h-full hover:border-primary/30 hover:shadow-md transition-all">
                  <CardContent className="p-4 flex items-center gap-3">
                    <span className="text-2xl">{getCategoryIcon(category.icon)}</span>
                    <span className="font-medium text-sm group-hover:text-primary transition-colors">{category.name}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Prices */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 bg-primary rounded-full" />
            <div>
              <h2 className="text-xl font-bold font-display">Featured Prices</h2>
              <p className="text-sm text-muted-foreground">Most searched items this week</p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm" className="rounded-xl">
            <Link to="/browse">
              See All
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
        
        <PriceList 
          prices={featuredPrices} 
          variant="featured"
          emptyMessage="No prices yet. Be the first to submit!"
        />
      </section>
      
      {/* Recent Updates Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 bg-success rounded-full" />
            <div>
              <h2 className="text-xl font-bold font-display">Recently Updated</h2>
              <p className="text-sm text-muted-foreground">Latest price reports from the community</p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm" className="rounded-xl">
            <Link to="/browse">
              Browse All
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
        
        <PriceList 
          prices={recentPrices} 
          emptyMessage="No prices yet. Be the first to submit!"
        />
      </section>
      
      {/* CTA Section */}
      <section className="relative overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent-foreground" />
        <div className="absolute inset-0 dot-pattern opacity-10" />
        
        <div className="relative px-6 py-12 md:px-12 md:py-16 text-center text-primary-foreground">
          <Sparkles className="h-10 w-10 mx-auto mb-4 opacity-80" />
          <h2 className="text-2xl md:text-3xl font-bold font-display mb-4">
            Help Build Price Transparency
          </h2>
          <p className="text-primary-foreground/80 max-w-lg mx-auto mb-8">
            Every price you submit helps someone avoid being overcharged. 
            It only takes 30 seconds and you're making a difference!
          </p>
          <Button asChild size="lg" variant="secondary" className="rounded-xl h-14 px-10 text-base font-semibold shadow-lg">
            <Link to="/submit">
              Submit a Price Now
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
