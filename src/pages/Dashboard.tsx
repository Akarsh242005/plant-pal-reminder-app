
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Link } from "react-router-dom";
import PlantCollection from "@/components/plants/PlantCollection";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const Dashboard = () => {
  const { auth } = useAuth();

  // If not logged in, redirect to login
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <MainLayout>
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Plants</h1>
          <p className="text-muted-foreground">
            Manage your plant collection and watering schedules
          </p>
        </div>
        <Link to="/add-plant">
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5" />
            Add New Plant
          </Button>
        </Link>
      </div>

      <PlantCollection />
    </MainLayout>
  );
};

export default Dashboard;
