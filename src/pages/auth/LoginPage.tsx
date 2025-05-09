
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { LogIn } from "lucide-react";

const LoginContent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard/content");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await signIn(email, password);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="max-w-md w-full p-6 bg-black border border-white/10 rounded-xl shadow-lg">
        <div className="mb-6 text-center">
          <div className="w-16 h-16 mx-auto bg-blue-600/20 rounded-full flex items-center justify-center">
            <LogIn className="h-8 w-8 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold mt-4">Welcome back</h1>
          <p className="text-white/70">Sign in to continue to Content Creator</p>
        </div>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-1">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="bg-white/5 border-white/10"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white/70 mb-1">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="bg-white/5 border-white/10"
            />
          </div>
          
          <div>
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-500" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </div>
          
          <div className="text-center text-sm">
            <span className="text-white/70">Don't have an account?</span>{" "}
            <Link to="/auth/register" className="text-blue-500 hover:underline">
              Create Account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

const LoginPage = () => (
  <AuthProvider>
    <LoginContent />
  </AuthProvider>
);

export default LoginPage;
