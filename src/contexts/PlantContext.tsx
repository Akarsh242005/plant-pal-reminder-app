
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Plant } from '@/types';
import { useAuth } from './AuthContext';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

interface PlantContextType {
  plants: Plant[];
  addPlant: (plant: Omit<Plant, 'id'>) => void;
  updatePlant: (id: string, plant: Partial<Plant>) => void;
  deletePlant: (id: string) => void;
  markWatered: (id: string) => void;
  isLoading: boolean;
}

const PlantContext = createContext<PlantContextType | undefined>(undefined);

// Sample plant data for first-time users
const SAMPLE_PLANTS: Plant[] = [
  {
    id: '1',
    name: 'Snake Plant',
    species: 'Sansevieria trifasciata',
    lastWatered: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    waterFrequency: 14,
    image: 'https://images.unsplash.com/photo-1620127682229-33388276e540?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    location: 'Living Room',
  },
  {
    id: '2',
    name: 'Monstera',
    species: 'Monstera deliciosa',
    lastWatered: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    waterFrequency: 7,
    image: 'https://images.unsplash.com/photo-1637967886160-fd0748161c13?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    location: 'Bedroom',
    notes: 'Likes bright, indirect light'
  },
  {
    id: '3',
    name: 'Fiddle Leaf Fig',
    species: 'Ficus lyrata',
    lastWatered: new Date().toISOString(),
    waterFrequency: 10,
    image: 'https://images.unsplash.com/photo-1625604087024-7fb198116190?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    location: 'Office',
    notes: 'Sensitive to overwatering'
  }
];

export const PlantProvider = ({ children }: { children: ReactNode }) => {
  const { auth } = useAuth();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load plants from Supabase on mount and when auth changes
  useEffect(() => {
    const loadPlants = async () => {
      if (!auth.isAuthenticated || !auth.user) {
        setPlants([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      
      try {
        // Fetch plants from Supabase
        const { data, error } = await supabase
          .from('plants')
          .select('*')
          .eq('user_id', auth.user.id);
        
        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          // Map database fields to our Plant type
          const mappedPlants = data.map(plant => ({
            id: plant.id,
            name: plant.name,
            species: plant.species,
            lastWatered: plant.last_watered,
            waterFrequency: plant.water_frequency,
            image: plant.image || undefined,
            notes: plant.notes || undefined,
            location: plant.location || undefined,
          }));
          
          setPlants(mappedPlants);
        } else {
          // First login, use sample data
          await addSamplePlants(auth.user.id);
          setPlants(SAMPLE_PLANTS);
        }
      } catch (error) {
        console.error('Failed to load plants', error);
        toast.error("Failed to load plants. Please try again later.");
        setPlants([]);
      }
      
      setIsLoading(false);
    };

    loadPlants();
  }, [auth.isAuthenticated, auth.user]);

  // Helper function to add sample plants on first login
  const addSamplePlants = async (userId: string) => {
    try {
      const samplePlantsWithUserId = SAMPLE_PLANTS.map(plant => ({
        name: plant.name,
        species: plant.species,
        last_watered: plant.lastWatered,
        water_frequency: plant.waterFrequency,
        image: plant.image,
        notes: plant.notes,
        location: plant.location,
        user_id: userId,
      }));

      const { error } = await supabase
        .from('plants')
        .insert(samplePlantsWithUserId);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error adding sample plants:', error);
    }
  };

  const addPlant = async (plantData: Omit<Plant, 'id'>) => {
    if (!auth.user) {
      toast.error("You must be logged in to add plants");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Insert into Supabase
      const { data, error } = await supabase
        .from('plants')
        .insert({
          name: plantData.name,
          species: plantData.species,
          water_frequency: plantData.waterFrequency,
          last_watered: plantData.lastWatered,
          image: plantData.image,
          notes: plantData.notes,
          location: plantData.location,
          user_id: auth.user.id,
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Map database response to Plant type
      const newPlant: Plant = {
        id: data.id,
        name: data.name,
        species: data.species,
        lastWatered: data.last_watered,
        waterFrequency: data.water_frequency,
        image: data.image || undefined,
        notes: data.notes || undefined,
        location: data.location || undefined,
      };
      
      // Update local state
      setPlants((prevPlants) => [...prevPlants, newPlant]);
      toast.success(`${newPlant.name} has been added to your garden!`);
    } catch (error) {
      console.error('Failed to add plant:', error);
      toast.error("Failed to add plant. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const updatePlant = async (id: string, plantData: Partial<Plant>) => {
    setIsLoading(true);
    
    try {
      // Prepare the update data
      const updateData: any = {};
      if (plantData.name) updateData.name = plantData.name;
      if (plantData.species) updateData.species = plantData.species;
      if (plantData.waterFrequency) updateData.water_frequency = plantData.waterFrequency;
      if (plantData.lastWatered) updateData.last_watered = plantData.lastWatered;
      if ('image' in plantData) updateData.image = plantData.image;
      if ('notes' in plantData) updateData.notes = plantData.notes;
      if ('location' in plantData) updateData.location = plantData.location;
      updateData.updated_at = new Date().toISOString();
      
      // Update in Supabase
      const { error } = await supabase
        .from('plants')
        .update(updateData)
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setPlants((prevPlants) => 
        prevPlants.map((plant) => 
          plant.id === id ? { ...plant, ...plantData } : plant
        )
      );
      
      toast.success("Plant updated successfully");
    } catch (error) {
      console.error('Failed to update plant:', error);
      toast.error("Failed to update plant. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const deletePlant = async (id: string) => {
    const plantName = plants.find(p => p.id === id)?.name;
    
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('plants')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setPlants((prevPlants) => prevPlants.filter((plant) => plant.id !== id));
      toast.success(`${plantName || 'Plant'} has been removed`);
    } catch (error) {
      console.error('Failed to delete plant:', error);
      toast.error("Failed to delete plant. Please try again.");
    }
  };

  const markWatered = async (id: string) => {
    const today = new Date().toISOString();
    
    try {
      // Update in Supabase
      const { error } = await supabase
        .from('plants')
        .update({ last_watered: today, updated_at: today })
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setPlants((prevPlants) => 
        prevPlants.map((plant) => 
          plant.id === id ? { ...plant, lastWatered: today } : plant
        )
      );
      
      const plantName = plants.find(p => p.id === id)?.name;
      toast.success(`${plantName || 'Plant'} has been watered!`, {
        icon: "💦",
      });
    } catch (error) {
      console.error('Failed to mark plant as watered:', error);
      toast.error("Failed to update watering status. Please try again.");
    }
  };

  return (
    <PlantContext.Provider value={{ plants, addPlant, updatePlant, deletePlant, markWatered, isLoading }}>
      {children}
    </PlantContext.Provider>
  );
};

export const usePlants = () => {
  const context = useContext(PlantContext);
  if (context === undefined) {
    throw new Error('usePlants must be used within a PlantProvider');
  }
  return context;
};
