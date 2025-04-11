
import PlantCard from "./PlantCard";
import { usePlants } from "@/contexts/PlantContext";
import { Loader2, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PlantCollection = () => {
  const { plants, isLoading } = usePlants();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 text-plantpal-primary animate-spin" />
      </div>
    );
  }

  if (plants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-gray-200 rounded-lg">
        <Leaf className="h-12 w-12 text-muted mb-4" />
        <h3 className="text-xl font-medium text-center mb-2">No plants yet</h3>
        <p className="text-muted-foreground text-center mb-6">
          Start building your plant collection by adding your first plant.
        </p>
        <Link to="/add-plant">
          <Button>Add Your First Plant</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {plants.map((plant) => (
        <PlantCard key={plant.id} plant={plant} />
      ))}
    </div>
  );
};

export default PlantCollection;
