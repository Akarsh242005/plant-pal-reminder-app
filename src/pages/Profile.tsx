
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserCircle } from "lucide-react";

const Profile = () => {
  const { auth } = useAuth();

  // If not logged in, redirect to login
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
        
        <Card>
          <CardHeader>
            <div className="flex justify-center">
              <div className="bg-muted p-6 rounded-full">
                <UserCircle className="h-24 w-24 text-plantpal-primary" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 text-center">
              <div>
                <h2 className="text-2xl font-semibold">
                  {auth.user?.name || "User"}
                </h2>
                <p className="text-muted-foreground">{auth.user?.email}</p>
              </div>
              
              <div className="flex justify-center gap-4">
                <Button variant="outline">Edit Profile</Button>
                <Button variant="outline" className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200">
                  Reset Password
                </Button>
              </div>
              
              <div className="pt-6 border-t">
                <p className="text-muted-foreground mb-2">
                  Account created on {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Profile;
