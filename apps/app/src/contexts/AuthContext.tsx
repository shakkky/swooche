import { Session, User } from "@supabase/supabase-js";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { trpc } from "../lib/trpc";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // tRPC mutations
  const onUserSignInMutation = trpc.user.onUserSignIn.useMutation();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Handle user signup - check if this is a new user
      if (event === "SIGNED_IN" && session?.user) {
        try {
          // Always call onUserSignIn - it will detect if this is a new user or existing user
          onUserSignInMutation
            .mutateAsync({
              userMetadata: session.user.user_metadata,
            })
            .then((result) => {
              if (result.isNewUser) {
                console.log(
                  "🎉 New user signup processed successfully:",
                  result
                );
              } else {
                console.log("👤 Existing user signed in:", result.message);
              }
            });
        } catch (error) {
          console.error("❌ Error processing user sign-in:", error);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [onUserSignInMutation]);

  const signInWithGoogle = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/app`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  }, []);

  const signOut = useCallback(async () => {
    setUser(null);
    setSession(null);
    await supabase.auth.signOut();
    navigate("/signin");
  }, [navigate]);

  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      signInWithGoogle,
      signOut,
    }),
    [user, session, loading, signInWithGoogle, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
