
import AuthForm from "@/components/auth/AuthForm";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const Register = () => {
  const { auth } = useAuth();

  if (auth.isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <MainLayout>
      <div className="max-w-md mx-auto py-12">
        <AuthForm mode="register" />
      </div>
    </MainLayout>
  );
};

export default Register;
