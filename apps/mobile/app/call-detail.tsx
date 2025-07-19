import { Stack } from "expo-router";
import React from "react";
import { CallDetail } from "@/templates/CallDetail";

const CallDetailScreen = () => (
  <>
    <Stack.Screen
      options={{
        headerShown: false,
      }}
    />
    <CallDetail />
  </>
);

export default CallDetailScreen;
