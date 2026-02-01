import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useItems } from "@/hooks/useItems";
import { Skeleton } from "@/components/ui/skeleton";

interface ItemSelectorProps {
  value?: string;
  onChange: (itemId: string) => void;
  categoryId?: string;
  label?: string;
  required?: boolean;
}

export function ItemSelector({
  value,
  onChange,
  categoryId,
  label = "Item",
  required = false,
}: ItemSelectorProps) {
  const { data: items, isLoading } = useItems(categoryId);
  
  if (isLoading) {
    return (
      <div className="space-y-1.5">
        {label && (
          <Label className="text-sm font-medium">
            {label} {required && <span className="text-destructive">*</span>}
          </Label>
        )}
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }
  
  return (
    <div className="space-y-1.5">
      {label && (
        <Label className="text-sm font-medium">
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select item" />
        </SelectTrigger>
        <SelectContent>
          {items?.map((item) => (
            <SelectItem key={item.id} value={item.id}>
              {item.name} {item.unit && `(${item.unit})`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
