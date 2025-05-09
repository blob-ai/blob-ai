
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { UserPlus } from "lucide-react";

const RegisterContent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const { signUp, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard/content");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }
    
    setPasswordError("");
    setIsSubmitting(true);
    try {
      await signUp(email, password);
      // Redirect to login page
      navigate("/auth/login");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="max-w-md w-full p-6 bg-black border border-white/10 rounded-xl shadow-lg">
        <div className="mb-6 text-center">
          <div className="w-16 h-16 mx-auto bg-blue-600/20 rounded-full flex items-center justify-center">
            <UserPlus className="h-8 w-8 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold mt-4">Create account</h1>
          <p className="text-white/70">Sign up to get started with Content Creator</p>
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
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError("");
              }}
              placeholder="Create a password"
              required
              className={`bg-white/5 border-white/10 ${passwordError ? "border-red-500" : ""}`}
            />
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/70 mb-1">
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setPasswordError("");
              }}
              placeholder="Confirm your password"
              required
              className={`bg-white/5 border-white/10 ${passwordError ? "border-red-500" : ""}`}
            />
            {passwordError && (
              <p className="text-sm text-red-500 mt-1">{passwordError}</p>
            )}
          </div>
          
          <div>
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-500" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating account..." : "Create Account"}
            </Button>
          </div>
          
          <div className="text-center text-sm">
            <span className="text-white/70">Already have an account?</span>{" "}
            <Link to="/auth/login" className="text-blue-500 hover:underline">
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

const RegisterPage = () => (
  <AuthProvider>
    <RegisterContent />
  </AuthProvider>
);

export default RegisterPage;
