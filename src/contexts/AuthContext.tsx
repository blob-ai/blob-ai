
import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

// Define a proper type for our profile to match the database schema
type Profile = {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  name?: string;
  plan_tier: string;
  stripe_customer_id?: string;
  daily_chat_count: number;
  daily_chat_limit: number;
  daily_analysis_count: number;
  daily_analysis_limit: number;
  total_tokens_used: number;
  is_onboarded: boolean;
  last_chat_reset: string;
  last_analysis_reset: string;
  created_at: string;
  updated_at: string;
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{success: boolean, error?: string}>;
  signUp: (email: string, password: string, userData?: any) => Promise<{success: boolean, error?: string}>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user profile data
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }

      return data as Profile;
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
  };

  // Create a default profile for user if it doesn't exist
  const createDefaultProfile = async (userId: string) => {
    try {
      const defaultProfile = {
        id: userId,
        plan_tier: 'free',
        daily_chat_count: 0,
        daily_chat_limit: 10,
        daily_analysis_count: 0,
        daily_analysis_limit: 5,
        total_tokens_used: 0,
        is_onboarded: false
      };
      
      const { data, error } = await supabase
        .from("profiles")
        .insert([defaultProfile])
        .select()
        .single();
        
      if (error) {
        console.error("Error creating default profile:", error);
        return null;
      }
      
      console.log("Default profile created:", data);
      return data as Profile;
    } catch (error) {
      console.error("Error creating default profile:", error);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchProfile(user.id);
      if (!profileData) {
        // If profile doesn't exist, create a default one
        const newProfile = await createDefaultProfile(user.id);
        setProfile(newProfile);
      } else {
        setProfile(profileData);
      }
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string): Promise<{success: boolean, error?: string}> => {
    try {
      setIsLoading(true);
      
      console.log("Starting sign in process for:", email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Sign in error:", error);
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive",
        });
        return { success: false, error: error.message };
      }

      console.log("Sign in successful:", data);

      if (data.user) {
        const profileData = await fetchProfile(data.user.id);
        
        if (!profileData) {
          console.log("Creating default profile for user");
          await createDefaultProfile(data.user.id);
        }
        
        setProfile(profileData);
        
        toast({
          title: "Signed in successfully",
          description: `Welcome back${profileData && profileData.username ? `, ${profileData.username}` : ''}!`,
        });
        navigate("/dashboard");
        return { success: true };
      } else {
        return { success: false, error: "No user returned from authentication" };
      }
    } catch (error: any) {
      console.error("Unexpected sign in error:", error);
      toast({
        title: "Sign in failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      setIsLoading(true);
      
      console.log("Starting signup process for:", email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });

      if (error) {
        console.error("Signup error:", error);
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
        return { success: false, error: error.message };
      }

      // Log successful signup
      console.log("Signup successful:", data);

      toast({
        title: "Sign up successful",
        description: "Please check your email to confirm your account.",
      });

      // Auto-sign in after registration if email confirmation is disabled
      if (data.session) {
        console.log("Session created immediately:", data.session);
        
        if (data.user) {
          const profileData = await fetchProfile(data.user.id);
          
          if (!profileData) {
            console.log("Creating default profile for new user");
            await createDefaultProfile(data.user.id);
          }
          
          setProfile(profileData);
        }
        navigate("/dashboard");
      } else {
        navigate("/auth?mode=login");
      }
      
      return { success: true };
    } catch (error: any) {
      console.error("Unexpected signup error:", error);
      toast({
        title: "Sign up failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      setProfile(null);
      toast({
        title: "Signed out successfully",
      });
      navigate("/auth");
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(async () => {
            const profileData = await fetchProfile(session.user.id);
            if (!profileData) {
              // Create a default profile if none exists
              const newProfile = await createDefaultProfile(session.user.id);
              setProfile(newProfile);
            } else {
              setProfile(profileData);
            }
          }, 0);
        } else {
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id).then(async profileData => {
          if (!profileData) {
            // Create a default profile if none exists
            const newProfile = await createDefaultProfile(session.user.id);
            setProfile(newProfile);
          } else {
            setProfile(profileData);
          }
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        isLoading,
        signIn,
        signUp,
        signOut,
        refreshProfile,
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
