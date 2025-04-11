
import { useEffect, useState } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { usePlants } from "@/contexts/PlantContext";
import PlantForm from "@/components/plants/PlantForm";
import { Plant } from "@/types";
import { Loader2 } from "lucide-react";

const EditPlant = () => {
  const { auth } = useAuth();
  const { plants } = usePlants();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [plant, setPlant] = useState<Plant | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  // If not logged in, redirect to login
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    const findPlant = plants.find((p) => p.id === id);
    if (findPlant) {
      setPlant(findPlant);
    } else if (plants.length > 0) {
      // Plant not found, redirect to dashboard
      navigate("/dashboard");
    }
    setLoading(false);
  }, [id, plants, navigate]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 text-plantpal-primary animate-spin" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Edit Plant</h1>
        {plant && <PlantForm mode="edit" plant={plant} />}
      </div>
    </MainLayout>
  );
};

export default EditPlant;
