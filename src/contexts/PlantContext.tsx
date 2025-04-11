
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Plant } from '@/types';
import { useAuth } from './AuthContext';
import { toast } from "sonner";
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

// Sample plant data
const SAMPLE_PLANTS: Plant[] = [
  {
    id: '1',
    name: 'Snake Plant',
    species: 'Sansevieria trifasciata',
    lastWatered: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    waterFrequency: 14, // every 14 days
    image: 'https://images.unsplash.com/photo-1620127682229-33388276e540?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    location: 'Living Room',
  },
  {
    id: '2',
    name: 'Monstera',
    species: 'Monstera deliciosa',
    lastWatered: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    waterFrequency: 7, // every week
    image: 'https://images.unsplash.com/photo-1637967886160-fd0748161c13?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    location: 'Bedroom',
    notes: 'Likes bright, indirect light'
  },
  {
    id: '3',
    name: 'Fiddle Leaf Fig',
    species: 'Ficus lyrata',
    lastWatered: new Date().toISOString(), // today
    waterFrequency: 10, // every 10 days
    image: 'https://images.unsplash.com/photo-1625604087024-7fb198116190?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    location: 'Office',
    notes: 'Sensitive to overwatering'
  }
];

export const PlantProvider = ({ children }: { children: ReactNode }) => {
  const { auth } = useAuth();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load plants from localStorage on mount and when auth changes
  useEffect(() => {
    const loadPlants = () => {
      if (!auth.isAuthenticated) {
        setPlants([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      
      try {
        // Try to get plants from localStorage
        const storedPlantsKey = `plantpal_plants_${auth.user?.id}`;
        const storedPlants = localStorage.getItem(storedPlantsKey);
        
        if (storedPlants) {
          setPlants(JSON.parse(storedPlants));
        } else {
          // First login, use sample data
          setPlants(SAMPLE_PLANTS);
          localStorage.setItem(storedPlantsKey, JSON.stringify(SAMPLE_PLANTS));
        }
      } catch (error) {
        console.error('Failed to load plants', error);
        setPlants([]);
      }
      
      setIsLoading(false);
    };

    loadPlants();
  }, [auth.isAuthenticated, auth.user?.id]);

  // Save plants to localStorage whenever they change
  useEffect(() => {
    if (auth.isAuthenticated && auth.user) {
      localStorage.setItem(`plantpal_plants_${auth.user.id}`, JSON.stringify(plants));
    }
  }, [plants, auth.isAuthenticated, auth.user]);

  const addPlant = (plantData: Omit<Plant, 'id'>) => {
    const newPlant: Plant = {
      ...plantData,
      id: uuidv4(),
    };
    
    setPlants((prevPlants) => [...prevPlants, newPlant]);
    toast.success(`${newPlant.name} has been added to your garden!`);
  };

  const updatePlant = (id: string, plantData: Partial<Plant>) => {
    setPlants((prevPlants) => 
      prevPlants.map((plant) => 
        plant.id === id ? { ...plant, ...plantData } : plant
      )
    );
    toast.success("Plant updated successfully");
  };

  const deletePlant = (id: string) => {
    const plantName = plants.find(p => p.id === id)?.name;
    setPlants((prevPlants) => prevPlants.filter((plant) => plant.id !== id));
    toast.success(`${plantName || 'Plant'} has been removed`);
  };

  const markWatered = (id: string) => {
    const today = new Date().toISOString();
    setPlants((prevPlants) => 
      prevPlants.map((plant) => 
        plant.id === id ? { ...plant, lastWatered: today } : plant
      )
    );
    const plantName = plants.find(p => p.id === id)?.name;
    toast.success(`${plantName || 'Plant'} has been watered!`, {
      icon: "💦",
    });
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
