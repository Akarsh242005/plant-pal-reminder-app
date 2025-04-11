
import { useAuth } from "@/contexts/AuthContext";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";
import { Leaf, ArrowRight, Droplet, CalendarCheck, Bell } from "lucide-react";

const Index = () => {
  const { auth } = useAuth();

  // If already logged in, redirect to dashboard
  if (auth.isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="py-20 md:py-28">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-plantpal-light p-3 rounded-full">
                <Leaf className="h-12 w-12 text-plantpal-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-6">
              Never forget to water your plants again!
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              PlantPal helps you keep track of your plants' watering schedules, ensuring your green friends stay happy and healthy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="px-8">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Plant Lovers Choose PlantPal</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our simple but powerful features help you take better care of your plants
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <div className="bg-plantpal-light w-12 h-12 flex items-center justify-center rounded-full mb-4">
                <Droplet className="text-plantpal-primary h-6 w-6" />
              </div>
              <h3 className="text-xl font-medium mb-2">Water Tracking</h3>
              <p className="text-muted-foreground">
                Keep track of when you last watered each plant and when they'll need water next.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <div className="bg-plantpal-light w-12 h-12 flex items-center justify-center rounded-full mb-4">
                <CalendarCheck className="text-plantpal-primary h-6 w-6" />
              </div>
              <h3 className="text-xl font-medium mb-2">Custom Schedules</h3>
              <p className="text-muted-foreground">
                Set custom watering schedules based on each plant's specific needs.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <div className="bg-plantpal-light w-12 h-12 flex items-center justify-center rounded-full mb-4">
                <Bell className="text-plantpal-primary h-6 w-6" />
              </div>
              <h3 className="text-xl font-medium mb-2">Visual Reminders</h3>
              <p className="text-muted-foreground">
                Get clear visual reminders when your plants need attention.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-20">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to become a better plant parent?</h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of plant enthusiasts who never forget to water their plants.
            </p>
            <Link to="/register">
              <Button size="lg" className="px-8">
                Get Started For Free
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
