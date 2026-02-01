export function formatPrice(price: number, currency = "₦"): string {
  return `${currency}${price.toLocaleString("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

export function formatPriceRange(min: number, max: number, currency = "₦"): string {
  if (min === max) {
    return formatPrice(min, currency);
  }
  return `${formatPrice(min, currency)} - ${formatPrice(max, currency)}`;
}

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return formatDate(d);
}

export function getCategoryIcon(icon: string | null): string {
  const iconMap: Record<string, string> = {
    utensils: "🍽️",
    hammer: "🔨",
    smartphone: "📱",
    car: "🚗",
    wrench: "🔧",
  };
  
  return icon ? iconMap[icon] || "📦" : "📦";
}
