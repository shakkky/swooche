import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User, Session } from "@supabase/supabase-js";
import { useTwilioVoice } from "./TwilioVoiceContext";
import { supabase } from "../lib/supabase";

type AuthState = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export const useAuth = (): AuthState => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside Provider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { start: startTwilioVoice, started, error } = useTwilioVoice();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Get initial session
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Error checking auth status:", error);
        setUser(null);
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Automatically start Twilio Voice when logged in
  useEffect(() => {
    if (user && !started && !error) {
      const autoStartTwilio = async () => {
        try {
          console.log("🔄 Auto-starting Twilio Voice after login...");
          await startTwilioVoice();
        } catch (error) {
          console.error("❌ Failed to auto-start Twilio Voice:", error);
        }
      };

      autoStartTwilio();
    }
  }, [user, started, error, startTwilioVoice]);

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "swooche://auth/callback",
        },
      });

      if (error) {
        console.error("❌ Google sign-in error:", error);
        throw error;
      }

      console.log("✅ Google sign-in initiated successfully");
    } catch (error) {
      console.error("❌ Sign-in failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("❌ Logout error:", error);
        throw error;
      }
      console.log("👋 User logged out successfully");
    } catch (error) {
      console.error("❌ Logout failed:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        signInWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
