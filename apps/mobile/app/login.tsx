import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { router } from "expo-router";
import * as Font from "expo-font";
import { useAuth } from "../src/contexts/AuthContext";

const Login = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const { signInWithGoogle, isLoading } = useAuth();

  React.useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        Modak: require("../assets/fonts/Modak.ttf"),
      });
      setFontsLoaded(true);
    };

    loadFonts();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      // Navigation will be handled by the auth context
    } catch (error) {
      Alert.alert(
        "Sign In Error",
        "Failed to sign in with Google. Please try again."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, fontsLoaded && { fontFamily: "Modak" }]}>
        Swooche
      </Text>

      <Text style={styles.subtitle}>
        Welcome back! Please sign in to continue.
      </Text>

      <View style={styles.formContainer}>
        <Pressable
          style={[styles.googleButton, isLoading && styles.buttonDisabled]}
          onPress={handleGoogleSignIn}
          disabled={isLoading}
        >
          <Text
            style={[
              styles.googleButtonText,
              isLoading && styles.buttonTextDisabled,
            ]}
          >
            {isLoading ? "Signing in..." : "Continue with Google"}
          </Text>
        </Pressable>

        <Text style={styles.note}>
          Sign in with your Google account to access your Swooche dashboard.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3B81F6",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    color: "#BEDBFE",
    fontSize: 72,
    marginBottom: 16,
    transform: [{ rotate: "-4deg" }],
    textShadowRadius: 4,
  },
  subtitle: {
    color: "#FFFFFF",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
  },
  formContainer: {
    width: "100%",
    maxWidth: 300,
  },
  googleButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: "#E5E7EB",
    opacity: 0.6,
  },
  googleButtonText: {
    color: "#3B81F6",
    fontSize: 18,
    fontWeight: "600",
  },
  buttonTextDisabled: {
    color: "#9CA3AF",
  },
  note: {
    color: "#BEDBFE",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});

export default Login;
