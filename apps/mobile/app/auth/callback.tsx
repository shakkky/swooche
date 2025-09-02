import React, { useEffect } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { supabase } from "../../src/lib/supabase";

export default function AuthCallback() {
  const params = useLocalSearchParams();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle the OAuth callback
        const { error } = await supabase.auth.getSession();

        if (error) {
          console.error("Auth callback error:", error);
          router.replace("/login");
          return;
        }

        // Successfully authenticated, redirect to home
        router.replace("/home");
      } catch (error) {
        console.error("Error handling auth callback:", error);
        router.replace("/login");
      }
    };

    handleAuthCallback();
  }, [params]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#3B81F6",
      }}
    >
      <ActivityIndicator size="large" color="#FFFFFF" />
      <Text style={{ color: "#FFFFFF", marginTop: 16, fontSize: 16 }}>
        Completing sign in...
      </Text>
    </View>
  );
}
