import { Stack } from "expo-router";
import React from "react";
import { TwilioVoiceProvider } from "../src/contexts/TwilioVoiceContext";

export default function Layout() {
  return (
    <TwilioVoiceProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </TwilioVoiceProvider>
  );
}
