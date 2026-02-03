import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { Home, Search, Plus, TrendingUp, Info, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
const navItems = [{
  to: "/",
  icon: Home,
  label: "Home"
}, {
  to: "/browse",
  icon: Search,
  label: "Browse"
}, {
  to: "/submit",
  icon: Plus,
  label: "Submit"
}, {
  to: "/trends",
  icon: TrendingUp,
  label: "Trends"
}, {
  to: "/about",
  icon: Info,
  label: "About"
}];
export function TopNav() {
  const location = useLocation();
  return <header className="sticky top-0 z-50 hidden md:block">
      <div className="absolute inset-0 bg-card/70 backdrop-blur-xl border-b border-border/50" />
      <div className="container relative flex h-16 items-center justify-between">
        <RouterNavLink to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-glow transition-all group-hover:shadow-glow-lg group-hover:scale-105">
              <span className="text-xl font-bold font-display">₦</span>
            </div>
            <Sparkles className="absolute -top-1 -right-1 h-3.5 w-3.5 text-highlight animate-pulse-soft" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold font-display tracking-tight">PriceMap</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground -mt-0.5">Checker</span>
          </div>
        </RouterNavLink>
        
        <nav className="flex items-center gap-1 p-1 rounded-2xl bg-muted/50">
          {navItems.map(({
          to,
          icon: Icon,
          label
        }) => {
          const isActive = location.pathname === to;
          return <RouterNavLink key={to} to={to} className={cn("flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200", isActive ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-card/50")}>
                <Icon className={cn("h-4 w-4", isActive && "text-primary")} />
                {label}
              </RouterNavLink>;
        })}
        </nav>
      </div>
    </header>;
}