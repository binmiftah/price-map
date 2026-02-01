import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useCategories } from "@/hooks/useCategories";
import { Skeleton } from "@/components/ui/skeleton";
import { getCategoryIcon } from "@/lib/format";

interface CategoryFilterProps {
  value?: string;
  onChange: (categoryId: string | undefined) => void;
  label?: string;
  showAll?: boolean;
}

export function CategoryFilter({
  value,
  onChange,
  label = "Category",
  showAll = true,
}: CategoryFilterProps) {
  const { data: categories, isLoading } = useCategories();
  
  const handleChange = (val: string) => {
    onChange(val === "all" ? undefined : val);
  };
  
  if (isLoading) {
    return (
      <div className="space-y-1.5">
        {label && <Label className="text-xs text-muted-foreground">{label}</Label>}
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }
  
  return (
    <div className="space-y-1.5">
      {label && <Label className="text-xs text-muted-foreground">{label}</Label>}
      <Select value={value || "all"} onValueChange={handleChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          {showAll && (
            <SelectItem value="all">
              <span className="flex items-center gap-2">
                <span>📋</span>
                All Categories
              </span>
            </SelectItem>
          )}
          {categories?.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              <span className="flex items-center gap-2">
                <span>{getCategoryIcon(category.icon)}</span>
                {category.name}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
