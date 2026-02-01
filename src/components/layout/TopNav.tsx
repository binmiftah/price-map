import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { Home, Search, Plus, TrendingUp, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/browse", icon: Search, label: "Browse" },
  { to: "/submit", icon: Plus, label: "Submit" },
  { to: "/trends", icon: TrendingUp, label: "Trends" },
  { to: "/about", icon: Info, label: "About" },
];

export function TopNav() {
  const location = useLocation();
  
  return (
    <header className="sticky top-0 z-50 hidden border-b border-border bg-card/95 backdrop-blur-lg md:block">
      <div className="container flex h-16 items-center justify-between">
        <RouterNavLink to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-lg font-bold">₦</span>
          </div>
          <span className="text-lg font-semibold">Local Price Checker</span>
        </RouterNavLink>
        
        <nav className="flex items-center gap-1">
          {navItems.map(({ to, icon: Icon, label }) => {
            const isActive = location.pathname === to;
            return (
              <RouterNavLink
                key={to}
                to={to}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </RouterNavLink>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
