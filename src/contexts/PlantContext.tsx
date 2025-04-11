
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Plant } from '@/types';
import { useAuth } from './AuthContext';
import { toast } from "sonner";
import { ObjectId } from 'mongodb';
import { connectToMongoDB } from "@/integrations/mongodb/client";
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
const SAMPLE_PLANTS: Omit<Plant, 'id'>[] = [
  {
    name: 'Snake Plant',
    species: 'Sansevieria trifasciata',
    lastWatered: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    waterFrequency: 14,
    image: 'https://images.unsplash.com/photo-1620127682229-33388276e540?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    location: 'Living Room',
  },
  {
    name: 'Monstera',
    species: 'Monstera deliciosa',
    lastWatered: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    waterFrequency: 7,
    image: 'https://images.unsplash.com/photo-1637967886160-fd0748161c13?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    location: 'Bedroom',
    notes: 'Likes bright, indirect light'
  },
  {
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

  // Load plants from MongoDB on mount and when auth changes
  useEffect(() => {
    const loadPlants = async () => {
      if (!auth.isAuthenticated || !auth.user) {
        setPlants([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      
      try {
        const db = await connectToMongoDB();
        const plantsCollection = db.collection('plants');
        
        // Fetch plants for the current user
        const cursor = plantsCollection.find({ userId: auth.user.id });
        const userPlants = await cursor.toArray();
        
        if (userPlants && userPlants.length > 0) {
          // Map database fields to our Plant type
          const mappedPlants = userPlants.map(plant => ({
            id: plant._id.toString(),
            name: plant.name,
            species: plant.species,
            lastWatered: plant.lastWatered,
            waterFrequency: plant.waterFrequency,
            image: plant.image || undefined,
            notes: plant.notes || undefined,
            location: plant.location || undefined,
          }));
          
          setPlants(mappedPlants);
        } else {
          // First login, add sample plants
          await addSamplePlants(auth.user.id);
          
          // After adding sample plants, fetch them again
          const newCursor = plantsCollection.find({ userId: auth.user.id });
          const newUserPlants = await newCursor.toArray();
          
          const mappedSamplePlants = newUserPlants.map(plant => ({
            id: plant._id.toString(),
            name: plant.name,
            species: plant.species,
            lastWatered: plant.lastWatered,
            waterFrequency: plant.waterFrequency,
            image: plant.image || undefined,
            notes: plant.notes || undefined,
            location: plant.location || undefined,
          }));
          
          setPlants(mappedSamplePlants);
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
      const db = await connectToMongoDB();
      const plantsCollection = db.collection('plants');
      
      const samplePlantsWithUserId = SAMPLE_PLANTS.map(plant => ({
        name: plant.name,
        species: plant.species,
        lastWatered: plant.lastWatered,
        waterFrequency: plant.waterFrequency,
        image: plant.image,
        notes: plant.notes,
        location: plant.location,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      await plantsCollection.insertMany(samplePlantsWithUserId);
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
      const db = await connectToMongoDB();
      const plantsCollection = db.collection('plants');
      
      // Insert into MongoDB
      const result = await plantsCollection.insertOne({
        name: plantData.name,
        species: plantData.species,
        waterFrequency: plantData.waterFrequency,
        lastWatered: plantData.lastWatered,
        image: plantData.image,
        notes: plantData.notes,
        location: plantData.location,
        userId: auth.user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      if (!result.acknowledged) {
        throw new Error('Failed to add plant');
      }
      
      // Get the inserted document
      const insertedPlant = await plantsCollection.findOne({ _id: result.insertedId });
      
      if (!insertedPlant) {
        throw new Error('Could not find inserted plant');
      }
      
      // Map database response to Plant type
      const newPlant: Plant = {
        id: insertedPlant._id.toString(),
        name: insertedPlant.name,
        species: insertedPlant.species,
        lastWatered: insertedPlant.lastWatered,
        waterFrequency: insertedPlant.waterFrequency,
        image: insertedPlant.image || undefined,
        notes: insertedPlant.notes || undefined,
        location: insertedPlant.location || undefined,
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
      const db = await connectToMongoDB();
      const plantsCollection = db.collection('plants');
      
      // Prepare the update data
      const updateData: any = {
        updatedAt: new Date()
      };
      
      if (plantData.name) updateData.name = plantData.name;
      if (plantData.species) updateData.species = plantData.species;
      if (plantData.waterFrequency) updateData.waterFrequency = plantData.waterFrequency;
      if (plantData.lastWatered) updateData.lastWatered = plantData.lastWatered;
      if ('image' in plantData) updateData.image = plantData.image;
      if ('notes' in plantData) updateData.notes = plantData.notes;
      if ('location' in plantData) updateData.location = plantData.location;
      
      // Update in MongoDB
      const result = await plantsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );
      
      if (!result.acknowledged) {
        throw new Error('Failed to update plant');
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
      const db = await connectToMongoDB();
      const plantsCollection = db.collection('plants');
      
      // Delete from MongoDB
      const result = await plantsCollection.deleteOne({ _id: new ObjectId(id) });
      
      if (!result.acknowledged || result.deletedCount === 0) {
        throw new Error('Failed to delete plant');
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
      const db = await connectToMongoDB();
      const plantsCollection = db.collection('plants');
      
      // Update in MongoDB
      const result = await plantsCollection.updateOne(
        { _id: new ObjectId(id) },
        { 
          $set: { 
            lastWatered: today,
            updatedAt: new Date()
          } 
        }
      );
      
      if (!result.acknowledged) {
        throw new Error('Failed to update plant');
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
