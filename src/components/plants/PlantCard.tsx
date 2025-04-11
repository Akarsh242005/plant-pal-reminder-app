
import { Plant } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Droplet, Calendar, Edit, Trash2, MapPin } from "lucide-react";
import { usePlants } from "@/contexts/PlantContext";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

interface PlantCardProps {
  plant: Plant;
}

const PlantCard = ({ plant }: PlantCardProps) => {
  const { markWatered, deletePlant } = usePlants();
  const [daysLeft, setDaysLeft] = useState<number>(0);
  const [isOverdue, setIsOverdue] = useState<boolean>(false);

  useEffect(() => {
    // Calculate days since last watered
    const lastWateredDate = new Date(plant.lastWatered);
    const today = new Date();
    const diffTime = today.getTime() - lastWateredDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Calculate days left until next watering
    const daysUntilWatering = plant.waterFrequency - diffDays;
    setDaysLeft(daysUntilWatering);
    setIsOverdue(daysUntilWatering <= 0);
  }, [plant.lastWatered, plant.waterFrequency]);

  const handleWater = () => {
    markWatered(plant.id);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete ${plant.name}?`)) {
      deletePlant(plant.id);
    }
  };

  return (
    <Card className={`plant-card-shadow overflow-hidden ${isOverdue ? 'border-plantpal-accent' : ''}`}>
      {/* Plant image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={plant.image || "https://images.unsplash.com/photo-1604762524889-3e2fcc145683?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"} 
          alt={plant.name} 
          className="w-full h-full object-cover"
        />
        {isOverdue && (
          <div className="absolute top-3 right-3">
            <span className="bg-plantpal-accent text-white text-xs px-2 py-1 rounded-full">
              Needs water!
            </span>
          </div>
        )}
        {plant.location && (
          <div className="absolute bottom-3 left-3 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full flex items-center">
            <MapPin className="h-3 w-3 mr-1" />
            {plant.location}
          </div>
        )}
      </div>

      {/* Plant info */}
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{plant.name}</h3>
            <p className="text-sm text-muted-foreground italic">{plant.species}</p>
          </div>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon"
              asChild
              className="h-8 w-8"
            >
              <Link to={`/edit-plant/${plant.id}`}>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Link>
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleDelete}
              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Water every {plant.waterFrequency} days</span>
          </div>

          <div className={`flex items-center gap-1 ${isOverdue ? 'text-plantpal-accent font-medium' : 'text-muted-foreground'}`}>
            <Droplet className={`h-4 w-4 ${isOverdue ? 'text-plantpal-accent' : ''}`} />
            <span>
              {isOverdue 
                ? `Overdue by ${Math.abs(daysLeft)} day${Math.abs(daysLeft) !== 1 ? 's' : ''}` 
                : `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`}
            </span>
          </div>
        </div>

        {plant.notes && (
          <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
            {plant.notes}
          </p>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <Button 
          className="w-full flex items-center gap-2"
          onClick={handleWater}
        >
          <Droplet className="h-4 w-4" />
          Mark as Watered
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PlantCard;
