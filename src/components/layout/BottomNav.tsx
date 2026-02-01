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

export function BottomNav() {
  const location = useLocation();
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-lg safe-bottom md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to;
          return (
            <RouterNavLink
              key={to}
              to={to}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "scale-110")} />
              <span className="text-[10px] font-medium">{label}</span>
            </RouterNavLink>
          );
        })}
      </div>
    </nav>
  );
}
