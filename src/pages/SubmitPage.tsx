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
import { Check, Loader2, Sparkles, Lightbulb, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

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
      
      setTimeout(() => {
        setIsSuccess(false);
        reset();
        setCategoryId(undefined);
        setLocationId("");
      }, 3000);
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
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="relative mb-8">
          <div className="h-24 w-24 rounded-3xl bg-success/10 flex items-center justify-center animate-fade-in">
            <Check className="h-12 w-12 text-success" />
          </div>
          <Sparkles className="absolute -top-2 -right-2 h-8 w-8 text-highlight animate-pulse" />
        </div>
        
        <h1 className="text-3xl font-bold font-display mb-3 animate-fade-in">
          Price Submitted!
        </h1>
        <p className="text-muted-foreground mb-8 max-w-sm animate-fade-in">
          Thank you for helping build price transparency in Nigeria. Every contribution matters!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 animate-fade-in">
          <Button onClick={() => setIsSuccess(false)} className="rounded-xl h-12 px-6">
            Submit Another
          </Button>
          <Button variant="outline" onClick={() => navigate("/browse")} className="rounded-xl h-12 px-6">
            Browse Prices
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-bold font-display tracking-tight">
          Submit a Price
        </h1>
        <p className="text-muted-foreground mt-2">
          Help others avoid overpaying by sharing prices you've seen
        </p>
      </div>
      
      {/* Form Card */}
      <Card className="overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-primary via-primary/50 to-transparent" />
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-display">Price Information</CardTitle>
          <CardDescription>
            All fields are required. Your submission is anonymous.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Step indicators */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <span className="flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground font-bold">1</span>
              <span>Category & Item</span>
              <ArrowRight className="h-3 w-3" />
              <span className="flex items-center justify-center h-5 w-5 rounded-full bg-muted font-bold">2</span>
              <span>Location</span>
              <ArrowRight className="h-3 w-3" />
              <span className="flex items-center justify-center h-5 w-5 rounded-full bg-muted font-bold">3</span>
              <span>Price</span>
            </div>
            
            {/* Category (for filtering items) */}
            <div className="space-y-1.5">
              <CategoryFilter
                value={categoryId}
                onChange={setCategoryId}
                label="Category"
                showAll={false}
              />
            </div>
            
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
              <Label htmlFor="price" className="flex items-center gap-1">
                Price (₦) <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-muted-foreground">
                  ₦
                </span>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="pl-10 h-14 text-lg font-mono rounded-xl border-2"
                  {...register("price", { valueAsNumber: true })}
                />
              </div>
              {errors.price && (
                <p className="text-sm text-destructive">{errors.price.message}</p>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-14 text-base font-semibold rounded-xl shadow-glow hover:shadow-glow-lg transition-all" 
              size="lg"
              disabled={submitPrice.isPending}
            >
              {submitPrice.isPending ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Price
                  <ArrowRight className="h-5 w-5 ml-2" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {/* Tips Card */}
      <Card className="bg-accent/50 border-accent">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-highlight/20 flex items-center justify-center flex-shrink-0">
              <Lightbulb className="h-5 w-5 text-highlight-foreground" />
            </div>
            <div>
              <h3 className="font-semibold font-display mb-2">Tips for Accurate Submissions</h3>
              <ul className="text-sm text-muted-foreground space-y-1.5">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  Submit prices you've actually seen or paid
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  Be as specific as possible with the location
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  Include the most recent price if it has changed
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
