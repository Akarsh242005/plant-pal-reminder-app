
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Plant } from "@/types";
import { usePlants } from "@/contexts/PlantContext";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const plantFormSchema = z.object({
  name: z.string().min(1, { message: "Plant name is required" }),
  species: z.string().min(1, { message: "Species name is required" }),
  waterFrequency: z.coerce.number().int().min(1, { message: "Water frequency must be at least 1 day" }),
  location: z.string().optional(),
  image: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  notes: z.string().optional(),
});

type PlantFormValues = z.infer<typeof plantFormSchema>;

interface PlantFormProps {
  plant?: Plant;
  mode: "add" | "edit";
}

const PlantForm = ({ plant, mode }: PlantFormProps) => {
  const { addPlant, updatePlant } = usePlants();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PlantFormValues>({
    resolver: zodResolver(plantFormSchema),
    defaultValues: {
      name: plant?.name || "",
      species: plant?.species || "",
      waterFrequency: plant?.waterFrequency || 7,
      location: plant?.location || "",
      image: plant?.image || "",
      notes: plant?.notes || "",
    },
  });

  const onSubmit = async (values: PlantFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (mode === "add") {
        addPlant({
          ...values,
          lastWatered: new Date().toISOString(),
        });
      } else if (mode === "edit" && plant) {
        updatePlant(plant.id, values);
      }
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Error submitting plant form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plant Name</FormLabel>
                <FormControl>
                  <Input placeholder="Snake Plant" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="species"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Species</FormLabel>
                <FormControl>
                  <Input placeholder="Sansevieria trifasciata" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="waterFrequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Water Frequency (days)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="1" 
                    placeholder="7" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Living Room" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL (optional)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://example.com/plant-image.jpg" 
                  {...field} 
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Care instructions, preferences, etc." 
                  className="min-h-[100px]"
                  {...field} 
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex gap-4 justify-end">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate("/dashboard")}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === "add" ? "Adding..." : "Updating..."}
              </>
            ) : (
              mode === "add" ? "Add Plant" : "Update Plant"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PlantForm;
