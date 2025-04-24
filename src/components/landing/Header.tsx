
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { TextShimmer } from "../ui/text-shimmer";
import { useAuth } from "@/contexts/AuthContext";

export const Header = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  return (
    <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">
            <TextShimmer 
              duration={5}
              className="[--base-color:theme(colors.primary.600)] [--base-gradient-color:theme(colors.primary.400)]"
            >
              inspire.me
            </TextShimmer>
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <Button 
              className="bg-primary-600 hover:bg-primary-500 text-white"
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </Button>
          ) : (
            <>
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/10"
                onClick={() => navigate('/auth?mode=login')}
              >
                Sign in
              </Button>
              <Button 
                className="bg-primary-600 hover:bg-primary-500 text-white"
                onClick={() => navigate('/auth?mode=register')}
              >
                Sign up
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
