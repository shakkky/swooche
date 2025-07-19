import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { router } from "expo-router";
import * as Font from "expo-font";
import { useAuth } from "../src/contexts/AuthContext";

const Login = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const { login, isLoading } = useAuth();

  React.useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        Modak: require("../assets/fonts/Modak.ttf"),
      });
      setFontsLoaded(true);
    };

    loadFonts();
  }, []);

  const handleLogin = async () => {
    try {
      await login();
      // Navigation will be handled by the auth context
      router.replace("/home");
    } catch (error) {
      Alert.alert("Login Error", "Failed to log in. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, fontsLoaded && { fontFamily: "Modak" }]}>
        Swooche
      </Text>

      <Text style={styles.subtitle}>
        Welcome back! Please log in to continue.
      </Text>

      <View style={styles.formContainer}>
        <Pressable
          style={[styles.loginButton, isLoading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text
            style={[
              styles.loginButtonText,
              isLoading && styles.buttonTextDisabled,
            ]}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Text>
        </Pressable>

        <Text style={styles.note}>
          Note: This is a demo login. In production, you would enter your
          credentials here.
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
  loginButton: {
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
  loginButtonText: {
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
