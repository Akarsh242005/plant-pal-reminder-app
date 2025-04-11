
import { ReactNode } from "react";
import Navbar from "./Navbar";
import { useAuth } from "@/contexts/AuthContext";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { auth } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-muted py-6 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} PlantPal - Your plant care companion</p>
          {!auth.isAuthenticated && (
            <p className="mt-1">Sign in to start tracking your plants!</p>
          )}
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
