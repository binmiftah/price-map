import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { LocationSelector } from "@/components/filters/LocationSelector";
import { CategoryFilter } from "@/components/filters/CategoryFilter";
import { ItemSelector } from "@/components/filters/ItemSelector";
import { useSubmitPrice } from "@/hooks/usePrices";
import { Check, Loader2 } from "lucide-react";

const priceSchema = z.object({
  item_id: z.string().min(1, "Please select an item"),
  location_id: z.string().min(1, "Please select a location"),
  price: z
    .number({ required_error: "Please enter a price", invalid_type_error: "Please enter a valid number" })
    .positive("Price must be greater than 0")
    .max(100000000, "Price seems unrealistically high"),
});

type PriceFormData = z.infer<typeof priceSchema>;

export default function SubmitPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [locationId, setLocationId] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState(false);
  
  const submitPrice = useSubmitPrice();
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<PriceFormData>({
    resolver: zodResolver(priceSchema),
  });
  
  const itemId = watch("item_id");
  
  const onSubmit = async (data: PriceFormData) => {
    try {
      await submitPrice.mutateAsync({
        item_id: data.item_id,
        location_id: data.location_id,
        price: data.price,
      });
      
      setIsSuccess(true);
      toast({
        title: "Price submitted!",
        description: "Thank you for contributing to price transparency.",
      });
      
      // Reset after 2 seconds
      setTimeout(() => {
        setIsSuccess(false);
        reset();
        setCategoryId(undefined);
        setLocationId("");
      }, 2000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit price. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleLocationChange = (id: string) => {
    setLocationId(id);
    setValue("location_id", id);
  };
  
  const handleItemChange = (id: string) => {
    setValue("item_id", id);
  };
  
  if (isSuccess) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center py-16 text-center">
        <div className="h-20 w-20 rounded-full bg-success/10 flex items-center justify-center mb-6">
          <Check className="h-10 w-10 text-success" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Price Submitted!</h1>
        <p className="text-muted-foreground mb-6">
          Thank you for helping build price transparency in Nigeria.
        </p>
        <div className="flex gap-3">
          <Button onClick={() => setIsSuccess(false)}>
            Submit Another
          </Button>
          <Button variant="outline" onClick={() => navigate("/browse")}>
            Browse Prices
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="animate-fade-in max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Submit a Price</h1>
        <p className="text-muted-foreground">
          Help others avoid overpaying by sharing prices you've seen
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Price Information</CardTitle>
          <CardDescription>
            All fields are required. Your submission is anonymous.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Category (for filtering items) */}
            <CategoryFilter
              value={categoryId}
              onChange={setCategoryId}
              label="Category"
              showAll={false}
            />
            
            {/* Item */}
            <div className="space-y-1.5">
              <ItemSelector
                value={itemId}
                onChange={handleItemChange}
                categoryId={categoryId}
                label="Item"
                required
              />
              {errors.item_id && (
                <p className="text-sm text-destructive">{errors.item_id.message}</p>
              )}
            </div>
            
            {/* Location */}
            <div className="space-y-1.5">
              <LocationSelector
                value={locationId}
                onChange={handleLocationChange}
                label="Location"
                required
              />
              {errors.location_id && (
                <p className="text-sm text-destructive">{errors.location_id.message}</p>
              )}
            </div>
            
            {/* Price */}
            <div className="space-y-1.5">
              <Label htmlFor="price">
                Price (₦) <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  ₦
                </span>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="pl-8"
                  {...register("price", { valueAsNumber: true })}
                />
              </div>
              {errors.price && (
                <p className="text-sm text-destructive">{errors.price.message}</p>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={submitPrice.isPending}
            >
              {submitPrice.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Price"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Card className="bg-accent border-accent">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-2">💡 Tips for Accurate Submissions</h3>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Submit prices you've actually seen or paid</li>
            <li>Be as specific as possible with the location</li>
            <li>Include the most recent price if it has changed</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
