import { Session, User } from "@supabase/supabase-js";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
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
  const onUserSignInMutation = trpc.onUserSignIn.useMutation();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("🔍 Initial session check:", session?.user?.id || "No user");
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(
        "🔄 Auth state change:",
        event,
        session?.user?.id || "No user"
      );
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Handle user signup - check if this is a new user
      if (event === "SIGNED_IN" && session?.user) {
        console.log("🔐 User signed in:", session.user);
        console.log("📊 Auth event:", event);
        console.log("📊 User created at:", session.user.created_at);
        console.log("📊 Last sign in:", session.user.last_sign_in_at);

        try {
          // Always call onUserSignIn - it will detect if this is a new user or existing user
          const result = await onUserSignInMutation.mutateAsync({
            userMetadata: session.user.user_metadata,
          });

          if (result.isNewUser) {
            console.log("🎉 New user signup processed successfully:", result);
          } else {
            console.log("👤 Existing user signed in:", result.message);
          }
        } catch (error) {
          console.error("❌ Error processing user sign-in:", error);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [onUserSignInMutation]);

  const signInWithGoogle = async () => {
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
  };

  const signOut = async () => {
    // all of the below is super janky. supabase.auth.signOut() should do this for us, but it hangs indefinitely.
    try {
      localStorage.removeItem("sb-bvyvuajzkofjrzxnoowq-auth-token");
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("sb-")) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error("❌ Error clearing localStorage:", error);
    }

    setUser(null);
    setSession(null);
    navigate("/signin");

    supabase.auth
      .signOut()
      .then(({ error }) => {
        if (error) {
          console.error("❌ Background Supabase signout error:", error);
        } else {
          console.log("✅ Background Supabase signout successful");
        }
      })
      .catch((error) => {
        console.error("❌ Background Supabase signout failed:", error);
      });
  };

  const value = {
    user,
    session,
    loading,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
