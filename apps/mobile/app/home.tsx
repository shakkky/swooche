import { Stack } from "expo-router";
import React from "react";
import { Home } from "@/templates/Home";

const HomeScreen = () => (
  <>
    <Stack.Screen
      options={{
        headerShown: false,
      }}
    />
    <Home />
  </>
);

export default HomeScreen;
