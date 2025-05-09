
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

const AuthRequired: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="max-w-md w-full p-6 bg-black border border-white/10 rounded-xl shadow-lg text-center">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto bg-blue-600/20 rounded-full flex items-center justify-center">
              <LogIn className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2">Authentication Required</h1>
          <p className="text-white/70 mb-6">
            You need to sign in to access the content creation features.
          </p>
          <div className="flex flex-col gap-4">
            <Button asChild className="w-full">
              <Link to="/auth/login">Sign In</Link>
            </Button>
            <Button asChild variant="outline" className="w-full border-white/10">
              <Link to="/auth/register">Create Account</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthRequired;
