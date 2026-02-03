import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { Home, Search, Plus, TrendingUp, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/browse", icon: Search, label: "Browse" },
  { to: "/submit", icon: Plus, label: "Submit", special: true },
  { to: "/trends", icon: TrendingUp, label: "Trends" },
  { to: "/about", icon: Info, label: "About" },
];

export function BottomNav() {
  const location = useLocation();
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-card/90 backdrop-blur-xl border-t border-border/50" />
      <div className="relative flex items-end justify-around px-2 pt-2 pb-2 safe-bottom">
        {navItems.map(({ to, icon: Icon, label, special }) => {
          const isActive = location.pathname === to;
          
          if (special) {
            return (
              <RouterNavLink
                key={to}
                to={to}
                className="flex flex-col items-center -mt-5"
              >
                <div className={cn(
                  "flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg transition-all",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-glow scale-105" 
                    : "bg-primary/90 text-primary-foreground hover:bg-primary"
                )}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className={cn(
                  "text-[10px] font-medium mt-1",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}>
                  {label}
                </span>
              </RouterNavLink>
            );
          }
          
          return (
            <RouterNavLink
              key={to}
              to={to}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-xl transition-all",
                isActive && "bg-primary/10"
              )}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-medium">{label}</span>
            </RouterNavLink>
          );
        })}
      </div>
    </nav>
  );
}
