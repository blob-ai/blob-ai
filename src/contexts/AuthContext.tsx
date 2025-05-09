
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { initializeUserUsage } from "@/services/contentService";

interface UserProfile {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  plan_tier?: string;
}

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isLoading: boolean; // Added to fix type error
  profile: UserProfile | null; // Added to fix type error
  refreshProfile: () => Promise<void>; // Added to fix type error
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  // Alias loading as isLoading for components that use that name
  const isLoading = loading;

  useEffect(() => {
    // Set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === "SIGNED_IN" && session?.user) {
          // Initialize usage when user signs in
          setTimeout(() => {
            initializeUserUsage(session.user.id).catch(console.error);
            fetchProfile(session.user.id);
          }, 0);
        } else if (event === "SIGNED_OUT") {
          setProfile(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Initialize usage if user is already signed in
        initializeUserUsage(session.user.id).catch(console.error);
        fetchProfile(session.user.id);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }
      
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Signed in successfully!");
      navigate("/dashboard/content");
    } catch (error: any) {
      toast.error(error.message || "Error signing in");
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      toast.success("Account created! Check your email to confirm your account.");
    } catch (error: any) {
      toast.error(error.message || "Error signing up");
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.info("Signed out successfully");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Error signing out");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isLoading,
        profile,
        refreshProfile,
        signIn,
        signUp,
        signOut,
        isAuthenticated: !!session,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
