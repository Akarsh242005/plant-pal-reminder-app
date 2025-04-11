
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import PlantForm from "@/components/plants/PlantForm";

const AddPlant = () => {
  const { auth } = useAuth();

  // If not logged in, redirect to login
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Add New Plant</h1>
        <PlantForm mode="add" />
      </div>
    </MainLayout>
  );
};

export default AddPlant;
