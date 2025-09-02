import React, { useEffect } from "react";
import { router } from "expo-router";
import { useAuth } from "../src/contexts/AuthContext";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace("/home");
      } else {
        router.replace("/login");
      }
    }
  }, [user, isLoading]);

  // Show loading spinner while checking auth status
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#3B81F6" />
    </View>
  );
}
