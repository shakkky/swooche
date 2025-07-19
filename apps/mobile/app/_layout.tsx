import { Stack } from "expo-router";
import React from "react";
import { TwilioVoiceProvider } from "../src/contexts/TwilioVoiceContext";
import { AuthProvider } from "../src/contexts/AuthContext";

export default function Layout() {
  return (
    <TwilioVoiceProvider>
      <AuthProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </AuthProvider>
    </TwilioVoiceProvider>
  );
}
