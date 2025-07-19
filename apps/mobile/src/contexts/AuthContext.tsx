import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useTwilioVoice } from "./TwilioVoiceContext";

type AuthState = {
  isLoggedIn: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export const useAuth = (): AuthState => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside Provider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { start: startTwilioVoice, started, error } = useTwilioVoice();

  // Check if user is already logged in (e.g., from storage)
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // In a real app, you'd check AsyncStorage or secure storage
        // For now, we'll assume the user needs to log in
        setIsLoggedIn(false);
      } catch (error) {
        console.error("Error checking auth status:", error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Automatically start Twilio Voice when logged in
  useEffect(() => {
    if (isLoggedIn && !started && !error) {
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
  }, [isLoggedIn, started, error, startTwilioVoice]);

  const login = async () => {
    setIsLoading(true);
    try {
      // Simulate login process
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app, you'd validate credentials and store auth tokens
      setIsLoggedIn(true);

      console.log("✅ User logged in successfully");
    } catch (error) {
      console.error("❌ Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    console.log("👋 User logged out");
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
